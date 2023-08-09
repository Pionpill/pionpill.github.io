---
difficulty: easy
type: note
pre: +/front/Vue/Vue2/1-2_Vue基础(中)
---

# Vue2 基础(下)

<p class="hint">这篇对应官方文的: 可复用性&组合。是一些零碎的东西，涉及到底层原理的一些概念，部分内容不是很常用(所以照抄了文档)。</p>

> Vue2 官网文档: [https://v2.cn.vuejs.org/v2/guide/index.html](https://v2.cn.vuejs.org/v2/guide/index.html)

## 混入

混入的目的是分发 Vue 组件中的**可复用功能**。一个混入对象可以包含任意组件选项。当组件使用混入对象时, 所有混入对象的选项将被“混合”进入该组件本身的选项。这个过程类似 `Object.assign()`(但规则不同)。

```js
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```

### 混入规则

如果组件和混入对象有同名选项,那么选项将以恰当的方式合并: 对于常规选项和生命周期钩子处理方式有所不同.

#### 常规选项

数据对象, 函数等常规非生命周期钩子选项, 如果发生冲突, 以组件数据优先:

```js
var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)   // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
```

#### 生命周期钩子

同名钩子函数会被合并为一个数组, 都会被调用. 此外, 混入对象的钩子在组件自身钩子之前调用:

```js
var mixin = {
  created: function () {
    console.log('混入对象的钩子被调用')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件钩子被调用')
  }
})
// => "混入对象的钩子被调用"
// => "组件钩子被调用"
```

## 自定义指令

<p class="hint">这部分本人用的少，所以几乎完全抄的 Vue2 文档</p>

Vue 允许我们自定义指令 (v-instruction 形式), 比如说我们注册一个 `v-focus` 指令:

```js
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

如果要注册局部指令,也可以在组件中配置 `directives` 选项.

### 钩子函数

一个指令定义对象可以提供如下几个钩子函数(都是可选的):
- `bind`: 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- `inserted`: 被绑定元素插入父节点时调用。
- `update`: 被绑定元素插入父节点时调用。
- `componentUpdated`: 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- `unbind`: 只调用一次，指令与元素解绑时调用。

### 钩子函数的参数

指令钩子函数会被传入以下参数:
- `el`: 指令所绑定的元素，可以用来操作 DOM。
- `binding`: 一个对象，包含以下键:
  - `name`: 指令名，不包括 `v-` 前缀。
  - `value`: 指令的绑定值，例如 `v-my-directive="1 + 1"`，值为2。
  - `oldValue`: 指定绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。
  - `expression`: 字符串指令表达式，例如 `v-my-directive="1 + 1"`，值为 `1 + 1`。
  - `arg`: 传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
  - `modifiers`: 一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。
- `vnode`: Vue 编译生成的虚拟节点。
- `oldVnode`: 上一个虚拟节点。

这是一个使用了这些 property 的自定义钩子样例：

```html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
```

```js
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```

#### 动态指令的参数

指令的参数可以是动态的。例如，在 `v-mydirective:[argument]="value"` 中，`argument` 参数可以根据组件实例数据进行更新！这使得自定义指令可以在应用中被灵活使用。

例如你想要创建一个自定义指令，用来通过固定布局将元素固定在页面上。我们可以像这样创建一个通过指令值来更新竖直位置像素值的自定义指令：

```html
<div id="baseexample">
  <p>Scroll down the page</p>
  <p v-pin="200">Stick me 200px from the top of the page</p>
</div>
```

```js
Vue.directive('pin', {
  bind: function (el, binding, vnode) {
    el.style.position = 'fixed'
    el.style.top = binding.value + 'px'
  }
})

new Vue({
  el: '#baseexample'
})
```

这会把该元素固定在距离页面顶部 200 像素的位置。但如果场景是我们需要把元素固定在左侧而不是顶部又该怎么办呢？这时使用动态参数就可以非常方便地根据每个组件实例来进行更新。

```html
<div id="dynamicexample">
  <h3>Scroll down inside this section ↓</h3>
  <p v-pin:[direction]="200">I am pinned onto the page at 200px to the left.</p>
</div>
```

```js
Vue.directive('pin', {
  bind: function (el, binding, vnode) {
    el.style.position = 'fixed'
    var s = (binding.arg == 'left' ? 'left' : 'top')
    el.style[s] = binding.value + 'px'
  }
})

new Vue({
  el: '#dynamicexample',
  data: function () {
    return {
      direction: 'left'
    }
  }
})
```

### 函数简写

在很多时候，你可能想在 `bind` 和 `update` 时触发相同行为，而不关心其它的钩子。比如这样写：
```js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

### 对象字面量

如果指令需要多个值，可以传入一个 JavaScript 对象字面量。记住，指令函数能够接受所有合法的 JavaScript 表达式。

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```

## 过滤器

过滤器被用于一些常见的文本格式化，有两个地方可以使用过滤器: 插值语法(双大括号), `v-bind` 表达式，过滤器的使用方式是在 JS 表达式后面加一个 `|` 然后加上过滤器名，类似于 linux 的管道。

```html
{{ message | capitalize }}
<div :id="rawId | formatId"></div>
```

可以在本地或者全局定义过滤器，过滤器方法一般接收一个参数，即要过滤的对象:

```js
// 本地定义
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
// 全局定义
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

过滤器可以串联使用:

```html
{{ message | filterA | filterB }}
```

过滤器也可以接受多个参数:

```html
{{ message | filterA('arg1', arg2) }}
```

## 渲染函数

在绝大部分情况下，我们都是通过模板来创建 HTML。但是在一些场景中，我们可能会需要通过 JS 来生成 DOM 节点，这时候我们可以使用渲染函数，这更阶段编译器。

例如我们通过传入一个 `level` 数据，决定外层使用 h1-h6 之间的标签。那么我们可以这样写:

```js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,     // 标签名称
      this.$slots.default   // 子节点数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

上述代码会创建如下模板（以 h1 为例，如果传入其他 level 值则为其他级别标签）:

```html
<h1>
  <slot></slot>
</h1>
```

<p class="discuss">如果你会 React，会发现 React 有一个名称相同的 createElement 方法，它们的作用都是创建 vDOM 元素。</p>

### createElement 函数

`createElement` 接受的参数包括:
- 根节点(String | Object | Function): 必填
- 配置项(Object): 可选，具体键查 [官方文档](https://v2.cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1)
- 子节点(String | Array): 单个子节点或子节点数组。

例如我们可以这样写:

```js
var getChildrenTextContent = function (children) {
  return children.map(function (node) {
    return node.children
      ? getChildrenTextContent(node.children)
      : node.text
  }).join('')
}

Vue.component('anchored-heading', {
  render: function (createElement) {
    // 创建 kebab-case 风格的 ID
    var headingId = getChildrenTextContent(this.$slots.default)
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^-|-$)/g, '')

    return createElement(
      'h' + this.level,
      [
        createElement('a', {
          attrs: {
            name: headingId,
            href: '#' + headingId
          }
        }, this.$slots.default)
      ]
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

非常抽象，还是写模板吧。

#### 约束

组件树的所有 VNode 必须是唯一的，下面写法不合法:

```js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // 错误 - 重复的 VNode
    myParagraphVNode, myParagraphVNode
  ])
}
```

可以改成:

```js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

实际上绝大多数指令都是通过 `createElement` 实现的，如果比较熟，可以尝试自己实现一遍。

### 函数式组件

如果一个组件很简单，没有任何状态需要管理，也没有生命周期方法啊，只接受一些 prop，那么我们可以将其标记为函数式组件 (functional)。

通过创建实例的方式标记:

```js
Vue.component('my-component', {
  functional: true,
  // Props 是可选的
  props: {
    // ...
  },
  // 为了弥补缺少的实例
  // 提供第二个参数作为上下文
  render: function (createElement, context) {
    // ...
  }
})
```

单文件组件标记:

```html
<template functional>
  ...
</template>
```

<p class="discuss">类似于 React 的纯组件。</p>

## 插件

插件是给 Vue 添加全局功能的，需要在 new Vue 对象之前完成。

通过 `Vue.use` 可以全局启用某个插件，第二个参数是一个配置项:

```js
Vue.use(MyPlugin, { someOption: true })
```