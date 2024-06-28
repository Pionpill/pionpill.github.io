---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-5-1_性能钩子-useCallback
---

# useMemo

> 官方文档: [https://react.dev/reference/react/useMemo](https://react.dev/reference/react/useMemo)  

<p class="tip">React VS Vue ||| useMemo 是需要手动指定依赖的 computed</p>

`useCallback` 只能缓存函数，`useMemo` 可以缓存计算结果。它的参数和 `useCallback` 完全相同。

## mountMemo

原理非常简单，只是把 `useCallback` 传入的函数执行了（[✨约2801行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2801)）：

```ts
function mountMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

## updateMemo

update 阶段也一样（[✨约2817行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2817)）

```ts
function updateMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (nextDeps !== null) {
    const prevDeps: Array<mixed> | null = prevState[1];
    if (areHookInputsEqual(nextDeps, prevDeps)) {
      return prevState[0];
    }
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```
