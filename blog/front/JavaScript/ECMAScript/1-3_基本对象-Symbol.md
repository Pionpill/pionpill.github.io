---
difficulty: easy
type: note
pre: +/front/JavaScript/ECMAScript/1-1_基本对象-Object
---

# Symbol

> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

## 作用

`symbol` 是 ES6 新引入的一种基本数据类型。`Symbol` 函数会返回 `symbol` 类型的值，开发者自定义 `Symbol` 唯一的作用是作为对象属性的标识符，每个调用 `Symbol()` 产生的值都是唯一的，即使传入的参数相同。

<p class="tip">无法通过 new 创建 Symbol 实例，实际上其他简单类型的包装类也不应该通过 new 创建对应的实例，由于历史原因，没有对 ES6 之前的包装类实例化做限制。</p>

Symbol 没有字面量表示，只能通过工厂函数创建: `Symbol([description])`，可以选择性传入一个 `description` 用于标记当前 `symbol`。`symbol` 也只有一个实例属性: `description`。这个实例属性自身没有功能，仅供开发者查看。

## 全局 Symbol 注册表

我们可以在运行时的全局环境中获取注册的 symbol，与之相关的有两个接口:

```js
Symbol.for(key);        // 通过 key 获取或创建一个 symbol
Symbol.keyFor(symbol);  // 通过 symbol 获取对应的 key
```

与 `Symbol()` 不同的是，`Symbol.for(key)` 创建的 `symbol` 会被放入到一个全局 `symbol` 注册表中。并且每次调用时会检测全局注册表是否已经存在 `key` 对应的 symbol, 如果存在则直接返回。

## symbol 作为对象属性的键

ES6 之前，对象属性的 key 只能是字符串(或隐式转换为字符串)，ES6 之后 key 可以是 symbol 类型(symbol 无法被隐式转换为 string)。

symbol 作为对象属性的 key 无法通过点号(.)访问，只能使用中括号获取。在定义 symbol 类型的 key 时，也必须使用中括号语法，例如:

```js
const symbol1 = Symbol();
const symbol2 = Symbol();
const obj = {
    a: "a",
    [symbol1]: 123,
    [symbol2]: {
        b: "b",
    },
};
```

symbol 作为键的好处是不会被覆写，特别是从第三方代码获得某个对象，并希望为其添加属性时。

## 系统 symbol

系统Symbol是预定义的一些Symbol常量。它们是由JavaScript引擎提供的内置Symbol，具有特定的行为和语义。

开发者可以通过重写对象的系统 Symbol 属性来实现元编程，常用的系统 Symbol 包括:
- `Symbol.iterator`: 定义对象的默认迭代器
- `Symbol.asyncIterator`: 定义对象的默认异步迭代器
- `Symbol.match`: 定义对象的正则匹配行为，对应 `String.prototype.match()` 方法
- `Symbol.replace`: 定义对象的替换行为，对应 `String.prototype.replace()` 方法
- `Symbol.search`: 定义对象的搜索行为，对应 `String.prototype.search()` 方法
- `Symbol.split`: 定义对象的分割行为，对应 `String.prototype.split()` 方法
- `Symbol.hasInstance`: 定义对象 `instanceof` 运算符行为
- `Symbol.isConcatSpreadable`: 定义对象是否可以展开为数组，如果为 `true`，则可以通过 `Array.prototype.concat()` 方法展开
- `Symbol.toPrimitive`: 定义对象的原始值转换行为
- `Symbol.toStringTag`: 对应 `Object.prototype.toString()` 方法的返回值。

例如:
```js
const obj = {
  [Symbol.toStringTag]: '1111111111',
}

console.log(obj)    // { [Symbol(Symbol.toStringTag)]: '1111111111' }
console.log(Object.prototype.toString.call(obj))  // [object 1111111111]
```

<p class="discuss">这玩意和 python 的特殊函数好像，抄袭！</p>