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
- `subscribe`: 订阅函数，返回一个取消订阅函数
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

  // 优先级与执行函数判断
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

  // 把当前值和获取快照函数存到 hook 中
  hook.memoizedState = nextSnapshot;
  const inst: StoreInstance<T> = {
    value: nextSnapshot,
    getSnapshot,
  };
  hook.queue = inst;

  // 放到副作用中执行，subscribeToStore 发起订阅
  mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [subscribe]);
  fiber.flags |= PassiveEffect;

  // 监听组件 render，只要渲染就会调用 updateStoreInstance
  pushEffect(
    HookHasEffect | HookPassive,
    updateStoreInstance.bind(null, fiber, inst, nextSnapshot, getSnapshot),
    createEffectInstance(),
    null,
  );

  return nextSnapshot;
}

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

逻辑和 `useState` 类似，`subscribe` 最终会作为 `mountState` 的参数，这就很好理解为什么订阅函数的返回值需要取消订阅了。核心的逻辑包括:
- 用一个 `effect` 来订阅状态 `subscribeToStore` 发起订阅。
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

总的来说，`useSyncExternalStore` 的处理逻辑更类似 `useEffect`。在组件每次渲染时都会通过 `getSnapshot` 获取新的外部状态快照，如果快照变化，则重新渲染。他们有以下不同:
- `useSyncExternalStore` 通过 `subscribe` 函数确保外部状态变化时更新，`useEffect` 通过依赖数组
- `useSyncExternalStore` 每次重新渲染都会执行一次 `getSnapshot` 再比较，`useEffect` 先判断依赖数组是否有变化再比较。

<p class="discuss">这个钩子作者也没用过，欢迎补充实战场景。</p>