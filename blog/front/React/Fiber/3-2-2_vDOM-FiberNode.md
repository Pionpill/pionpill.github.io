---
difficulty: hard
type: origin
pre: +/front/React/Fiber/3-2-1_vDOM-JSX解析
rear: +/front/React/Fiber/3-3-1_scheduler-优先级与准备阶段
---

# FiberNode

> 主要源码: [ReactFiber](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiber.js)  

<p class="tip">这章涉及到很多重要的数据结构及属性，比较难记，后文讲到建议多回来看几遍。</p>

`FiberNode` 是一个包含 Fiber 架构所需要数据的对象(使用函数实现)，也是 vDOM 这一概念对应的具体数据结构。后文中 `FiberNode` 就是指 Fiber 架构中的 vDOM。

`FiberNode` 包含了两层重要的数据:
- 作为静态数据结构: 保存了一个组件所需要的所有 DOM 信息，也即从 ReactElement 来的数据。
- 作为动态工作单元: 保存了本次更新过程中组件需要执行操作的状态与信息。

看下 `FiberNode` 的源代码（[✨约136行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiber.js#L136)），这里的属性都非常重要，后面如果忘了建议回来多看几遍:

```ts
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  /** 基本静态属性 */
  this.tag = tag;                   // 对应节点的详细类型，非常重要
  this.key = key;                   // 优化用的key，源于 ReactElement
  this.elementType = null;          // 节点的元素类型，源于 ReactElement 的 type
  this.type = null;                 // 节点的类型，主要起作用于开发模式，生产环境峡和 elementType 类似
  this.pendingProps = pendingProps; // 组件属性，源于 ReactElement
  this.mode = mode;                 // 优先级相关
  this.lanes = NoLanes;             // 优先级相关
  this.ref = null;                  // 引用
  this.refCleanup = null;           // 在生命周期中操作 ref

  /** DOM结构相关的属性 */
  this.return = null;               // 指向父 Fiber 节点
  this.child = null;                // 指向子 Fiber 节点
  this.sibling = null;              // 指向右侧 Fiber 节点
  this.index = 0;                   // 在父节点的 children 列表中的索引位置，优化用的

  /** 与组件更新相关的属性 */
  this.memoizedProps = null;        // 组件当前的 prop
  this.updateQueue = null;          // 更新队列
  this.memoizedState = null;        // hook 链表
  this.dependencies = null;         // 组件的 context 依赖项
  this.flags = NoFlags;             // render 阶段打上的 flag(一个标签)，commit 阶段处理
  this.subtreeFlags = NoFlags;      // 子树的 flag
  this.deletions = null;            // 要删除的节点
  this.alternate = null;            // 状态的备份
  this.stateNode = null;            // 当前节点关联的实际DOM节点或其他类型的节点
  this.childLanes = NoLanes;        // 保存当前节点的子节点所在的优先级。
}
```

## FiberNode 构造过程

先看一下 Fiber 是如何将 `ReactElement` 转换为 `FiberNode` 的，这里接收的参数多了两个：`mode` 和 `lanes`，`mode` 是指节点模式，比如 StrictMode，`lanes` 则是优先级，后文会细讲（[✨约659行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiber.js#L659)）:

```ts
export function createFiberFromElement(
  element: ReactElement,
  mode: TypeOfMode,
  lanes: Lanes,
): Fiber {
  let source, owner = null;
  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;
  return createFiberFromTypeAndProps(type, key, pendingProps, source, owner, mode, lanes);
}
```

核心方法在 `createFiberFromTypeAndProps` 上（[✨约488行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiber.js#L488)）:

```ts
export function createFiberFromTypeAndProps(
  type: any,
  key: null | string,
  pendingProps: any,
  source: null | Source,
  owner: null | Fiber,
  mode: TypeOfMode,
  lanes: Lanes,
): Fiber {
  // 这两个变量都是用于表示节点类型的
  let fiberTag = IndeterminateComponent; // 节点类型，初始化为不定类型
  let resolvedType = type; // 节点的最终类型

  // 这一段代码只干一件事: 确定 fiberTag 类型
  if (typeof type === 'function' && shouldConstruct(type)) {
    fiberTag = ClassComponent;
  } else if (typeof type === 'string') {
    // html 原生组件处理逻辑，确定 fiberTag 类型
  } else {
    // 处理一些特殊类型，比如 FRAGMENT，SUSPENSE，FORWARD，这里会直接返回对应的 FiberNode
  }

  // 这个方法就是调构造函数 new FiberNode(tag, pendingProps, key, mode)
  const fiber = createFiber(fiberTag, pendingProps, key, mode);
  fiber.elementType = type;
  fiber.type = resolvedType;
  fiber.lanes = lanes;
  return fiber;
}
```

这个过程有两个属性不知道哪来的，mode 和 lanes。这两个属性有很大的关联，会在将 Scheduler 时讲到。

### 节点类型

这一步最重要的就一件事: 确定 FiberNode 的 `tag` 类型，后续 render 和 commit 阶段会针对不同 `tag` 的 FiberNode 做详细处理。最常见的 `tag` 包括如下:
- `HostComponent`: DOM 元素节点。
- `FunctionComponent`: 函数组件节点。
- `ClassComponent`: 类组件节点。

DOM 元素相关的 `tag` 类型:
- `HostRoot`: 根 DOM 节点。
- `HostPortal`: Portal 节点(通过 Portal 可以将节点插在 DOM 的任意位置)。

钩子 `useContext` 相关的 `tag` 类型:
- `ContextConsumer`: Context 消费者节点
- `ContextProvider`: Context 提供者节点

钩子 `useRef` 相关的 `tag` 类型:
- `ForwardRef`: ForwardRef 组件节点

钩子 `memo` 相关的 `tag` 类型:

- `MemoComponent`: Memo 组件节点
- `SimpleMemoComponent`: 简单 Memo 组件节点

其他 `tag` 类型:
- `LazyComponent`: 懒加载组件节点
- `SuspenseComponent`: Suspense 组件节点
- `Fragment`: Fragment 组件节点
- `Mode`: 是一个 Mode
- `Profiler`: 是一个 Profiler
- `ScopeComponent`: 是一个 Scope

这个 `tag` 非常重要，在 `FiberNode` 的生命周期中，会针对不同的 `FiberNode` 做特殊处理。

### DOM 结构相关属性

DOM 接收相关的属性有四个，前三个属性: `return`, `child`, `sibling` 可以确定 DOM 数结构。在 children 是列表的情况下， `index` 可以帮助我们快速定位子节点位置。假如有如下 DOM 结构:
```js
const App:React.FC = () => {
  const list = [1, 2, 3];

  return (
    <div>
      list:
      <div>
        {list.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  )
}
```

就会产生如下 Fiber 树:

<img src="https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2F3-2-2_Fiber%E8%8A%82%E7%82%B9%2FFiberNode%E7%BB%93%E6%9E%84%E7%9B%B8%E5%85%B3%E5%B1%9E%E6%80%A7.svg">

这样在任一节点上，我们都能找到其邻近节点(左节点比较难找)。

## FiberRootNode

`FiberRootNode` 是指 React 应用程序的根节点，`FiberRootNode` 和 `FiberNode` 不同，它所持有的属性和整个 Fiber 树关联，它是存储与管理 `FiberNode` 的容器([✨约47行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberRoot.js#L47)):

```ts
function FiberRootNode(
  containerInfo: any,
  tag,
  hydrate: any,
  identifierPrefix: any,
  onRecoverableError: any,
  formState: ReactFormState<any, any> | null,
) {
  this.tag = tag;                     // 一般为 Root
  this.containerInfo = containerInfo; // React 应用程序的容器元素，即将要挂载或已经挂载的 DOM 元素
  this.pendingChildren = null;        // 下一次渲染的子元素
  this.current = null;                // 当前 Fiber 树的根节点
  this.pingCache = null;              // 缓存 FiberNode 的引用，用于快速访问
  this.finishedWork = null;           // 上一次完成的 Fiber 树的根节点
  this.timeoutHandle = noTimeout;     // 处理超时的计时器句柄
  this.cancelPendingCommit = null;    // 用于取消挂起的提交操作的函数
  this.context = null;                // 当前的上下文对象
  this.pendingContext = null;         // 下一次渲染的上下文对象
  this.next = null;                   // 下一个 FiberRootNode 对象
  this.callbackNode = null;           // 回调相关的节点
  this.callbackPriority = NoLane;     // 回调的优先级
  this.expirationTimes = createLaneMap(NoTimestamp); // 各个 Lane 的过期时间

  /** Lane 相关 */
  this.pendingLanes = NoLanes;        // 待处理的 Lane
  this.suspendedLanes = NoLanes;      // 被挂起的 Lane
  this.pingedLanes = NoLanes;         // 需要处理的 Lane
  this.expiredLanes = NoLanes;        // 已过期的 Lane
  this.finishedLanes = NoLanes;       // 已完成的 Lane
  this.errorRecoveryDisabledLanes = NoLanes;  // 禁用错误恢复的 Lane
  this.entangledLanes = NoLanes;      // 相关联的 Lane
  this.entanglements = createLaneMap(NoLanes);  // 相关联的 Lane 的映射
  this.hiddenUpdates = createLaneMap(null);     // 隐藏更新的 Lane 的映射
  this.shellSuspendCounter = 0;       // 挂起计数器

  this.identifierPrefix = identifierPrefix;     // 标识符前缀
  this.onRecoverableError = onRecoverableError; // 可恢复错误的回调函数

  if (enableCache) {
    this.pooledCache = null;          // 缓存的 FiberNode
    this.pooledCacheLanes = NoLanes;  // 缓存的 Lane
  }
  if (enableSuspenseCallback) {
    this.hydrationCallbacks = null;   // 用于注水的回调函数
  }

  this.formState = formState;         // 表单状态
  this.incompleteTransitions = new Map(); // 未完成的过渡的映射
}
```

这里有很多优先级，上下文相关的属性，我们会在后文中一一解释，只需要知道这些属性是从 `FiberRootNode` 上来的就行了。

### 构建过程

`FiberRootNode` 源于 `createRoot` 这个方法（[✨约153行](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMRoot.js#L153)）

```ts
export function createRoot(
  container: Element | Document | DocumentFragment,
  options?: CreateRootOptions,
): RootType {
  if (!isValidContainer(container)) {
    throw new Error('xxx');
  }

  /** 下面这部分属性会从 options 决定 */
  let isStrictMode = false;       // 严格模式
  let concurrentUpdatesByDefaultOverride = false;     // 是否覆盖默认的并发更新模式
  let identifierPrefix = '';      // 用于生成唯一标识符的前缀
  let onRecoverableError = defaultOnRecoverableError; // 处理可恢复的错误的回调
  let transitionCallbacks = null; // 用于存储过渡的回调函数

  if (options !== null && options !== undefined) {
    if (options.unstable_strictMode === true) {
      isStrictMode = true;
    }
    if (
      allowConcurrentByDefault &&
      options.unstable_concurrentUpdatesByDefault === true
    ) {
      concurrentUpdatesByDefaultOverride = true;
    }
    if (options.identifierPrefix !== undefined) {
      identifierPrefix = options.identifierPrefix;
    }
    if (options.onRecoverableError !== undefined) {
      onRecoverableError = options.onRecoverableError;
    }
    if (options.unstable_transitionCallbacks !== undefined) {
      transitionCallbacks = options.unstable_transitionCallbacks;
    }
  }

  const root = createContainer(
    container,
    ConcurrentRoot, // 默认开启并发模式，React16，17 会使用 LegacyRoot 模式 
    null,
    isStrictMode,
    concurrentUpdatesByDefaultOverride,
    identifierPrefix,
    onRecoverableError,
    transitionCallbacks,
  );

  // 给 #root DOM 元素设置一个内部属性，存储 root.current
  markContainerAsRoot(root.current, container);
  Dispatcher.current = ReactDOMClientDispatcher;

  const rootContainerElement: Document | Element | DocumentFragment =
    container.nodeType === COMMENT_NODE
      ? (container.parentNode: any)
      : container;
  listenToAllSupportedEvents(rootContainerElement);

  // 创建ReactDOMRoot实例对象并返回 将root应用根节点对象 存储为ReactDOM的内部对象
  return new ReactDOMRoot(root);
}
```

这个过程有三个重点步骤:
1. 调用 `createContainer`，创建root应用根节点对象。
2. 在 `#root` 应用容器元素上监听所有事件
3. 创建一个 `ReactDOMRoot` 实例对象并返回，这就是 `createRoot` 方法最后返回的root对象。

### createContainer

`createContainer` 会返回一个 `FiberRootNode`（[✨约245行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberReconciler.js#L245)）:

```ts
export function createContainer(
  containerInfo: Container,
  tag: RootTag,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
  isStrictMode: boolean,
  concurrentUpdatesByDefaultOverride: null | boolean,
  identifierPrefix: string,
  onRecoverableError: (error: mixed) => void,
  transitionCallbacks: null | TransitionTracingCallbacks,
): OpaqueRoot {
  const hydrate = false;  // SSR
  const initialChildren = null;
  return createFiberRoot(
    containerInfo,
    tag,
    hydrate,
    initialChildren,
    hydrationCallbacks,
    isStrictMode,
    concurrentUpdatesByDefaultOverride,
    identifierPrefix,
    onRecoverableError,
    transitionCallbacks,
    null,
  );
}
```

```ts
export function createFiberRoot(
  containerInfo: Container,
  tag: RootTag,
  hydrate: boolean,
  initialChildren: ReactNodeList,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
  isStrictMode: boolean,
  concurrentUpdatesByDefaultOverride: null | boolean,
  identifierPrefix: string,
  onRecoverableError: null | ((error: mixed) => void),
  transitionCallbacks: null | TransitionTracingCallbacks,
  formState: ReactFormState<any, any> | null,
): FiberRoot {
  const root: FiberRoot = (new FiberRootNode(
    containerInfo,
    tag,
    hydrate,
    identifierPrefix,
    onRecoverableError,
    formState,
  ): any);

  // 创建一个根节点并让 root.current 引用它
  const uninitializedFiber = createHostRootFiber(
    tag,
    isStrictMode,
    concurrentUpdatesByDefaultOverride,
  );
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  if (enableCache) {
    const initialCache = createCache();
    retainCache(initialCache);
    root.pooledCache = initialCache;
    retainCache(initialCache);
    const initialState: RootState = {
      element: initialChildren,
      isDehydrated: hydrate,
      cache: initialCache,
    };
    uninitializedFiber.memoizedState = initialState;
  } else {
    const initialState: RootState = {
      element: initialChildren,
      isDehydrated: hydrate,
      cache: (null: any), // not enabled yet
    };
    uninitializedFiber.memoizedState = initialState;
  }

  // 初始化HostRootFiber根节点对象的updateQueue属性
  initializeUpdateQueue(uninitializedFiber);
  return root;
}
```

这个过程就是创建了两个东西: 一个 `FiberRootNode` 类型的 root 对象最终返回，一个 hostRoot 根节点。下面一篇文章会讲这两个 root 有什么区别。

### updateContainer

前面说过 `FiberRootNode` 是 `FiberNode` 的容器，同时负责管理 `FiberNode`。那么当我们需要更新 DOM 结构时，就会调用对应的更新函数（[✨约321行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberReconciler.js#L321)）:

```ts
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): Lane {
  const current = container.current;
  // 1. 获取更新优先级与上下文
  const lane = requestUpdateLane(current);
  const context = getContextForSubtree(parentComponent);
  container.context === null ? container.context = context : container.pendingContext = context

  // 2. 创建一个update更新对象 
  const update = createUpdate(lane);
  update.payload = {element};

  callback = callback ?? null;
  callback !== null && update.callback = callback;

  // 3. 将 update 对象添加到目标Fiber对象的更新队列中
  const root = enqueueUpdate(current, update, lane);

  // 4. 开启一个新的调度更新任务
  if (root !== null) {
    scheduleUpdateOnFiber(root, current, lane);
    entangleTransitions(root, current, lane);
  }
  return lane;
}
```

这里我们看一下 update 更新对象:
```ts
export function createUpdate(lane: Lane): Update<mixed> {
  const update: Update<mixed> = {
    lane,
    tag: UpdateState, // 是个 number 类型的标志
    payload: null,  // 更新的内容
    callback: null, // 回调函数
    next: null,     // 指向下一个更新
  };
  return update;
}
```

简单看一下 `tag`:

```ts
// 1，默认情况：通过ReactDOM.createRoot或者this.setState触发
export const UpdateState = 0;
// 2，在classCompont组件生命周期函数中使用this.setState触发更新
export const ReplaceState = 1;
// 3，通过this.forceUpdate触发
export const ForceUpdate = 2;
// 4，发生错误的情况下在classComponent或者HostRoot中触发更新
export const CaptureUpdate = 3;
```

这个 update 对象最终会被塞到 `FiberNode` 的 `updateQueue` 中（[✨约225行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberClassUpdateQueue.js#L225)）:

```ts
export function enqueueUpdate<State>(
  fiber: Fiber,
  update: Update<State>,
  lane: Lane,
): FiberRoot | null {
  const updateQueue = fiber.updateQueue;
  if (updateQueue === null) { // 这表示 FiberNode 已经不存在 (unmount) 了
    return null;
  }

  const sharedQueue: SharedQueue<State> = (updateQueue: any).shared;

  if (isUnsafeClassRenderPhaseUpdate(fiber)) {
    // 不安全，直接添加到更新中队列，以便在当前渲染期间处理
    const pending = sharedQueue.pending;
    if (pending === null) {
      update.next = update;
    } else {
      update.next = pending.next;
      pending.next = update;
    }
    sharedQueue.pending = update;
    return unsafe_markUpdateLaneFromFiberToRoot(fiber, lane);
  } else {
    // 安全，添加到 queue 中
    return enqueueConcurrentClassUpdate(fiber, sharedQueue, update, lane);
  }
}
```