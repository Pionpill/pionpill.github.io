---
difficulty: hard
type: origin
pre: +/front/React/Fiber/3-5-1_render-准备阶段
rear: +/front/React/Fiber/3-5-3_render-completeWork方法
---

# beginWork 方法

> 对应源码: [https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js)

`beginWork` 方法的目的是创建新的节点替换原节点，先看一下源代码的大致逻辑:

```ts
function beginWork(
  current: Fiber | null,  // 界面上的当前节点
  workInProgress: Fiber,  // 构建中的当前节点
  renderLanes: Lanes,
): Fiber | null {
  if (current !== null) {
    // 该组件存在，进行 update 操作
  } else {
    // 该组件没有，进行 mount 操作
  }

  workInProgress.lanes = NoLanes;
  switch (workInProgress.tag) {
    // 针对 tag 类型进行具体操作
  }

  // 没 switch 到对应类型，抛错
  throw new Error('xxx');
}
```

首先，从 `current` 是否存在可以判断出该节点是需要新建(mount)还是更新(update)，使用一些变量打上标记供后续处理。然后根据组件类型进行相关处理。

第一次进入 `beginWork` 工作的节点一定是 `HostFiber`(根节点)且一定是存在的。

## 组件更新

### 组件 update

看一下固有组件 update 的逻辑:

```ts
if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps || // 这时候会拿新老 props 进行浅比较
      hasLegacyContextChanged() // 这个方法不用管，做兼容性的
    ) {
      didReceiveUpdate = true;  // 需要 update
      // 这里搭上了 update 标签但是没有执行相关逻辑，因为后续会紧系 memo 判断
    } else {
      // 如果通过内部状态(context)判断组件是否要更新
      const hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(current, renderLanes);
      if (
        !hasScheduledUpdateOrContext &&
        (workInProgress.flags & DidCapture) === NoFlags
      ) {
        // 进入这里表示不存在内部状态更新，且 FiberNode 也没有被打上任何更新 flag
        // 检查是否不是错误或悬挂边界的第二次遍历，如果满足条件复用当前节点(优化)
        didReceiveUpdate = false;
        return attemptEarlyBailoutIfNoScheduledUpdate(
          current,
          workInProgress,
          renderLanes,
        );
      }
      // legacy 模式的特殊情况需要 update，一般都执行下面的 false 赋值逻辑
      if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        didReceiveUpdate = true;
      } else {
        didReceiveUpdate = false;
      }
    }
  }
```

这里我们发现如果发现需要更新并没有立即执行更新逻辑，而是给全局的 `didReceiveUpdate` 变量赋值，因为后续如果发现

内部状态更新判断我们看一下 `checkScheduledUpdateOrContext` 方法:

```ts
function checkScheduledUpdateOrContext(
  current: Fiber,
  renderLanes: Lanes,
): boolean {
  // 判断是否有等待更新的内容
  const updateLanes = current.lanes;
  if (includesSomeLane(updateLanes, renderLanes)) {
    return true;
  }
  // 在懒加载 context 模式下，判断依赖的 context 是否有变化
  if (enableLazyContextPropagation) {
    const dependencies = current.dependencies;
    if (dependencies !== null && checkIfContextChanged(dependencies)) {
      return true;
    }
  }
  return false;
}
```

`attemptEarlyBailoutIfNoScheduledUpdate` 方法会在没有更新计划时尝试提前退出并复用当前的 Fiber 节点，针对不同的 tag 类型节点，它会对子节点，context 做一些操作以确保是否有相关节点需要变更，最终它会调一个名为 `bailoutOnAlreadyFinishedWork` 的方法并作为返回值:

```ts
function bailoutOnAlreadyFinishedWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  if (current !== null) {
    workInProgress.dependencies = current.dependencies;
  }

  markSkippedUpdateLanes(workInProgress.lanes);

  // 判断子节点是否存在任务
  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    if (enableLazyContextPropagation && current !== null) {
      // 判断子节点是否有 context 变更
      lazilyPropagateParentContextChanges(current, workInProgress, renderLanes);
      if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
        return null;
      }
    } else {
      return null;
    }
  }

  // 到这里说明子节点需要变更
  cloneChildFibers(current, workInProgress);
  // 如果返回了新建的子节点，代表子节点不满足优化策略，需要更新
  return workInProgress.child;
}
```

```ts
export function cloneChildFibers(
  current: Fiber | null,
  workInProgress: Fiber,
): void {
  if (workInProgress.child === null) {
    return;
  }

  let currentChild = workInProgress.child;
  // 这个方法创建一个新的 FiberNode 并进行属性赋值操作
  let newChild = createWorkInProgress(currentChild, currentChild.pendingProps);
  workInProgress.child = newChild;

  newChild.return = workInProgress;
  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    newChild = newChild.sibling = createWorkInProgress(
      currentChild,
      currentChild.pendingProps,
    );
    newChild.return = workInProgress;
  }
  newChild.sibling = null;
}
```

这里先回顾一下触发 react 组件更新的方式:
1. 传入组件的 props 改变
2. 组件订阅的 context 改变
3. 调用了 `forceUpdate` 方法(逐渐废弃)

对应的上面执行过程中
- 首先会通过 `oldProps !== newProps` 对 props 进行**浅比较**，如果有新的 props 则强制更新，注意这里是浅比较，因此即使 props 内容相同引用不同，react 组件也会更新。
- 其次通过 `checkScheduledUpdateOrContext` 查询组件是否有需要更新的内部状态。
- 最后会判断子节点是否需要变更，如果需要则克隆直接子节点。

### 组件 mount

看一下 mount 阶段的逻辑:

```ts
else {
  // 这里标识不是 update 操作
  didReceiveUpdate = false;
  // 对应 children 为列表的情形，进行注水操作
  // 具体来说是为每个子组件生成唯一的树 ID
  if (getIsHydrating() && isForkedChild(workInProgress)) {
    const slotIndex = workInProgress.index;
    const numberOfForks = getForksAtLevel(workInProgress);
    pushTreeId(workInProgress, numberOfForks, slotIndex);
  }
}
```

新 FiberNide 挂载比较简单，只对多 child 模式做了优化: 打上 key, 生成 id。

## 具体操作

```ts
workInProgress.lanes = NoLanes;
switch (workInProgress.tag) {
  // 针对不同的 tag 类型，进行更新或挂载，这里只看一个最常见的函数组件
  // 详细的 tag 类型(memo, ref) 我们会在讲 hook 的时候讲
  case FunctionComponent: {
    const Component = workInProgress.type;
    const unresolvedProps = workInProgress.pendingProps;
    const resolvedProps =
      workInProgress.elementType === Component
        ? unresolvedProps
        : resolveDefaultProps(Component, unresolvedProps);
    return updateFunctionComponent(
      current,
      workInProgress,
      Component,
      resolvedProps,
      renderLanes,
    );
  }
  case xxx: {
    // 略
  }
}
// 没 switch 到对应类型，抛错
throw new Error('xxx');
```

这里根据组件的类型不同从 `workInProgress` 上取属性，并调用对应的 `updateXXX` 或 `mountXXX` 对组件进行操作。

### reconcileChildren

对于常见的组件类型，最终会调用一个名为 `reconcileChildren` 方法:

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
```

这两个方法其实是调的一个方法:

```ts
export const reconcileChildFibers: ChildReconciler = createChildReconciler(true);
export const mountChildFibers: ChildReconciler = createChildReconciler(false);
```

这个 `createChildReconciler` 有点小长(1200+行)，包含了针对各种子节点的各种操作(创建，更新，替换)。有兴趣的话可以自行看一下源代码，这里接收的布尔类型参数表示是否要跟踪副作用，我们只看一下里面的 `reconcileChildFibers` 方法。

### reconcileChildFibers

`reconcileChildFibers` 核心逻辑在 `reconcileChildFibersImpl` 中:

```ts
function reconcileChildFibersImpl(
  returnFiber: Fiber, // 父节点
  currentFirstChild: Fiber | null, // 子节点
  newChild: any, // 新的 child 内容
  lanes: Lanes,
): Fiber | null {
  // 处理 fragment 片段，当作 array
  const isUnkeyedTopLevelFragment =
    typeof newChild === 'object' &&
    newChild !== null &&
    newChild.type === REACT_FRAGMENT_TYPE &&
    newChild.key === null;
  if (isUnkeyedTopLevelFragment) {
    newChild = newChild.props.children;
  }

  if (typeof newChild === 'object' && newChild !== null) {
    // 单节点处理
    switch (newChild.$$typeof) {
      // 类组件，函数组件都属于此类别
      case REACT_ELEMENT_TYPE:
        return placeSingleChild(
          reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes),
        );
      // 省略 ...
    }
    // 数组节点处理，循环创建多个子节点返回第一个子节点
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
    }
    // 迭代函数，例如 map 处理
    if (getIteratorFn(newChild)) {
      return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
    }
    // 是可用节点(我没遇到过这种情形)
    if (typeof newChild.then === 'function') {
      const thenable: Thenable<any> = (newChild: any);
      return reconcileChildFibersImpl(returnFiber, currentFirstChild, unwrapThenable(thenable), lanes);
    }
    // 上下文节点处理
    if (
      newChild.$$typeof === REACT_CONTEXT_TYPE ||
      newChild.$$typeof === REACT_SERVER_CONTEXT_TYPE
    ) {
      const context: ReactContext<mixed> = (newChild: any);
      return reconcileChildFibersImpl(
        returnFiber,
        currentFirstChild,
        readContextDuringReconcilation(returnFiber, context, lanes),
        lanes,
      );
    }
    throwOnInvalidObjectType(returnFiber, newChild);
  }
  // 文本类型处理
  if (
    (typeof newChild === 'string' && newChild !== '') ||
    typeof newChild === 'number'
  ) {
    return placeSingleChild(
      reconcileSingleTextNode(
        returnFiber,
        currentFirstChild,
        '' + newChild,  // 数字类型最终被转换为了字符串
        lanes,
      ),
    );
  }
  // Remaining cases are all treated as empty.
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

这个方法就是根据节点类型来创建新的节点，如果子节点是数组，Fragment context 等，则处理后再次调用自身。如果是"单节点"，则调用下面方法返回:

```ts
return placeSingleChild(reconcileSingleElement(xxx))
```

### reconcileSingleElement

这个方法都非常非常重要，几乎是这一阶段最核心的方法。涉及到 diff，FiberNode 的更新与创建，看不懂建议反复看逻辑:

```ts
function reconcileSingleElement(
  returnFiber: Fiber, 
  currentFirstChild: Fiber | null,
  element: ReactElement,
  lanes: Lanes,
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  // 更新处理: 单节点 diff：除了可以通过 key 优化的节点都删除
  while (child !== null) {
    // 存在 key 进行优化
    if (child.key === key) {
      const elementType = element.type;
      // 两个 FRAGMENT
      if (elementType === REACT_FRAGMENT_TYPE && child.tag === Fragment) {
        deleteRemainingChildren(returnFiber, child.sibling); // 删除右兄弟节点
        // 创建一个新的 Fiber 节点并设置为当前节点的父节点，并返回
        const existing = useFiber(child, element.props.children); 
        existing.return = returnFiber;
        return existing;
      } else if (
        // elementType 相同或者是懒加载类型
        child.elementType === elementType ||
        (typeof elementType === 'object' &&
          elementType !== null &&
          elementType.$$typeof === REACT_LAZY_TYPE &&
          resolveLazy(elementType) === child.type)
      ) {
        // 逻辑和上面类似，删除右兄弟节点，创建新节点并返回
        deleteRemainingChildren(returnFiber, child.sibling);
        const existing = useFiber(child, element.props);
        existing.ref = coerceRef(returnFiber, child, element);
        existing.return = returnFiber;
        return existing;
      }
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      deleteChild(returnFiber, child);
    }
    // 更新为兄弟节点，进入下一次更新
    child = child.sibling;
  }

  // 创建逻辑
  if (element.type === REACT_FRAGMENT_TYPE) {
    const created = createFiberFromFragment(
      element.props.children,
      returnFiber.mode,
      lanes,
      element.key,
    );
    created.return = returnFiber;
    return created;
  } else {
    const created = createFiberFromElement(element, returnFiber.mode, lanes);
    created.ref = coerceRef(returnFiber, currentFirstChild, element);
    created.return = returnFiber;
    return created;
  }
}
```

总的来说分为两个过程: 
- 兄弟节点更新判断: 只要不是特殊的 Fragment，懒加载，存在 key 优化情形，节点直接删掉。非常暴力。
- 创建新的节点替换。

### createFiberFromElement

```ts
export function createFiberFromElement(
  element: ReactElement,
  mode: TypeOfMode,
  lanes: Lanes,
): Fiber {
  let source = null;
  let owner = null;
  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;
  const fiber = createFiberFromTypeAndProps(
    type,
    key,
    pendingProps,
    source,
    owner,
    mode,
    lanes,
  );
  return fiber;
}
```

节点的创建在前面讲 `FiberNode` 的时候仔细分析过了，这里简单看一下。这里创建的节点最终会替换到 `workInProgress.child` 上，成为构建树中的新节点。然后开始下一个 `FiberNode` 的替换过程。

最后我们整理一下 `beginWork` 更新组件的大致流程:

![beginWork 方法流程](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FFiber%2FbeginWork.svg)