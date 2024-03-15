---
difficulty: medium
type: organize
pre: +/front/React/Fiber/3-1-1_概念-浏览器帧渲染
rear: +/front/React/Fiber/3-2-1_vDOM-JSX解析
---

# React Fiber 架构

> React 技术揭秘: [https://kasong.gitee.io/just-react/preparation/idea.html](https://kasong.gitee.io/just-react/preparation/idea.html)  
> React 之 Fiber 架构: [https://juejin.cn/post/7067153014544400415/](https://juejin.cn/post/7067153014544400415/)

<p class="hint">从这篇文章开始剖析 React16 之后的 Fiber 架构。本篇主要是一些框架设计理念。</p>

如果了解 Java 一定知道多线程这个概念，Java 通过同一时间不同线程执行不同的逻辑实现了多任务处理，Java 的多任务处理基本单元是 thread。React 多任务处理的基本单元是 fiber。
- thread: 对应 CPU 中的线程，是一种抢占式多任务方式，是正真意义上的同一时刻执行多个任务。
- fiber: 是一种非抢占式多任务方式，是指在一个时间段内执行多个任务，由于 js 的限制并不能并行执行多任务。

<p class="tip">通过比较新的浏览器 worker 线程可以实现真正的 JS 并行处理，但这不在我们这几篇文章的讨论范围内。</p>

非抢占式也叫协作式，其特点是要求每一个运行中的程序，定时放弃自己的运行权限，告诉操作系统执行下一个程序。

## Fiber 架构理念

目前有两种主流的方案解决长任务卡顿问题:
- 优化框架，使代码被浏览器更快地解析(废话)。
- 将长任务"分解"为多个短任务，将其分派在多个帧中执行。

Fiber 架构的理念就是第二种，让 JS 定时放弃自己的运行权限。

<p class="discuss">React vs Vue ||| 由于 react 大量采用了 JSX 语法，因此在解析过程中会多一步 JSX -> vDOM 的操作，这限制了使用第一种方案的优化上限(但是 JSX 用起来很爽!)。而 Vue 采用更接近原生 HTML 的写法，可以对模板代码做更极致的优化。</p>

### Fiber 的处理逻辑

只要我们将长任务划分为多个短任务，放在不同的浏览器帧时间内执行，就不会产生卡顿。Fiber 架构中，浏览器每一帧时间内，都会预留一些时间给 JS 线程(5ms，这段时间也被可以叫做时间片)，react 利用这部分时间更新组件，剩余的时间留给浏览器其他任务。等到下一帧重新执行未完成的操作。

查看使用 Fiber 架构的堆栈图，会发现异步渲染时每帧时间执行完任务后，到达 16.6ms，任务会立即停止，待到下一帧开始新的任务。

这样的处理逻辑带来了一个特性: 操作的决定权由框架转移到了浏览器。在以往的处理逻辑中，都是框架控制 JS 线程，继而决定浏览器的操作(怎么执行，执行到哪结束，执行多久框架说了算)。Fiber 架构规定了仅能在一帧时间内进行操作，只有浏览器有空闲资源时才会让框架逻辑执行。

## 新老架构对比

React 15 及以前使用的是 Stack 架构，采用**同步不可中断**的架构操作虚拟 DOM。React 16 使用的是**异步可中断**的 Fiber 架构。Fiber 架构是基于 Stack 架构的，采用可中断递归的方案操作虚拟 DOM。

### Stack 架构

React15 的 Stack 架构可以分为两层:
- Reconciler(协调器): 找出变化的组件
- Renderer(渲染器): 将变化的组件渲染到页面上

#### Stack Reconciler

在 React 中可以通过 `setState` `forceUpdate` `render` 等 API 触发更新。每当有更新时会执行如下工作:
- 调用类组件的 `render` 方法或者函数组件的返回值，将 JSX 转化为 vDOM。
- 将新老 vDOM 对比。
- 找出变化的 vDOM。
- 通知 Renderer 将变化的 vDOM 渲染到页面上。

Stack Reconciler 在 mount 过程中会调用 `mountComponent`，update 过程会调用 `updateComponent`。这两个方法都会递归更新组件(是不可中断的)。Stack 架构与 Fiber 架构最大的区别是 Reconciler 变了，Fiber Reconciler 使得组件更新的过程可中断。

#### Renderer

渲染器负责在各种环境渲染DOM，React 除了浏览器平台还支持很多平台，常见的渲染器有:
- ReactDOM: 浏览器环境的 Renderer
- ReactNative 渲染器: App 环境渲染
- ReactArt 渲染器: Canvas, SVG 渲染

#### Stack 架构的缺陷

对于 React15 来说，协调器和渲染器是交互进行的，假设有这样一个 DOM 结构:
```html
<div>a</div>
<div>
  <div>b1</div>
  <div>b2</div>
</div>
<div>c</div>
```

这里我们将所有字母替换为大写，那么会执行如下操作:
1. Reconciler 发现 a->A, 通知 Renderer
2. Renderer 更新 a->A
3. Reconciler 发现 b1->B1, 通知 Renderer
4. Renderer 更新 b1->B1
5. Reconciler 发现 b2->B2, 通知 Renderer
6. Renderer 更新 b2->B2
7. Reconciler 发现 c->C, 通知 Renderer
8. Renderer 更新 c->C

这个过程是递归的，如果存在子 DOM，会采用深度优先搜索算法替换。

我们之前说过，Stack Reconciler 有个缺陷: 同步不可中断。上述的 8 个步骤如果停在了任意一个步骤，用户的界面就会显示错误: 一个初始状态与预想状态的不完全 DOM。

此外，由于是采用递归的方式更新 DOM，在实际操作中，每个 DOM 更新都会执行如下具体的操作:
1. `componentWillMount()`
2. `render()`
3. `componentDidMount()`

注意，某一个 DOM 如果存在子 DOM，上面三个方法并不会全部执行完并返回，而是在 render() 之后停留，等待子 DOM 执行完后再调用 `componentDidMount()` 方法。如果 DOM 结构很复杂，例如 1w 个 DOM 需要递归，那就会有 9999 个 `componentDidMount()` 等待最后一个 DOM 操作执行完才能调用。

基于这些原因，react 团队决定改进框架。

### Fiber 架构

Fiber 架构多了一层:
- Scheduler(调度器): 调度任务的优先级
- Reconciler(协调器): 找出变化的组件
- Renderer(渲染器): 将变化的组件渲染到页面上

<p class="tip">Fiber 框架最核心的就是 Fiber Reconciler。为了支持 Fiber Reconciler，重构出了 vDOM 的具体实现 FiberNode。</p>

#### Scheduler

既然我们的浏览器每帧要取出任务执行，那肯定需要一个 Scheduler 来决定取哪个任务。

浏览器有一个原生的 `requestIdleCallback` 方法(即上一篇文章中的 idle)，可以决定事件执行优先级，但是基于以下原因 react 没有采用这个方法:
- 兼容性问题，有的浏览器不支持这个 API。
- 这个方法任务执行优先级无法自定义，且并不符合 react 团队的预期

总之，react 最后自己封装了一个 Scheduler，提供更强大的事件优先级处理逻辑，取代了 idle 的功能。具体执行策略会在其他文章中讲解。

#### Fiber Reconciler

这里简单讲一下 Fiber Reconciler 的执行逻辑。在 React 16 之后，Reconciler 与 Renderer 不再是交替工作。Reconciler 会给 vDOM 打上增删改查的标记:

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

Scheduler 和 Reconciler 的工作都在内存中执行，只有所有组件完成 Reconciler 工作后，才会统一交给 Renderer。

## react 源码结构

这里我们看的是 main 分支最新(当前为 v18.2.0)的源代码，如果后续 react 有大的更新导致项目结构变更，可以看 v18.2.0 标签的源码:
- main: https://github.com/facebook/react/tree/main
- v18.2.0: https://github.com/facebook/react/tree/v18.2.0

<p class="tip">我会在每次引用源代码前给上 Github 链接，以便实时查阅</p>

react 核心源代码位于 packages 文件夹中，这里有如下重要的文件:
```json
|- react // react 的核心，包含所有全局 API
|- schedular // 调度器文件夹
|- react-reconciler // 协调器，Diff 算法，最难啃的部分
|- shared // 全局共享配置
```

其他还包含一些 SSR，跨平台，测试模块。

后文默认读者对 React 有一定的基础。我会把 React 的几个核心模块的功能都讲一遍，贴上关键的源代码。

### react 发展历程

我们可以将 react 发展历程分为两个阶段:
- React15-: 引入 JSX 语法，vDOM，Diff 状态更新等概念。直到 React15 都在此基础上完善功能；特点是类组件，同步渲染。
- React16-18: 推出 Fiber 架构，异步处理机制。特点是可中断任务，函数组件，钩子语法。

目前 react 还有两个主要发展方向:
- 一是在 Fiber 架构的基础上，完善异步处理机制。
- 二是往 SSR(服务端渲染) 方向发展。

### 后文说明

关于看 react 源代码的几点说明(吐槽):
- 源代码中有很多看似无效的内容，比如一个 `if` 判断后没有进行任何处理，但是有注释，表示这里以后会加内容或者只是为了可读性。
- 源代码有很多远古写法(ES6 之前)，以及一些为了兼容性放弃可读性的写法。
- 源代码包含了大量与核心逻辑无关的内容：开发模式，性能分析。
- Scheduler 代码的存在会影响我们看核心逻辑。
- 源代码虽然是 js 文件，但使用了 ts 语法
- 源代码中包含了很多开发者提示需要重构或者进一步处理的注释。

总而言之，react 源代码很难读(并不是逻辑上难，而是可读性不高)，后文贴的源代码我会做一些改动:
- 无用的逻辑判断，直接省略。
- 使用 ES6 语法优化部分可读性差的代码片段。
- 对于开发模式(\_\_DEV\_\_)，开启性能追踪(`enableTransitionTracing`)，开启性能分析计时器(`enableProfilerTimer`) 等非生产环境逻辑代码全部删除。
- Scheduler 相关代码如果删除，会给出注释
- 使用 ts 语法

<p class="tip">大部分代码上面会贴源码地址，文中的代码是剔除我认为不重要的部分后优化过的</p>

### 文字说明

一些概念与常用语:
- 帧时间: 浏览器执行 1 帧所需要的时间
- 时间片: react 在帧时间内可执行 js 代码的时间
- 冲刷(flush): 执行完某队列的所有任务