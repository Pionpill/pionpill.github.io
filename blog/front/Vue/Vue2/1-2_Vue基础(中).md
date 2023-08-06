---
difficulty: easy
type: note
---

# Vue2 基础(中)

<p class="hint">这篇对应官方文档深入了解组件(以及基础-组件基础)，主要针对 Vue2 的组件语法。如果没有实践经验，可能无法理解所有内容，建议快速浏览本文写项目后再回顾。</p>


> Vue2 官网文档: [https://v2.cn.vuejs.org/v2/guide/index.html](https://v2.cn.vuejs.org/v2/guide/index.html)

## 组件基础

### 基本示例

定义一个基础的 Vue 组件:

```ts
Vue.component("button-counter", {
  data: function() {
    return {
      count: 0
    }
  }
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```

组件是可复用的 Vue 实例，第一个参数为组件的名字。我们可以在一个通过 `new Vue` 创建的 Vue 根实例中，把这个组件作为自定义元素来使用：

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```ts
new Vue({ el: '#components-demo' })
```

因为组件是可复用的 Vue 实例，所以它们与 `new Vue` 接收相同的选项，例如 `data`、`computed`、`watch`、`methods` 以及生命周期钩子等。仅有的例外是像 `el` 这样根实例特有的选项。

当我们定义 `<button-counter>` 时，它的 `data` 并不是直接提供对象，一个组件的 `data` 必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝。如果不这样做，所有的组件将共享数据。

### 组件的组织

组建的注册分为两种: **全局注册** 和 **局部注册**，我们之前通过 `Vue.component` 写的组件都是全局注册的。全局注册的组件可以用在其被注册之后的任何新创建的 Vue 根实例，也包括其组件树中的所有子组件的模板中。

### Prop 基础

Prop 是可以在组件上注册的一些自定义 attribute。当一个值传给一个 prop attribute 的时候，它就变成了那个组件实例的一个 property。

```ts
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
```

一个 prop 被注册之后，你就可以像这样把数据作为一个自定义 attribute 传递进来：

```html
<blog-post title="My journey with Vue"></blog-post>
<blog-post title="Blogging with Vue"></blog-post>
<blog-post title="Why Vue is so fun"></blog-post>
```

### 监听子组件事件

子组件可以通过调用内建的 `$emit` 方法并传入事件名称来触发一个事件:

```html
<blog-post
  v-on:enlarge-text="postFontSize += 0.1"
>
  <button v-on:click="$emit('enlarge-text')">
    Enlarge text
  </button>
</blog-post>
```

#### 使用事件抛出一个值

在父组件监听子组件事件的过程中，有时候我们可能需要让子组件抛出参数，此时只需要在 `$emit` 方法的第二个参数中传入值即可，父组件可以通过 `$emit` 访问到被抛出的这个值:

```html
<blog-post
  v-on:enlarge-text="postFontSize += $event"
>
  <button v-on:click="$emit('enlarge-text', 0.1)">
    Enlarge text
  </button>
</blog-post>
```

如果事件处理函数是一个方法，那么这个值将作为第一个参数被传入这个方法:

```html
<blog-post
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```

```ts
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

#### 在组件上使用 `v-model`

自定义事件也可以用于创建支持 `v-model` 的自定义输入组件，下面三种写法是等价的:

```html
<input v-model="searchText">
<!-- 等价的原生组件写法 -->
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
<!-- 等价的自定义组件写法 -->
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

为了让它正常工作，这个组件内的 `<input>` 必须:
- 将其 `value` attribute 绑定到一个名为 `value` 的 prop 上
- 在其 `input` 事件被触发时，将新的值通过自定义的 `input` 事件抛出

写成之后的代码是这样的:

```ts
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```

现在 `v-model` 就应该可以在这个组件上完美地工作起来了：

```html
<custom-input v-model="searchText"></custom-input>
```

### 通过插槽分发内容

和 HTML 元素一样，我们经常需要向一个组件传递内容，像这样：

```html
<alert-box>
  Something bad happened.
</alert-box>
```

Vue 自定义的 `<slot>` 元素让这变得非常简单:

```ts
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot>Something bad happened.</slot>
    </div>
  `
})
```

由于这里只有一个默认的插槽，因此 `alert-box` 组建的 `children` 元素会自动被替换为插槽中的内容，最终在浏览器中将显示如下 DOM 结构:

```html
<div class="demo-alert-box">
  <strong>Error!</strong>
  <p></p>
</div>
```

插槽还可以起别名，同时我们在传入的时候也就需要指定名称:

```ts
Vue.component('my-component', {
  template: `
    <template>
      <div>
        <h2>{{ title }}</h2>
        <slot name="customSlot"></slot> <!-- 具名插槽 -->
      </div>
    </template>
  `
})
```

通过 `v-slot` 指令指定插槽名，在 Vue3 中可以用 `#` 代替 `v-slot`:

```html
<my-component title="示例组件">
  <template v-slot:customSlot>
    <p>这段内容将被插入到具名插槽中。</p>
  </template>
</my-component>
```

### 动态组件

如果我们选哟在不同组件之间进行动态切换，则可以通过 Vue 的 `<component>` 元素加一个特殊的 `is` attribute 来实现:

```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```

其中 `currentTabComponent` 可以是 **已注册组件的名字** 或者 **一个组件的选项对象** 

我们也可以将常规 HTML 元素名传入，但传入的元素会被视为 Vue 组件，这意味着我们无法想写常规 HTML 元素那样传入 attribute，而是要通过传 `prop` 的方法传入属性。

#### 解析 DOM 模板时的注意事项

> 了解一下，使用 .vue 编写项目一般不出出现这些问题

某些 html 元素，例如 `<ul>, <ol>, <table>` 对于哪些元素能够出现在其内部是有严格限制的，而 `<li>, <tr>` 等元素只能出现在特定元素内部，例如:

```html
<table>
  <blog-post-row></blog-post-row>
</table>
```

这里的 `<blog-post-row>` 会被作为无效的内容提升到外部，最终导致渲染出错。一个有效的变通方法是使用 `is` attribute:

```html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

但通过以下来源的模板，这种限制是不存在的:
- 字符串: `template: '...'`
- 单文件组件: `.vue`
- `<script type="text/x-template">`

## 组件注册

### 组件名

无论以何种方式注册组件，都需要传入一个组件名。Vue 使用 [W3C 规范](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) 的自定义组件名(全小写，使用连字符隔开)。Vue 官方给出了两种组件名编写方式:
- kebab-case: 单词全小写，使用连字符隔开
- PascalCase: 大驼峰写法，单词首字符全大写

当使用大驼峰法定义组件时，通过 `<my-component-name>` 和 `<MyComponentName>` 引入组件都是可行的，Vue 自动帮我们把它转换成了 kebab-case 写法。

### 全局注册与局部注册

目前为止，我们通过 `Vue.component` 定义的组件都是全局注册的，即它们在注册之后可以用在任何新创建的 Vue 根实例 (new Vue) 的模板中。

全局注册会带来不必要的开销，实际开发中，我们绝大部分情况下只会用到局部注册:

```ts
new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

对于 `components` 对象的每个 property 来说，名就是自定义元素的名字，值是这个组建的选项对象。

注意局部注册的组件在子组件中也是不可用的。如果我们希望使用某一个局部注册组件，那么可以这样写(ES6):

```ts
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}
```
在 ES6+ 中，对象中放一个类似 `ComponentA` 变量其实是 `ComponentA: ComponentA` 的缩写，即这个变量名同时是:
- 用在模板中的自定义元素的名称
- 包含了这个组件选项的变量名

### 模块系统
#### 在模块系统中局部注册

下面是一个基于 ES6+ 模块系统的例子:

```ts
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```

我们通过 `import` 导入了两个外部组件注册到想要使用的组件中，这就是模块系统。

#### 基础组件的自动化全局注册

如果我们的组件只包裹了一个输入框或按钮之类的元素，是相对通用的。我们可以将它们称为基础组件，在各个组件中会被频繁用到。这些基础组件我们可以使用 `require.context` 将其全局注册:

```ts
const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)
```

全局注册的行为必须在根 Vue 实例(通过 `new Vue`)创建之前发生。

## Prop

HTML 中的 attribute 名是大小写不敏感的，所有浏览器会将所有大写字符转换为小写字符。这意味着我们使用小驼峰法命名的属性需要使用等价的短横线法名使用:

```ts
Vue.component('blog-post', {
  // 在 JavaScript 中是 camelCase 的
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```
```html
<!-- 在 HTML 中是 kebab-case 的 -->
<blog-post post-title="hello!"></blog-post>
```

如果使用字符串模板，这个限制就不存在。

### Prop 类型

prop 可以以字符串数组形式定义，但更多的我们会使用对象形式列出，并定义其类型:

```ts
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```
```ts
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
```

### 传递静态或动态 Prop

给 Prop 传值有两种方法:
- 静态传值: `title="My journey with Vue"`
- 动态传值: `v-bind:title="My journey with Vue"`

静态传值只将值传过去，传完就什么都不管了。且静态传值只能传字符串类型，因此静态传值基本不会被用到。

动态传值，支持 js 表达式，如果父组件改变了这个值，子组件会随之改变(但是子组件不能改这个值)。

如果想要将一个对象的所有 property 都作为 prop 传入，可以使用不带参数的 `v-bind`，例如给定一个对象 `post`:

```ts
post: {
  id: 1,
  title: 'title'
}
```

下面两种写法等价:

```ts
<blog-post v-bind="post"></blog-post>
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

### 单向数据流

所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**: 父级 prop 的更新会向下流动到子组件中，但是反过来就不行。

此外，每次父组件发生变更时，子组件中所有的 prop 都会被刷新为最新的值。这意味着不应该在一个子组件内部改变 prop。如果这样做了，Vue 会在浏览器发出警告。

注意: 在 JS 中对象和数组等非基本类型是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，子组件可以改变这个对象，同时影响父组件状态。

### Prop 验证

如果我们使用对象定义 props，Vue 提供了多种验证方式：

```ts
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].includes(value)
      }
    }
  }
})
```

prop 会在一个组件实例创建之前进行验证，所以实例的 property (`date`,`computed` 等) 在 `default` 或 `validator` 函数中是不可用的。

### 非 Prop 的 Attribute

非 prop 的 attribute 是指传向一个组件，但是该组件并没有相应 prop 定义的 attribute。

显式定义的 prop 适用于向一个子组件传入信息，然而组件库的作者并不总能预见组件会被用于怎样的场景。这也是为什么组件可以接受任意的 attribute，而这些 attribute 会被添加到这个组件的根元素上。

非 prop 的属性可以通过 `$attrs` 对象访问到，假如我们在 `child-component` 的 props 中只定义了 `message` 属性，但父组件这样调用:

```html
<child-component message="Hello" color="blue"></child-component>
```

这时候，子组件需要通过这种方式访问非 prop 的属性:

```html
<template>
  <div>
    <p>{{ message }}</p>
    <p>{{ $attrs.color }}</p>
  </div>
</template>
```

#### 替换/合并已有的 Attribute

假如有一个组件 `<bootstrap-date-input>`，它的模板是这样的:

```html
<input type="date" class="form-control">
```

现在我们传入了新的 attribute:

```html
<bootstrap-date-input
  data-date-picker="activated"
  class="date-picker-theme-dark"
></bootstrap-date-input>
```

这种情况下，我们的标签拥有了两个不同 `class` 值:
- `form-control`: 在组件的模板内设置好的。
- `date-picker-theme-dark`: 从组件的父级传入的。

对于绝大多数 attribute，外部传入的值会替换掉原有的值，所有如果传入 `type="text"` 则会替换掉原有的 `type=date`。但是 `class` 和 `type` 稍微智能一些，两边的值会合并起来。

#### 禁用 Attribute 继承

如果不希望组件的根元素继承 attribute，可以在组建的选项中设置 `inheritAttrs: false`。例如:

```ts
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})
```

配合实例的 `$attrs` 属性使用，就可以手动决定这些 attribute 会被赋予哪个元素，在撰写基础组件时常会用到:

```ts
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```

<p class="warn"> `inheritAttrs: false` 选项不会影响 `style` 和 `class` 的绑定 </p>

## 自定义事件

自定义事件名不存在自动转换格式的机制，但 `v-on` 事件监听器在 DOM 模板中会被自动转换为全小写，所以 `v-on: myEvent` 会被转换为 `v-on: myevent`，而且 `myEvent` 不会被监听到。因此，还是推荐使用 kebab-case 写法。

### 自定义组件的 `v-model`

一个组件上的 `v-model` 默认会利用名为 `value` 的 prop 和名为 `input` 的事件，但像单选框，复选框等类型的输入控件可能会将 `value` attribute 用于不同的目的。`model` 选项可以用来避免这样的冲突。

```ts
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```

现在在这个组件上使用 `v-model`:

```html
<base-checkbox v-model="lovingVue"></base-checkbox>
```

此时 `lovingVue` 的值会传入这个名为 `checked` 的 prop。同时当 `<base-checkbox>` 触发一个 `change` 事件并附带一个新的值的时候，这个 `lovingVue` 的 property 将会被更新。

<p class="warn">仍然需要在组件的 `props` 选项里声明 `checked` 这个 prop。</p>

### 将原生事件绑定到组件

如果需要在一个组建的根元素上直接监听一个原生事件，可以使用 `v-on` de  `.native` 修饰:

```html
<base-input v-on:focus.native="onFocus"></base-input>
```

但有时候，我们需要监听事件的对象并不是根元素，例如:

```html
<label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label>
```

为了解决这个问题，Vue 提供了 `$listeners` property，它是一个对象，里面包含了作用在这个组件上的所有监听器:

```ts
{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}
```

这样就可以配合 `v-on="$listeners"` 将所有的事件监听器指向这个组件的某个特定的子元素。

### `.sync` 修饰符

Vue 推荐以 `update:myPropName` 的模式触发父组件更新 prop 以达到 "双向绑定" 的效果，例如通过如下方式向父组件发出一个信息，来更新 prop:

```ts
this.$emit('update:title', newTitle)
```

父组件:

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```
为了方便起见，我们为这种模式提供一个缩写，即 `.sync` 修饰符:

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

<p class="warn">带有 `.sync` 修饰符的 `v-bind` 不能和表达式一起使用，只能提供想要绑定的 property 名，类似 `v-model`</p>

当我们用一个对象同时设置多个 prop 的时候，也可以将这个 `.sync` 修饰符和 `v-bind` 配合使用:

```html
<text-document v-bind.sync="doc"></text-document>
```

这样会把 `doc` 对象中的每一个 property (如 `title`) 都作为一个独立的 prop 传进去，然后各自添加用于更新的 `v-on` 监听器。

<p class="warn">`v-bind.sync` 使用字面量对象时是无效的，因为需要考虑很多边界情况</p>

## 插槽

前面我们已经提及过插槽，插槽可以是任意内容: 字符串，HTML元素...总而言之，它会被 `<slot>` 标签所在的位置替换。

<p class="discuss">单个插槽非常像 React 的 children 属性</p>

### 编译作用域

当在一个插槽中使用数据时，例如:

```html
<navigation-link url="/profile">
  Logged in as {{ user.name }}
</navigation-link>
```

这里的数据访问的是该组件实例的 property，而不是 `<navigation-link>` 的作用域。父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

#### 后备内容

插槽可以提供默认的内容，如果没有传入任何值则会显示这里的默认内容；

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

### 具名插槽

有时我们需要多个插槽，例如:

```html
<div class="container">
  <header>
    <!-- 我们希望把页头放这里 -->
  </header>
  <main>
    <!-- 我们希望把主要内容放这里 -->
  </main>
  <footer>
    <!-- 我们希望把页脚放这里 -->
  </footer>
</div>
```
这时候我们只需要设置插槽的特殊属性: `name` 就可以用来定义额外的插槽:

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

不带 `name` 的 `<slot>` 出口会带有隐含的名字 "default"。

在向具名插槽提供内容的时候，我们可以在一个 `<template>` 元素上使用 `v-slot` 指令，并以 `v-slot` 的参数的形式提供其名称：

```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

任何没有被包裹在带有 `v-slot` 的 `<template>` 中的内容都会被视为默认插槽的内容，如果希望更明确一些，可以使用 `<template v-slot:default>` 的形式。

`v-slot` 只能添加在 `<template>` 上(有一种例外，见下文)。

### 作用域插槽

假如我们有如下模板组件 `<current-user>`:

```html
<span>
  <slot>{{ user.lastName }}</slot>
</span>
```

我们可能希望在使用模板组件时替换一些内容，例如:

```html
<current-user>
  {{ user.firstName }}
</current-user>
```

但是上述代码不会正常工作，因为只有 `<current-user>` 组件可以访问到 `user`，而我们的内容是渲染在父级的。为了让 `user` 可以在父级插槽中可用，我们可以将 `user` 作为 `<slot>` 元素的一个 attribute 绑定上去:

```html
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```

绑定在 `<slot>` 元素上的 attribute 被称为**插槽 prop**。现在在父级作用域中，我们可以使用带值的 `v-slot` 来定义我们提供的插槽 prop 的名字：

```html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

这里的名字 `slotProps` 不是唯一的，可以改成任意想要的名字。

#### 独占默认插槽的缩写语法

就像假定未指明的内容对应默认插槽一样，不带参数的 `v-slot` 被假定对应默认插槽，所以上面的例子可以简写为:

```html
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

默认插槽缩写语法不能和具名插槽混用，这会导致作用域不明确，只要出现多个插槽，始终为所有的插槽使用完整的基于 `<template>` 的语法:

```html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>
```

#### 解构插槽 Prop

作用域插槽的内部工作原理是将你的插槽内容包裹在一个拥有单个参数的函数里:

```ts
function (slotProps) {
  // 插槽内容
}
```

这意味着 `v-slot` 的值实际上可以是任何能够作为函数定义中的参数的 JS 表达式:

```html
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
```

### 动态插槽

动态参数指令也可以用在 `v-slot` 上，来定义动态的插槽名:

```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

### 具名插槽的缩写

和 `v-bind` 能被 `:` 代替一样，`v-slot` 也能被 `#` 代替，前提是必须有参数。

## 动态组件&异步组件
### 动态组件

```html
<component v-bind:is="currentTabComponent"></component>
```

使用 `is` attribute 可以切换不同的组件，当在这些组件之间切换的时候，你有时会想保持这些组件的状态，以避免反复重新渲染导致的性能问题。为了解决这个问题，我们可以用一个 `<keep-alive>` 元素将其动态组件包裹起来。

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

<p class="warn">被 `<keep-alive>` 包裹的组件要求有自己的名字，不论是通过组件的 `name` 还是全局/局部注册。</p>

### 异步组件

<p class="tip">这一般是 node 环境下的机制，不做过多介绍。</p>

Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。例如：

```ts
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

## 处理边界情况

<p class="warn">边界情况是指需要对 Vue 的规则做调整的特殊情况，不到万不得已不要用这种方法，本文不会做过多介绍。</p>

### 访问元素 & 组件

#### 根组件，父组件，子组件访问

在每个 `new Vue` 实例的子组件中，根实例都可以通过 `$root` property 进行访问，例如:

```ts
new Vue({
  data: {
    foo: 1
  },
  computed: {
    bar: function () { /* ... */ }
  },
  methods: {
    baz: function () { /* ... */ }
  }
})
```

```ts
// 获取根组件的数据
this.$root.foo
// 写入根组件的数据
this.$root.foo = 2
// 访问根组件的计算属性
this.$root.bar
// 调用根组件的方法
this.$root.baz()
```

<p class="tip">更多情况下，我们会用 Vuex 来管理状态，而不是这样调用。</p>

类似的，子组件可以通过 `$parent` 访问父组件实例。如果选哟访问子组件实例，则可以这样写:

```html
<base-input ref="usernameInput"></base-input>
```

然后在父组件中调用:

```ts
this.$refs.usernameInput
```

`$refs` 只会在组件渲染完成后生效，且不是响应式的。

#### 依赖注入

依赖注入涉及到两个实例选项: `provide` 和 `inject`:
- `provide` 允许我们指定想要提供给后代组件的数据/方法。
- `inject` 接收指定的我们要添加到实力上的 property。

具体使用上:
```ts
// 父组件
provide: function () {
  return {
    getMap: this.getMap
  }
}
// 子组件
inject: ['getMap']
```

可以把这种写法看作一种大范围有效的 `props`，父组件不需要知道哪些子组件会用到，子组件也不需要知道它来自于哪里。

<p class="warn">这看起来很方便，但是依赖注入有很多缺陷，例如: 依赖注入的 property 不是响应式的；依赖注入会使得代码耦合度变高，后续难以重构。</p>

### 程序化的事件侦听器

针对 `$emit` 用法，我们知道它可以被 `v-on` 侦听，同时 Vue 提供了几种其他侦听方式:
- 通过 `$on(eventName, eventHandler)` 侦听一个事件。
- 通过 `$once(eventName, eventHandler)` 一次性侦听一个事件。
- 通过 `$off(eventName, eventHandler)` 停止侦听一个事件。
