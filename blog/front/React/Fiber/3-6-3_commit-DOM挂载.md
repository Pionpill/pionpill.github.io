---
difficulty: hard
type: origin
pre: +/front/React/Fiber/3-6-2_commit-DOM挂载前
rear: +/front/React/Fiber/3-6-4_commit_DOM挂载后
---

# DOM挂载

> 对应源码: [https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js)

## commitMutationEffects

先回顾一下 `MutationMask` 的定义:

```ts
MutationMask = Placement | Update | ChildDeletion | ContentReset | Ref | Hydrating | Visibility;
```

这个阶段要处理的副作用比较多，主要对应 FiberNode 的增删改操作，我们看源代码（[✨约2474行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L2474)）:

```ts
export function commitMutationEffects(
  root: FiberRoot,
  finishedWork: Fiber,
  committedLanes: Lanes,
) {
  inProgressLanes = committedLanes; // 设置异步优先级
  inProgressRoot = root;

  commitMutationEffectsOnFiber(finishedWork, root, committedLanes);

  inProgressLanes = null;
  inProgressRoot = null;
}
```

核心方法 `commitMutationEffectsOnFiber` 会根据 FiberNode 的类型做一些特殊处理，我们只需要了解这几个类型的处理逻辑即可（[✨约2523行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L2523)）:

<p class="tip">几种钩子的详细作用原理我们会在其他文章中说明</p>

```ts
function commitMutationEffectsOnFiber(
  finishedWork: Fiber,
  root: FiberRoot,
  lanes: Lanes,
) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case xxx: {
      // 省略
    }
    case ClassComponent: {
      recursivelyTraverseMutationEffects(root, finishedWork, lanes);
      commitReconciliationEffects(finishedWork);

      if (flags & Ref && current !== null) {
        safelyDetachRef(current, current.return);
      }

      if (flags & Callback && offscreenSubtreeIsHidden) {
        const updateQueue: UpdateQueue<mixed> | null =
          (finishedWork.updateQueue: any);
        if (updateQueue !== null) {
          deferHiddenCallbacks(updateQueue);
        }
      }
      return;
    }
    default: {
      // 删除没必要的节点，然后递归子节点再次调用本方法
      recursivelyTraverseMutationEffects(root, finishedWork, lanes);
      // 执行组件 Placement 操作
      commitReconciliationEffects(finishedWork);
      return;
    }
  }
}
```

主要节点都会调用 `default` 中的两个方法：
- `recursivelyTraverseMutationEffects`: 自上而下遍历节点，同时执行 DOM 删除操作。
- `commitReconciliationEffects`: 自下而上插入和更新 DOM 操作。

### recursivelyTraverseMutationEffects

源码（[✨约2490行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L2490)）：

```ts
function recursivelyTraverseMutationEffects(
  root: FiberRoot,
  parentFiber: Fiber,
  lanes: Lanes,
) {
  // 删除不必要的节点
  const deletions = parentFiber.deletions;
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i];
      try {
        commitDeletionEffects(root, parentFiber, childToDelete);
      } catch (error) {
        captureCommitPhaseError(childToDelete, parentFiber, error);
      }
    }
  }

  const prevDebugFiber = getCurrentDebugFiberInDEV();
  if (parentFiber.subtreeFlags & MutationMask) {
    let child = parentFiber.child;
    // 递归
    while (child !== null) {
      setCurrentDebugFiberInDEV(child);
      // 为子节点执行挂载阶段的变更效果
      commitMutationEffectsOnFiber(child, root, lanes);
      child = child.sibling;
    }
  }
  setCurrentDebugFiberInDEV(prevDebugFiber);
}
```

这个函数检测当前 Fiber 节点是否存在 `deletions` 删除标记，如果存在则调用 `commitDeletionEffects` 方法删除。然后继续调用 `commitMutationEffectsOnFiber` 处理所有子节点。

删除 Fiber 节点的过程比较复杂，也需要根据节点类型进行相关操作，但总的来说会有如下影响:
- 执行子树所有组件的 `unmount` 卸载逻辑。
- 执行子树某些类组件的 `componentWillUnmount` 方法。
- 执行子树某些函数组件的 `useEffect`, `useLayoutEffect` 等 hooks 的 `destroy` 销毁方法。
- 执行子树所有 `ref` 属性的卸载操作。

## commitReconciliationEffects

为什么说 `commitReconciliationEffects` 是自下而上地更新与插入 DOM 呢？在卸载过程中 react 会一直递归调用 `commitMutationEffectsOnFiber` 方法，因此在调用栈中会首先执行子 FiberNode 的 `commitReconciliationEffects` 方法（[✨约3059行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L3059)）。

```ts
function commitReconciliationEffects(finishedWork: Fiber) {
  const flags = finishedWork.flags;
  // 组件需要替换
  if (flags & Placement) {
    try {
      // 针对组件类型执行属性变化，添加事件监听器操作
      commitPlacement(finishedWork);
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
    // 位运算移除替换标记
    finishedWork.flags &= ~Placement;
  }
  // SSR 的内容，暂时不管
  if (flags & Hydrating) {
    finishedWork.flags &= ~Hydrating;
  }
}
```

核心逻辑在 `commitPlacement` 方法中（[✨约1790行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L1790)）:

```ts
function commitPlacement(finishedWork: Fiber): void {
  // 省略一些不做处理的逻辑
  const parentFiber = getHostParentFiber(finishedWork);

  switch (parentFiber.tag) {
    case HostSingleton: {
      if (enableHostSingletons && supportsSingletons) {
        const parent: Instance = parentFiber.stateNode;
        const before = getHostSibling(finishedWork);
        // 遍历子节点进行相关操作
        insertOrAppendPlacementNode(finishedWork, before, parent);
        break;
      }
    }
    case HostComponent: {
      const parent: Instance = parentFiber.stateNode;
      if (parentFiber.flags & ContentReset) {
        // 重置文本内容
        resetTextContent(parent);
        // 删除对应 tag
        parentFiber.flags &= ~ContentReset;
      }

      const before = getHostSibling(finishedWork);
      // 遍历子节点进行相关操作
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }
    case HostRoot:
    case HostPortal: {
      const parent: Container = parentFiber.stateNode.containerInfo;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
      break;
    }
    default:
      throw new Error('xxx');
  }
}
```

然后还要看一下 `insertOrAppendPlacementNode` 这个方法（[✨约1848行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L1848)）:

```ts
function insertOrAppendPlacementNodeIntoContainer(
  node: Fiber,
  before: ?Instance,
  parent: Container,
): void {
  const {tag} = node;
  // 普通 DOM 元素或文本
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    const stateNode = node.stateNode;
    // 找插入位置
    if (before) {
      insertInContainerBefore(parent, stateNode, before);
    } else {
      appendChildToContainer(parent, stateNode);
    }
  } else if (
    tag === HostPortal ||
    (enableHostSingletons && supportsSingletons ? tag === HostSingleton : false)
  ) {
    // 啥都没干
  } else {
    const child = node.child;
    // 遍历子节点执行相同的操作
    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}
```

能够执行 `Placement` 副作用的，其实只有两种组件节点: `HostComponent` 和 `HostRoot`。其余组件都是卸载后更新。执行插入调用的是原生 DOM 的两个方法：`parentNode.appendChild()` 和 `parentNode.insertBefore()`。