---
difficulty: hard
type: origin
pre: +/front/React/Hooks/1-1-1_函数组件-加载过程
rear: +/front/React/Hooks/2-1-2_状态钩子-useReducer
---

# useState

> 官方文档: [https://react.dev/reference/react/useState](https://react.dev/reference/react/useState)

<p class="warn">这篇文章除了讲 useState, 还存在很多 hook 通用的逻辑, 后续文章不再赘述.</p>

首先回顾一下 `Hook` 数据结构：

```ts
export type Hook = {
  baseState: any, // 初始状态值
  baseQueue: Update<any, any> | null, // 初始状态的更新操作队列，不会更新
  memoizedState: any, // 保存的状态（现在的状态）
  queue: any, // 当前状态更新操作的队列
  next: Hook | null,  // 指向下一个 hook
};
```

其中 `baseState` 和 `baseQueue` 只在函数组件加载的时候写入状态/状态操作，`next` 的作用我们之前讲过，用于构建 `hook` 链。

前面讲过的两个常用方法如下（下文不再赘述）：
- `mountWorkInProgressHook`: 创建一个 `hook` 并挂载到 `FiberNode` 上
- `updateWorkInProgressHook`: 将原 `hook` 挂载到新的 `FiberNode` 上

<p class="tip">mount 表示组件挂载，即初始化组件；update 表示组件的 state/prop 改变导致的更新；rerender 表示没有 state/prop 改变的情况下，重新渲染。</p>

## mountState

首先看一下 `mountState` 源码（[✨约1775行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L1775)）：

```ts
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const hook = mountStateImpl(initialState);
  const dispatch: Dispatch<BasicStateAction<S>> = (dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any);
  hook.queue.dispatch = dispatch;
  return [hook.memoizedState, dispatch];
}
```

从类型中可以看出 `useState` 可以接受常规类型或者函数 `S`，返回 `S` 与对应的 `dispatch`。`mountState` 逻辑可以分为两部分: 创建 `hook` 与 `dispatch`。

### 创建 hook

创建 `hook` 对应 `mountStateImpl` 方法（[✨约1750行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L1750)）：

```ts
function mountStateImpl<S>(initialState: (() => S) | S): Hook {
  // 构建一个 hook
  const hook = mountWorkInProgressHook();
  // 初始状态为函数的话，获取执行结果
  if (typeof initialState === 'function') {
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;

  const queue: UpdateQueue<S, BasicStateAction<S>> = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  };
  hook.queue = queue;
  return hook;
}
```

`basicStateReducer` 用处是处理 `action`（[✨约1143行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L1143)）:

```ts
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === 'function' ? action(state) : action;
}
```

这是这简单的 `reducer`，如果使用 `useReducer` 可以自定义处理方案。

#### UpdateQueue

这里引入一个新的数据结构：`UpdateQueue`（[✨约170行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L170)）:

```ts
export type UpdateQueue<S, A> = {
  pending: Update<S, A> | null, // 更新链表（核心部分）
  lanes: Lanes, // 优先级
  dispatch: (A => mixed) | null,  // 触发动作更新的分发器
  lastRenderedReducer: ((S, A) => S) | null,  // 上次渲染使用的 reducer 函数，用于优化
  lastRenderedState: S | null,  // 上次渲染的状态，用于优化
};
```

`UpdateQueue` 采用了分发器设计模式，这种设计模式有如下成员：
- `action`: 事件，可以是一个函数，在使用是会被执行
  ```ts
  type BasicStateAction<S> = (S => S) | S;
  ```
- `reducer`: 事件的具体处理函数
  ```ts
  (S, A) => S
  ```
- `dispatch`: 分发器，接受一个 `action` 选择对应的 `reducer` 进行处理，不具备处理能力只负责管理
  ```ts
  type Dispatch<A> = A => void;
  ```

<p class="discuss">很有 redux 的味道，因为 redux 的作者 Dan Abramov 同时给也是 react 的核心成员之一。</p>

回到 `mountState` 方法中，创建 `hook` 之后会初始化一个 `dispatch` 函数挂在 `queue.dispatch` 属性上。目前我们只关注 `action`。 `hook` 中还有一种属性: `state`，他表示 `action` 被 `reducer` 处理后的结果，即我们常用的状态，不要搞混了。

`action` 被封装成了另一种数据结构 `Update`。

#### Update

`action` 被封装成了另一种数据结构 `Update`，被挂在 `hook` 的 `pending` 属性上，表示需要进行的更新。它的数据结构如下（[✨约161行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L170)）:

```ts
export type Update<S, A> = {
  action: A,  // 动作（核心部分）
  lane: Lane, // 优先级
  revertLane: Lane, // 回滚更新优先级
  hasEagerState: boolean, // 是否急切，如果为 True 表示立即应用不不会等到下一次渲染
  eagerState: S | null, // 急切数据
  next: Update<S, A>, // 链表指向下一个 Update
};
```

`action` 表示我们具体的数据，目前了解这点即可。

回到 `mountStateImpl` 方法中，在 `mount` 阶段，只干了一件事：初始化 `hook` 并赋初始值 `initialState`。

在 `mount` 阶段创建了 `hook` 之后还需要创建它对应的 `dispatch`，这是最为关键的部分:

```ts
const dispatch: Dispatch<BasicStateAction<S>> = (dispatchSetState.bind(
  null,
  currentlyRenderingFiber,
  queue,
): any);
hook.queue.dispatch = dispatch;
```

### dispatchSetState

`dispatchSetState` 是 `mountState` 的核心方法（[✨约3244行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3244)）:

```ts
function dispatchSetState<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
): void {
  // 通过当前 FiberNode 获取优先级
  const lane = requestUpdateLane(fiber);
  // 基于 action 创建一个 update，表示需要更新的内容
  const update: Update<S, A> = {
    lane,
    revertLane: NoLane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  };
  if (isRenderPhaseUpdate(fiber)) {
    // 将渲染阶段的更新任务加入到更新队列中。
    // 它会将更新任务包装成一个特殊的更新对象，然后添加到更新队列的末尾。
    enqueueRenderPhaseUpdate(queue, update);
  } else {
    const alternate = fiber.alternate;
    // 快速计算出本次最新的state，与原来的进行对比，如果没有发生变化，则跳过后续的更新逻辑
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        let prevDispatcher;
        try {
          const currentState: S = (queue.lastRenderedState: any);
          // 计算最新的 state
          const eagerState = lastRenderedReducer(currentState, action);
          update.hasEagerState = true;
          update.eagerState = eagerState;
          // 比较新旧 state，相同则执行优化逻辑
          if (is(eagerState, currentState)) {
            enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update);
            return;
          }
        } catch (error) {
          // Suppress the error. It will throw again in the render phase.
        }
      }
    }
    // 将更新对象入队
    const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
    if (root !== null) {
      // 开启一个新的调度更新任务
      scheduleUpdateOnFiber(root, fiber, lane);
      entangleTransitionUpdate(root, queue, lane);
    }
  }
}
```

#### enqueueRenderPhaseUpdate

首先看一下进入该方法的前置条件 `isRenderPhaseUpdate`（[✨约3415行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3415)）：

```ts
function isRenderPhaseUpdate(fiber: Fiber): boolean {
  const alternate = fiber.alternate;
  // 当前 fiber 或其 alternate 正在被渲染
  return (
    fiber === currentlyRenderingFiber ||
    (alternate !== null && alternate === currentlyRenderingFiber)
  );
}
```

如果满足条件会执行 `enqueueRenderPhaseUpdate` 逻辑（[✨约3423行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3423)）:

```ts
function enqueueRenderPhaseUpdate<S, A>(
  queue: UpdateQueue<S, A>,
  update: Update<S, A>,
): void {
  didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate =
    true;
  const pending = queue.pending;
  if (pending === null) {
    // 首次更新，创建一个环，updateReducer 中会讲为什么这样处理
    update.next = update;
  } else {
    // 否则，更新队列添加到 pending 队尾
    update.next = pending.next;
    pending.next = update;
  }
  // 将更新队列挂到 `queue.pending` 属性上
  queue.pending = update;
}
```

这个方法并没有处理更新队列，只是将更新队列添加到 `queue.pending` 上。也即如果当前构建中的 `FiberNode` 如果正在被渲染，那么暂不处理它的 `state` 更新，只是加到 `pending` 队列中，等待渲染完成后再做处理。

这样处理的原因包括：
- 性能优化：渲染进行中阶段是计算和收集更新任务的阶段，处理更新任务可能会影响到渲染性能。
- 一致性：在渲染阶段结束之前，可能会有多个更新任务被收集，这些更新任务之间可能存在依赖关系。为了保证更新任务的执行顺序和一致性，最好等到渲染阶段结束后再进行处理。

#### 更新优化策略

有这样一段代码:

```ts
if (
  fiber.lanes === NoLanes &&
  (alternate === null || alternate.lanes === NoLanes)
) {
  const lastRenderedReducer = queue.lastRenderedReducer;
  if (lastRenderedReducer !== null) {
    let prevDispatcher;
    try {
      const currentState: S = (queue.lastRenderedState: any);
      // 计算最新的 state
      const eagerState = lastRenderedReducer(currentState, action);
      update.hasEagerState = true;
      update.eagerState = eagerState;
      // 比较新旧 state，
      if (is(eagerState, currentState)) {
        enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update);
        return;
      }
    } catch (error) {
      // Suppress the error. It will throw again in the render phase.
    }
  }
}
```

如果满足一定条件，会尝试获取队列中最新的状态，并拿最新的 `reducer` 计算出下一阶段需要更新的状态做对比，如果两个 `state` 相同，则不会触发新的更新。看一下这种情形走的 `enqueueConcurrentHookUpdateAndEagerlyBailout` 逻辑（[✨约126行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberConcurrentUpdates.js#L126)）:

```ts
export function enqueueConcurrentHookUpdateAndEagerlyBailout<S, A>(
  fiber: Fiber,
  queue: HookQueue<S, A>,
  update: HookUpdate<S, A>,
): void {
  const lane = NoLane;
  const concurrentQueue: ConcurrentQueue = (queue: any);
  const concurrentUpdate: ConcurrentUpdate = (update: any);
  // 队列更新
  enqueueUpdate(fiber, concurrentQueue, concurrentUpdate, lane);
  const isConcurrentlyRendering = getWorkInProgressRoot() !== null;
  if (!isConcurrentlyRendering) {
    finishQueueingConcurrentUpdates();
  }
}
```

这个方法也很简单，核心是调用 `enqueueUpdate` 更新了一次队列（[✨约89行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberConcurrentUpdates.js#L89)）:

```ts
const concurrentQueues: Array<any> = [];

function enqueueUpdate(
  fiber: Fiber,
  queue: ConcurrentQueue | null,
  update: ConcurrentUpdate | null,
  lane: Lane,
) {
  concurrentQueues[concurrentQueuesIndex++] = fiber;
  concurrentQueues[concurrentQueuesIndex++] = queue;
  concurrentQueues[concurrentQueuesIndex++] = update;
  concurrentQueues[concurrentQueuesIndex++] = lane;

  concurrentlyUpdatedLanes = mergeLanes(concurrentlyUpdatedLanes, lane);
  fiber.lanes = mergeLanes(fiber.lanes, lane);
  const alternate = fiber.alternate;
  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }
}
```

这里的 `concurrentQueues` 非常特殊，每四个连续的元素可以看作是一个更新任务的信息包，后续会处理这些任务。

### 总结

在 mountState 阶段会依此执行如下逻辑:
- 创建一个具备初始状态的 `hook`，对应 `mountStateImpl` 方法
- 根据当前节点创建一个 `dispatchSetState` 挂载到 `hook.queue.dispatch` 属性上

`dispatchSetState` 的执行逻辑如下:
- 当前 `FiberNode` 处于渲染阶段
  - 将 `update` 队列添加到 `hook.pending` 对尾，暂不处理
- 不处于渲染阶段
  - `FiberNode` 优先级不高
    - 计算前后 `state` 尝试优化，更新 `concurrentQueues`
  - 其他情形
    - 更新 `concurrentQueues`，开启新的更新任务

## updateState 与 rerenderState

看一下这两个方法（[✨约1789行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L1789)）：

```ts
function updateState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  return updateReducer(basicStateReducer, initialState);
}

function rerenderState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  return rerenderReducer(basicStateReducer, initialState);
}
```

这两个实现讲 `useReducer` 的时候再讲，因为 `useState` 就是简化版的 `useReducer`。