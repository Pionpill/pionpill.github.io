---
difficulty: easy
type: note
---

# Object

> 浏览器兼容性: [caniuse](https://caniuse.com/?search=javascript%20Object)  
> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)  
> 发布版本: ES2015

## 作用

除了简单类型，其他几乎所有对象都是 `Object` 实例。由于所有对象的原型链上都有 `Object`(非常重要)，我们这篇文章整理一下 `Object` 的常用静态方法。

<p class="tip">这里用几乎是因为 null 是一个特殊的对象，typeof null === 'object'，历史原因这里返回 true。但是 null 的原型链上没有 Object，下文我们说对象的时候默认排除 null。</p>

## 构造对象

### 字面量构造

构造 `Object` 最常见的方法是用字面量构造:

```ts
const a = {
  name: 'a',
  'b': 'b',
  func: (a, b) => a + b,
  func2(a) {
      console.log(a)
  }
}
```

语法类似于其它语言的 `Map`，可传入任意个键值对，其中键必须是字符串或 `Symbol` 类型，键如果是字符串可省略引号。

### 构造函数

通过构造函数创建 `Object` 对象很少见，有两种构造方法:

```js
new Object(value)
Object(value)
```

此外，在 TS 种，这两种构造方法的返回值类型也不同:

```ts
// 通过 new 关键字返回的是 Object 类型
new(value?: any): Object;
// 没有 new 关键字返回 any 类型
(): any;
(value: any): any;
```

是否使用 `new` 关键字有些微的区别，但都返回一个继承自 `Object.prototype` 的新对象实例。根据 `value` 类型的不同返回值也不同:
- 不传入 `value` 或者传入 `null/undefined`，会生成并返回一个空对象
- 传入其他简单类型，会返回一个对应的封装对象
- 传入一个对象，则返回该对象的引用(相当于啥也没干)。

## 原型方法

原型方法很常用，这里简单罗列一下:

```ts
interface Object {
    // 原型属性，指向构造方法
    constructor: Function;

    // 转化为 string
    toString(): string;

    // 转换为本地 string
    toLocaleString(): string;

    // 返回原始值
    valueOf(): Object;

    // 判断对象是否存在某个属性，传入的 number 会被自动转为 string
    hasOwnProperty(v: string | number | symbol): boolean;

    // 判断对象的原型链上是否存在某个对象
    isPrototypeOf(v: Object): boolean;

    // 判断某个属性是否是可枚举的
    propertyIsEnumerable(v: string | number | symbol): boolean;
}
```

这里有个 `valueOf` 特殊说明下，当我们使用某个对象的原始值时(例如进行算术运算或比较操作)，JS 引擎会自动调用该对象的 `valueOf` 方法来获取原始值。默认情况下 `Object.prototype.valueOf()` 方法返回对象本身。

number 的封装类 `Number` 就是重写了 `valueOf` 保持操作和原始值相同:

```ts
const n = Number(1)
console.log(n.valueOf())  // 1
```

我们也可以自己重写 `valueOf`:

```js
const test = {
    value: 10,
    valueOf() {
        return this.value
    }
}
console.log(test + 1)
```

但是，在 TS 中对象的 `valueOf` 方法不会被自动调用，因此需要显示调用:

```ts
console.log(test.valueOf() + 1)
```

## 静态方法

有一个原型属性 `prototype`，用于获取 `Object` 的原型

获取/设置某个实例的原型：
```ts
Object.getPrototypeOf(o: any): any
Object.setPrototypeOf(o: any, proto: object | null): any
```

获取某个对象直接属性(直接存在于对象上而不是原型链上)的描述信息：
```ts
Object.getOwnPropertyDescriptor(o: any, p: PropertyKey): PropertyDescriptor | undefined
```

获取某个对象直接属性键列表：
```ts
Object.getOwnPropertyNames(o: any): string[]
Object.getOwnPropertySymbols(o: any): symbol[]
```

创建一个新对象，并为该对象指定原型:
```ts
Object.create(o: object | null): any;
Object.create(o: object | null, properties: PropertyDescriptorMap & ThisType<any>): any;
```
`Object.create` 方法会以传入的参数为原型创建一个对象，例如:

```ts
const a = Object.create({ x: 1 })
console.log(a)  // {} 空对象
console.log(a.__proto__)  // { x: 1 }
```

如果要更精确地配置一些属性，可以传入第二个参数:

```ts
const a = Object.create({ x: 1 }, {
  a: {
    configurable: false,
    value: 'a',
  }
})
```

为已有对象添加新属性，基础功能和中括号赋值类似，但是可以传入属性配置:
```ts
Object.defineProperty<T>(o: T, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>): T;
Object.defineProperties<T>(o: T, properties: PropertyDescriptorMap & ThisType<any>): T;
```

密封对象的属性:
```ts
Object.seal<T>(o: T): T;
Object.isSealed(o: any): boolean;
```
如果某个对象被密封，那么有如下限制:
- 不能添加新的属性
- 不能删除现有属性，或更改属性的 `configurable`, `enumerable` 配置
- 不能重新分配其原型
- 对属性值没有影响

冻结对象
```ts
Object.freeze<T>(o: T): T;
Object.isFrozen(o: any): boolean;
```
如果某个对象被冻结，那么有如下限制:
- 不能添加新的属性
- 不能删除现有属性，或更改属性的 `configurable`, `enumerable`, `writable` 配置，不能更改值
- 不能重新分配其原型
- 与密封的区别是对属性值也有影响

禁止为对象添加新的属性:
```ts
Object.preventExtensions<T>(o: T): T;
Object.isExtensible(o: any): boolean;
```

返回对象自身的可枚举的字符串键属性 key/value/entry 组成的数组:
```ts
Object.keys(o: object): string[];   // ES2015
Object.values(o: {}): any[];        // ES2017
Object.entries(o: {}): [string, any][]; // ES2017
```

将 `source` 对象的可枚举属性拷贝到 `target` 对象中，如果 `target` 对象已存在对应的属性则覆盖:
```ts
Object.assign<T extends {}, U>(target: T, source: U): T & U;
```

判断两个值是否相等:
```ts
Object.is(value1: any, value2: any): boolean
```
这个方法在大多数情形下和 `===` 判断返回值相同，有两个不同的场景:
```ts
console.log(Object.is(NaN, NaN));   // true
console.log(Object.is(+0, -0));     // false
console.log(NaN === NaN);   // false
console.log(+0 === -0);     // true
```

将 Map 转化为对象:
```ts
Object.fromEntries<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k: string]: T }   // ES2019
```