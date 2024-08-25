---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-1-1_状态钩子-useState
---

# memo

> 官方文档: [https://react.dev/reference/react/memo](https://react.dev/reference/react/memo)  

<p class="tip">memo 是一个高阶函数，不是钩子，但都是做性能优化，且部分逻辑相同，因此放在一起讲。</p>

我们知道，React 的更新过程是十分"暴力"的，如果发现某个节点需要更新，React 会完全构建一棵新的子 Fiber 树替换原来的树结构。这个过程中，从需要替换的 FiberNode 开始，所有的子 FiberNode 也会重新构建，即使他们没必要更新（即状态没有改变）。为了复用原有的组件提高性能，React 提供了一系列的性能优化 API。

`memo` 是最早的性能优化 API，实现上非常简单（[✨约14行](https://github.com/facebook/react/blob/main/packages/react/src/ReactMemo.js#L14)）:

```ts
export function memo<Props>(
  type: React$ElementType,
  compare?: (oldProps: Props, newProps: Props) => boolean,
) {
  const elementType = {
    $$typeof: REACT_MEMO_TYPE,
    type,
    compare: compare === undefined ? null : compare,
  };
  return elementType;
}
```

`memo` 接受两个参数，第一个是需要优化的组件，第二个是一个函数，接受旧新 `props`，返回布尔值用于判断是否执行优化策略（`true` 表示优化）。如果不传第二个函数则默认对新旧 `props` 进行 `shallowEqual` 比较。

源代码中，`memo` 返回了一个类型为 `REACT_MEMO_TYPE` 的元素。

## updateMemoComponent

在 `beginWork` 过程中，会通过 `updateMemoComponent` 函数处理这个类型的节点（[✨约480行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js#L480)）:

```ts
function shouldConstruct(Component: Function) {
  const prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

export function isSimpleFunctionComponent(type: any): boolean {
  return (
    typeof type === 'function' &&
    !shouldConstruct(type) &&
    type.defaultProps === undefined
  );
}

function updateMemoComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps: any,
  renderLanes: Lanes,
): null | Fiber {
  // 首次构建
  if (current === null) {
    const type = Component.type;
    if (
      isSimpleFunctionComponent(type) &&
      Component.compare === null &&
      (disableDefaultPropsExceptForClasses ||
        Component.defaultProps === undefined)
    ) {
      // 简单函数组件（新概念，做优化用的）
      let resolvedType = type;
      workInProgress.tag = SimpleMemoComponent;
      workInProgress.type = resolvedType;
      return updateSimpleMemoComponent(
        current,
        workInProgress,
        resolvedType,
        nextProps,
        renderLanes,
      );
    }
    // 不是简单函数组件
    const child = createFiberFromTypeAndProps(
      Component.type,
      null,
      nextProps,
      workInProgress,
      workInProgress.mode,
      renderLanes,
    );
    child.ref = workInProgress.ref;
    child.return = workInProgress;
    workInProgress.child = child;
    return child;
  }
  // 非首次构建
  const currentChild = ((current.child: any): Fiber);
  const hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(
    current,
    renderLanes,
  );
  // 不存在更新或订阅内容
  if (!hasScheduledUpdateOrContext) {
    const prevProps = currentChild.memoizedProps;
    let compare = Component.compare;
    compare = compare !== null ? compare : shallowEqual;
    // 关键：新旧 props 比较，且视图与构建中的 FiberNode 相同
    if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
      // bailout 优化：跳过渲染
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    }
  }
  // 不满足优化策略，走常规构建流程
  workInProgress.flags |= PerformedWork;
  const newChild = createWorkInProgress(currentChild, nextProps);
  newChild.ref = workInProgress.ref;
  newChild.return = workInProgress;
  workInProgress.child = newChild;
  return newChild;
}
```

这个过程略微有些复杂，分为两种情形:
- 首次构建：如果判是一个简单函数组件，那么执行 `updateSimpleMemoComponent` 方法，否则按常规流程创建一个对应的节点。简单函数组件须满足的要求:
  - 是一个函数组件
  - 没有原型或原型没有 `isReactComponent` 属性，箭头函数！
  - 没有默认 `props`
  - `memo` 第二个参数不传（默认 `shallowEqual`）
- 非首次构建: 如果没有更新计划，且没有订阅 `context` 变化，那么优化处理：复用组件。否则退出。

## updateSimpleMemoComponent

看源代码（[✨约569行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js#L569)）

```js
function updateSimpleMemoComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps: any,
  renderLanes: Lanes,
): null | Fiber {
  // React团队：内部渲染暂时时，current 可能不为 null
  if (current !== null) {
    const prevProps = current.memoizedProps;
    // 比较逻辑和上面相同
    if (
      shallowEqual(prevProps, nextProps) &&
      current.ref === workInProgress.ref)
    ) {
      didReceiveUpdate = false;
      workInProgress.pendingProps = nextProps = prevProps;

      if (!checkScheduledUpdateOrContext(current, renderLanes)) {
        workInProgress.lanes = current.lanes;
        return bailoutOnAlreadyFinishedWork(
          current,
          workInProgress,
          renderLanes,
        );
      } else if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        // 一种特殊情形，暂不考虑
        didReceiveUpdate = true;
      }
    }
  }
  // 走常规更新逻辑
  return updateFunctionComponent(
    current,
    workInProgress,
    Component,
    nextProps,
    renderLanes,
  );
}
```

## shallowEqual

看完发现和非首次构建时的优化处理逻辑类似。有一个重点方法: `shallowEqual`（[✨约18行](https://github.com/facebook/react/blob/main/packages/shared/shallowEqual.js#L18)）：

```ts
function is(x: any, y: any) {
  // 区分 +0, -0, NaN
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

function shallowEqual(objA: mixed, objB: mixed): boolean {
  // is 方法与 Object.js 相同
  if (is(objA, objB)) {
    return true;
  }

  // 传参出了问题
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  // 属性长度比较（优化）
  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    const currentKey = keysA[i];
    // B 不存在键或者值不相同
    if (
      // 调用 hasOwnPrototype 防止比较原型链上的属性
      !hasOwnProperty.call(objB, currentKey) ||
      !is(objA[currentKey], objB[currentKey])
    ) {
      return false;
    }
  }

  return true;
}
```

这个方法还是很有意思的，虽然直译过来叫浅比较，但是却对直接属性进行了比较，有几个值得注意的地方:
- 如果前后 `props` 没有改变，直接返回 `true`。
- 如果改变了取出所有直接属性进行比较（`Object.keys()` 取不出不可枚举与 `Symbol` 属性）。

这个方法比直接传一个 `(pre, new) => per === new` 更好，因此除非要特殊处理，否则不建议传第二个参数。

最后再看一下最关键的代码片段:

```ts
// 不存在更新或订阅内容
if (!hasScheduledUpdateOrContext) {
  const prevProps = currentChild.memoizedProps;
  let compare = Component.compare;
  compare = compare !== null ? compare : shallowEqual;
  // 关键：新旧 props 比较，且视图与构建中的 FiberNode 相同
  if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }
}
```

总结：触发 `memo` 组件复用优化的条件:
- 组件没有安排更新计划，且不存在 `context` 变化
- `memo` 的第二个函数执行结果为 `true`，默认采用 `shallowEqual` 比较
- 构建前后的组件是同一个组件