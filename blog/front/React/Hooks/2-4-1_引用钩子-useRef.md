---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-1-1_状态钩子-useState
---

# useRef

> 官方文档: [https://react.dev/reference/react/useRef](https://react.dev/reference/react/useRef)

`useRef` 的作用是保存一个不会被重新渲染的任意类型变量。通过 `ref.current` 可以获取该变量。

## mountRef/updateRef

`useRef` 的两个实现都很简单，`mountRef`（[✨约2333行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2333)）

```ts
function mountRef<T>(initialValue: T): {current: T} {
  const hook = mountWorkInProgressHook();
  const ref = {current: initialValue};
  hook.memoizedState = ref;
  return ref;
}
```

`updateRef`（[✨约2402行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2402)）:

```ts
function updateRef<T>(initialValue: T): {current: T} {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}
```

一个弱化版，砍掉 `setState` 的 `useState`。作用是在组件整个生命周期中保持一个（封装过的）任意类型变量，这个变量在组件更新过程中不会被 react 更新（开发者可以更新）。

### 使用场景

组件在 `mount` 和 `update` 阶段会重新执行一遍，因此并不能保证一些变量的值不变。使用 `useRef` 就不用担心这个问题，一些常用的场景包括：
- 记录异步任务:
  ```ts
  const intervalRef = useRef(0);
  intervalRef.current = setInterval(() => {xxx}, 1000);
  clearInterval(intervalRef.current);
  ```
- 获取 DOM 引用:
  ```ts
  const inputRef = useRef(null);
  return <input ref={inputRef} />;
  ```
- 避免每次渲染组件时重复创造对象:
  ```ts
  function Video() {
    const playerRef = useRef(null);
    if (playerRef.current === null) {
      playerRef.current = new VideoPlayer();
    }
  }
  ```

由于 react 双缓存的特性，只有 `prop, state, context` 允许直接/间接触发组件更新，这三个属性如果相同，渲染的视图就应该是相同的，因此，不允许在渲染时对 `useRef` 进行读/写操作。

```ts
function MyComponent() {
  // 🚩 Don't write a ref during rendering
  myRef.current = 123;
  useEffect(() => {
    // ✅ You can read or write refs in effects
    myRef.current = 123;
  });
  function handleClick() {
    // ✅ You can read or write refs in event handlers
    doSomething(myOtherRef.current);
  }

  // 🚩 Don't read a ref during rendering
  return <h1>{myOtherRef.current}</h1>;
}
```

## forwardRef

### 父组件获取子组件引用

我们知道 `ref` 只能引用原生 DOM 元素，没法获取函数组件的引用，这是因为 vDOM 在真实 DOM 中可能并不存在，我们需要指定获取 vDOM 中哪个真实 DOM 的引用（开始绕起来了哈😅）。

之前介绍的都是子组件拿父组件的 `ref`，如果要父组件拿子组件的 `ref` 就需要用到 `forwardRef`，这种场景下多数情况是拿子组件的真实 DOM。（[✨约12行](https://github.com/facebook/react/blob/main/packages/react/src/ReactForwardRef.js#L12)）:

```ts
export function forwardRef<Props, ElementType: React$ElementType>(
  render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
) {
  const elementType = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  };
  return elementType;
}
```

`REACT_FORWARD_REF_TYPE` 对应的 ``FiberNode.tag`` 为 `ForwardRef`，在 `beginWork` 方法中对应的处理方法为 `updateForwardRef`（[✨约394行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js#L394)）:

```ts
function updateForwardRef(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps: any,
  renderLanes: Lanes,
) {
  // 分别获取函数组件与引用
  const render = Component.render;
  const ref = workInProgress.ref;

  // 如果 ref 在 props 中，过滤掉
  let propsWithoutRef;
  if (enableRefAsProp && 'ref' in nextProps) {
    propsWithoutRef = ({}: {[string]: any});
    for (const key in nextProps) {
      if (key !== 'ref') {
        propsWithoutRef[key] = nextProps[key];
      }
    }
  } else {
    propsWithoutRef = nextProps;
  }

  // 下面逻辑和函数组件一致
  let nextChildren;
  let hasId;
  prepareToReadContext(workInProgress, renderLanes);
  nextChildren = renderWithHooks(
    current,
    workInProgress,
    render,
    propsWithoutRef,
    ref,  // 将 ref 作为 secondArg 传入，最终会作为执行函数组件的第二个参数
    renderLanes,
  );
  hasId = checkDidRenderIdHook();

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  if (getIsHydrating() && hasId) {
    pushMaterializedTreeId(workInProgress);
  }
  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}
```

这个方法作用是将 `ref` 从 `props` 中剔除，然后将 `ref` 作为函数的第二个参数传入。通过 `ref` 将父组件属性传递给子组件，就可以获取子组件的引用。

### 原生 DOM 的 ref 支持

`ref` 并不是原生 DOM 支持的属性，在 `beginWork` 阶段，react 针对原生 DOM 会执行 `markRef` 操作（[✨约1028行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js#L1028)）:

```ts
function markRef(current: Fiber | null, workInProgress: Fiber) {
  const ref = workInProgress.ref;
  if (ref === null) {
    if (current !== null && current.ref !== null) {
      // 记录一个 ref 副作用
      workInProgress.flags |= Ref | RefStatic;
    }
  } else {
    if (typeof ref !== 'function' && typeof ref !== 'object') {
      throw new Error(
        'Expected ref to be a function, an object returned by React.createRef(), or undefined/null.',
      );
    }
    if (current === null || current.ref !== ref) {
      // 记录一个 ref 副作用
      workInProgress.flags |= Ref | RefStatic;
    }
  }
}
```

这里的 `workInProgress.flags` 被加上 `ref` 标记后会在 `commit` 阶段处理(`render` 阶段无法获取 DOM)，对应的有两个方法：`safelyAttachRef` 用于添加 `ref`（[✨约274行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L274)）:

```ts
function safelyAttachRef(current: Fiber, nearestMountedAncestor: Fiber | null) {
  try {
    commitAttachRef(current);
  } catch (error) {
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
}

function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    // 获取节点真实 DOM
    const instance = finishedWork.stateNode;
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostHoistable:
      case HostSingleton:
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;
      default:
        instanceToUse = instance;
    }
    
    if (enableScopeAPI && finishedWork.tag === ScopeComponent) {
      instanceToUse = instance;
    }

    if (typeof ref === 'function') {
      // 如果是函数，执行，返回值在清理阶段执行
      if (shouldProfile(finishedWork)) {
        try {
          startLayoutEffectTimer();
          finishedWork.refCleanup = ref(instanceToUse);
        } finally {
          recordLayoutEffectDuration(finishedWork);
        }
      } else {
        finishedWork.refCleanup = ref(instanceToUse);
      }
    } else {
      // 拿到对真实 DOM 的引用
      ref.current = instanceToUse;
    }
  }
}
```

`safelyDetachRef` 用于添加 `ref`（[✨约282行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L282)）：

```ts
function safelyDetachRef(current: Fiber, nearestMountedAncestor: Fiber | null) {
  const ref = current.ref;
  const refCleanup = current.refCleanup;

  if (ref !== null) {
    // 执行清理函数
    if (typeof refCleanup === 'function') {
      try {
        if (shouldProfile(current)) {
          try {
            startLayoutEffectTimer();
            refCleanup();
          } finally {
            recordLayoutEffectDuration(current);
          }
        } else {
          refCleanup();
        }
      } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
      } finally {
        current.refCleanup = null;
        const finishedWork = current.alternate;
        if (finishedWork != null) {
          finishedWork.refCleanup = null;
        }
      }
    } else if (typeof ref === 'function') {
      let retVal;
      try {
        if (shouldProfile(current)) {
          try {
            startLayoutEffectTimer();
            retVal = ref(null);
          } finally {
            recordLayoutEffectDuration(current);
          }
        } else {
          retVal = ref(null);
        }
      } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
      }
    } else {
      // 置空
      ref.current = null;
    }
  }
}
```

主要逻辑是获取/置空真实 DOM，如果是函数会执行，并将执行结果作为清理回调。这和 `effect` 处理逻辑类似。