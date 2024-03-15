---
difficulty: hard
type: origin
pre: +/front/React/Fiber/3-6-3_commit_DOM挂载
---

# DOM挂载后

> 对应源码: [https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js)

## commitLayoutEffects

先回顾一下 `LayoutMask` 的定义:

```ts
LayoutMask = Update | Callback | Ref | Visibility;
```

在这一阶段，react 主要执行这些副作用:
- 类组件的 `componentDidMount/componentDidUpdate` 生命周期钩子函数。
- 类组件调用 `this.setState` 时传递的 `callback` 回调函数的会被保存到 Fiber 节点的 `updateQueue` 属性中在这里执行。
- 函数组件的 `useLayoutEffect` 钩子。

总的来说，Layout 阶段是在 DOM 渲染完成之后，执行组件定义的一些 `callback` 回调函数（[✨约3081行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L3081)）。

```ts
export function commitLayoutEffects(
  finishedWork: Fiber,
  root: FiberRoot,
  committedLanes: Lanes,
): void {
  // 优先级相关操作
  inProgressLanes = committedLanes;
  inProgressRoot = root;

  const current = finishedWork.alternate;
  commitLayoutEffectOnFiber(root, current, finishedWork, committedLanes);

  inProgressLanes = null;
  inProgressRoot = null;
}
```

## commitLayoutEffectOnFiber

核心方法 `commitLayoutEffectOnFiber` 同样会针对不同 tag 类型的 FiberNode 做处理，我们重点关注一下函数组件和类组件（[✨约1032行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L1032)）:

```ts
function commitLayoutEffectOnFiber(
  finishedRoot: FiberRoot,
  current: Fiber | null,
  finishedWork: Fiber,
  committedLanes: Lanes,
): void {
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent: {
      recursivelyTraverseLayoutEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
      );
      if (flags & Update) {
        // 调用 useLayoutEffect 方法
        commitHookLayoutEffects(finishedWork, HookLayout | HookHasEffect);
      }
      break;
    }
    case ClassComponent: {
      recursivelyTraverseLayoutEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
      );
      // 调用类组件的一些生命周期钩子
      if (flags & Update) {
        commitClassLayoutLifecycles(finishedWork, current);
      }
      if (flags & Callback) {
        commitClassCallbacks(finishedWork);
      }
      if (flags & Ref) {
        safelyAttachRef(finishedWork, finishedWork.return);
      }
      break;
    }
    case xxx: {
      // 省略
    }
    default: {
      recursivelyTraverseLayoutEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
      );
      break;
    }
  }
}
```

在该方法中，首先调用了 `recursivelyTraverseLayoutEffects` 方法，然后针对类组件和函数组件调用了对应的生命周期钩子方法。

### recursivelyTraverseLayoutEffects

源码（[✨约3096行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L3096)）：

```ts
function recursivelyTraverseLayoutEffects(
  root: FiberRoot,
  parentFiber: Fiber,
  lanes: Lanes,
) {
  const prevDebugFiber = getCurrentDebugFiberInDEV();
  if (parentFiber.subtreeFlags & LayoutMask) {
    let child = parentFiber.child;
    // 递归
    while (child !== null) {
      setCurrentDebugFiberInDEV(child);
      const current = child.alternate;
      // 为子节点执行layout阶段的变更效果
      commitLayoutEffectOnFiber(root, current, child, lanes);
      child = child.sibling;
    }
  }
  setCurrentDebugFiberInDEV(prevDebugFiber);
}
```

这个方法对子节点调用了 `commitLayoutEffectOnFiber` 方法。又因为 `recursivelyTraverseLayoutEffects` 方法是先调用再执行组件回调方法。因此 Layout 阶段同样是递归先执行子节点的回调函数。

此外，这个过程针对原生 DOM，还会绑定 ref 对象。绑定 ref 就是直接从当前Fiber对象的 `stateNode` 属性中，取出对应的类组件实例或者DOM实例。

最后我们整理一下整个 commit 阶段做了什么:

![commit 阶段](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FFiber%2FflushPassiveEffects.svg)