---
difficulty: easy
type: note
---

# Vue2 基础(上)

<p class="hint">这篇对应官方文档基础部分(组件基础除外)，主要针对 Vue2 的基础语法。</p>

> Vue2 官网文档: [https://v2.cn.vuejs.org/v2/guide/index.html](https://v2.cn.vuejs.org/v2/guide/index.html)

## Vue 实例

### 响应式实例数据

最基础额创建 Vue 实例的方法需要传入一个对象作为参数，如下所示(创建 Vue 实例的方法有多种，这里只给出官网的写法，这里主要讲数据响应与生命周期，不必纠结于具体的写法):

```ts
const data = {a: 1}

const vm = new Vue({
  el: '#app',
  data: data
})
```

其中，`el` 表示需要绑定的 HTML 元素 id，`data` 表示对象绑定的属性。

当一个 Vue 实例被创建时，它的 `data` 对象中所有的 `property` 会被加入到 Vue 的 **响应式系统** 中。当 `property` 发生变化时，视图会产生响应，数据会被更新。

```ts
vm.a = data.a;  // true
vm.a = 2;
data.a;         // 2
data.a = 3;
vm.a;           // 3
```

只有当实例被创建时就存在于 `data` 的数据才会**响应式**变化，后续加入的数据并不会改变，例如:

```ts
vm.b = 10;
```

如果需要在创建时设置一些后续要用到的数据，可以设置一些初始值:

```ts
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

处理数据 property，Vue 实例还暴露了一些有用的实例 property 与方法，它们都有前缀 `$`，以便于用于定义的 property 区分开，例如:

```ts
vm.$data
vm.$el
vm.$watch   // 一个实例方法
```

### 实例生命周期

每个 Vue 实例在被创建时都需要经过一系列的初始化过程，在这个过程中会运行一系列的叫做**生命周期钩子**的函数，方便开发者在不同阶段添加代码，生命周期钩子的 `this` 上下文指向调用它的 Vue 实例，例如 `created` 钩子用于在一个实例被创建后执行代码:

```ts
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` 指向 vm 实例
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"
```

Vue 实例具体的生命周期及对应的钩子函数如下图所示:

![生命周期图示](https://v2.cn.vuejs.org/images/lifecycle.png)

## 模板语法

Vue 的模板语法可以声明式地将 DOM 绑定至底层 Vue 实例的数据。

### 插值

#### 文本 ({{}})

文本是最常见的形式，使用双大括号(“Mustache”语法)插入文本:

```html
<span>Message: {{msg}}</span>
```

这里大括号的内容会被替换为对应数据对象上 `msg` property 值。基于响应式系统，只要数据对象上 `msg` property 发生了变化，插值处的内容就会更新。

如果我们不希望文本更新，可以使用 `v-once` 指令，这样数据改变时，插值出的内容就不会更新。

```html
<span v-once>这个将不会改变: {{ msg }}</span>
```

#### HTML (v-html)

如果我们要输出真正的 HTML，则需要加上 `v-html` 指令:

```html
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

这里 `span` 的内容会被替换为 property 的值 `rawHtml`，直接作为 HTML(忽略数据绑定)。

#### Attribute (v-bind)

Mustache 语法不能作用在 HTML 属性上，如果我们要将数据绑定到 HTML 标签的属性上，需要使用 `v-bind` 指令:

```html
<div v-bind:id="dynamicId"></div>
```

如果绑定的属性是布尔值，则根据隐式转换原则转换，如果为 `false`，对应属性可能不存在。

#### JS 表达式

对于所有的数据绑定，都支持**单个** JavaScript 表达式:

```html
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div v-bind:id="'list-' + id"></div>
```

### 指令

指令是指带有 `v-` 前缀的特殊 attribute，指令 attribute 的值预期是 **单个 JS 表达式**(`v-for` 例外)。指令的职责是: 当表达式的值改变时，将产生连带影响，响应式地作用于 DOM。

#### 参数

部分指令接受一个参数，在指令之后用冒号表示: `v-xxx:attribute`，例如:

```html
<a v-bind:href="url">...</a>
<a v-on:click="doSomething">...</a>
```

#### 动态参数

从 2.6.0 开始可以用方括号括起来的 JS 表达式作为一个指令的参数: `v-xxx:[attribute]`。

```html
<a v-bind:[attributeName]="url"> ... </a>
```

这里的 `attributeName` 会被作为一个 JavaScript 表达式进行动态求值，求得的值将会作为最终的参数来使用。例如上面例子 `attributeName` 最终求值结果为 href，那么等价于: `v-bind:href`。

动态参数有如下约束:
- 值的约束: 动态参数预期会得出字符串，异常情况下为 `null`，`null` 可以别显示用于移除绑定。任何其他非字符串类型的值都会触发警告。
- 表达式约束: 表达式必须满足 HTML attribute 标准，例如结果不能有空格，引号，属性名必须是全小写。

#### 修饰符

修饰符 (modifier) 是以半角句号 . 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，`.prevent` 修饰符告诉 `v-on` 指令对于触发的事件调用 `event.preventDefault()`：

```html
<form v-on:submit.prevent="onSubmit">...</form>
```

#### 缩写

由于一些指令很常用，为了简化开发，我们会省略掉这些指令的 `v-` 前缀，Vue 为 `v-bind` 与 `v-on` 提供了特定的简写:

`v-bind` 缩写

```html
<a v-bind:href="url">...</a>
<a :href="url">...</a>              <!-- 缩写 -->
```

`v-on` 缩写

```html
<a v-on:click="doSomething">...</a>
<a @click="doSomething">...</a>     <!-- 缩写 -->
```

## 计算属性和侦听器

### 计算属性

模板中虽然可以使用 JS 表达式，但是放入过于复杂的处理逻辑会让带啊吗变得难以维护，于是就出现了计算属性:

```html
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>
```

```ts
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})
```

这里我们声明了一个计算属性 `reversedMessage`。我们提供的函数将用作 property `vm.reversedMessage` 的 getter 函数。

计算属性仍然是响应式的，上述例子中，只要 `message` 发生改变，`reversedMessage` 的值也随之改变。

#### 计算属性 VS 调用方法

在上面的例子中，我们也可以通过在表达式中调用方法来达到同样的效果:

```html
<p>Reversed message: "{{ reversedMessage() }}"</p>
```

```ts
methods: {
  reversedMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

这两种方式在**上面例子**中最终结果是完全相同的。但是，**计算属性是基于它们的响应式依赖进行缓存的**，只有在以来数据发生变化时才会重新求值，但是调用方法不会，每次调用方法将重新执行方法逻辑。

这意味着下面计算属性将不会再更新，除非采用方法调用的形式:

```ts
computed: {
  now: function () {
    return Date.now()
  }
}
```

两种方法各有优缺点及应用场景。

#### 计算属性的 setter

计算属性默认只有 getter，如果有需要可以自己提供一个 setter:

```ts
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```


### 侦听器

侦听器在大多数情况下可以被计算属性替代，但是档需要在数据变换时执行异步或开销较大的操作时，侦听器很有用，具体是使用 `watch` 选项:

```html
<div id="watch-example">
  <p>
    Ask a yes/no question:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

```ts
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer() // 异步逻辑
    }
  },
  ...
}
```

## Class 与 Style 绑定

`v-bind` 用于 `class` 和 `style` 时，Vue.js 做了专门的增强，表达式的结果除了字符串，还可以是对象或数值。

### 绑定 HTML Class

#### 对象语法

我们可以给 `v-bind:class` 一个对象，以动态地切换 class:

```html
<div v-bind:class="{active: isActive}"></div>
```

上面例子表示 `active` 这个 class 存在与否取决于数据 property `isActive` 的[真值](https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy)。

通过这种方法，多个 class 可以共存，此外，`v-bind:class` 也可以与普通的 class attribute 共存:

```html
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>
```

加入有如下数据:

```ts
data: {
  isActive: true,
  hasError: false
}
```

那么结果为:

```html
<div class="static active"></div>
```

绑定的数据对象不必内联定义在模板里:

```html
<div v-bind:class="classObject"></div>
```

```ts
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

我们也可以绑定返回对象的计算属性:

```ts
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

#### 数组语法

数组语法如下所示:

```html
<div v-bind:class="[activeClass, errorClass]"></div>
```

```ts
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

最终结果为

```html
<div class="active text-danger"></div>
```

如果想要根据条件切换 class，可以使用三元表达式，或者嵌套对象:

```html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

#### 用在组件上

当在一个自定义组件上使用 `class` property(带数据绑定也相同) 时，这些 class 将被添加到该组件的根元素上面，已有的 class 不会被覆盖。

```ts
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```

```html
<my-component v-bind:class="{ active: isActive }" class="static"></my-component>
```

当 `isActive` 为真值时，HTML 将被渲染为:

```html
<p class="foo bar active static">Hi</p>
```
### 绑定内联样式

#### 对象语法

`v-bind:style` 的对象语法和 CSS 非常像，其实是一个 JS 对象。CSS property 名可以用驼峰式或短横线命名:

```html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

```ts
data: {
  activeColor: 'red',
  fontSize: 30
}
```

直接绑定样式对象会让模板更清晰:

```html
<div v-bind:style="styleObject"></div>
```

```ts
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

#### 数组语法

`v-bind:style` 数组语法可以将多个样式对象应用到同一个元素上:

```html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

当 `v-bind:style` 使用需要添加浏览器引擎前缀的 CSS property 时，Vue.js 会自动侦测并添加相应的前缀。

从 2.3.0 起，`style` 绑定中的property 提供一个包含多个值的数组，常用于提供多个带前缀的值:

```html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

这样写只会渲染数组中最后一个被浏览器支持的值。在本例中，如果浏览器支持不带浏览器前缀的 flexbox，那么就只会渲染 `display:flex`。

## 条件渲染

### v-if

`v-if` 指令用于条件性地渲染一块内容，只有结果为 truthy 值地时候会被渲染。

```html
<h1 v-if="awesome">Vue is awesome!</h1>
```

可以配合 `v-else` 一起使用

```html
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

2.1.0 新增一个 `v-else-if`:

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

#### 用 `key` 管理可复用的元素

Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。例如:

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

上面代码切换 `loginType` 不会清除用户已输入的内容。因为两个模板使用了相同的元素，`<input>` 不会被替换掉，仅仅替换它的 `placeholder`。

如果我们不想要这种效果，可以为元素添加具有唯一值的 `key` 属性:

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

这样每次切换时，输入框都会被重新渲染。但 `<label>` 元素仍然会被高效复用。

### v-show

`v-show` 指令也可以根据条件展示元素:

```html
<h1 v-show="ok">Hello!</h1>
```

不同的是，`v-show` 的元素始终会被渲染并保留在 DOM 中，只是简单地切换元素的 CSS property `display`。`v-show` 不支持 `<template>` 元素，`v-if` 是支持的。

#### `v-if` VS `v-show`

`v-if` 是真正的条件渲染，他会确保在切换过程中组件被销毁或重建，`v-if` 是惰性的，如果不处罚渲染条件，那么什么都不做，只有第一次为真值时，才会才是渲染条件块。

`v-show` 很简单，不管什么条件都会渲染，基于 CSS 样式决定是否显示。

不要同时使用 `v-if` 和 `v-for`，`v-for` 具有比 `v-if` 更高的优先级。

## 列表渲染

### `v-for`

`v-for` 指令基于一个数组渲染一个列表。`v-for` 指令需要使用 `item in items` 形式的特殊语法，其中 `items` 是源数据数组，`item` 是被迭代的数组元素的别名。

```html
<ul id="example-1">
  <li v-for="item in items" :key="item.message">
    {{ item.message }}
  </li>
</ul>
```

```ts
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

`v-for` 块可以访问所有父作用域的 property。`v-for` 还支持一个可选的第二个参数，即当前项的索引。同时我们可以使用 of 代替 in，更接近 JS 原生的语法。

```html
<ul id="example-2">
  <li v-for="(item, index) of items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

```ts
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

`v-for` 不止可以访问可迭代对象，还可以访问对象：

```html
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

```ts
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
})
```

同样的访问对象可以提供第二个参数(甚至第三个)：键名

```html
<div v-for="(value, name, index) in object">
  {{ index }}. {{ name }}: {{ value }}
</div>
```

### 维护状态

Vue 使用 `v-for` 渲染元素列表时，默认使用 **就地更新** 策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，而是就地更新每个元素，并且确保它们在每个索引位置正确渲染。

这个默认的模式是高效的，但是**只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出。**

为了给 Vue 一个提示，以便它能跟踪每个节点的身份，我们需要为每项提供一个唯一的 `key` attribute:

```html
<div v-for="item in items" v-bind:key="item.id">
  <!-- 内容 -->
</div>
```

这个 `key` 只能是(约定)字符串或者数字(Symbol 也可以)。

### 数组更新检测

#### 变更方法

Vue 将被侦听的数组的变更方法进行了包裹，所以这些方法会触发视图更新: `push()` `pop()` `shift` `unshift` `splice` `sort` `reverse`。

#### 替换数组

除了变更方法，还存在一些非变更方法，他们会返回新的数组，例如 `filter()`, `concat()`, `slice()`。当使用非变更方法时，可以用新数组替换旧数组:

```ts
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

Vue 为了使得 DOM 元素得到最大范围的重用而实现了一些智能的启发式方法，所以用一个含有相同元素的数组去替换原来的数组是非常高效的操作。

由于 JavaScript 的限制，Vue 不能检测数组和对象的变化。

### 显示过滤/排序后的结果

如果我们想要显示一个数组经过过滤或排序后的版本，而不实际改变或重置原始数据，可以通过计算属性返回过滤或排序后的数组:

```html
<li v-for="n in evenNumbers">{{ n }}</li>
```

```ts
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

如果计算属性不适用，可以使用非变更方法:

```html
<ul v-for="set in sets">
  <li v-for="n in even(set)">{{ n }}</li>
</ul>
```

```js
data: {
  sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

### `v-for` 注意事项

`v-for` 接受整数，在这种情况下，它会把模板重复对应次数。

```html
<span v-for="n in 10">{{ n }} </span>
```

`v-for` 和 `v-if` 类似，都可以在 `<template>` 标签中使用:

```html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

`v-if` 和 `v-for` 不推荐一起使用，如果在同一节点 `v-for` 优先级高于 `v-if`，这意味着 `v-if` 将分别重复运行于每个 `v-for` 循环中。

## 事件处理

### 监听事件

可以用 `v-on` 指令监听 DOM 时间，并在出发时运行一些 JS 代码:

```html
<div id="example-1">
  <button v-on:click="counter += 1">Add 1</button>
  <p>The button above has been clicked {{ counter }} times.</p>
</div>
```

如果是复杂的事件，需要将逻辑抽离出去，并将函数名传入 `v-on`:

```html
<div id="example-2">
  <button v-on:click="greet">Greet</button>
</div>
```

```ts
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  methods: {
    greet: function (event) {
      alert('Hello ' + this.name + '!')
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})

example2.greet() //  'Hello Vue.js!'
```

如果函数需要传入参数，可以在内联 JS 语句中调用方法:

```html
<div id="example-3">
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
</div>
```

```ts
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
```

如果徐奥在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 `$event` 把它传入方法:

```html
<button v-on:click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```

```js
methods: {
  warn: function (message, event) {
    // 现在我们可以访问原生事件对象
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

### 修饰符

#### 事件修饰符

我们的事件处理方法最好只有存储的逻辑数据，而不去处理 DOM 事件细节。为了解决这个问题，Vue.js 为 `v-on` 提供了 **事件修饰符**: `.stop` `.prevent` `.capture` `.self` `.once` `.passive`。

```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```

修饰符可以嵌套使用，但顺序很重要。

#### 按键修饰符

Vue 允许为 `v-on` 在监听键盘事件时添加按键修饰符：

```html
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
```

大部分常用按键码的别名都是支持的: `.enter` `.tab` `.delete` `.esc` `.space` `.up` `.down` `.left` `.right`。

可以通过全局 `config.keyCodes` 对象自定义按键修饰符别名:

```ts
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

对于复合按键，可以用如下修饰符来实现仅在按下相应按键时才触发鼠标或键盘事件的监听器: `.ctrl` `.alt` `.shift` `.meta`:

```html
<!-- Alt + C -->
<input v-on:keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div v-on:click.ctrl="doSomething">Do something</div>
```

`.exact` 修饰符允许你控制由精确的系统修饰符组合触发的事件:

```html
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button v-on:click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button v-on:click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button v-on:click.exact="onClick">A</button>
```

vue 同时支持了一些鼠标按钮修饰符: `.left` `.right` `.middle`。

## 表单输入绑定

### 基础用法

可以用 `v-model` 指令在表单 `<input>` `<textarea>` `<select>` 元素上创建双向数据绑定。它会根据控件类型自动选取正确的方法来更新元素。`v-model` 责监听用户的输入事件以更新数据，并对一些极端场景进行一些特殊处理。

`v-model` 会忽略所有表单元素的 `value`、`checked`、`selected` attribute 的初始值而总是将 Vue 实例的数据作为数据来源。

`v-model` 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：
- text 和 textarea 元素使用 `value` property 和 `input` 事件；
- checkbox 和 radio 使用 `checked` property 和 `change` 事件；
- select 字段将 `value` 作为 prop 并将 `change` 作为事件。

这里给出一个例子，更多例子查看 [Vue2 官网](https://v2.cn.vuejs.org/v2/guide/forms.html):

```html
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```

如果 `v-model` 表达式的初始值未能匹配任何选项，`<select>` 元素会被渲染为 "未选择"状态，这在 IOS 系统中会导致 bug，因此，更推荐在 data 中设置一个为空的初值。

### 修饰符

#### `.lazy`

默认情况下，`v-model` 在每次 `input` 事件触发之后将输入框的值与数据进行同步。加上 `lazy` 修饰符后，转为在 `change` 事件之后进行同步。

```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg">
```

#### `.number`

如果想自动将用户的输入值转为数值类型，可以给 `v-model` 添加 `number` 修饰符：

```html
<input v-model.number="age" type="number">
```

如果这个值无法被 `parseFloat()` 解析，则会返回原始的值。

#### `.trim`

自动过滤输入的首尾空白字符。