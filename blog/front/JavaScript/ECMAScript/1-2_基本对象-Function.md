---
difficulty: easy
type: note
pre: +/front/JavaScript/ECMAScript/1-1_基本对象-Object
---

# Function

> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)

## 作用

`Function` 指函数，每个函数实际上都是一个 `Function` 对象。

可以通过 `new Function()` 动态创建函数对象，但是这会带来性能和安全问题（意思就是别用）:

```ts
let operation = 'multiply'
const func = new Function('a', 'b', `return a ${operation} b`)
const result = func(5, 3)   // 15
```

<p class="tip">再一次被 JS 的灵活性震惊，但是别这样写。</p>

## 实例属性

获取参数数量:
```ts
readonly length: number
```

获取函数名:
```ts
readonly name: string;
```

## 实例方法

`Function` 常用的实例方法只有三个，功能上类似: `apply`, `call`, `bind`。这三个方法都是用来改变函数执行上下文的(解决 `this` 指向问题):

```ts
apply(this: Function, thisArg: any, argArray?: any): any;
call(this: Function, thisArg: any, ...argArray: any[]): any;
bind(this: Function, thisArg: any, ...argArray: any[]): any;
```

只说一下 `call`: 

```ts
function greet() {
  console.log(`Hello, ${this.name}!`);
}

const person = { name: 'Alice' };
greet.call(person); // 输出：Hello, Alice!
```

使用 `call` 传入 `person` 后，`greet` 函数内部的 `this` 指向 `person` 对象。

- `call` 与 `apply`: 收参不同，`call` 可以传任意个参数，最后全收到 `argArray` 中，`apply` 只能传两个，第二个参数即函数执行时的参数。
- `call` 与 `bind`: `call` 会立即执行，`bind` 不会，`bind` 通常返回一个函数，开发者自行调用。

## 函数闭包

> MDN 官方文档: [闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

闭包是由函数以及声明该函数的词法环境组合而成的。该环境包含了这个闭包创建时作用域内的任何局部变量。

```js
function makeFunc() {
  const name = "Mozilla";
  function displayName() {
    alert(name);
  }
  return displayName;
}
```

在其他部分编程语言中，函数中的局部变量仅在此函数执行期间存在，例如上面的 `name`，一旦函数执行完毕，局部变量将不存在。但是 JS 的函数执行后可以保留内部变量的引用。

<p class="tip">深入理解 JS 词法环境，上下文，this 指向问题等知识需要一些 JS 引擎基础，我会在其他博客(计划在 v8 引擎系列)中单独讲解。</p>

使用闭包可以创建一些内部变量，我们可以将这些变量当作私有属性使用(可以模拟 java，c++ 的 private 变量)。

频繁使用闭包有一些缺陷: 如果需要用闭包创建大量实例，可以考虑使用原型链上的属性代替。闭包在处理速度和内存消耗上远不及原型链。

## 箭头函数

箭头函数与普通函数最大的区别是没有自己的 `this` 绑定。箭头函数会继承外部的 `this`，因此箭头函数没有 `bind, apply, call` 这三个方法。

同时箭头函数也无法获得自己的 `arguments` 对象。箭头函数无法通过 `new` 关键字实例化对象。