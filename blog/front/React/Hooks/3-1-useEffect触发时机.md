---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-2-1_副作用钩子-useEffect
---

# useEffect 触发时机

<p class="tip">最近面试，useEffect 被拷打懵了，特地整理一下。</p>

## useEffect 基础

先回顾一下 `useEffect` 这个钩子：

```ts
function useEffect(effect: EffectCallback, deps?: unknown[]): void;
```

- `effect`：副作用函数，返回值会在组件卸载时执行，一般是事件取消逻辑。
- `deps`：依赖数组。

逻辑很简单：`deps` 依赖数组中如果有变量值发生变化，那么执行副作用。有两种特殊情形：
- 不传 `deps`：组件每次更新的时候都执行。
- `deps` 为空数组：仅在 `mount` 阶段执行一次。

这些都是使用层的逻辑，一般记住上面的规则就可以了，但是既然 React 源码都看过了（没看过源码的可以简单过一下这篇文章：[副作用钩子-useEffect](https://pionpill.github.io/blog/front/React/Hooks/2-2-1_%E5%89%AF%E4%BD%9C%E7%94%A8%E9%92%A9%E5%AD%90-useEffect)），当让要从底层角度分析。

## useEffect 源码逻辑

任何 `FiberNode` 都会经历以下三个阶段：
- `mount`：组件装载，即创建一个全新的组件。
- `update`：组件更新，一般是由 `props`, `state`, `context` 发生变化时直接/间接导致的更新。
- `unmount`：组件卸载。

### mount 阶段

在 `mount` 阶段，函数组件会调用名为 `renderWithHooks` 的方法，这个方法会初始化一些属性，确定当前组件所处的阶段，然后执行一遍我们的函数：

```ts
let children = Component(props, secondArg);
```

函数在执行过程中遇到 `useEffect` 钩子会执行对应的 `mountEffect` 方法，这个方法的具体执行逻辑如下:

```ts
function mountEffectImpl(
  fiberFlags: Flags,
  hookFlags: HookFlags,
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  const hook = mountWorkInProgressHook(); // 创建一个 hook 对象
  const nextDeps = deps === undefined ? null : deps; // 依赖数组判断
  currentlyRenderingFiber.flags |= fiberFlags; // 打标签
  hook.memoizedState = pushEffect( // 将副作用挂到 memoizedState 属性上
    HookHasEffect | hookFlags,
    create,
    createEffectInstance(),
    nextDeps,
  );
}
```

这里面最重要的是 `pushEffect` 方法（代码比较长，就不贴了），它会创建一个 `effect` 对象，并将其挂载到 `FiberNode.updateQueue` 上。`updateQueue` 上的任务都是低优先级任务，会被储存起来，等主线程有空的时候再执行。此外它会将 `create` 方法的返回值（即清理函数）存到 `effect.inst` 上。

了解了这个逻辑，会发现 `useEffect` 有几个特殊的地方：
- 包含回调函数的 `effect` 实例既会存储在 `Hook.memoizedState` 上，也会挂载到 `FiberNode.updateQueue` 属性上。
- `useEffect` 产生的副作用并不会立即执行，而是等待浏览器有空再执行。

总而言之，`mount` 阶段所有的副作用都被收集到 `FiberNode.updateQueue` 属性上了，都会在浏览器空闲时执行。

### update 阶段

`update` 阶段的逻辑和 `mount` 阶段类似，也会执行函数组件，但调用的 `useEffect` 具体方法是 `updateEffect`：

```ts
function updateEffectImpl(
  fiberFlags: Flags,
  hookFlags: HookFlags,
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  const hook = updateWorkInProgressHook(); // 复用原有的 hook 属性
  const nextDeps = deps === undefined ? null : deps;
  const effect: Effect = hook.memoizedState;
  const inst = effect.inst;
  if (currentHook !== null && nextDeps !== null) {
    const prevEffect: Effect = currentHook.memoizedState;
    const prevDeps = prevEffect.deps;
    // 前后依赖数组是否相同
    if (areHookInputsEqual(nextDeps, prevDeps)) {
      hook.memoizedState = pushEffect(hookFlags, create, inst, nextDeps);
      return;
    }
  }

  currentlyRenderingFiber.flags |= fiberFlags;

  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    inst,
    nextDeps,
  );
}
```

注意这里的逻辑，如果钩子为`null`（开发中没遇到过），且更新的依赖数组不为 `null`，那么会比较两次依赖数组是否相同来决定是否安排副作用执行。

这里有个小细节，如果我们传的 `deps` 是一个变量，他被赋值为 `undefined`/`null`（`undefined` 会被转为 `null`）。那么副作用一定会被再次安排执行。（实际代码中，你会使用变量传入 `deps` 吗？）

正常情况下，会比较两次依赖数组是否相同，简单看一下逻辑：

```ts
function areHookInputsEqual(
  nextDeps: Array<mixed>,
  prevDeps: Array<mixed> | null,
): boolean {
  if (prevDeps === null) {
    return false;
  }
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}
```

看完这里的代码，就很有意思了：
- 如果 `deps` 之前是 `undefined`/`null`，副作用会被安排
- 新旧 `deps` 比较的时候仅对存在的元素比较，数组长度新增/减少导致的元素变量不会被考虑在内。

这些特性非常重要哦（在面试的时候，正常人谁这样写）！！！

`unmount` 阶段就比较简单了，执行一下清理函数（`update` 阶段也会执行清理函数）。

至此，`useEffect` 在源代码中的主要逻辑整理完了，几个重要点包括：
- 副作用不会立即执行，会在 `FiberNode.updateQueue` 中等待统一执行（全部执行完之前视图不会更新）。 
- 新旧依赖项 `deps` 如果任一项是 `null`/`undefined`，那么副作用一定会被安排执行
- 新旧依赖项 `deps` 进行对比时，只会比较两者下标都能访问的元素，并且是浅比较。
- 副作用函数的返回值是清理函数，每次副作用更新（包括卸载）都会调用一次清理函数。

注意 `deps` 是浅比较，放一个 `useRef` 的返回值进去什么用都没有，放 `ref.current` 是有用的。

## 实际场景

何时使用 `useEffect` 非常重要，函数组件地特性是每次 `mount`/`update` 都会执行一遍，因此如果直接在函数组件内写了很多计算量大的逻辑就会造成频繁卡顿，此时就需要我们使用 `useEffect`, `useMemo`, `useCallback` 这些存在依赖项比对机制的钩子进行优化。

### 模拟生命周期

`useEffect` 的作用是执行副作用，它是用来替换 React16 之前类组件生命周期 API 的，但由于副作用的执行是一个低优先级任务，因此无法精确模拟 `componentWillMount` 这类生命周期 API。但简单地模拟组件各个阶段还是可以的：
- `mount` 阶段：`deps` 传一个空数组
- `update` 阶段：`deps` 不传
- `unmount` 阶段：写在 `deps` 为空数组地副作用函数的返回值中。

如果需要在特定的 `update` 阶段执行，则将依赖项写进去就可以了。如果想要只在 `update` 阶段执行，不在 `mount` 阶段执行，可以借助外部变量标识，例如 `isMounted = useRef(false)`，执行之前判断 `usMounted.current`。

我们经常会在 `useEffect` 中添加事件监听，在清理函数中返回。如果每次 `update` 都要重新删除再添加就非常麻烦，因此建议仅在 `mount`/`unmount` 阶段处理这类逻辑。

### memo 与 context 的影响

有一个容易忽略的问题，`deps` 变化一定会导致副作用执行吗？看这个例子：

```ts
const Comp: React.FC<{a: string, b: string}> = ({ a, b }) => {
    useEffect(() => console.log('a changed'), [a])
    useEffect(() => console.log('b changed'), [b])
    return <div>{a + '|' + b}</div>
}

const MemoComp = memo(Comp, (pre, next) => pre.a === next.a)

const App: React.FC<{ name: string }> = () => {
    const [state1, setState1] = useState("1");
    const [state2, setState2] = useState("2");

    return (
        <div>
            <button onClick={() => setState1((Number(state1) + 1).toString())}>
                state1
            </button>
            <button onClick={() => setState2((Number(state2) + 1).toString())}>
                state2
            </button>
            <MemoComp a={state1} b={state2} />
        </div>
    );
};
```

这个时候，如果点击 `state1`，逻辑和不用 `memo` 一样，打印：`a changed`。

如果点击 `state2`，那么不会有任何打印，因为 `memo` 导致复用旧有的 `Comp` 组件。`useEffect` 在内的所有 hook 执行都有一个前提条件，函数组件运行，而 `memo` 优化会跳过这一步，直接复用旧的（这个机制在 diff key 相同时也可能触发）。

如果点击了 `state2` 再点击 `state1`，`a changed`，`b changed` 都会打印，而且会更新到最新的状态。

嗨嗨嗨，以为这样就结束了吗？我们知道有一个东西能够破坏 `memo` 优化：`context`，看这段代码：

```ts
const Comp: React.FC<{ a: string; b: string }> = ({ a, b }) => {
    const contextState = useContext(TestContext);
    useEffect(() => console.log("a changed"), [a]);
    useEffect(() => console.log("b changed"), [b]);
    useEffect(() => console.log("context changed"), [contextState]);
    return <div>{a + "|" + b + "|" + contextState}</div>;
};

const MemoComp = memo(Comp, (pre, next) => pre.a === next.a);

const App: React.FC<{ name: string }> = () => {
    const [state1, setState1] = useState("1");
    const [state2, setState2] = useState("2");
    const [contextValue, setContextValue] = useState(1);

    const clickState2 = () => {
        setState2((Number(state2) + 1).toString());
        setContextValue(contextValue + 1);
    };

    return (
        <TestContext.Provider value={contextValue}>
            <button onClick={() => setState1((Number(state1) + 1).toString())}>
                state1
            </button>
            <button onClick={clickState2}>state2</button>
            <MemoComp a={state1} b={state2} />
        </TestContext.Provider>
    );
};
```

此时点击 `state2` 会发生什么：
- 打印 `contextChanged`，`contextValue` 更新到视图
- `b` 没有任何变化

`context` 变化不是会让组件重新渲染吗，为什么没有接收到新的 `n`？这里简单阐述一下原因（细讲可以单开一节）：
- `context` 消费者是如何知道要更新的：`FiberNode.dependencies` 用于存储 `context`，如果发生变化即更新。
- `memo` 如果发现不需要更新，则什么都不做，也就不会传递新的 `props`。

所以说，这两者并不冲突，点击 `state2` 发生了两件事：
- `memo`: 不具备触发更新条件，所以没有传新的 `props`
- `context`: 发现有变化，所以更新了一下，但用旧的 `props` 在更新

### useEffect 实现延迟 useMemo

`useEffect` 相较于 `useMemo`, `useCallback` 有一个好处，副作用不会立即执行，而是放到低优先级任务队列中等到浏览器空闲再执行

`useMemo` 效果是依赖项变化时，立即计算出一个缓存结果。`useEffect` 是依赖项变化时，安排副作用执行。这两者都根据依赖项决定是否要执行，但执行时机不同：
- `useMemo`: 在函数组件执行时决定是否要执行，具体是在 `beginWork` 方法中，执行的结果会出现在视图上。
- `useEffect`: 低优先级任务，在 DOM 树挂载后执行，执行结果不会出现在当前更新的视图上。

结合 `useEffect` 与 `useRef`，我们可以实现一个伪 `useMemo`：

```ts
const DeferEffectComp = () => {
  const cacheValue = useRef<number>(0);
  useEffect(() => {
    cacheValue.current = cacheValue.current + 1;
  })
  return <div>{cacheValue.current}</div>
}
```

这样做有如下特性：
- 任务会被放在 `FiberNode.updateQueue` 中异步执行，不会阻塞整个 Fiber 树更新。
- `cacheValue` 缓存的值不会立即更新到视图上。

## 总结

- 前置条件：组件因为 `mount`/`update` 执行了一遍。
  - `memo`：命中优化则不会重新渲染
  - `context`：变化则一定重新渲染（破坏 `memo`），但不会拿到最新的 `props`
- `deps` 条件: `deps` 发生了变化
  - 新旧 `deps` 如果是 `undefined`/`null`，一定执行
  - 新旧 `deps` 对比的时候，只会比较两者下标都能访问的元素，并且是浅比较。
- 清除函数：即副作用函数的返回值，避免频繁做清理操作
- `useEffect` 模拟生命周期 API:
  - `mount`: `deps` 设置为空数组
  - `update`: 分情况讨论
    - 每次 `update`：不传 `deps`
    - 状态 `update`：`deps` 传入状态
    - 仅 `update`（排除 `mount`）：借助一个 `useRef` 进行判断
  - `unmount`: `deps` 设置为空数组时副作用函数的返回值
- 基于 `useEffect` 安排副作用空闲执行的机制，可以组合其他 hooks 玩出很多花样