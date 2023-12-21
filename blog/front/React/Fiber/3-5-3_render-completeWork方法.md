---
difficulty: hard
type: origin
pre: +/front/React/Fiber/3-5-2_render-beginWork方法
rear: +/front/React/Fiber/3-6-1_commit-概述
---

# completeWork 方法

> 对应源码: [https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCompleteWork.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCompleteWork.js)

`beginWork` 方法对应节点递阶段，是从父节点开始向子节点处理。`completeWork` 方法则相反，从子节点


## completeUnitOfWork

`completeWork` 方法代表一个 Fiber 节点工作结束，首先看一下 `completeUnitOfWork` 方法:

```ts
// 传进来正在构建的 Fiber 树
function completeUnitOfWork(unitOfWork: Fiber): void {
  let completedWork: Fiber = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;

    let next = completeWork(current, completedWork, entangledRenderLanes);

    if (next !== null) {
      // 处理下一个节点
      workInProgress = next;
      return;
    }

    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      // 处理右节点
      workInProgress = siblingFiber;
      return;
    }
    // 如果不存在兄弟节点，则将父级节点设置为completedWork，开始父级节点的completedWork工作
    completedWork = returnFiber;
    // 更新workInProgress，可能会开启新的beginWork工作
    workInProgress = completedWork;
  } while (completedWork !== null);

  // We've reached the root.
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootCompleted;
  }
}
```

`completeUnitOfWork` 方法关键就是一个 `do...while` 循环，当前节点处理完就返回。这个过程可能会开启新节点的 `beginWork` 工作。

## completeWork

`completeWork` 这个方法的源码小长(900+)，但主要是根据 tag 对 Fiber 节点分别进行处理:

```ts
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  const newProps = workInProgress.pendingProps;
  popTreeContext(workInProgress);
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      bubbleProperties(workInProgress);
      return null;
    case xxx:
    case HostComponent:
      ...
  }
  throw new Error('xxx');
}
```

## HostComponent

这里我们看一下 `HostComponent` (原生 DOM 组件)处理过程:

```ts
case HostComponent: {
  popHostContext(workInProgress);
  const type = workInProgress.type;
  if (current !== null && workInProgress.stateNode != null) {
    // 执行 update 操作
  } else {
    // 执行 commit 操作
  }
  bubbleProperties(workInProgress); // 将组件的状态向上冒泡传递
  preloadInstanceAndSuspendIfNeeded( // 组件预加载并挂起
    workInProgress,
    workInProgress.type,
    workInProgress.pendingProps,
    renderLanes,
  );
  return null;
}
```

这里和 `beginWork` 方法类似，也会分 commit 和 update 阶段的操作。

### update 操作

```ts
if (current !== null && workInProgress.stateNode != null) {
  updateHostComponent(
    current,
    workInProgress,
    type,
    newProps,
    renderLanes,
  );
  if (current.ref !== workInProgress.ref) {
    markRef(workInProgress);
  }
}
```

这里的 `updateHostComponent` 方法会将处理完的 `props` 赋值给 `workInProgress.updateQueue`，最终在 commit 阶段更新:

```ts
function updateHostComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
) {
  // 在 Fiber 节点的堆栈中推入宿主环境的上下文
  pushHostContext(workInProgress);

  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  }

  const type = workInProgress.type;
  const nextProps = workInProgress.pendingProps;
  const prevProps = current?.memoizedProps ?? null;

  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);

  // 判断是否为直接文本节点
  if (isDirectTextChild) {
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    workInProgress.flags |= ContentReset;
  }

  if (enableFormActions && enableAsyncActions) {
    const memoizedState = workInProgress.memoizedState;
    if (memoizedState !== null) {
      const newState = renderTransitionAwareHostComponentWithHooks(
        current,
        workInProgress,
        renderLanes,
      );
      if (isPrimaryRenderer) {
        HostTransitionContext._currentValue = newState;
      } else {
        HostTransitionContext._currentValue2 = newState;
      }
      if (!enableLazyContextPropagation && didReceiveUpdate && current !== null) {
        const oldStateHook: Hook = current.memoizedState;
        const oldState: TransitionStatus = oldStateHook.memoizedState;
        if (oldState !== newState) {
          propagateContextChange(
            workInProgress,
            HostTransitionContext,
            renderLanes,
          );
        }
      }
    }
  }

  markRef(current, workInProgress);
  // 熟悉的方法
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}
```

这个过程最关键的是调用 `reconcileChildren` 方法进行更新操作，这个方法上一节详细讲过了，这里不再说明。

### mount 操作

```ts
else {
  const currentHostContext = getHostContext();
  const wasHydrated = popHydrationState(workInProgress);
  if (wasHydrated) {
    // 如果注水过，执行相关操作
    prepareToHydrateHostInstance(workInProgress, currentHostContext);
  } else {
    const rootContainerInstance = getRootHostContainer();
    // 创建 DOM 结构
    const instance = createInstance(
      type,
      newProps,
      rootContainerInstance,
      currentHostContext,
      workInProgress,
    );
    // 插入子节点
    appendAllChildren(instance, workInProgress, false, false);
    workInProgress.stateNode = instance;
    if (
      finalizeInitialChildren(
        instance,
        type,
        newProps,
        currentHostContext,
      )
    ) {
      // 打上标签
      markUpdate(workInProgress);
    }
  }
  if (workInProgress.ref !== null) {
    markRef(workInProgress);
  }
}
```

前面我们讲过，在 `mount` 时只有 rootFiber 被打上 Placement effectTag。在归阶段的最后，rootFiber 调用 `appendAllChildren` 方法将子孙 DOM 节点插入到构建中的 DOM 树上，就构建好了一个完整的 DOM 树。

`createInstance` 这个方法很重要, 会根据客户端环境创建一个真实 DOM 结构, 它最终会调用原生 DOM 的 `document.createElement(type)` 创建真实的 DOM 元素, 简单看一下:

```ts
export function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
): Instance {
  let hostContextProd: HostContextProd = (hostContext: any);

  const ownerDocument = getOwnerDocumentFromRootContainer(
    rootContainerInstance,
  );

  let domElement: Instance;
  switch (hostContextProd) {
    case HostContextNamespaceSvg:
      domElement = ownerDocument.createElementNS(SVG_NAMESPACE, type);
      break;
    case HostContextNamespaceMath:
      domElement = ownerDocument.createElementNS(MATH_NAMESPACE, type);
      break;
    default:
      switch (type) {
        case 'svg': {
          domElement = ownerDocument.createElementNS(SVG_NAMESPACE, type);
          break;
        }
        case 'math': {
          domElement = ownerDocument.createElementNS(MATH_NAMESPACE, type);
          break;
        }
        case 'script': {
          const div = ownerDocument.createElement('div');
          div.innerHTML = '<script><' + '/script>';
          const firstChild = ((div.firstChild: any): HTMLScriptElement);
          domElement = div.removeChild(firstChild);
          break;
        }
        case 'select': {
          if (typeof props.is === 'string') {
            domElement = ownerDocument.createElement('select', {is: props.is});
          } else {
            domElement = ownerDocument.createElement('select');
          }
          if (props.multiple) {
            domElement.multiple = true;
          } else if (props.size) {
            domElement.size = props.size;
          }
          break;
        }
        default: {
          if (typeof props.is === 'string') {
            domElement = ownerDocument.createElement(type, {is: props.is});
          } else {
            domElement = ownerDocument.createElement(type);
          }
        }
      }
  }
  // 将当前的Fiber节点存储到domElement元素上
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}
```

最后两个方法 `precacheFiberNode` 和 `updateFiberProps` 会在 `domElement` 元素上定义一个 react 内部属性存储当前 Fiber 节点及其 `pendingProps`。

然后调用 `appendAllChildren` 方法将下一级的 dom 内容添加到当前的 DOM 元素之中，主要是设置 `return`, `sibling`, `child` 等属性。

最后会调用名为 `finalizeInitialChildren` 的方法初始化原生 DOM 的属性，添加事件绑定:

```ts
export function finalizeInitialChildren(
  domElement: Instance,
  type: string,
  props: Props,
  hostContext: HostContext,
): boolean {
  // 初始化dom属性
  setInitialProperties(domElement, type, props);
  switch (type) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      return !!props.autoFocus;
    case 'img':
      return true;
    default:
      return false;
  }
}
```

最后总结一下 `completeWork` 方法的大致流程:

![completeWork 方法流程](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FFiber%2FcompleteWork.svg)