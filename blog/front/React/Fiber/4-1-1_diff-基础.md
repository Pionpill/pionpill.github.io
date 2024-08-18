---
difficulty: hard
type: origin
pre: +/front/React/Fiber/3-5-2_render-beginWork方法
---

# React 的 diff 算法基础

<p class="tip">阅读本文之前请确保您对 React 双缓存机制，beginWork 整体流程有一定的了解。</p>

React 的 diff 算法是非常"简单粗暴"的。它的时间复杂度只有 O(n)，也即只会遍历一次 Fiber 树。其核心算法位于 render 阶段的 `beginWork` 方法中。

## 触发 diff 的条件

回顾一下 `beginWork` 方法:

```ts
function beginWork( current: Fiber | null, workInProgress: Fiber ): Fiber | null {
  if (current !== null) {
    // props 或者 context 变化
    if ( oldProps !== newProps || hasLegacyContextChanged() ) {
      didReceiveUpdate = true;
    } else {
      // 省略
    }
  } else {
    // 进行 mount 操作，这里不涉及 diff 省略
  }

  switch (workInProgress.tag) {
    case FunctionComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        disableDefaultPropsExceptForClasses ||
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultPropsOnNonClassComponent(Component, unresolvedProps);
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes,
      );
    }
    // 省略其他 tag 处理
  }
}
```

当检测到 `props` 或 `context` 发生变化，会将全局属性 `didReceiveUpdate` 设置为 `true` 表示需要更新节点。之后再根据 `tag` 的不同分别处理，这里我们只看最常见的函数组件处理过程。

### updateFunctionComponent

核心逻辑如下（[✨约1102行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js#L1102)）:

```ts
function updateFunctionComponent(
  current: null | Fiber,
  workInProgress: Fiber,
  Component: any,
  nextProps: any,
  renderLanes: Lanes,
) {
  let context;
  let nextChildren;
  let hasId;

  // 创建一个新的 FiberNode
  nextChildren = renderWithHooks(
    current,
    workInProgress,
    Component,
    nextProps,
    context,
    renderLanes,
  );

  // 优化：如果没有接收到 update，并且当前视图上存在对应的节点
  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  // 不满足优化条件，创建子节点（进入 diff）
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}
```

如果接收到了 `didReceiveUpdate` 信息，需要更新，则进入 `reconcileChildren` 这个方法进行 diff。

## 子元素更新

`reconcileChildren` 这个方法非常简单:

```ts
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes,
) {
  if (current === null) {
    // 对于 mount 的组件
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // 对于 update 的组件
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}

export const reconcileChildFibers: ChildReconciler = createChildReconciler(true);
export const mountChildFibers: ChildReconciler = createChildReconciler(false);
```

`createChildReconciler` 是一个方法集，和子节点创建/更新/删除相关的操作都在其中，列举几个重要的方法:

```ts
function createChildReconciler( shouldTrackSideEffects: boolean ): ChildReconciler {
  // 总的方法
  function reconcileChildFibers() {}
  // 单点 diff
  function reconcileSingleElement() {}
  // 多点 diff
  function reconcileChildrenArray() {}
  return reconcileChildFibers;
}
```

这个方法最终返回的是内部的 `reconcileChildFibers` 方法。它是 diff 的起点。

### reconcileChildFibers

`reconcileChildFibers` 是进入 diff 的入口，它的具体逻辑在 `reconcileChildFibersImpl` 中:

```ts
  function reconcileChildFibersImpl(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChild: any,
    lanes: Lanes,
  ): Fiber | null {
    // 多个 Fragment 嵌套的情形，忽略没必要的 Fragment 元素
    const isUnkeyedTopLevelFragment =
      typeof newChild === 'object' &&
      newChild !== null &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null;
    if (isUnkeyedTopLevelFragment) {
      validateFragmentProps(newChild, null, returnFiber);
      newChild = newChild.props.children;
    }

    // 处理对象类型
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        // 常规单节点情形
        case REACT_ELEMENT_TYPE: {
          const firstChild = placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes,
            ),
          );
          return firstChild;
        }
        // portal 类型：将组件渲染到父组件以外的 DOM 节点
        case REACT_PORTAL_TYPE:
          return placeSingleChild(
            reconcileSinglePortal(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes,
            ),
          );
        // 懒加载情形
        case REACT_LAZY_TYPE: {
          const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
          let result;
          const payload = newChild._payload;
          const init = newChild._init;
          result = init(payload);
          const firstChild = reconcileChildFibersImpl(
            returnFiber,
            currentFirstChild,
            result,
            lanes,
          );
          currentDebugInfo = prevDebugInfo;
          return firstChild;
        }
      }

      // 数组情形
      if (isArray(newChild)) {
        const firstChild = reconcileChildrenArray(
          returnFiber,
          currentFirstChild,
          newChild,
          lanes,
        );
        return firstChild;
      }

      // 迭代器情形
      if (getIteratorFn(newChild)) {
        const firstChild = reconcileChildrenIteratable(
          returnFiber,
          currentFirstChild,
          newChild,
          lanes,
        );
        return firstChild;
      }

      // 异步迭代情形
      if (
        enableAsyncIterableChildren &&
        typeof newChild[ASYNC_ITERATOR] === 'function'
      ) {
        const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
        const firstChild = reconcileChildrenAsyncIteratable(
          returnFiber,
          currentFirstChild,
          newChild,
          lanes,
        );
        currentDebugInfo = prevDebugInfo;
        return firstChild;
      }
      
      // 异步回调情形
      if (typeof newChild.then === 'function') {
        const thenable: Thenable<any> = (newChild: any);
        const prevDebugInfo = pushDebugInfo((thenable: any)._debugInfo);
        const firstChild = reconcileChildFibersImpl(
          returnFiber,
          currentFirstChild,
          unwrapThenable(thenable),
          lanes,
        );
        currentDebugInfo = prevDebugInfo;
        return firstChild;
      }

      // 上下文情形
      if (newChild.$$typeof === REACT_CONTEXT_TYPE) {
        const context: ReactContext<mixed> = (newChild: any);
        return reconcileChildFibersImpl(
          returnFiber,
          currentFirstChild,
          readContextDuringReconciliation(returnFiber, context, lanes),
          lanes,
        );
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    // 处理文本类型
    if (
      (typeof newChild === 'string' && newChild !== '') ||
      typeof newChild === 'number' ||
      typeof newChild === 'bigint'
    ) {
      return placeSingleChild(
        reconcileSingleTextNode(
          returnFiber,
          currentFirstChild,
          '' + newChild,
          lanes,
        ),
      );
    }

    // 删除剩余元素
    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }
```

可以看到，针对不同类型的子元素，React 的处理机制非常多：文本，Fragment，单常规节点，数组节点，迭代器函数...

后文重点说一下（常规）单节点 diff 与（数组）多节点 diff，其他几种 tag 的 diff 方式大同小异。

### Fragment

Fragment 处理很简单所以在这说了算了，相关的代码如下:

```ts
const isUnkeyedTopLevelFragment =
  typeof newChild === 'object' &&
  newChild !== null &&
  newChild.type === REACT_FRAGMENT_TYPE &&
  newChild.key === null;
if (isUnkeyedTopLevelFragment) {
  validateFragmentProps(newChild, null, returnFiber);
  newChild = newChild.props.children;
}
```

`Fragment` 是不会被转换为真实 DOM 标签的，因此如果判断某个 `Fragment` 不存在 `key` 属性，则直接使用子元素代替它（`Fragment` 只是个工具人😭），如果存在 `key` 那就会对比一下进行优化。
