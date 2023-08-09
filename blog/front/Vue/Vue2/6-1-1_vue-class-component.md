---
difficulty: medium
type: note
pre: +/front/JS/TypeScript/4-1_装饰器 /front/Vue/Vue2/2-1_OptionsAPI
rear: +/front/Vue/Vue2/6-1-2_vue-property-decorator
---

# vue-class-component

> 组件官方文档(英): [https://class-component.vuejs.org](https://class-component.vuejs.org)

<p class="warn">很遗憾该组件目前已经不维护了(现在都用组合式 API)，但很多 Vue2 项目仍然采用了这种写法。</p>

vue-class-component 是 Vue2 社区提供的一种**基于 ts 装饰器**的替代 Options API 的**类风格**写法。使用装饰器写法(即 vue-class-component 写法)，可以使用 js 的类语法，将属性，方法直接放在类中，而不需要在特定的对象键中书写逻辑，下面是一个例子:

```js
<template>
  <div>
    <button v-on:click="decrement">-</button>
    {{ count }}
    <button v-on:click="increment">+</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

// Define the component in class-style
@Component
export default class Counter extends Vue {
  // Class properties will be component data
  count = 0

  // Methods will be component methods
  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }
}
</script>
```

在上述写法中，我们定义了一个名为 Counter 的类，并使用 vue-class-component 的 `@Component` 装饰器将其声明为一个组件。我们的属性和方法直接定义在了类中，而不像 Option API 需要放在特定的对象键中。

该组件的项目安装指令:
```bash
npm install --save vue-class-component
```

配置 `tsconfig.json` 文件，开启 ts 的实验性装饰器功能:

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "es2015",
    "moduleResolution": "node",
    "strict": true,
    "experimentalDecorators": true
  }
}
```

<p class="hint">下文代码默认省略最外层的 export default class ...</p>

## 类组件

`@Component` 装饰器将类转换为 Vue 组件，该装饰器接受一个对象参数，用于指定组建的名称, 需要用到的外部组件等(组件名在使用时会自动转换为 kebab-case 写法):

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: "HelloWorld"
  components: {
    OtherComponent
  }
})
export default class HelloWorld extends Vue {}
```

### data

直接使用类属性的写法定义数据(用于替换 Option API 的 data):

```js
message1 = 'Hello World!'
message2 = undefined
```

如果属性的初始值为 undefined，该属性将不会产生响应式变化，因此最好赋予一个初值(null)。

### props

vue-class-component 并没有提供 props 定义的行语法。

一种定义方式是使用 Vue 原生的语法定义后，vue-class-component 通过类继承的方式获取。

```js
const GreetingProps = Vue.extend({
  props: {
    name: String
  }
})

@Component
export default class Greeting extends GreetingProps {
  get message(): string {
    return 'Hello, ' + this.name
  }
}
</script>
```

<p class="discuss">另一种更常见的方式是使用 vue-property-decorator 库。</p>

### methods

类组件中直接声明方法(用于替换 Option API 的 methods):

```js
hello() {
  console.log('Hello World!')
}
```

### 计算属性

通过在类名前加上 get, set 保留字来声明某个方法为计算属性:

```js
get name() {
  return this.firstName + ' ' + this.lastName
}

set name(value) {
  const splitted = value.split(' ')
  this.firstName = splitted[0]
  this.lastName = splitted[1] || ''
}
```

### 钩子

Vue 的钩子使用名称相同的函数定义即可:

```js
// 对应 mounted 钩子
mounted() {
  console.log('mounted')
}
```

## 插件钩子

如果要使用到一些 Vue 插件，比如 Vue Router 的钩子，使用 `Component.registryHooks` 注册这些钩子即可，不过我们必须在组件定义之前被创建，最好的方式是单独在一个文件中注册插件钩子:

```js
import Component from 'vue-class-component'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])
```

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  beforeRouteEnter(to, from, next) {
    console.log('beforeRouteEnter')
    next()
  }

  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate')
    next()
  }

  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave')
    next()
  }
}
```

## 自定义装饰器

可以通过创建自己的装饰器来扩展 vue-class-component 的功能，通过 `createDecorator` 方法创建自定义装饰器，这个方法需要传入一个函数，该函数接受以下几个参数:
- `options`: vue 组件对象，该对象的改变会影响到对应的组件。
- `key`: 属性或方法键名。
- `parameterIndex`: 装饰器参数的 index。

```js
import { createDecorator } from 'vue-class-component'

// 打印日志
export const Log = createDecorator((options, key) => {
  const originalMethod = options.methods[key]

  options.methods[key] = function wrapperMethod(...args) {
    console.log(`Invoked: ${key}(`, ...args, ')')
    originalMethod.apply(this, args)
  }
})
```

## extends and mixins

可以使用 js 原生的 `extends` 语法继承类:

```js
@Component
export default class Super extends Vue {
  superValue = 'Hello'
}
```

vue-class-component 提供了 `mixins` 方法，通过继承的方式实现混合:

```js
// mixins.js
@Component
export class Hello extends Vue {
  hello = 'Hello'
}

@Component
export class World extends Vue {
  world = 'World'
}
```

```js
@Component
export class HelloWorld extends mixins(Hello, World) {
  created () {
    console.log(this.hello + ' ' + this.world + '!') // -> Hello World!
  }
}
```

## 警告

使用 vue-class-component 有两个需要注意的地方:
- 不要使用箭头函数，这会导致 this 无法绑定，当然你的函数中用不到 this 另说，但习惯上还是不要用箭头函数。
- 使用生命周期钩子，而不是构造方法。

<p class="hint">建议继续看 vue-property-decorator，这两个组件一般都一起使用</p>