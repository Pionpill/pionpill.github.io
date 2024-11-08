---
difficulty: hard
type: origin
---

# React 数据流方案

<p class="tip">需要了解 useState，useContext，useSyncExternalStore 钩子和 Redux，响应式等常见状态管理框架。</p>

React 框架处理数据流时会考虑以下几个问题：
- 跨组件数据通讯如何处理
- 状态改变时如何仅让需要的组件更新
- 如何尽量避免状态改变出现的副作用

针对这些问题，这篇文章讨论一下常见的几种数据流管理方案及其优缺点。

## useState + prop 传递

所有 React 开发者几乎都会这种方案，组件通过 `const [state, setState] = useState(1)` 的方式创建并传递状态，当父组件更新状态时，接受了 `state` 的子组件同步更新。如果子组件想要改变父组件状态，则将 `setState` 传递到子组件，子组件再调用即可。

### memo 优化

这个过程会遇到一个问题：React 对状态更新的处理非常暴力，如果某个节点自身的 `state` 发生了变化，那么从该节点开始整棵节点树都会进行 `update`，即使子树的 `prop` 并没有变化也没必要更新：

![setState-update](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FHooks%2FReact%E6%95%B0%E6%8D%AE%E6%B5%81%E6%96%B9%E6%A1%88%2FsetState-update.svg)

为了避免不必要的节点更新，React 提供了 `memo` 这个高阶函数，允许仅部分属性改变时更新节点（据说 React19 不用自己写 memo 了）：

![memo-update](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FHooks%2FReact%E6%95%B0%E6%8D%AE%E6%B5%81%E6%96%B9%E6%A1%88%2Fmemo-update.svg)

### 跨组件传递

`prop` 传递有一个缺陷：如果状态需要多级传递，并且叶子节点想要改变子树根节点的状态咋办？只能一级级地将 `setState` 传递过去，对于中间组件来说 `setState` 没有任何作用，仅起到一个传递作用：

![setState-prop](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FHooks%2FReact%E6%95%B0%E6%8D%AE%E6%B5%81%E6%96%B9%E6%A1%88%2FsetState-prop.svg)

为了解决这个问题，出现了非常多的状态流框架：Redux，MobX，Zustand。以及 React 后来提供的 `useContext` 钩子。

## useContext

`useContext` 似乎是一个解决跨组件传递状态的好方案，父组件提供一个 `Provider`，子组件作为消费则使用 `useContext` 订阅上下文即可。如果子组件对于订阅内容是只读的，那确实没什么问题：

![context](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FHooks%2FReact%E6%95%B0%E6%8D%AE%E6%B5%81%E6%96%B9%E6%A1%88%2Fcontext.svg)

为啥说内容只读没问题呢，如果叶子节点需要改变根节点状态咋办，如果看过 `useContext` 源码（没看过可以看这篇[订阅钩子-useContext](https://pionpill.github.io/blog/front/React/Hooks/2-3-1_%E8%AE%A2%E9%98%85%E9%92%A9%E5%AD%90-useContext)）会发现，在不借助其他钩子的前提下，`useContext` 本身订阅的内容发生改变不会触发重新渲染，也即只会在缓存树中更新状态而不开始新一轮的更新。

那咋办，我们把 `setState` 作为 context 的消费内容不就好了，子组件拿到 `setState` 方法再执行也能达到根节点更新的功能（或者自行封装一个 `useForceUpdate`，总之需要让 Provider 所在地节点更新），然后我们在子组件中调用 `setState`，这样完全能实现跨组件修改状态的功能。

### useContext 特殊的更新机制

问题来了，源代码中 `useContext` 钩子是不会挂载到 `FiberNode.memorizedState` 钩子链上的，它存在一些特殊的机制。回想一下没有 `context` 的 `FiberNode` 是如何更新的：浅比较新旧 `props`，如果不同就更新。加上 `context` 的后，会需要额外判断一层 `context` 是否有变化，并且 `context` 的变化是不受 `memo` 优化约束的。也即 `context` 发生变化，它的订阅节点一定会更新。

并且这其中存在一个小坑，如果一个节点既使用了 `memo` 优化，又使用 `useContext` 订阅了上下文，此时如果命中 `memo` 优化，但是 `context` 改变，那么组件:
- 不会接受新的 `prop`: 因为 `memo` 优化表示不需要更新，新的 `prop` 压根不会传递过来。
- 组件会更新：因为 `context` 发生了变化，并且 `context` 相关的逻辑会执行，视图会刷新。

![context-memo](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FHooks%2FReact%E6%95%B0%E6%8D%AE%E6%B5%81%E6%96%B9%E6%A1%88%2Fcontext-memo.svg)

为啥会这样呢，`FiberNode` 有两个更新相关的属性：
- `pendingProps`, `memoizedProps`: 新旧外部状态
- `dependencies`: context 依赖的上下文状态

一般情况下，更新逻辑为：比较 `pendingProps` 与 `memoizedProps`，如果不同则更新。比较 `dependencies` 是否发生变化，如果变化即更新。

使用了 `memo` 并命中优化之后会砍掉 `prop` 比较过程，并且不传递新的 `prop` 进来，但是 `dependencies` 仍然进行比较。

### useContext 更新的性能问题

上面是一个小坑，不常见但遇到了很难排查，`useContext` 订阅内容改变最大的问题是性能，他会破坏 `memo` 优化，等于说我们的优化节点无效了，所有消费者节点一定会在 `context` 变化后更新。

![context-change](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FHooks%2FReact%E6%95%B0%E6%8D%AE%E6%B5%81%E6%96%B9%E6%A1%88%2Fcontext-change.svg)

试想一下，如果我们的 `context` 是一个对象，里面有很多个属性，然后将改变这些属性的函数也传递到消费者节点，那么某个消费者节点执行状态改变函数后，其他仅使用了部分 `context` 属性的消费者节点也必须更新，这是无法避免的，React 也没有提供 `context` 版的 `memo` API。

### useContext 适用场景

说了 `context` 这么多坏话，但他也不是一无是处。如果提供的 `context` 子节点是只读的，那么完全没问题，避免了 `prop` 多级传递的问题。或者 `context` 比较简单，节点树也比较简单，改变 `context` 的影响是可预期的，那么也可以使用 `context`。

同事和我讨论了另一种方案：`context` 维护一个复杂的对象，但不允许修改这个对象的引用，因此不会触发 `context` 更新。子组件监听 `context` 属性的变化，如果有需要使用的属性变化调用 `useForceUpdate` 强制更新当前节点（`useReducer` 实现）。也是一个好的思路，只要解决监听部分属性变化这个问题就可以了，不过这个过程会引入副作用（老项目升级，没办法完全重新设计）。

但显然，`context` 不适用做频繁变化的状态管理。

## useSyncExternalStore

本期主角登场：`useSyncExternalStore`，几乎所有的状态管理框架都会用这个钩子。简单讲一下功能：接受两个参数：
- `subscribe: (onStoreChange: () => void) => () => void`: 订阅函数，返回一个取消订阅函数。外部状态改变的时候调用一下 `onStoreChange` 即可。
- `getSnapshot: () => Snapshot`: 获取数据的快照

外部状态改变后会自动执行 React 内部的 `scheduleUpdateOnFiber` 方法去安排更新。也就是说，它的更新机制和 `useState` 是一样的，不存在 `context` 特殊处理逻辑，可以放心使用 `memo`  优化。

![useSyncExternalStore](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FHooks%2FReact%E6%95%B0%E6%8D%AE%E6%B5%81%E6%96%B9%E6%A1%88%2FuseSyncExternalStore.svg)

这个钩子不常用，因为需要自行编写一个外部状态系统，然后再用这个钩子和 React 状态关联起来。这个过程要写很多代码，一般状态流框架都给我们写好了，一般的流程如下：

![useSyncExternalStore-change](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FHooks%2FReact%E6%95%B0%E6%8D%AE%E6%B5%81%E6%96%B9%E6%A1%88%2FuseSyncExternalStore-change.svg)

下面讨论目前主流的几种状态管理方案。

## Redux：全局状态管理

Redux 的数据流处理过程如下：

![redux](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FHooks%2FReact%E6%95%B0%E6%8D%AE%E6%B5%81%E6%96%B9%E6%A1%88%2Fredux.svg)

很有趣的一点是：Redux 的主要贡献者和 React16 hook 写法的主要贡献者是同一个人：[gaearon](https://github.com/gaearon)。`useReducer` 和 Redux 的思路几乎是一样的：

![useReducer](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2FHooks%2FReact%E6%95%B0%E6%8D%AE%E6%B5%81%E6%96%B9%E6%A1%88%2FuseReducer.svg)

发现没有，这两个思路是一样的，`useReducer` 就是简化版的React内置的 `redux`，如果我们将 `action` 和 `dispatch` 封装复杂一点，就变成了 `store`。

而 `useState` 就是一个简化版本的 `useReducer`，他们只有两个不同：
- `useState` 自身实现了 `reducer`: `return typeof action === 'function' ? action(state) : action`，嗯直接将 action 返回为新的状态（函数的话执行一下）。
- `useState` 会比较新旧 `state`，如果相同则不开启更新调度。

redux 相比于 `useReducer` 功能上唯一的主要优势在于：它是用 `useSyncExternalStore` 与 React 组件关联，不需要跨组件传递 prop。redux 的缺陷也很多：
- 需要写很多模板代码。
- redux 主要用于全局状态管理，如果局部状态管理，单写一个 slice 非常麻烦。
- redux 学习路线较为陡峭，且代码诞生于 class API 时代，比较古老（社区更新热度现在有所下降）

## MobX：响应式状态管理

<p class="tip">没用过这个框架，写的比较笼统</p>

以前听过这样一段话：MobX + React = Vue。MobX 主要实现了状态的响应式变化，不需要开发者手动调用 `setState` 去更新视图。笔者用过 Vue 所以这里说一下响应式编码的优缺点：
- 优点：自动更新状态，框架会智能地为我们调度更新。
- 缺点：响应式本身就是一种副作用，频繁使用会让状态流难以追踪。

此外，在 React18 之后，函数写法如何使用 MobX 的装饰器呢？

## Zustand：去中心化状态管理

这个是我目前见过这简单，最适合 React 的跨组件状态管理方案。

Zustand 核心代码只有不到 200 行，其中近一半是 typescript 类型声明，非常简单易学，且完全使用钩子写法实现，没有历史包袱。它只做了一件事：用发布订阅模式写了一个外部状态管理系统，然后将这个系统与 `useSyncExternalStore` 关联起来。

Zustand 由两部分核心代码组成：`createStore` 创建外部状态store，`useStore` 将外部状态与 React 关联，先看一下 `createStore` 的主要方法（简化过）：
- `subscribe`: 订阅函数，用于维护与外界的关联。
    ```ts
    const subscribe = (listener) => {
        listeners.add(listener) // 添加到订阅者集合中
        return () => listeners.delete(listener) // 非常 React 的写法，返回一个删除函数
    }
    ```
- `getState`: 获取状态：
    ```ts
    const getState = () => state
    const getInitialState = () => initialState // 获取初始状态
    ```
- `setState`: 改变状态：
    ```ts
    const setState = (partial, replace) => {
        // 和 useState 处理方式一样，函数就执行
        const nextState = typeof partial === 'function' ? partial(state) : partial
        // 判断前后状态是否相同
        if (!Object.is(nextState, state)) {
            const previousState = state
            state =
                (replace ?? (typeof nextState !== 'object' || nextState === null))
                ? nextState
                : Object.assign({}, state, nextState)
            // 执行订阅者回调
            listeners.forEach((listener) => listener(state, previousState))
        }
    }
    ```

大道至简，一个非常标准的发布订阅模式，甚至可以自己手写一个，接下来看下 `useStore`：

```ts
// api: createStore 返回的内容，获取改变状态的哪些方法组成的对象
// selector: 传一个函数，允许我们获取部分状态
export function useStore( api, selector: (state: TState) => StateSlice = identity as any ) {
  const slice = React.useSyncExternalStore(
    api.subscribe, // 订阅函数
    () => selector(api.getState()), // 获取状态切片
    () => selector(api.getInitialState()), // SSR 用的
  )
  React.useDebugValue(slice)
  return slice
}
```

这样就和 React 绑定起来了，开发者每次修改外部状态都会通过 `useSyncExternalStore` 触发组件更新。最后将状态与修改状态的方法都返回给开发者就完成了：

```ts
// 返回了一个钩子函数
const createImpl = <T>(createState: StateCreator<T, [], []>) => {
  const api = createStore(createState)
  const useBoundStore = (selector?: any) => useStore(api, selector)
  Object.assign(useBoundStore, api)
  return useBoundStore
}
```

小结：zustand 用一个非常简单的发布订阅模式构建了外部 store，然后用 `useSyncExternalStore` 将其与 React 组件关联起来。它的优点如下：
- 实现非常简单，没有冗余的部分，容易上手，体积小性能强。
- 使用 `useSyncExternalStore` 钩子，调度更新逻辑与 `useState` 相同，符合大部分开发者习惯。
- 去中心化：由于实现简单，因此非常容易编写自己的 store，就是一个 hook，没有那么多模板代码。

## 总结

最后我们对比一下各种状态流方案的优缺点：

useState：
- 优点：简单，人人都会
- 缺点：跨组件状态需要层层传递
- 适用场景：简单数据流/单向传递数据流

useContext:
- 优点：易于跨组件传递状态
- 缺点：存在特殊的更新机制，会破坏 memo 优化，不适用于频繁改变的快组件状态
- 适用场景：context 内容只读，不会频繁改变 context 或者 context 改动带来的影响可控

useSyncExternalStore
- 优点：订阅外部状态
- 缺点：开发者不常用这个钩子，需要自行编写外部状态管理逻辑
- 适用场景：状态管理逻辑希望与 React 解耦

Redux
- 优点：全局状态管理框架，功能强大
- 缺点：需要编写复杂的模板，局部状态管理不方便
- 使用场景：全局状态

MobX
- 优点：响应式编程，状态改变后自动调度更新
- 缺点：响应式带来的副作用可能无法控制，装饰器写法如何兼容 hook 写法？
- 使用场景：数据改变带来的影响可预期

Zustand
- 优点：简单易用，去中心化的状态管理框架
- 缺点：无（对，我偏向于这个方案）
- 使用场景：全局/局部状态管理都非常方便