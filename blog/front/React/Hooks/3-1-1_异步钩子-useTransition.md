---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-1-1_状态钩子-useState
---

# useTransition

> 官方文档: [https://react.dev/reference/react/useTransition](https://react.dev/reference/react/useTransition)  

React18 新增了 concurrent 渲染模式。一般如 `event`, `setTimeout`, `network request` 回调触发的更新会采用 `Legacy` 模式。而更新如果与 `OffScreen`, `Suspense`, `useTransition`, `useDeferredValue` 相关，则会触发可中断更新的 `Concurrent` 模式。

<p class="warn">该钩子在 React 更新过程中变化较大，请以您目前使用的 react 版本实际功能为准（免责声明）。</p>

考虑这样一种场景：在搜索框中输入文字，显示匹配的内容。每输入一个文字都会触发一次重新渲染，或调用一次接口，性能很差。一般通过加防抖/节流的方式做优化。

但如果一次搜索的内容非常多，例如十万条数据（打个比方，实际业务中出现这种情景让后端做分页处理🤣），防抖/节流虽然能避免状态频繁改变，但无法处理一次状态改变带来的卡顿。

`useTransition` 可以，它触发的更新都是低优先级，如果此时用户仍然在执行输入关键词这样一个高优先级的任务，那么 react 会优先处理，而不是卡住（阻塞渲染引擎）。

```ts
const TabContainer = () => {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

`useTransition` 返回两部分内容:
- `isPending`: 表示 `transition` 更新状态，`true` 表示未被处理。
- `startTransition`: 一个函数，用于触发 `Concurrent` 模式。

## mountTransition

看源代码（[✨约3212行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3212)）: 

```ts
function mountTransition(): [
  boolean,
  (callback: () => void, options?: StartTransitionOptions) => void,
] {
  // 用 state 钩子的方法创建，所以 useTransition 也会触发更新
  const stateHook = mountStateImpl((false: Thenable<boolean> | boolean));
  const start = startTransition.bind(
    null,
    currentlyRenderingFiber,
    stateHook.queue,
    true,
    false,
  );
  const hook = mountWorkInProgressHook();
  hook.memoizedState = start;
  return [false, start];
}

function startTransition<S>(
  fiber: Fiber,
  queue: UpdateQueue<S | Thenable<S>, BasicStateAction<S | Thenable<S>>>,
  pendingState: S,
  finishedState: S,
  callback: () => mixed,
  options?: StartTransitionOptions,
): void {
  // 设置当前任务优先级
  const previousPriority = getCurrentUpdatePriority();
  setCurrentUpdatePriority(
    higherEventPriority(previousPriority, ContinuousEventPriority),
  );

  // 创建过渡对象
  const prevTransition = ReactSharedInternals.T;
  const currentTransition: BatchConfigTransition = {};

  // 进行一次 state 更新
  if (enableAsyncActions) {
    ReactSharedInternals.T = currentTransition;
    dispatchOptimisticSetState(fiber, false, queue, pendingState);
  } else {
    ReactSharedInternals.T = null;
    dispatchSetState(fiber, queue, pendingState);
    ReactSharedInternals.T = currentTransition;
  }

  try {
    if (enableAsyncActions) {
      const returnValue = callback();
      // 这个操作会改变上下文为 Transition
      const onStartTransitionFinish = ReactSharedInternals.S;
      if (onStartTransitionFinish !== null) {
        onStartTransitionFinish(currentTransition, returnValue);
      }
      if (
        returnValue !== null &&
        typeof returnValue === 'object' &&
        typeof returnValue.then === 'function'
      ) {
        const thenable = ((returnValue: any): Thenable<mixed>);
        const thenableForFinishedState = chainThenableValue(
          thenable,
          finishedState,
        );
        dispatchSetState(fiber, queue, (thenableForFinishedState: any));
      } else {
        dispatchSetState(fiber, queue, finishedState);
      }
    } else {
      dispatchSetState(fiber, queue, finishedState);
      callback();
    }
  } catch (error) {
    if (enableAsyncActions) {
      const rejectedThenable: RejectedThenable<S> = {
        then() {},
        status: 'rejected',
        reason: error,
      };
      // 出错第三次 setState
      dispatchSetState(fiber, queue, rejectedThenable);
    } else {
      throw error;
    }
  } finally {
    // 恢复过度状态
    setCurrentUpdatePriority(previousPriority);
    ReactSharedInternals.T = prevTransition;
  }
}
```

`startTransition` 方法主要设置了 `Transition` 上下文来让 React 采用 `Concurrent` 模式渲染。

此外通过 `setState` 开启 `FiberTree` 更新，第一次为常规更新，第二次可能切换到 `Transition` 上下文再次更新。由于 React 的批处理机制，至多在两种模式下分别执行一次更新。

在 `Concurrent` 模式下，高优先级的任务可以阻断低优先级任务，因此有了先前的效果。

<p class="discuss"> Concurrent 模式下，当低优先级更新被高优先级更新中断时，低优先级更新已经开始的协调会被清理，低优先级更新会被重置为未开始状态。</p>

## updateTransition

看源代码（[✨约3230行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3230)）:

```ts
function updateTransition(): [
  boolean,
  (callback: () => void, options?: StartTransitionOptions) => void,
] {
  // 布尔值或者异步操作结果
  const [booleanOrThenable] = updateState(false);
  const hook = updateWorkInProgressHook();
  const start = hook.memoizedState;
  const isPending =
    typeof booleanOrThenable === 'boolean'
      ? booleanOrThenable
      : useThenable(booleanOrThenable); // 将异步结果转换为布尔值
  return [isPending, start];
}
```

## rerenderTransition

源代码（[✨约3245行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3245)）:

```ts
function rerenderTransition(): [
  boolean,
  (callback: () => void, options?: StartTransitionOptions) => void,
] {
  const [booleanOrThenable] = rerenderState(false);
  const hook = updateWorkInProgressHook();
  const start = hook.memoizedState;
  const isPending =
    typeof booleanOrThenable === 'boolean'
      ? booleanOrThenable
      : useThenable(booleanOrThenable);
  return [isPending, start];
}
```