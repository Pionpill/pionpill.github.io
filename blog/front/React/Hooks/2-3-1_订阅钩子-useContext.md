---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-1-1_状态钩子-useState
---

# useContext

> 官方文档: [https://react.dev/reference/react/useContext](https://react.dev/reference/react/useContext)

先回顾一下这个钩子的用法（很多人只用状态管理框架而不用 `useContext`，比如作者）：

使用改钩子前必须提供一个 `Provider`，并赋予 `value` 属性:

```ts
// 默认为 light
const ThemeContext = createContext('light');

function MyPage() {
  return (
    // 提供一个 dark
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}
```

如何在该 `Provider` 的子组件中，订阅 `value`:

```ts
function Button() {
  // 拿到 dark
  const theme = useContext(ThemeContext);
  // ......
}
```

当然也可以用这种古老的方式使用(不讲了):

```ts
function Button() {
  // 🟡 遗留方式 (不推荐)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

`useContext` 允许子组件获取组件树上方最近的 `Context.Provider` 的 `value`。避免 `context` 需要多重传递的问题。注意，`useContext` 获取的值并不属于 `prop` 或 `state`，不会开启 Fiber 树更新（下文会解释为什么这样说）。

<p class="discuss">作用和 Vue 的 provide，inject 很像，甚至思想有点类似 Spring 的 IOC。</p>

咋一看 `useContext` 似乎可以替代状态管理框架（Redux 作者也是 react 16+的核心开发人员之一），但是存在几个问题（归根结底就是这个钩子太简单了）：
- `useContext` 只能获取订阅的值，无法修改，除非再订阅一个修改函数
- `useContext` 一般作用在子节点上，不是全局状态

因此，`useContext` 更适用于那些不会改变的全局状态，或能明确预见副作用的局部状态。比如 `i18n`，一些 CSS-in-JS 框架都用到了 `useContext`。

## createContext

看源码（[✨约19行](https://github.com/facebook/react/blob/main/packages/react/src/ReactContext.js#L19)）:

```ts
export function createContext<T>(defaultValue: T): ReactContext<T> {
  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE, // 最多同时支持两个并发渲染器处理
    _currentValue: defaultValue,  // 主要值
    _currentValue2: defaultValue, // 次要值
    // 记录有多少个并发渲染器
    _threadCount: 0,
    Provider: (null: any),
    Consumer: (null: any),
  };

  if (enableRenderableContext) {
    context.Provider = context;
    context.Consumer = {
      $$typeof: REACT_CONSUMER_TYPE,
      _context: context,
    };
  } else {
    (context: any).Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context,
    };
    (context: any).Consumer = context;
  }
  return context;
}
```

先不管并发渲染逻辑，简单看一下这个方法，返回了 `ReactContext` 对象，有两个属性 `Provider` 与 `Consumer` 都可以拿到 `context`。

`REACT_CONSUMER_TYPE` 与 `REACT_PROVIDER_TYPE` 会被替换为 `ContextConsumer` 与 `ContextProvider` 类型的 `tag` 挂在 `FiberNode` 上。

## ContextProvider

先看一下 `beginWork` 阶段对 `ContextProvider` 的处理，具体方法是 `updateContextProvider`（[✨约3439行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js#L3439)）:

```ts
function updateContextProvider(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
) {
  const context: ReactContext<any> = enableRenderableContext
    ? workInProgress.type : workInProgress.type._context;
  const newProps = workInProgress.pendingProps;
  const oldProps = workInProgress.memoizedProps;
  const newValue = newProps.value;

  pushProvider(workInProgress, context, newValue);

  if (enableLazyContextPropagation) {
    // 暂时什么都没写
  } else {
    if (oldProps !== null) {
      const oldValue = oldProps.value;
      if (is(oldValue, newValue)) {
        // 没有改变，bailout 优化
        if (
          // 同时比较 children
          oldProps.children === newProps.children &&
          !hasLegacyContextChanged()
        ) {
          return bailoutOnAlreadyFinishedWork(
            current,
            workInProgress,
            renderLanes,
          );
        }
      } else {
        // 让消费者更新
        propagateContextChange(workInProgress, context, renderLanes);
      }
    }
  }

  const newChildren = newProps.children;
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  return workInProgress.child;
}
```

这个过程会比较生产者组件的 `props`（`context` 内容是挂在 `props` 上的），如果有变化（即使是其他 prop 变化），则让消费者组件更新。

重点看一下 `pushProvider` 和 `propagateContextChange`:

### pushProvider

源码（[✨约102行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberNewContext.js#L102)）:

```ts
export function pushProvider<T>(
  providerFiber: Fiber,
  context: ReactContext<T>,
  nextValue: T,
): void {
  // 首屏渲染更新 _currentValue 否则更新 _currentValue2
  if (isPrimaryRenderer) {
    push(valueCursor, context._currentValue, providerFiber);
    context._currentValue = nextValue;
  } else {
    push(valueCursor, context._currentValue2, providerFiber);
    context._currentValue2 = nextValue;
  }
}

// return { current: defaultValue };
const valueCursor: StackCursor<mixed> = createCursor(null);
const valueStack: Array<any> = [];

function push<T>(cursor: StackCursor<T>, value: T, fiber: Fiber): void {
  index++;
  valueStack[index] = cursor.current;
  cursor.current = value;
}
```

这里有两个全局变量：内容游标 `valueCursor` 和内容栈 `valueStack`。整个 `pushProvider` 方法的作用就是把上下文压入 `valueStack`，游标随之更新。

对应的还有个 `popProvider` 方法，在卸载 `ContextProvider` 时调用（[✨约148行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberNewContext.js#L148)）:

```ts
export function popProvider(
  context: ReactContext<any>,
  providerFiber: Fiber,
): void {
  const currentValue = valueCursor.current;
  if (isPrimaryRenderer) {
    context._currentValue = currentValue;
  } else {
    context._currentValue2 = currentValue;
  }

  pop(valueCursor, providerFiber);
}

function pop<T>(cursor: StackCursor<T>, fiber: Fiber): void {
  if (index < 0) {
    return;
  }

  cursor.current = valueStack[index];
  valueStack[index] = null;
  index--;
}
```

### propagateContextChange

在压入上下文内容后，还需要 `propagateContextChange` 方法传播上下文（[✨约215行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberNewContext.js#L215)）:

```ts
export function propagateContextChange<T>(
  workInProgress: Fiber,
  context: ReactContext<T>,
  renderLanes: Lanes,
): void {
  if (enableLazyContextPropagation) {
    propagateContextChanges(workInProgress, [context], renderLanes, true);
  } else {
    propagateContextChange_eager(workInProgress, context, renderLanes);
  }
}
```

我们看一下走的 `propagateContextChange_eager` 逻辑（[✨约236行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberNewContext.js#L236)）:

```ts
function propagateContextChange_eager<T>(
  workInProgress: Fiber,
  context: ReactContext<T>,
  renderLanes: Lanes,
): void {
  if (enableLazyContextPropagation) return;

  let fiber = workInProgress.child;
  if (fiber !== null) {
    fiber.return = workInProgress;
  }

  while (fiber !== null) {
    // 从上到下从左到右遍历 FiberNode
    let nextFiber;

    const list = fiber.dependencies;
    if (list !== null) {
      // 存在依赖 context，深度优先
      nextFiber = fiber.child;
      let dependency = list.firstContext;
      while (dependency !== null) {
        // 遍历依赖 context，如果是当前 Provider 的上下文，处理
        if (dependency.context === context) {
          // 省略类组件逻辑

          fiber.lanes = mergeLanes(fiber.lanes, renderLanes);
          const alternate = fiber.alternate;
          if (alternate !== null) {
            alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
          }
          // 向上回溯
          scheduleContextWorkOnParentPath(
            fiber.return,
            renderLanes,
            workInProgress,
          );
          list.lanes = mergeLanes(list.lanes, renderLanes);
          // 安排更新结束，退出
          break;
        }
        dependency = dependency.next;
      }
    } else if (fiber.tag === ContextProvider) {
      // 发现是Provider组件且还是此Context的，终止DFS
      nextFiber = fiber.type === workInProgress.type ? null : fiber.child;
    } else if (fiber.tag === DehydratedFragment) {
      // SSR 的一种 tag，简单了解一下
      const parentSuspense = fiber.return;

      if (parentSuspense === null) {
        throw new Error('xxx');
      }

      parentSuspense.lanes = mergeLanes(parentSuspense.lanes, renderLanes);
      const alternate = parentSuspense.alternate;
      if (alternate !== null) {
        alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
      }
      scheduleContextWorkOnParentPath(
        parentSuspense,
        renderLanes,
        workInProgress,
      );
      nextFiber = fiber.sibling;
    } else {
      nextFiber = fiber.child;
    }

    // 找下一个 FiberNode 处理
    if (nextFiber !== null) {
      nextFiber.return = fiber;
    } else {
      nextFiber = fiber;
      while (nextFiber !== null) {
        if (nextFiber === workInProgress) {
          nextFiber = null;
          break;
        }
        const sibling = nextFiber.sibling;
        if (sibling !== null) {
          sibling.return = nextFiber.return;
          nextFiber = sibling;
          break;
        }
        nextFiber = nextFiber.return;
      }
    }
    fiber = nextFiber;
  }
}
```

这个方法的主要逻辑是遍历子节点，通过 `dependency.context === context` 判断节点是否订阅了当前 `Provider` 的上下文。注意这个过程没有直接触发节点树更新，简单看一下 `scheduleContextWorkOnParentPath`（[✨约173行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberNewContext.js#L173)）:

```ts
export function scheduleContextWorkOnParentPath(
  parent: Fiber | null,
  renderLanes: Lanes,
  propagationRoot: Fiber,
) {
  let node = parent;
  while (node !== null) {
    const alternate = node.alternate;
    if (!isSubsetOfLanes(node.childLanes, renderLanes)) {
      node.childLanes = mergeLanes(node.childLanes, renderLanes);
      if (alternate !== null) {
        alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes);
      }
    } else if (
      alternate !== null &&
      !isSubsetOfLanes(alternate.childLanes, renderLanes)
    ) {
      alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes);
    } else {
    }
    if (node === propagationRoot) {
      break;
    }
    node = node.return;
  }
}
```

这个方法只干了一件事：合并优先级，也没有触发节点树更新。先不解释，继续看下文。

### ContextCustomer

顺便看一下 `beginWork` 阶段对 `ContextCustomer` 的处理（对应 `xxx.Customer` 调用方式），具体方法是 `updateContextCustomer`（[✨约3501行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js#L3501)）:

```ts
function updateContextConsumer(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
) {
  // 拿到订阅的内容
  let context: ReactContext<any>;
  if (enableRenderableContext) {
    const consumerType: ReactConsumerType<any> = workInProgress.type;
    context = consumerType._context;
  } else {
    context = workInProgress.type;
  }

  const newProps = workInProgress.pendingProps;
  const render = newProps.children;

  // 使用订阅的内容渲染子组件
  prepareToReadContext(workInProgress, renderLanes);
  const newValue = readContext(context);
  let newChildren;
  newChildren = render(newValue);

  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  return workInProgress.child;
}
```

## readContext

首先看一个读上下文都会用到的 `prepareToReadContext` 方法（[✨约675行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberNewContext.js#L675)）：

```ts
export function prepareToReadContext(
  workInProgress: Fiber,
  renderLanes: Lanes,
): void {
  // 全局标记
  currentlyRenderingFiber = workInProgress;
  lastContextDependency = null;
  lastFullyObservedContext = null;

  const dependencies = workInProgress.dependencies;
  if (dependencies !== null) {
    if (enableLazyContextPropagation) {
      // 重置
      dependencies.firstContext = null;
    } else {
      const firstContext = dependencies.firstContext;
      if (firstContext !== null) {
        if (includesSomeLane(dependencies.lanes, renderLanes)) {
          // 标记组件进行更新，之前在 propagateContextChange 方法中打的标记
          // didReceiveUpdate = true
          markWorkInProgressReceivedUpdate();
        }
        // 清空链表
        dependencies.firstContext = null;
      }
    }
  }
}
```

这里 `markWorkInProgressReceivedUpdate` 需要 `propagateContextChange` 过程打上标记才会触发。

`useContext` 所有过程对应的具体方法都是 `readContext`（[✨约702行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberNewContext.js#L702)）:

```ts
export function readContext<T>(context: ReactContext<T>): T {
  return readContextForConsumer(currentlyRenderingFiber, context);
}

function readContextForConsumer<T>(
  consumer: Fiber | null,
  context: ReactContext<T>,
): T {
  // 拿订阅的上下文
  const value = isPrimaryRenderer
    ? context._currentValue
    : context._currentValue2;

  if (lastFullyObservedContext === context) {
    // 暂时没有任何处理
  } else {
    const contextItem = {
      context: ((context: any): ReactContext<mixed>),
      memoizedValue: value,
      next: null,
    };

    if (lastContextDependency === null) {
      // 首次订阅上下文
      if (consumer === null) {
        throw new Error('xxx');
      }

      lastContextDependency = contextItem;
      // 挂在 FiberNode 的 dependencies 属性上，也是一个链表
      consumer.dependencies = {
        lanes: NoLanes,
        firstContext: contextItem,
      };
      if (enableLazyContextPropagation) {
        consumer.flags |= NeedsPropagation;
      }
    } else {
      // 链表添加内容
      lastContextDependency = lastContextDependency.next = contextItem;
    }
  }
  return value;
}
```

逻辑很简单在 `FiberNode` 的 `dependencies` 属性上挂载订阅的上下文链。


## 总结

`useContext` 有几个特殊的地方：
- 首先他没有(`createContext` 也没有)创建 `hook`，而是在 `FiberNode` 的 `dependency` 属性中压入订阅的上下文。
- `Provider` 组件触发更新时不仅会比较 `props` 还会比较 `children`。
- `Provider` 的 `value` 变动会触发所有依赖该上下文的 `FiberNode` 更新，无视 `Memo`, `Pure` 等优化逻辑。

有一个非常有趣的地方，`Provider` 从始至终都不会直接触发组件更新。前面我们讲过，只有 `props` 的改变会触发组件更新(`state` 是子组件的 `prop`)，`Provider` 上下文改变时没有直接触发组件更新的逻辑，只设置了订阅他上下文的 `Consumer` 组件的更新优先级。

也就是说，只有树结构更新的过程中，发现某个 `Consumer` 节点被打上了 `Context` 更新的标记，才会触发对应节点的更新。如果树结构没有其他更新，那么即使 `Provider` 的 `value` 变化了，也不会引起子组件更新(子组件此时处于一个有更新任务，但是没被触发的状态)。

比如下面代码，点击按钮会发现，`value` 的确变化了，但是视图不会更新:

```ts
const fakeValue = { a: 1 };
const Context = createContext(fakeValue);

const App: React.FC<{name: string}> = () => {
  const [count, setCount] = useState(0)
  const [value, setValue] = useState({ a: 100 });
  const handleClick = () => {
    // setCount(count + 1);
    value.a++;
    console.log(value)
  }

  return (
    <Context.Provider value={value}>
      <button onClick={handleClick}>update</button>
      <Child/>
    </Context.Provider>
  )
}

const Child: React.FC = () => {
  const context = useContext(Context);
  return <p>{context.a}</p>
}
```

因为并没有 `setState` 去触发节点树更新，此时将 `setCount` 取消注释(即使不是 `setValue`)，视图就会更新了。

<p class="discuss">这又出现了一个有意思的问题，为什么引用类型改变不会触发视图改变，如果是 Vue，响应式对象引用没有改变，但属性变化了视图也会变化。因为 React 采用了双缓存节点树，我们改变的 value 在内存中，而不是在视图上！</p>
