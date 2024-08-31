---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-6-1_异步钩子-useTransition
---

# useDeferredValue

> 官方文档: [https://react.dev/reference/react/useDeferredValue](https://react.dev/reference/react/useDeferredValue)  

`useDeferredValue` 允许我们延迟渲染不紧急的部分，具体延迟多久不确定，与 `useTransition` 相同，不会阻塞用户操作。

## mountDeferredValue

源代码（[✨约2841行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2841)）：
```ts
function mountDeferredValue<T>(value: T, initialValue?: T): T {
  const hook = mountWorkInProgressHook();
  return mountDeferredValueImpl(hook, value, initialValue);
}

function mountDeferredValueImpl<T>(hook: Hook, value: T, initialValue?: T): T {
  if (
    enableUseDeferredValueInitialArg &&
    // 如果有初值，延迟首屏渲染
    initialValue !== undefined &&
    // 如果有更早的 defer，不进行延迟
    !includesSomeLane(renderLanes, DeferredLane)
  ) {
    hook.memoizedState = initialValue;
    // 调度延迟渲染
    const deferredLane = requestDeferredLane();
    currentlyRenderingFiber.lanes = mergeLanes(
      currentlyRenderingFiber.lanes,
      deferredLane,
    );
    markSkippedUpdateLanes(deferredLane);

    return initialValue;
  } else {
    hook.memoizedState = value;
    return value;
  }
}
```

这里有一个实验性 API，第二个参数 `initialValue`，如果传了，那么在首屏渲染的时候就会尝试延迟。

## updateDeferredValue

源代码（[✨约2846行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2846)）：

```ts
function updateDeferredValue<T>(value: T, initialValue?: T): T {
  const hook = updateWorkInProgressHook();
  const resolvedCurrentHook: Hook = (currentHook: any);
  const prevValue: T = resolvedCurrentHook.memoizedState;
  return updateDeferredValueImpl(hook, prevValue, value, initialValue);
}

function updateDeferredValueImpl<T>(
  hook: Hook,
  prevValue: T,
  value: T,
  initialValue?: T,
): T {
  if (is(value, prevValue)) {
    return value;
  } else {
    if (isCurrentTreeHidden()) {
      const resultValue = mountDeferredValueImpl(hook, value, initialValue);
      // 值有变化，开启更新
      if (!is(resultValue, prevValue)) {
        markWorkInProgressReceivedUpdate();
      }
      return resultValue;
    }

    // 判断是否要立即延迟执行
    const shouldDeferValue = !includesOnlyNonUrgentLanes(renderLanes);
    if (shouldDeferValue) {
      const deferredLane = requestDeferredLane();
      currentlyRenderingFiber.lanes = mergeLanes(
        currentlyRenderingFiber.lanes,
        deferredLane,
      );
      // 跳过延迟逻辑
      markSkippedUpdateLanes(deferredLane);
      return prevValue;
    } else {
      // 需要立即执行
      markWorkInProgressReceivedUpdate();
      hook.memoizedState = value;
      return value;
    }
  }
}
```

逻辑很简单：判断值是否有变化，有变化则判断是否有其他高优先级任务要处理，有的话就延迟执行。

## rerenderDeferredValue

源代码（[✨约2853行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2853)）：

```ts
function rerenderDeferredValue<T>(value: T, initialValue?: T): T {
  const hook = updateWorkInProgressHook();
  if (currentHook === null) {
    return mountDeferredValueImpl(hook, value, initialValue);
  } else {
    const prevValue: T = currentHook.memoizedState;
    return updateDeferredValueImpl(hook, prevValue, value, initialValue);
  }
}
```