---
difficulty: hard
type: origin
pre: +/front/React/Fiber/3-6-1_commit-概述
rear: +/front/React/Fiber/3-6-3_commit_DOM挂载
---

# DOM挂载前

> 对应源码: [https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js)

commit 主要阶段可以分为三部分:
- before mutation 阶段: 替换 DOM 前
- mutation 阶段: 替换 DOM
- layout 阶段: 替换 DOM 后

## commitBeforeMutationEffects

先回顾一下 `BeforeMutationMask` 的定义:

```ts
BeforeMutationMask = Update | Snapshot;
```

这暗示了在 before mutation 阶段我们会处理:
- class 组件的 `getSnapshotBeforeUpdate` 钩子
- `hostComponent` DOM 节点发生属性变化
- `hostText` 发生文本变化，需要更新执行

总的来说这个阶段主要处理 `Snapshot` 标记。这个标记对应 class 组件的 `getSnapshotBeforeUpdate` 方法，这是一个类组件的生命周期钩子。由于 Fiber 架构 render 阶段的任务可能中断/重新开始，对应的组件在 render 阶段生命周期钩子可能触发多次，如果我们想要仅执行一次，使用该钩子即可。

<p class="tip">update 在三个阶段都会处理，这个阶段其实只有函数组件会执行一部分 update 操作。</p>

我们看一下 `commitBeforeMutationEffects` 方法:

```ts
export function commitBeforeMutationEffects(
  root: FiberRoot,
  firstChild: Fiber,
): boolean {
  focusedInstanceHandle = prepareForCommit(root.containerInfo);
  nextEffect = firstChild;
  // 开始提交
  commitBeforeMutationEffects_begin();

  const shouldFire = shouldFireAfterActiveInstanceBlur;
  shouldFireAfterActiveInstanceBlur = false;
  focusedInstanceHandle = null;
  return shouldFire;
}
```

### commitBeforeMutationEffects_begin

这个方法的核心操作在 `commitBeforeMutationEffects_begin` 里面:

```ts
function commitBeforeMutationEffects_begin() {
  while (nextEffect !== null) {
    // 遍历 FiberNode 树
    const fiber = nextEffect;
    const child = fiber.child;
    // 如果该fiber的子节点存在 BeforeMutation 阶段相关的flgas标记 且 child不为null;  则继续循环，
    if ((fiber.subtreeFlags & BeforeMutationMask) !== NoFlags && child !== null) {
      child.return = fiber;
      nextEffect = child;
    } else {
      // 子节点没有 BeforeMutation 相关的标记或是叶节点
      commitBeforeMutationEffects_complete();
    }
  }
}
```

这个过程遍历了一遍 FiberNode 树，每次循环都取出 `child` 子节点判断是否满足如下条件:
- 该 `fiber` 的子节点存在 `BeforeMutation` 阶段相关的 `flags` 标记。
- `child` 不为 `null`。

如果同时满足这两个条件，则将 `child` 设置为新的 `nextEffect`，开启下一个循环。如果不满足这两个条件，则说明当前节点就是需要处理副作用的节点，用 `commitBeforeMutationEffects_complete` 处理。

```ts
function commitBeforeMutationEffects_complete() {
  // 这里从 nextEffect 开始继续遍历 FiberNode 树
  while (nextEffect !== null) {
    const fiber = nextEffect;
    try {
      // 执行 beforeMutation 阶段的副作用
      commitBeforeMutationEffectsOnFiber(fiber);
    } catch (error) {
      captureCommitPhaseError(fiber, fiber.return, error);
    }

    // 如果有兄弟节点，则下次判断兄弟节点
    const sibling = fiber.sibling;
    if (sibling !== null) {
      sibling.return = fiber.return;
      nextEffect = sibling;
      return;
    }
    // 没有右节点，下次循环中处理父节点
    nextEffect = fiber.return;
  }
}
```

### 遍历过程

在看 `commitBeforeMutationEffectsOnFiber` 之前，我们先理一下 before commit 阶段的遍历过程:
- 从 Root Fiber 开始遍历（`nextEffect` 初值设置为 `FiberNode`）。
- 如果 FiberNode 需要在这一阶段处理，执行如下循环:
  - 执行该 FiberNode 在 beforeMutation 要执行的副作用
  - 如果有右节点，将 `nextEffect` 赋给右节点，跳出循环
  - 没有右节点，`nextEffect` 赋给父节点，继续循环
- 本节点无需更新，则 `nextEffect` 赋给子节点，继续遍历。

这个过程有两个问题：
1. 在外部遍历过程中，每次执行完都会将 `nextEffect` 赋给子节点，那么右节点需要处理 effect 怎么办？  
  答: 在 Render 过程中，如果一系列兄弟节点中的某一个FiberNode节点需要更新，那么他们的最左节点会被标记，以确保整个兄弟节点都进行一次遍历判断。
2. 在内部遍历过程中，effect 处理完成后会继续处理父节点的 effect，这个过程会一直向上传递吗？  
  答: 是的，会一直向上传递，考虑这样一种情形: react 允许传函数给子组件，而这个函数有可能导致父组件状态更新！

<p class="discuss">由于 React 有这两个特性，我们在写的时候就需要注意了。针对第一种情形，有状态的兄弟组件过多的时候可以考虑加一层无状态组件，尽量不要出现 map 多个有状态的组件。针对第二种情形，没事别让子组件改变父组件状态。</p>

## commitBeforeMutationEffectsOnFiber

来看看 before commit 阶段对 FiberNode 干了什么吧:

```ts
function commitBeforeMutationEffectsOnFiber(finishedWork: Fiber) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;

  // 针对不同组件类型进行处理
  switch (finishedWork.tag) {
    case FunctionComponent: {
      if (enableUseEffectEventHook && (flags & Update) !== NoFlags) {
        commitUseEffectEventMount(finishedWork);
      }
      break;
    }
    case ClassComponent: {
      if ((flags & Snapshot) !== NoFlags && current !== null) {
        const prevProps = current.memoizedProps;
        const prevState = current.memoizedState;
        const instance = finishedWork.stateNode;
        const snapshot = instance.getSnapshotBeforeUpdate(
          finishedWork.elementType === finishedWork.type
            ? prevProps
            : resolveDefaultProps(finishedWork.type, prevProps),
          prevState,
        );
        // 获取快照并保存在这个属性中
        instance.__reactInternalSnapshotBeforeUpdate = snapshot;
      }
      break;
    }
    case HostRoot: {
      if ((flags & Snapshot) !== NoFlags && supportsMutation) {
        const root = finishedWork.stateNode;
        // 清空根节点内容
        clearContainer(root.containerInfo);
      }
      break;
    }
    case HostComponent:
    case HostHoistable:
    case HostSingleton:
    case HostText:
    case HostPortal:
    case IncompleteClassComponent:
      // Nothing to do for these component types
      break;
    default: {
      if ((flags & Snapshot) !== NoFlags) {
        throw new Error('这类组件不应该有副作用');
      }
    }
  }
}
```

绝大部分类型的 FiberNode 在这一阶段啥都没做，仅函数组件处理了 `Update` 标记，类组件和DOM根组件处理了 `Snapshot` 标记。

我们继续看一下 `commitUseEffectEventMount` 方法:

```ts
function commitUseEffectEventMount(finishedWork: Fiber) {
  const updateQueue: FunctionComponentUpdateQueue | null =
    (finishedWork.updateQueue: any);
  const eventPayloads = updateQueue !== null ? updateQueue.events : null;
  if (eventPayloads !== null) {
    for (let ii = 0; ii < eventPayloads.length; ii++) {
      const {ref, nextImpl} = eventPayloads[ii];
      ref.impl = nextImpl;
    }
  }
}
```

这个方法用于处理 `useEffect` 钩子函数中的事件绑定。它会在组件挂载时执行，将事件监听器添加到相应的 DOM 元素上。这样，当事件触发时，React 将能够捕获并处理它们。