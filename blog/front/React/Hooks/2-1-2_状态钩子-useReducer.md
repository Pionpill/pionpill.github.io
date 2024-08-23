---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-1-1_状态钩子-useState
---

# useReducer

> 官方文档: [https://react.dev/reference/react/useReducer](https://react.dev/reference/react/useReducer)

上一节结尾我们知道，`update` 与 `rerender` 阶段的 `useState` 是使用 `useReducer` 实现的。`useState` 本质上是一个弱化版的 `useReducer`:
- `useState`: `state === action`，`dispatch` 的 `action` 不会被修改(函数拿执行结果)，直接成为新的状态。
- `useReducer`: `state === reducer(state, action)`，可以自定义 `reducer` 方法，根据目前的 `state` 和接受的 `action` 计算新的状态。

笼统地讲，`useState` 就是一个采用 `basicStateReducer` 的 `useReducer`。

## mountReducer

先看一下 `mountReducer` 源码（[✨约1148行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L1148)）:

```ts
function mountReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  // 创建一个空 hook
  const hook = mountWorkInProgressHook();

  // 根据有没有第三个参数执行不同的初始化状态逻辑
  const initialState = init !== undefined 
    ? init(initialArg) 
    : ((initialArg: any): S);
  hook.memoizedState = hook.baseState = initialState;

  const queue: UpdateQueue<S, A> = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    // 这里用的是我们自定义的 reducer
    lastRenderedReducer: reducer,
    lastRenderedState: (initialState: any),
  };
  hook.queue = queue;
  const dispatch: Dispatch<A> = (queue.dispatch = (dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any));
  return [hook.memoizedState, dispatch];
}
```

`useReducer` 可接受2-3个参数:
- `reducer: (S, A) => S`: 一个自定义 `reducer` 函数，两个泛型类型分别代表 `state` 当前的状态，`action` 接受的事件。
- `initialArg`: 如果只传两个参数，表示初始状态。如果传三个参数，表示第三个参数（函数）的参数。
- `init`：初始化函数，返回值即初始状态。

`mountReducer` 与 `mountState` 的不同有以下几点:
- 根据参数个数不同初始化状态，如果传入的初始状态是函数类型，不会被执行，也就是说状态可以是函数
- 使用自定义的 `reducer`
- 使用 `dispatchReducerAction`

看一下这个分发器（[✨约3205行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3205)）：

```ts
function dispatchReducerAction<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
): void {
  const lane = requestUpdateLane(fiber);
  const update: Update<S, A> = {
    lane,
    revertLane: NoLane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  };

  if (isRenderPhaseUpdate(fiber)) {
    enqueueRenderPhaseUpdate(queue, update);
  } else {
    const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, lane);
      entangleTransitionUpdate(root, queue, lane);
    }
  }
}
```

和 `dispatchSetState` 没啥区别，少了 `bailout` 条件优化。

## updateReducer

`useState` 和 `useReducer` 在 `update` 过程都使用 `updateReducer`（[✨约1182行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L1182)）:

```ts
// updateState 的 reducer 是 basicStateReducer
function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  // 复用 hook
  const hook = updateWorkInProgressHook();
  return updateReducerImpl(hook, ((currentHook: any): Hook), reducer);
}

function updateReducerImpl<S, A>(
  hook: Hook,
  current: Hook,
  reducer: (S, A) => S,
): [S, Dispatch<A>] {
  const queue = hook.queue;
  queue.lastRenderedReducer = reducer;

  let baseQueue = hook.baseQueue;
  const pendingQueue = queue.pending;

  // 任务队列更新
  if (pendingQueue !== null) {
    if (baseQueue !== null) {
      // 这两个队列互相加到队尾
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }
    current.baseQueue = baseQueue = pendingQueue;
    // hook 上要更新的任务置空
    queue.pending = null;
  }

  const baseState = hook.baseState;
  if (baseQueue === null) {
    // 没有任务，直接赋值
    hook.memoizedState = baseState;
  } else {
    const first = baseQueue.next;
    let newState = baseState;
    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast: Update<S, A> | null = null;
    let update = first;
    let didReadFromEntangledAsyncAction = false;

    do {
      const updateLane = removeLanes(update.lane, OffscreenLane);
      const isHiddenUpdate = updateLane !== update.lane;

      // offscreen 情形，render 阶段，判断是否跳过
      const shouldSkipUpdate = isHiddenUpdate
        ? !isSubsetOfLanes(getWorkInProgressRootRenderLanes(), updateLane)
        : !isSubsetOfLanes(renderLanes, updateLane);

      if (shouldSkipUpdate) {
        // 优先级不高，暂缓更新
        const clone: Update<S, A> = {
          lane: updateLane,
          revertLane: update.revertLane,
          action: update.action,
          hasEagerState: update.hasEagerState,
          eagerState: update.eagerState,
          next: (null: any),
        };
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane,
        );
        // 标记跳过了一些任务的更新
        markSkippedUpdateLanes(updateLane);
      } else {
        const revertLane = update.revertLane;
        if (!enableAsyncActions || revertLane === NoLane) {
          // 如果有其他优先级更高的任务，存起来暂缓更新
          if (newBaseQueueLast !== null) {
            const clone: Update<S, A> = {
              lane: NoLane,
              revertLane: NoLane,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: (null: any),
            };
            newBaseQueueLast = newBaseQueueLast.next = clone;
          }

          // 是否为异步任务
          if (updateLane === peekEntangledActionLane()) {
            didReadFromEntangledAsyncAction = true;
          }
        } else {
          if (isSubsetOfLanes(renderLanes, revertLane)) {
            // 同样判断是否要暂缓处理
            update = update.next;
            if (revertLane === peekEntangledActionLane()) {
              didReadFromEntangledAsyncAction = true;
            }
            continue;
          } else {
            const clone: Update<S, A> = {
              lane: NoLane,
              revertLane: update.revertLane,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: (null: any),
            };
            if (newBaseQueueLast === null) {
              newBaseQueueFirst = newBaseQueueLast = clone;
              newBaseState = newState;
            } else {
              newBaseQueueLast = newBaseQueueLast.next = clone;
            }
            // 更新优先级
            currentlyRenderingFiber.lanes = mergeLanes(
              currentlyRenderingFiber.lanes,
              revertLane,
            );
            markSkippedUpdateLanes(revertLane);
          }
        }

        const action = update.action;
        // 判断是否有急切状态
        if (update.hasEagerState) {
          newState = ((update.eagerState: any): S);
        } else {
          // 调用 reducer
          newState = reducer(newState, action);
        }
      }
      update = update.next;
    } while (update !== null && update !== first);
    // 注意这有个 update !== first 判断, 对应了 mount 过程首次更新，创建一个环的情形

    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = (newBaseQueueFirst: any);
    }

    // 只有状态不同,才告诉 FiberNode 有更新
    if (!is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();

      // 有异步任务, 抛错
      if (didReadFromEntangledAsyncAction) {
        const entangledActionThenable = peekEntangledActionThenable();
        if (entangledActionThenable !== null) {
          throw entangledActionThenable;
        }
      }
    }

    // 更新 hook 状态
    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;
    queue.lastRenderedState = newState;
  }

  if (baseQueue === null) {
    queue.lanes = NoLanes;
  }
  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}
```

这个方法非常长, 简单概括一下它的逻辑:
1. 任务队列更新
2. 如果不存在需要更新的任务, 退出, 否则继续下面步骤
3. `do...while` 依此处理各个更新任务
    - 如果是 `offscreen` 任务, 暂缓处理, 开始下一个任务
    - 判断是否为异步任务, 打上标记
    - 是否有更高优先级的任务要处理, 有的话直接退出当前任务
    - 新状态赋值为 `eagerState` 或 `reducer(newState, action)`
4. 如果存在异步任务抛错
5. 任务队列更新(可能有未处理的任务)
6. 更新 `hook` 状态并返回新的状态

<p class="tip">offscreen 是指那些不在屏幕内的部分, 例如超出屏幕范围，是 React 的一种性能优化策略。</p>

## rerenderReducer

`useState` 和 `useReducer` 在 `rerender` 过程都使用 `rerenderReducer`（[✨约1436行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L1436)）:

```ts
function rerenderReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  // 这是还是用的 update 阶段创建 hook 的方法
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  if (queue === null) {
    throw new Error('xxx');
  }

  queue.lastRenderedReducer = reducer;

  const dispatch: Dispatch<A> = (queue.dispatch: any);
  const lastRenderPhaseUpdate = queue.pending;
  let newState = hook.memoizedState;
  // 还有任务要处理
  if (lastRenderPhaseUpdate !== null) {
    // 本次会处理掉所有任务
    queue.pending = null;

    const firstRenderPhaseUpdate = lastRenderPhaseUpdate.next;
    let update = firstRenderPhaseUpdate;
    do {
      // 全部处理完
      const action = update.action;
      newState = reducer(newState, action);
      update = update.next;
    } while (update !== firstRenderPhaseUpdate);

    if (!is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = newState;
    if (hook.baseQueue === null) {
      hook.baseState = newState;
    }

    queue.lastRenderedState = newState;
  }
  return [newState, dispatch];
}
```

`rerenderReducer` 就是简化版的 `updateReducer`, 不再有花里胡哨的优先级, 急切任务等判断, 直接将所有的更新任务处理完。

## 总结

`useReducer` 本质上是可以自定义 `reducer` 的 `useState`。但 `useReducer` 不会判断执行结果是否与旧状态相同。在 `useState` 中如果新旧状态相同，会进行 `bailout` 优化，组件不更新。