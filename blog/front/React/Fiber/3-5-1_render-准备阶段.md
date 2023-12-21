---
difficulty: hard
type: origin
pre: +/front/React/Fiber/3-4-2_冲刷副作用
rear: +/front/React/Fiber/3-5-2_Render-completeWork方法
---

# render 准备阶段

> 对应源码: [https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js)

回顾一下 render 阶段开始的代码:
```ts
let exitStatus = shouldTimeSlice ? renderRootConcurrent(root, lanes) : renderRootSync(root, lanes);
```

## renderRootSync

这里我们看一下同步 render 的逻辑，因为 react 大多数情况下都是同步 render，并且同步异步的核心逻辑差不多。

```ts
function renderRootSync(root: FiberRoot, lanes: Lanes) {
  const prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  const prevDispatcher = pushDispatcher(root.containerInfo);
  const prevCacheDispatcher = pushCacheDispatcher();

  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    workInProgressTransitions = getTransitionsForLanes(root, lanes);
    // 这里开始 root 就有了 alternate
    prepareFreshStack(root, lanes);
  }

  outer: do {
    try {
      if (
        workInProgressSuspendedReason !== NotSuspended &&
        workInProgress !== null
      ) {
        // 处理 render 暂停情形，主要是异步渲染时间片用完导致的
        const unitOfWork = workInProgress;
        const thrownValue = workInProgressThrownValue;
        switch (workInProgressSuspendedReason) {
          case SuspendedOnHydration: {
            // 注水：重置 Fiber 栈
            resetWorkInProgressStack();
            workInProgressRootExitStatus = RootDidNotComplete;
            break outer;
          }
          case SuspendedOnImmediate:
          case SuspendedOnData: {
            if (!didSuspendInShell && getSuspenseHandler() === null) {
              // 如果没有在外部环境中暂停且没有暂停处理程序
              didSuspendInShell = true;
            }
          }
          default: {
            // 其他情况抛出异常
            workInProgressSuspendedReason = NotSuspended;
            workInProgressThrownValue = null;
            throwAndUnwindWorkLoop(unitOfWork, thrownValue);
            break;
          }
        }
      }
      // 进入核心的工作循环过程
      workLoopSync();
      break;
    } catch (thrownValue) {
      handleThrow(root, thrownValue);
    }
  } while (true);

  // 暂停则计数，防止无限停止
  if (didSuspendInShell) {
    root.shellSuspendCounter++;
  }

  resetContextDependencies();

  executionContext = prevExecutionContext;
  popDispatcher(prevDispatcher);
  popCacheDispatcher(prevCacheDispatcher);

  if (workInProgress !== null) {
    throw new Error('xxx');
  }

  // 这里赋值表示没有 render 任务了
  workInProgressRoot = null;
  workInProgressRootRenderLanes = NoLanes;

  finishQueueingConcurrentUpdates();
  return workInProgressRootExitStatus;
}
```

### prepareFreshStack

`prepareFreshStack` 的作用是在每次更新之前做一些准备工作，主要是关闭一些原有的回调函数，重置一些属性：

```ts
function prepareFreshStack(root: FiberRoot, lanes: Lanes): Fiber {
  // 重置当前应用根节点的 Fiber 树
  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  // 由于重置了 Fiber 树，将一些特殊情形下的处理回调取消
  const timeoutHandle = root.timeoutHandle;
  if (timeoutHandle !== noTimeout) {
    root.timeoutHandle = noTimeout;
    cancelTimeout(timeoutHandle);
  }
  const cancelPendingCommit = root.cancelPendingCommit;
  if (cancelPendingCommit !== null) {
    root.cancelPendingCommit = null;
    cancelPendingCommit();
  }

  // 重置一些属性
  resetWorkInProgressStack();
  workInProgressRoot = root;
  const rootWorkInProgress = createWorkInProgress(root.current, null);
  workInProgress = rootWorkInProgress;
  workInProgressRootRenderLanes = lanes;
  workInProgressSuspendedReason = NotSuspended;
  workInProgressThrownValue = null;
  workInProgressRootDidAttachPingListener = false;
  workInProgressRootExitStatus = RootInProgress;
  workInProgressRootFatalError = null;
  workInProgressRootSkippedLanes = NoLanes;
  workInProgressRootInterleavedUpdatedLanes = NoLanes;
  workInProgressRootRenderPhaseUpdatedLanes = NoLanes;
  workInProgressRootPingedLanes = NoLanes;
  workInProgressDeferredLane = NoLane;
  workInProgressRootConcurrentErrors = null;
  workInProgressRootRecoverableErrors = null;

  entangledRenderLanes = getEntangledLanes(root, lanes);
  finishQueueingConcurrentUpdates();
  return rootWorkInProgress;
}
```

上面源代码的内容可以分为三部分:
- 重置 `root` 应用节点上的 Fiber 树，更新 `lanes`，取消一些处理函数。在每次创建具体 `FiberTree` 之前，都会首先创建用于本次 `FiberTree` 的节点 `HostFiber`，并且将 `HostFiber` 节点赋值给全局变量 `workInProgress`，表示它将是第一个执行 `beginWork` 工作的节点。
- 重置一些全局变量的值。
- 调用 `finishQueueingConcurrentUpdates` 方法: 将同属为一个 Fiber 节点的 update 对象构建为一个单向环形链表，存储到 `queue.pending` 属性中。它内部会调 `markUpdateLaneFromFiberToRoot` 方法，将本节点的 `lanes` 属性值向上传递，直到 `hostFiber` 根节点。具体的做法是将本节点的 `lanes` 属性值附加到父节节点的 `childLanes` 属性中，这样的作用是在每个节点的 `beginWork` 工作中，可以通过 `childLanes` 来判断子节点树有没有更新的任务。

<p class="tip">workInProgress 是一个全局变量，代表在工作中的 FiberNode。</p>
 
## performUnitOfWork

准备工作完成后就可以进入核心的 workloop 过程了。`workLoopSync` 和 `workLoopConcurrent` 方法最终都会调同一个方法，只不过异步渲染时会加一个时间片判断:

```js
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```
然后看一下核心的 `performUnitOfWork` 方法(删掉无关紧要的内容):

```ts
// 这里传进来的就是正在构建的 Fiber 树
function performUnitOfWork(unitOfWork: Fiber): void {
  // 这里是拿界面上的 Fiber 树
  const current = unitOfWork.alternate;
  let next = beginWork(current, unitOfWork, entangledRenderLanes);

  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  next === null ? completeUnitOfWork(unitOfWork) : workInProgress = next;
  ReactCurrentOwner.current = null;
}
```

Fiber Reconciler 是从 Stack Reconciler 发展来的，因此继承了递归逻辑，但实现了可中断的递归。递归分为两个阶段:
- 递：从 `rootFiber` 开始进行深度优先遍历，对每个遍历的 Fiber Node 调用 `beginWork` 方法创建其子节点。
- 归: 递完成后的回调操作，对应 `completeWork` 方法（来自 `completeUnitOfWork` 方法）。

这两个方法逻辑比较复杂但也非常关键，因为它和我们写的组件直接相关。下文我们会详细讲解。
