---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-1-1_状态钩子-useState /front/React/Hooks/2-5-0_性能钩子-memo
rear: +/front/React/Hooks/2-5-2_性能钩子-useMemo
---

# useCallback

> 官方文档: [https://react.dev/reference/react/useCallback](https://react.dev/reference/react/useCallback)  

<p class="tip">上一篇文章讲的 memo 会缓存整个组件，这篇文章开始的几个 hook 则会缓存组件的部分属性。</p>

`useCallback` 一般用于缓存函数，它有两个参数:
- `callback`: 要缓存的函数
- `deps`: 依赖数组

<p class="tip">这里说的缓存是指：在依赖，状态等不改变的前提下，复用固有组件/属性以达到性能优化目的</p>

## mountCallback

首先看下 `mount` 阶段（[✨约2780行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2780)）:

```ts
function mountCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

很简单，往 `hook` 的 `memoizedState` 里面塞了传进来的两个参数。

## updateCallback

然后是更新阶段（[✨约2787行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2787)）:

```ts
function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (nextDeps !== null) {
    const prevDeps: Array<mixed> | null = prevState[1];
    // 依赖项相同，返回缓存的函数
    if (areHookInputsEqual(nextDeps, prevDeps)) {
      return prevState[0];
    }
  }
  // 否则，更新 memoizedState
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

// 比较依赖项是否相同
function areHookInputsEqual(
  nextDeps: Array<mixed>,
  prevDeps: Array<mixed> | null,
): boolean {
  if (prevDeps === null) {
    return false;
  }

  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}
```

实现很简单，看完前面几篇文章，简单看一下源代码就知道咋实现的了。