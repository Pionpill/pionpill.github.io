---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-1-1_状态钩子-useState
---

# useSyncExternalStore

> 官方文档: [https://react.dev/reference/react/useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)

`useSyncExternalStore` 适用于订阅非 react 组件的外部状态的，它的使用方式如下:

```ts
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

三个参数分别为:
- `subscribe`: 订阅函数，返回一个取消订阅函数。
- `getSnapshot`: 获取数据的快照
- `getServerSnapshot`: 获取服务端数据的快照（实验中）

例如订阅浏览器网络状态:

```tsx
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

当网络状态更新的时候，组件会自动重新渲染，核心功能在对 `subscribe` 的处理上，下面看下源码。

## mountSyncExternalStore

看源码（[✨约1586行](https://github.com/facebook/react/blob/main/packages/react/src/ReactContext.js#L1586)）:

```ts
function mountSyncExternalStore<T>(
  subscribe: (() => void) => () => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
): T {
  const fiber = currentlyRenderingFiber;
  const hook = mountWorkInProgressHook();

  // 1. 优先级与执行函数判断，决定用哪个方法和获取状态快照
  let nextSnapshot;
  const isHydrating = getIsHydrating();
  if (isHydrating) {
    if (getServerSnapshot === undefined) {
      throw new Error(
        'Missing getServerSnapshot, which is required for ' +
          'server-rendered content. Will revert to client rendering.',
      );
    }
    nextSnapshot = getServerSnapshot();
  } else {
    nextSnapshot = getSnapshot();
    const root: FiberRoot | null = getWorkInProgressRoot();
    if (root === null) {
      throw new Error(
        'Expected a work-in-progress root. This is a bug in React. Please file an issue.',
      );
    }

    const rootRenderLanes = getWorkInProgressRootRenderLanes();
    if (!includesBlockingLane(root, rootRenderLanes)) {
      pushStoreConsistencyCheck(fiber, getSnapshot, nextSnapshot);
    }
  }

  // 2. 把当前值和获取快照函数存到 hook 中
  hook.memoizedState = nextSnapshot;
  const inst: StoreInstance<T> = {
    value: nextSnapshot,
    getSnapshot,
  };
  hook.queue = inst;

  // 3. 发布一个副作用，只有 subscribe 改变时更新（几乎不会改变）
  mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [subscribe]);
  fiber.flags |= PassiveEffect;

  // 4. 监听组件 render，确保拿到最新的状态
  pushEffect(
    HookHasEffect | HookPassive,
    updateStoreInstance.bind(null, fiber, inst, nextSnapshot, getSnapshot),
    createEffectInstance(),
    null,
  );

  return nextSnapshot;
}
```

到这里都很简单，获取状态，存到 `hook.memoizedState` 中，并发布一个副作用（这个副作用不太会执行）。关键在 3-4 步的两个方法: `subscribeToStore` 中。

### subscribeToStore

```ts
function subscribeToStore<T>(
  fiber: Fiber,
  inst: StoreInstance<T>,
  subscribe: (() => void) => () => void,
): any {
  const handleStoreChange = () => {
    if (checkIfSnapshotChanged(inst)) {
      forceStoreRerender(fiber);
    }
  };
  // 发起订阅
  return subscribe(handleStoreChange);
}

function checkIfSnapshotChanged<T>(inst: StoreInstance<T>): boolean {
  const latestGetSnapshot = inst.getSnapshot;
  const prevValue = inst.value;
  try {
    const nextValue = latestGetSnapshot();
    return !is(prevValue, nextValue);
  } catch (error) {
    return true;
  }
}
```

对于我们外部传入的 `subscribe` 函数，React 会自动传入一个 `handleStoreChange` 方法，一般情况下，当外部状态改变时，都会有这样一段代码：

```ts
// zustand 源码
const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// 在 react 中，state, previousState 参数不传也可以
listeners.forEach((listener) => listener(state, previousState))
```

这样就可以通知订阅者执行订阅方法，也即外部状态改变时候执行 `handleStoreChange` 方法，如何交给 React 判断是否要更新，如果需要则执行 `forceStoreRerender` 方法（[✨约1586行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L1891)）：

```ts
function forceStoreRerender(fiber: Fiber) {
  const root = enqueueConcurrentRenderForLane(fiber, SyncLane);
  if (root !== null) {
    scheduleUpdateOnFiber(root, fiber, SyncLane);
  }
}
```

芜湖，这个方法也会调用 `scheduleUpdateOnFiber` 去安排更新。

### updateStoreInstance

这个也顺带看一下，组件每次更新的时候重新获取一次外部状态判断是否要更新。

```ts
function updateStoreInstance<T>(
  fiber: Fiber,
  inst: StoreInstance<T>,
  nextSnapshot: T,
  getSnapshot: () => T,
): void {
  inst.value = nextSnapshot;
  inst.getSnapshot = getSnapshot;

  if (checkIfSnapshotChanged(inst)) {
    forceStoreRerender(fiber);
  }
}
```

逻辑和 `useState` 类似，`subscribe` 最终会作为 `mountState` 的参数，这就很好理解为什么订阅函数的返回值需要取消订阅了。核心的逻辑包括:
- 用一个 `effect` 来订阅状态 `subscribeToStore` 发起订阅，当外部状态调用 `subscribe` 的参数 `handleStoreChange` 会触发 `scheduleUpdateOnFiber` 去安排更新。
- 用一个 `useEffect` 来监听组件 `render` ，只要组件渲染就会调用 `updateStoreInstance`。

## updateSyncExternalStore

看源码（[✨约1677行](https://github.com/facebook/react/blob/main/packages/react/src/ReactContext.js#L1677)）:

```ts
function updateSyncExternalStore<T>(
  subscribe: (() => void) => () => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
): T {
  const fiber = currentlyRenderingFiber;
  const hook = updateWorkInProgressHook();
  let nextSnapshot;
  const isHydrating = getIsHydrating();
  if (isHydrating) {
    if (getServerSnapshot === undefined) {
      throw new Error(
        'Missing getServerSnapshot, which is required for ' +
          'server-rendered content. Will revert to client rendering.',
      );
    }
    nextSnapshot = getServerSnapshot();
  } else {
    nextSnapshot = getSnapshot();
  }
  const prevSnapshot = (currentHook || hook).memoizedState;
  // 判断状态是否改变
  const snapshotChanged = !is(prevSnapshot, nextSnapshot);
  if (snapshotChanged) {
    // 如果改变了，打上更新标记
    hook.memoizedState = nextSnapshot;
    markWorkInProgressReceivedUpdate();
  }
  const inst = hook.queue;

  updateEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
    subscribe,
  ]);

  if (
    inst.getSnapshot !== getSnapshot ||
    snapshotChanged ||
    (workInProgressHook !== null &&
      workInProgressHook.memoizedState.tag & HookHasEffect)
  ) {
    fiber.flags |= PassiveEffect;
    pushEffect(
      HookHasEffect | HookPassive,
      updateStoreInstance.bind(null, fiber, inst, nextSnapshot, getSnapshot),
      createEffectInstance(),
      null,
    );
    const root: FiberRoot | null = getWorkInProgressRoot();

    if (root === null) {
      throw new Error(
        'Expected a work-in-progress root. This is a bug in React. Please file an issue.',
      );
    }

    if (!isHydrating && !includesBlockingLane(root, renderLanes)) {
      pushStoreConsistencyCheck(fiber, getSnapshot, nextSnapshot);
    }
  }

  return nextSnapshot;
}
```

总的来说，`useSyncExternalStore` 用于与外部发布订阅模式的状态关联起来。
- 如果外部状态调用 `subscribe` 的第一个参数，则可以引起重新渲染（新旧状态不同）。
- 组件自身重新渲染也会重新判断一次是否需要重新渲染。