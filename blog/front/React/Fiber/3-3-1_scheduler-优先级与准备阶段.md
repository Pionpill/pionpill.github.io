---
difficulty: hard
type: origin
pre: +/front/React/Fiber/3-2-2_vDOM-FiberNode
rear: +/front/React/Fiber/3-3-2_scheduler-调度流程
---

# 优先级与上下文

> 主要源码: [ReactEventPriorities](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactEventPriorities.js)

这两章借着工作循环机制专门讲一下 scheduler，后面的文章中会穿插着讲 scheduler。

## 优先级

react 有两类优先级，一类是在 `react-reconciler` 包下的 react 事件优先级（[✨约24行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactEventPriorities.js#L24)）:
```ts
// export type Lane = number;
// export opaque type EventPriority = Lane; 如果不认识可以忽略 opaque 关键字
export const DiscreteEventPriority: EventPriority = SyncLane;   // 1
export const ContinuousEventPriority: EventPriority = InputContinuousLane;  // 8
export const DefaultEventPriority: EventPriority = DefaultLane;   // 32
export const IdleEventPriority: EventPriority = IdleLane;   // 33554431
```

还有一类是 `scheduler` 包下的调度优先级（[✨约13行](https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerPriorities.js#L13)）:
```ts
export type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const NoPriority = 0;
export const ImmediatePriority = 1;
export const UserBlockingPriority = 2;
export const NormalPriority = 3;
export const LowPriority = 4;
export const IdlePriority = 5;
```

这两种优先级的转换关系如下（[✨约374行](https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/events/ReactDOMEventListener.js#L374)）:
```ts
switch (schedulerPriority) {
  case ImmediateSchedulerPriority:
    return DiscreteEventPriority;
  case UserBlockingSchedulerPriority:
    return ContinuousEventPriority;
  case NormalSchedulerPriority:
  case LowSchedulerPriority:
    return DefaultEventPriority;
  case IdleSchedulerPriority:
    return IdleEventPriority;
  default:
    return DefaultEventPriority;
}
```

### 优先级位运算

React 源代码中有大量的位运算(比较快)，不了解的可以看下 [菜鸟教程](https://www.runoob.com/w3cnote/bit-operation.html)。这里看几个常见的优先级位运算:

```ts
// 合并lanes
export function mergeLanes(a: Lanes | Lane, b: Lanes | Lane): Lanes {
  return a | b;
}
```

```ts
// 移除lanes
export function removeLanes(set: Lanes, subset: Lanes | Lane): Lanes {
  return set & ~subset;
}
```

```ts
// 判断当前的lanes是否包含某个lane
export function includesSomeLane(a: Lanes | Lane, b: Lanes | Lane) {
  return (a & b) !== NoLanes;
}
```

### 上下文

React 中有四种上下文:

```ts
// 没上下文
export const NoContext = 0b000;
// 批处理上下文
const BatchedContext = 0b001;
// 渲染上下文
export const RenderContext = 0b010;
// 提交上下文
export const CommitContext = 0b100;
```

## scheduler 调度准备

这里了解一下几个方法即可，在后面的代码中经常会用到。

### scheduleUpdateOnFiber

首先看一下 `scheduleUpdateOnFiber` 方法（[✨约724行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js#L724)）:

```ts
export function scheduleUpdateOnFiber(
  root: FiberRoot,
  fiber: Fiber,
  lane: Lane,
) {
  // 检查工作循环是否当前处于挂起状态并等待数据加载完成。如果是挂起状态，则中断当前尝试并从头开始重新启动。
  if (
    (root === workInProgressRoot &&
      workInProgressSuspendedReason === SuspendedOnData) ||
    root.cancelPendingCommit !== null
  ) {
    prepareFreshStack(root, NoLanes);
    markRootSuspended(
      root,
      workInProgressRootRenderLanes,
      workInProgressDeferredLane,
    );
  }

  // 给根结点打个标记，要开始更新了
  markRootUpdated(root, lane);

  if (
    (executionContext & RenderContext) !== NoLanes &&
    root === workInProgressRoot
  ) {
    // 检查渲染阶段是否有更新，有的话发出警告
    warnAboutRenderPhaseUpdatesInDEV(fiber);
    // 跟踪在渲染阶段更新的 lanes
    workInProgressRootRenderPhaseUpdatedLanes = mergeLanes(
      workInProgressRootRenderPhaseUpdatedLanes,
      lane,
    );
  } else {
    // 常规更新过程
    if (root === workInProgressRoot) {
      if ((executionContext & RenderContext) === NoContext) {
        workInProgressRootInterleavedUpdatedLanes = mergeLanes(
          workInProgressRootInterleavedUpdatedLanes,
          lane,
        );
      }
      if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
        // 标记根节点为挂起状态
        markRootSuspended(root, workInProgressRootRenderLanes, workInProgressDeferredLane);
      }
    }

    // 确保根节点的调度
    ensureRootIsScheduled(root);

    if (
      lane === SyncLane &&
      executionContext === NoContext &&
      (fiber.mode & ConcurrentMode) === NoMode
    ) {
      // 重置渲染计时器，在同步根节点上刷新工作
      resetRenderTimer();
      flushSyncWorkOnLegacyRootsOnly();
    }
  }
}
```

`scheduleUpdateOnFiber` 方法是在一个 FiberNode 上触发调度更新任务，这个函数看着很长，但主要就执行了两个逻辑:

```ts
// 1，标记 root 有更新任务
markRootUpdated(root, lane, eventTime);
// 2，开始调度
ensureRootIsScheduled(root, eventTime);
```

### markRootUpdated

源码[✨约612行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberLane.js#L612)

```ts
export function markRootUpdated(root: FiberRoot, updateLane: Lane) {
  // 将更新优先级加到 root 的等待优先级上，这一步告诉根节点有东西要处理
  root.pendingLanes |= updateLane;
  if (updateLane !== IdleLane) {
    // 重置root应用根节点的优先级
    root.suspendedLanes = NoLanes;
    root.pingedLanes = NoLanes;
  }
}
```

### ensureRootIsScheduled

这个方法很重要，当 react 内部需要更新时，都会调用这个方法，确保根节点在恰当的时机触发更新流程（[✨约84行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberRootScheduler.js#L84)）:

```ts
// 确保root应用根节点被调度
export function ensureRootIsScheduled(root: FiberRoot): void {
  // 把 root 加入到 schedule 中
  if (root !== lastScheduledRoot && root.next === null) {
    if (lastScheduledRoot === null) {
      firstScheduledRoot = lastScheduledRoot = root;
    } else {
      lastScheduledRoot.next = root;
      lastScheduledRoot = root;
    }
  }

  // 下次执行 schedule 的时候通过该变量决定是否快速退出 flushSync
  mightHavePendingSyncWork = true;

  if (!didScheduleMicrotask) {
    didScheduleMicrotask = true;
    // 执行'微任务'
    scheduleImmediateTask(processRootScheduleInMicrotask);
  }

  // 如果启用了这个标志，立即调度 root 任务
  if (!enableDeferRootSchedulingToMicrotask) {
    scheduleTaskForRootDuringMicrotask(root, now());
  }
}
```

`ensureRootIsScheduled` 干了两件事:
1. 确保 root 处于 schedule 中，不在则加入进去。
2. 让一个等待中的微任务去执行 root schedule

再看一下 `scheduleImmediateTask` 的逻辑（[✨约455行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberRootScheduler.js#L455)）:

```ts
function scheduleImmediateTask(cb: () => mixed) {
  // 如果环境支持微任务
  if (supportsMicrotasks) {
    // 设置一个微任务
    scheduleMicrotask(() => {
      // 不处于 render/commit 阶段时进行 workloop
      const executionContext = getExecutionContext();
      if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
        // 这个方法会在下一篇文章中详细讲
        Scheduler_scheduleCallback(ImmediateSchedulerPriority, cb);
        return;
      }
      cb();
    });
  } else {
    // 如果不支持微任务，直接进行 workloop
    Scheduler_scheduleCallback(ImmediateSchedulerPriority, cb);
  }
}
```