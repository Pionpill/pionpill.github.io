---
difficulty: easy
type: note
---

# Vue 基础

> Vuex 官网文档: [https://vuex.vuejs.org/zh/](https://vuex.vuejs.org/zh/)

<p class="hint">简要介绍 Vuex 的概念与使用方式，对应 Vuex4 版本，仅支持 Vue3。</p>

Vuex 是专门为 Vue 开发的全局**状态管理模式+库**。他将数据集中管理并采用一定的使用规则保证状态以可预测的方式变化。

<p class="discuss">Vuex 与 Redux ||| Vuex 借鉴了 Redux，几乎可以认为 Vuex 就是 Vue 框架下的 Redux，设计理念与基础使用方式相同。</p>

Vuex 项目安装指令:

```bash
npm install vuex --save
```

## 状态管理

所有需要状态管理的组件一定包括以下几个部分:
- 状态(state): 即需要变化的数据。
- 视图(view): 界面，Vue 的 template，状态会被显示在视图中。
- 操作(action): 对状态的变更，一般是改变了状态的函数。

![状态管理概念图](https://vuex.vuejs.org/flow.png)

Vue (乃至所有组件化开发的前端框架)都会遇到一个问题，多个组件需要共享状态，以下两种情况让人非常头疼:
- 多层嵌套组件的状态传递: 如果组件树有 n 层，那么将一个状态从最上层传递到最下层要经过 n 个组件，而除了发出状态和接受状态的组件，中间组件很可能只起到一个传递作用，代码冗余不宜维护。如果再要 `$emit` 触发状态更新，更是头疼。如果是同级组件之间传递，需要父组件/爷组件...传递，传递过程更为复杂。
- 状态冗余: 如果一个状态被多个组件保留，那么很可能会产生多份拷贝，者多份拷贝之间又需要保持状态同步，这种模式非常脆弱。

所以我们需要将共享状态抽离出来，以单例模式管理。

<p class="tip">Vuex 以及大部分状态管理框架都只适合管理"全局"状态，是状态的 "全局" 决定了它可以被 Vuex 管理，而不是你嫌组件之间传状态麻烦所以放到"全局"进行管理。虽然它可以让传状态变得简单，但首先要确保是全局状态。</p>

## 单一数据流

先看一下 Vuex 状态变化的过程:

![Vuex 状态变更过程](https://vuex.vuejs.org/vuex.png)

Vuex 包含了三个东西: actions, mutations, state。
- state 非常简单，就是状态(即驱动视图的数据)。
- 这里的 actions 有点变化，前面我们说过，操作是对状态的变更，一般是函数。但这里并不是函数，而是操作名(字符串)。为什么这样设计呢？因为函数和数据一起被存在 vuex 中了，组件拿不到函数，只能通过传操作名的方式，让 vuex 去调用这个函数。通过这种方式，数据和操作数据的方法被绑定在了一起，高内聚!!!
- mutation 就是存函数的地方，所有的数据操作都在这里。

<p class="warn">对状态的操作只能通过上图的方式，即 action 触发，直接改 state 是不被允许的。</p>

现在看看 Vuex 是怎么做的，首先 Vuex 会创建一个 store，store 就是一个容器，用来存上述的内容:

```js
import { createApp } from 'vue'
import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {    // 全局状态
    return {
      count: 0
    }
  },
  mutations: {  // 对状态的操作集
    increment (state) {
      state.count++
    }
  }
})

const app = createApp({ /* 根组件 */ })
app.use(store)    // 将 store 实例作为插件安装
```

全局状态和他的相关操作都设置好了，如何操作呢，一种方式是直接使用 store:

```js
store.commit('increment');  // 触发操作
console.log(store.state.count); // 1
```

通过 `commit` 方法触发操作，将操作名(方法名)作为参数传进去就可以了。状态直接拿属性即可。

这种方式需要导入 `store`，还是比较麻烦的，在 Vue 组件中可以直接通过 `this.$store` 操作:

```js
methods: {
  this.$store.commit('increment');
  console.log(this.$store.state.count);
}
```

## State

Vuex 使用单一状态树，即一个对象存所有的全局状态。这个对象被称为"唯一数据源"(SSOT)，这也意味着每个应用只有一个 store 实例。

<p class="discuss">这也很好地解释了为什么只把全局状态放进来: 如果状态太多了，store 对象会变得非常臃肿。也解释了为什么只能通过 action 来修改状态: 已经定义好的操作是可知的，Vuex 能够预测到会对哪些组件产生影响，如果你自己直接操作 store，鬼知道你改了什么。</p>

### 获取 State

注意，不能直接将 state 作为组件的 data。Vuex 存储的状态本身就是响应式的，最简单的获取方式是通过计算属性获取:

<p class="discuss">为什么 state 不能作为组建的 data? 因为 state 无法被直接改变!</p>

```js
computed: {
  count () {
    return this.$store.state.count;
  }
}
```

每当 `count` 改变时，会重新求取计算属性的值。

这样操作 state 非常不方便，状态多了以后要写很多雷同的计算属性，所以 Vue 提供了一些简便操作。

### mapState

`mapState` 可以不用写 `this.$store`，直接拿 state:

```js
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数拿 count
    count: state => state.count,
    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',
    // 对 state 做一些操作(确保不会改变 state)
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

如果你只是想拿状态，且计算属性名和状态名相同的话(这种情况更常见)，直接给 `mapState` 传一个数组就行了:

```js
  // 映射 this.count 为 store.state.count
computed: mapState(['count'])
```

仔细看上面的代码会发现，`mapState` 返回的是一个对象，如果要和其他计算属性一起用的话，用展开运算符就行了:

```js
computed: {
  localComputed () { /* ... */ },
  ...mapState({
    ...
  })
}
```

### Getter

假设有这样一种情况，我们希望从 state 中派生出一些状态，例如:

```js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

如果有多个组件需要用到此属性，我们要么复制这个函数，或者抽取到一个共享函数然后在多处导入它。无论哪种方式都不是很理想。

Vuex 提供了一种方法: `getter`，一般用于获取 state 的浅拷贝或对 state 执行一些**不改变状态**的操作。`getter` 一般传两个参数，第一个是 state，第二个是 getters 用于获取其他 getter:

```js
const store = createStore({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos (state) {
      return state.todos.filter(todo => todo.done)
    },
    doneTodosCount (state, getters) {
      return getters.doneTodos.length
    },
    // getter 也可以返回函数哦，但函数结果不会被缓存
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }
  }
})
```

<p class="warn">getter 在 Vue3.0 的时候是不会缓存结果的，这个 bug 在后续被修复了。</p>

用起来也很简单:

```js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

getter 也可以在 `mapState` 中使用:

```js
...mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```

## Mutation

mutation 由两部分组成: 事件类型，回调函数。回调函数就是我们实际进行状态改变的地方，接受 state 作为第一个参数:

```js
const store = createStore({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

每次调用函数的时候，commit 事件名就行了: `store.commit('increment')`。

Mutation 必须是同步函数，如果含有异步逻辑，只有天知道什么时候会触发异步调用进而触发 state 变更。

### 荷载

可以向 `store.commit` 传入额外的参数，一般被称作荷载(payload)，荷载可以是任意类型，但一般是一个对象:

```js
mutations: {
  increment1 (state, n) {
    state.count += n
  }
  increment2 (state, payload) {
    state.count += payload.amount
  }
}
// ...
store.commit('increment1', 10);
store.commit('increment2', { amount: 10 });
```

可以以对象风格提交事件，整个对象会作为荷载传到函数中:

```js
store.commit({
  type: 'increment',
  amount: 10
})
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
``` 

### mapMutations

`mapMutations` 和 `mapState` 作用类似，直接看代码:

```js
methods: {
  ...mapMutations([
    'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
    // `mapMutations` 也支持载荷：
    'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
  ]),
  ...mapMutations({
    add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
  })
}
```

## Action

Action(这里指 store 里面的 Action，而不是前面状态管理概念的 action) 是一个很神奇的东西，它类似于 mutation，但它可具备更强的功能:
- Action 可以访问 state, getters 也可以提交 mutation。
- Action 可以包含异步操作。

```js
const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象(但这个对象并不是 store 本身)，因此我们可以进行任意的 store 操作:

```js
actions: {
  increment ({ commit }) {  // 解构语法
    commit('increment')
  }
}
```

在组件中可以通过 `store.dispatch` 触发 Action:

```js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {    // 异步操作
      commit('increment')
    }, 1000)
  }
}
```

Actions 同样支持荷载(函数第二个参数)，对象形式分发:

```js
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

在组件中同样有 `mapActions` 方法分发 action:

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

### 异步处理

`store.dispatch` 可以处理被触发的 action 的处理函数返回的 Promise，并且 `store.dispatch` 仍旧返回 Promise：

```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

然后我们可以:

```js
store.dispatch('actionA').then(() => {
  // ...
})
```

甚至可以利用 `async / await`:

```js
// 假设 getData() 和 getOtherData() 返回的是 Promise
actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

## Module

由于使用单一状态树，所有状态会被集中在一个大对象上，在大型项目中，store 会变得非常臃肿，因此 Vuex 推出了 module(模块)，每个模块拥有自己独立的 state, getter, mutation, action:

```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = createStore({
  state: () => ({ ... })
  // ...
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

### 局部状态

我们前面提到的 store 中的一些方法参数，默认都是模块内部的，但在 getter 和 action 中，我们可以通过 `rootState` 访问到根节点的状态:

```js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1)
        commit('increment')
    }
  },
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### 命名空间

默认情况下，模块内部的 action 和 mutation 仍然是注册在全局命名空间的——这样使得多个模块能够对同一个 action 或 mutation 作出响应。Getter 同样也默认注册在全局命名空间，但是目前这并非出于功能上的目的（仅仅是维持现状来避免非兼容性变更）。因此我们最好不要定义任何同名的方法或状态。

如果想要让模块处于单独的命名空间，可以通过设置 `namespace: true` 来实现。

#### 在带命名空间的模块内访问全局内容

如果希望使用全局的 state 和 getter，`rootState` 和 `rootGetters` 会作为第三第四个参数传入 getter，也会通过 `context` 对象的属性传入 action。

如果想要在全局命名空间内分发 action 或提交 mutation，将 `{ root: true }` 做欸第三参数传给 `dispatch` 或 `commit` 即可:

```js
modules: {
  foo: {
    namespaced: true,
    getters: {
      // 在这个模块的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四个参数来调用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
        rootGetters['bar/someOtherGetter'] // -> 'bar/someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },
    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'
        rootGetters['bar/someGetter'] // -> 'bar/someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

#### 在带命名空间的模块注册全局 action

若需要在带命名空间的模块注册全局 action，你可添加 `root: true`，并将这个 action 的定义放在函数 `handler` 中。

```js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

<p class="discuss">好乱，我觉得最好不要这样写。</p>

#### 带命名空间的绑定函数

当使用 mapState、mapGetters、mapActions 和 mapMutations 这些函数来绑定带命名空间的模块时，写起来比较繁琐：

```js
...mapState({
  a: state => state.some.nested.module.a,
  b: state => state.some.nested.module.b
}),
```

鉴于这种情况，Vue 可以让我们将模块的空间名称字符串作为第一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文:

```js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  }),
  ...mapGetters('some/nested/module', [
    'someGetter', // -> this.someGetter
    'someOtherGetter', // -> this.someOtherGetter
  ])
},
```

也可以是使用 `createNamespacedHelpers` 创建基于某个命名空间辅助函数。它返回一个对象，对象里有新的绑定在给定命名空间值上的组件绑定辅助函数：

```js
const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // 在 `some/nested/module` 中查找
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // 在 `some/nested/module` 中查找
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

### 模块动态注册

在 store 创建之后，你可以使用 `store.registerModule` 方法注册模块：

```js
import { createStore } from 'vuex'

const store = createStore({ /* 选项 */ })

// 注册模块 `myModule`
store.registerModule('myModule', {
  // ...
})

// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

也可以使用 `store.unregisterModule(moduleName)` 来动态卸载模块。但不能使用此方法卸载静态模块。同时可以通过 `store.hasModule(moduleName)` 检查该模块是否已经被注册到 store。

需要记住的是，嵌套模块应该以数组形式传递给 `registerModule` 和 `hasModule`，而不是以路径字符串的形式传递给 module。

假设要注册一个新的模块，我们的 store 的 state 已经包括了这个新的子模块的 state，此时我们不希望 state 被重复注册，可以通过 `store.registerModule('a', module, { preserveState: true })` 的方式，这样新的子模块的除了 state 的内容会被注册。

### 模块重用

有时我们可能需要创建一个模块的多个实例，比如多个公司用同一个模块。

如果我们使用一个纯对象来声明模块的状态，那么这个状态对象会通过引用被共享，导致状态对象被修改时 store 或模块间数据互相污染的问题。解决办法是使用函数，这样每次返回的就是新对象:

```js
const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  }),
  // mutation、action 和 getter 等等...
}
```

## 其他

### 项目结构

官方给我们规定了一些需要遵守的规则:
- 应用层级的状态应该集中到单个 store 对象中。
- 提交 mutation 是更改状态的唯一方法，并且这个过v是同步的。
- 异步逻辑应该封装到 action 中。

此外，官方还向我们推荐了 Vuex 模块分割的项目结构，一般都这样组织文件:

```sh
├── index.html
├── main.js
├── api
│   └── ... # 抽取出API请求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # 我们组装模块并导出 store 的地方
    ├── actions.js        # 根级别的 action
    ├── mutations.js      # 根级别的 mutation
    └── modules
        ├── cart.js       # 购物车模块
        └── products.js   # 产品模块
```

### 组合式 API

我们可以通过 `useStore` 钩子，在 `setup` 钩子函数中访问 store。这与在组件中使用 OptionsAPI 访问 `this.$store` 是等效的。

为了访问 state 和 getter，需要创建 `computed` 引用以保留响应性，这和 OptionsAPI 中的计算属性是等效的:

访问 mutation 和 action 则更为简单，直接调用就可以了。

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
    return {
      // 在 computed 函数中访问 state
      count: computed(() => store.state.count),
      // 在 computed 函数中访问 getter
      double: computed(() => store.getters.double),
      // 使用 mutation
      increment: () => store.commit('increment'),
      // 使用 action
      asyncIncrement: () => store.dispatch('asyncIncrement')
    }
  }
}
```

### 严格模式

开启严格模式只需要在创建 store 时传入 `strict: true`:

```js
const store = createStore({
  // ...
  strict: true
})
```

严格模式下，只要发生了状态改变不由 mutation 函数引起的情况，就会抛错。

但是不要在生产环境下使用严格模式！严格模式会深度监测状态树来检测不合规的状态变更。

### 表单处理

在严格模式下使用 `v-model` 那么好都没回 Vuex state 上的数据时会比较棘手:

```html
<input v-model="obj.message">
```

假设这里的 `obj` 是计算属性返回的一个属于 Vuex store 的对象。那么用户在输入时，`v-model` 会尝试直接修改 `obj.message`。严格模式会抛错，因为这个修改不是通过 `mutation` 进行的。

一种解决方案是别用 `v-model`，反正它也只是个语法糖:

```html
<input :value="message" @input="updateMessage">
```

```js
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

不过这样的话就失去了 `v-model` 的便携性，因此另一个方法是手动改对象的 `get()` 和 `set` 方法:

```html
<input v-model="message">
```

```js
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```

<p class="discuss">确定要往全局状态中写入表单这么复杂的数据结构吗？如果一定要写入，这个复杂状态还会频繁更新！我觉得最好不要这样做，你可以设置一个局部状态绑定到表单，再判断要不要将其同步到全局状态(这个过程可以做很多优化)。</p>