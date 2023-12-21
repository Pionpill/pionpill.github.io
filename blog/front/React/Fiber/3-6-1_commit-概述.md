---
difficulty: hard
type: origin
pre: +/front/React/Fiber/3-5-3_render-completeWork方法
rear: +/front/React/Fiber/3-6-2_commit-DOM挂载前
---

# commit 阶段概述

> 对应源码: [https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js)

在进入 commit 阶段前，无论是同步构建还是异步构建都会执行如下操作:

```ts
const finishedWork: Fiber = (root.current.alternate: any);
root.finishedWork = finishedWork;
root.finishedLanes = lanes;
```

这些操作会将 render 阶段构建好的 Fiber 树与 `FiberRootNode` 的 `finishedWork` 属性绑定。这代表着 Fiber 树已经构建完成，但是还没有替换页面上的 Fiber 树（current 属性没变）。

## 准备阶段

commit 阶段开始于 `commitRoot` 方法，具体实现为 `commitRootImpl` 方法。这个方法可以分为准备阶段，主要阶段，收尾阶段三部分，先看一下准备阶段:

```ts
function commitRootImpl(
  root: FiberRoot,  // 当前 fiber 树的根节点
  recoverableErrors: null | Array<CapturedValue<mixed>>,
  transitions: Array<Transition> | null,
  renderPriorityLevel: EventPriority,
  spawnedLane: Lane,
) {
  do {
    // 冲刷被动副作用，这里用了一个 while 循环，来确保微任务产生的微任务也被执行完
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);

  // 取出 render 阶段构建的 workInProgress 树
  const finishedWork = root.finishedWork;
  if (finishedWork === null) {
    return null;
  }

  // 这里重置了 FiberRootNode 上 fishWork 相关的属性
  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  // commitRoot 永远是同步执行的，因此可以重置回调任务与优先级
  root.callbackNode = null;
  root.callbackPriority = NoLane;
  root.cancelPendingCommit = null;

  // 合并同一批次的lanes，通过位运算，产生新的lane
  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);

  // 获取并发更新的 lanes 
  const concurrentlyUpdatedLanes = getConcurrentlyUpdatedLanes();
  remainingLanes = mergeLanes(remainingLanes, concurrentlyUpdatedLanes);
  // 标记root完成
  markRootFinished(root, remainingLanes, spawnedLane);

  // 如果到这里存在要处理的副作用，加入处理队列 
  if (
    (finishedWork.subtreeFlags & PassiveMask) !== NoFlags ||
    (finishedWork.flags & PassiveMask) !== NoFlags
  ) {
    if (!rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = true;
      pendingPassiveEffectsRemainingLanes = remainingLanes;
      pendingPassiveTransitions = transitions;
      // 将冲刷副作用放到 NormalSchedulerPriority(低优先级)，等浏览器有空再处理
      scheduleCallback(NormalSchedulerPriority, () => {
        flushPassiveEffects();
        return null;
      });
    }
  }

  // ................
}
```

到这里大部分是一些优先级处理操作，比较重要的是用一个 `do...while` 冲刷了被动副作用。 

## 主要阶段

我们看一下主要阶段的源代码:

```ts
function commitRootImpl(
  root: FiberRoot,  // 当前 fiber 树的根节点
  recoverableErrors: null | Array<CapturedValue<mixed>>,
  transitions: Array<Transition> | null,
  renderPriorityLevel: EventPriority,
  spawnedLane: Lane,
) {
  // ................

  // 判断子结点和自身是否存在副作用
  const subtreeHasEffects = (finishedWork.subtreeFlags & 
    (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & 
    (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !== NoFlags;

  // 如果存在副作用，需要进行 commit 处理
  if (subtreeHasEffects || rootHasEffect) {
    const prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = null;
    const previousPriority = getCurrentUpdatePriority();
    // 设置为同步优先级
    setCurrentUpdatePriority(DiscreteEventPriority);

    const prevExecutionContext = executionContext;
    executionContext |= CommitContext;
    ReactCurrentOwner.current = null;

    // 这三句代码对应 before commit，commit，after commit 阶段最核心的处理过程
    const shouldFireAfterActiveInstanceBlur = commitBeforeMutationEffects(
      root,
      finishedWork,
    );  // beforeCommit
    commitMutationEffects(root, finishedWork, lanes); // commit
    resetAfterCommit(root.containerInfo);
    root.current = finishedWork; // 到这里 DOM 树被替换了
    commitLayoutEffects(finishedWork, root, lanes); // after commit

    // 让 Scheduler 在帧结尾执行调度策略
    requestPaint();
    executionContext = prevExecutionContext;

    // 重新设置优先级
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig.transition = prevTransition;
  } else {
    // 没有副作用，不处理直接替换 DOM
    root.current = finishedWork;
  }

  // ................
}
```

### flags 场景

在判断是否要进行 commit 处理之前，需要通过 `subtreeHasEffects` 和 `rootHasEffect` 检测 `HostFiber` 子孙节点和本身是否存在副作用。这两个变量的判断条件都和四个 `mask` 掩码相关:

```ts
BeforeMutationMask | MutationMask | LayoutMask | PassiveMask
```

前面 render 阶段我们已经接触过一些 flags 类型，这里我们看一下常见的 flags 标记及其对应的场景:
- `Placement`: 代表当前Fiber或者子孙Fiber存在需要插入或者移动的dom元素或者文本【hostComponent,hostText】
- `Update`: 
  - 触发class组件的mount/update生命周期钩子函数; 
  - hostComponent发生属性变化; 
  - hostText发生文本变化; 
  - Fun组件定义了useLayoutEffect
- `Deletion`: 当前节点存在删除操作
- `ChildDeletion`: 子节点存在需要删除的dom或者文本【hostComponent,hostText】
- `ContentReset`: 清空hostComponent，即DOM节点的文本内容
- `Callback`: 调用this.setState时，传递了回调函数参数
- `Ref`: ref引用的创建与更新
- `Snapshot`: 触发class组件的getSnapshotBeforeUpdate方法【使用较少】
- `Passive`: 触发函数组件的useEffect钩子

这四个 `mask` 的定义分别为:

```ts
BeforeMutationMask = Update | Snapshot;
MutationMask = Placement | Update | ChildDeletion | ContentReset | Ref | Hydrating | Visibility;
LayoutMask = Update | Callback | Ref | Visibility;
PassiveMask = Passive | ChildDeletion;
```

### 核心方法

如果需要进入 commit 阶段，首先会把当前任务设置为同步执行，这代表整个 commit 阶段都是同步不可中断的:

```ts
setCurrentUpdatePriority(DiscreteEventPriority);
```

然后调用最核心的三个方法:

```ts
const shouldFireAfterActiveInstanceBlur = commitBeforeMutationEffects(
  root,
  finishedWork,
);  // beforeCommit
commitMutationEffects(root, finishedWork, lanes); // commit
resetAfterCommit(root.containerInfo); // 做一些清理顾左右，重置更新队列等操作
root.current = finishedWork;
commitLayoutEffects(finishedWork, root, lanes); // after commit
```

这三个方法分别对应了前面讲的 commit 阶段三个子阶段。

## 收尾阶段

最后一小段代码(处理完本轮副作用收尾工作):

```ts
function commitRootImpl(
  root: FiberRoot,  // 当前 fiber 树的根节点
  recoverableErrors: null | Array<CapturedValue<mixed>>,
  transitions: Array<Transition> | null,
  renderPriorityLevel: EventPriority,
  spawnedLane: Lane,
) {
  // ................
  
  const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;
  if (rootDoesHavePassiveEffects) {
    // commit 阶段之后仍有副作用要处理
    rootDoesHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsLanes = lanes;
  } else {
    // 没副作用了，释放缓存池
    releaseRootPooledCache(root, remainingLanes);
  }

  remainingLanes = root.pendingLanes;
  if (remainingLanes === NoLanes) {
    // 没有副作用，释放资源
    legacyErrorBoundariesThatAlreadyFailed = null;
  }

  onCommitRootDevTools(finishedWork.stateNode, renderPriorityLevel);
  ensureRootIsScheduled(root);

  if (recoverableErrors !== null) {
    // 有问题就打印
    const onRecoverableError = root.onRecoverableError;
    for (let i = 0; i < recoverableErrors.length; i++) {
      const recoverableError = recoverableErrors[i];
      const errorInfo = makeErrorInfo(
        recoverableError.digest,
        recoverableError.stack,
      );
      onRecoverableError(recoverableError.value, errorInfo);
    }
  }

  if (hasUncaughtError) {
    // 抛错
    hasUncaughtError = false;
    const error = firstUncaughtError;
    firstUncaughtError = null;
    throw error;
  }

  if (includesSyncLane(pendingPassiveEffectsLanes) && root.tag !== LegacyRoot) {
    flushPassiveEffects();
  }

  remainingLanes = root.pendingLanes;
  if (
    includesSomeLane(lanes, UpdateLanes) &&
    includesSomeLane(remainingLanes, SyncUpdateLanes)
  ) {
    if (root === rootWithNestedUpdates) {
      nestedUpdateCount++;
    } else {
      nestedUpdateCount = 0;
      rootWithNestedUpdates = root;
    }
  } else {
    nestedUpdateCount = 0;
  }

  flushSyncWorkOnAllRoots();

  return null;
}
```
