---
difficulty: medium
type: organize
pre: -/front/Vue/Vue2/1-3_Vue基础(下)
---

# Options API

> Vue 官方文档: [https://v2.cn.vuejs.org/v2/api/#data](https://v2.cn.vuejs.org/v2/api/#data)

Options API 是 Vue2 提供的一种单文件组件写法，默认使用 js，这种写法已经慢慢被组合式 API 代替了，但有很多老项目仍然在使用。

Options API 的写法形式如下:

```html
<template>
  <h1>{{ counter }}</h1>
  <button @click="incrCounter">Click Me</button>
</template>
<script>
export default {
  data() {
    return {
      counter: 0
    }
  },
  methods: {
    incrCounter: function() {
      this.counter += 1;
    }
  }
}
</script>
```

我们在脚本中通过 `export default` 导出一个默认对象，Vue 解析该对象渲染组件。该对象提供了固定的属性，方法，生命周期钩子等 API。开发者通过这些 API 控制组件数据流与逻辑。

<p class="warn">Options API 只是提供了一种写法，Vue 的语法并没有变，因此本文不会很详细地讨论各种 API 的使用细节。</p>
<p class="hint">方便起见，下文贴代码的时候我会省略最外层的 export default。</p>

## 配置

### name

string 类型，表示该组件的名称，在 `<template>` 中使用时会被自动转换为 kebab-case 写法(脚本导入时仍使用原始名称)。

### components

接受一个对象，包含各种需要使用的外部组件。

```js
import TemplateCreate from './template-create/template-create.vue';
import TemplateFilterDialog from './template-filter/template-filter-dialog.vue';
import TemplateFilters from './template-filter/template-filters.vue';

export default {
    name: 'TemplateManage',
    components: {
        TemplateCreate,
        TemplateFilters,
        TemplateFilterDialog,
    },
}
```

### directives

接受一个对象，包含各种需要使用的指令。

### filters

接受一个对象，包含各种需要使用的过滤器。

## 数据

### data

- 类型: `Function`

在 Options API 中，data 只能是 `Function` 类型，通过返回一个对象为组件载入数据。data 中的数据会被 Vue 递归地转换为 `getter/setter`。

实例创建之后，可以通过 `vm.$data` 访问原始数据对象。Vue 实例也代理了 data 对象上所有的 property，因此访问 `vm.a` 等价于访问 `vm.$data.a`。

```js
data() {
  return {
    checkedAll: false,
    tmpRoleMemberList: [],
    acceptFile: '.docx',
  }
}
```

以 `_` 或 `$` 开头的 property 不会被 Vue 实例代理，因为它们可能和 Vue 内置的 property、API 方法冲突。你可以使用例如 `vm.$data._property` 的方式访问这些 property。

如果需要，可以通过将 `vm.$data` 传入 `JSON.parse(JSON.stringify(...))` 得到深拷贝的原始数据对象。

<p class="discuss">为什么在 Options API 中，data 必须是函数呢？如果 data 仅是一个对象，那么该组件的多个实例会共享同一个数据对象。</p>

### props

- 类型: `Array<string> | Object`

props 用于接受父组件的数据。如果是数组的话，只能简单地定义属性名，对象则允许进行更高级的配置。

基于对象语法，props API 提供了下面选项:
- `type`: 原生构造函数: `String`、`Number`、`Boolean`、`Array`、`Object`、`Date`、`Function`、`Symbol`；自定义构造函数；或上述内容组成的数组。会检查一个 prop 是否是给定的类型，否则抛出警告。
- `default: any`: 默认值，如果没传入，则使用该值。对象或数组的默认值必须从一个工厂函数返回。
- `required: Boolean`: 定义该 prop 是否是必填项。一般默认为 true。
- `validator: Function`: 自定义验证函数会将该 prop 的值作为唯一的参数代入。如果该函数返回 false，控制台会给出警告。

```js
props: {
  // 检测类型
  height: Number,
  // 检测类型 + 其他验证
  age: {
    type: Number,
    default: 0,
    required: true,
    validator: function (value) {
      return value >= 0
    }
  }
}
```

### computed

- 类型: `{ [key: string]: Function | { get: Function, set: Function } }`

计算属性将被混入到 Vue 实例中。所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。下文的 methods 以及一些生命周期钩子函数都会被自动混入。

类型为对象，包含各种计算属性，可以以对象形式或函数形式(无法写 `setter`)定义。计算属性的结果会被缓存，除非依赖的响应式 property 变化才会重新计算。

对象形式，可以精确定义 getter 和 setter 方法:

```js
computed: {
  aDouble: function () {
    return this.a * 2
  },
  aPlus: {
    get: function () {
      return this.a + 1
    },
    // 限制赋值必须是正数
    set: function (v) {
      if (v >= 0) {
        this._counter = v;
      }
    }
  }
}
```

函数形式，写法更简单，但是只能定义 getter:

```js
computed: {
  curSelectedCount() {
    if (this.syncIsCheckedAll) {
      return this.total - this.excludedIds.length;
    }
    return this.selectedIds.length;
  },
}
```

### methods

- 类型: `{ [key: string]: Function }`

同样支持对象形式或函数形式写法，就是为 Vue 实例定义一些常规方法:

```js
methods: {
  plus: function () {
    this.a++
  }
}
```

### watch

- 类型: `{ [key: string]: string | Function | Object | Array }`

一个对象，键是要观察的表达式，值是对应回调函数。值也可以是方法名(string)，或者包含选项的对象。

如果值是数组，则数组里面的函数(或函数名对应的函数)会被一一执行，如果是对象，可以进行以下更高级的配置:
- handler: 回调函数或回调函数名
- deep: 布尔值，如果为 `true` 则监听对象内部值变化(数组无需这样做)。
- immediate: 如果为 `true` 立即以表达式的当前值触发回调。

回调函数接受两个参数，第一个为新传入的值，第二个为原来的值。

```js
data: {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: {
    f: {
      g: 5
    }
  }
},
watch: {
  a: function (val, oldVal) {
    console.log('new: %s, old: %s', val, oldVal)
  },
  // 方法名
  b: 'someMethod',
  // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
  c: {
    handler: function (val, oldVal) { /* ... */ },
    deep: true
  },
  // 该回调将会在侦听开始之后被立即调用
  d: {
    handler: 'someMethod',
    immediate: true
  },
  // 你可以传入回调数组，它们会被逐一调用
  e: [
    'handle1',
    function handle2 (val, oldVal) { /* ... */ },
    {
      handler: function handle3 (val, oldVal) { /* ... */ },
      /* ... */
    }
  ],
  // watch vm.e.f's value: {g: 5}
  'e.f': function (val, oldVal) { /* ... */ }
}
```

## 生命周期钩子

所有生命周期钩子类型都是 Function，表示在该生命周期需要执行的逻辑，这里再贴一次 Vue2 生命周期示意图(红色即为生命周期钩子):

![生命周期图示](https://v2.cn.vuejs.org/images/lifecycle.png)

除了上述的 8 个生命周期，还提供了以下 3 个生命周期钩子:
- `activated`: 被 keep-alive 缓存的组件激活时调用。
- `deactivated`: 被 keep-alive 缓存的组件失活时调用。
- `errorCaptured`: 捕获一个来自后代组件的错误时被调用。

```js
destroyed() {
    document.removeEventListener('click', this.clickEventListener);
},
```

## 组合

### parent

- 类型: `Vue instance`

实例的父实例，在子实例中可以使用 `this.$parent` 访问父实例，子实力则被推入到父实例的 `$children` 数组中。

<p class="warn">尽量不要使用这个 API，更推荐使用 props 和 events 进行父子组件通信</p>

### mixins

- 类型: `Array<Object>`

接受一个混入对象数组。混入对象可以像正常的实例对象一样包含实例选项，这些选项将会被合并到最终的选项中，如果混入对象和组件本身包含相同的生命周期钩子，则都会执行。

混入是将选项合并，因此如果组件和混入有相同的选项，组件的选项会优先。

### extends

- 类型: `Object | Function`

允许声明扩展另一个组件 (可以是一个简单的选项对象或构造函数)，而无需使用 `Vue.extend`。这主要是为了便于扩展单文件组件。

<p class="discuss">mixins 和 extends 机制非常类似，但它们的使用情况有所不同。mixins 表示混入，是将多个组件的公共处理方法抽象出来，功能上类似于 utils；而 extends 则类似于类继承。</p>

### provide / inject

- provide: `Object | () => Object`
- inject: `Array<string> | { [key: string]: string | Symbol | Object }`

允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在其上下游关系成立的时间里始终生效。

```js
// 父级组件提供 'foo'
var Provider = {
  provide: {
    foo: 'bar'
  },
  // ...
}

// 子组件注入 'foo'
var Child = {
  inject: ['foo'],
  created () {
    console.log(this.foo) // => "bar"
  }
  // ...
}
```

## 其他

### model

- 类型: `{ prop?: string, event?: string }`

允许一个自定义组件在使用 `v-model` 时定制 prop 和 event。默认情况下，一个组件上的 `v-model` 会把 `value` 用作 prop 且把 `input` 用作 event，但是一些输入类型比如单选框和复选框按钮可能想使用 `value` prop 来达到不同的目的。使用 `model` 选项可以回避这些情况产生的冲突。

```js
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    value: String,
    checked: {
      type: Number,
      default: 0
    }
  },
  // ...
})
```

```html
<!-- v-model 写法 -->
<my-checkbox v-model="foo" value="some value"></my-checkbox>
<!-- 等价写法 -->
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="some value">
</my-checkbox>
```