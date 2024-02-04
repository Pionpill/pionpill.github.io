---
difficulty: easy
type: note
---

# Map

> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)

## 作用

`Map` 和 `Object` 很像，都可以用于存储键值对，`Map` 有两个主要特点:
- 任何值(对象或原始值)都可以作为键或值
- `Map` 的元素是有序的，后插入的键值对在遍历时始终在后面

`Map` 查询速度很快(这类数据结构查询都很快)，规范要求时间复杂度小于 O(n)。`Map` 的原型上不存在多余的属性，而改动 `Object` 原型会带来非常大的影响。

不要将 `Map` 当作 `Object` 使用，使用操作对象的方法可以赋值，但会产生不必要的影响:

```js
const map = new Map();
map['a'] = 'aaa';

console.log(map)    // Map(0) { a: 'aaa' }
console.log(map.has('a'))   // false
console.log(map.delete('a'))    // false
```

仅能通过 `new Map()` 的方式构建 `Map` 对象，接收至多一个参数。不传参则构建一个空映射对象，传入的参数必须是键值对数组:
```ts
new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
```

`Map` 对象时可迭代的，因此可以使用 `for ... of` 语句。`Map` 有一个特殊的键: `NaN`，理论上 `NaN !== NaN`，但 `Map` 做了特殊处理，可以通过 `NaN` 取值:

```js
const myMap = new Map();
myMap.set(NaN, "not a number");
myMap.get(NaN);   // "not a number"
```
 
## 实例属性与方法

`Map` 实例只有一个只读的重要属性: `size`，用来获取键值对的数量。给 `size` 属性赋值不会报错，但是没有任何作用。

`Map` 的几个实例方法都很简单:
- `Map.prototype.has()`: 判断是否存在某个键
- `Map.prototype.get()`: 传入键获取指定值
- `Map.prototype.set()`: 设置一个新的键值对
- `Map.prototype.clear()`: 移除所有键值对
- `Map.prototype.delete()`: 传入键移除指定键值对
- `Map.prototype.keys()`: 返回键组成的数组
- `Map.prototype.values()`: 返回值组成的数组
- `Map.prototype.entries()`: 返回键值对数组
- `Map.prototype.forEach()`: 传入一个函数，对每个键值对进行处理

## 常见问题

在 Typescript 中直接传递数组变量给 `Map` 会报传参类型问题:

```js
const arrayA = [
    ["apple", 5],
    ["banana", 8],
];

const mapA: Map<string, number> = new Map(arrayA);
// No overload matches this call.
```

此时，`arrayA` 会被识别为 `(string | number)[][]`, 并没有指定二级数组长度，我们需要显式指明 `arrayA` 的类型:

```ts
const arrayA: [string, number][] = [
    ["apple", 5],
    ["banana", 8],
];

const mapA: Map<string, number> = new Map(arrayA);
```

## WeakMap

> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)

`WeakMap` 作用和 `Map` 类似，主要有两个大区别：
- 键必须是对象或非全局注册的符号
- 不会创建对键的强引用

由于 `WeakMap` 不会创建对键的强引用，因此某个对象作为键存在，并不会影响该对象被 GC。

此外，`WeakMap` 相比 `Map` 还有如下不同:
- 实例没有 `size` 属性
- 实例方法只有 `get`, `set`, `delete`, `has` 这四个

`WeakMap` 的实现机制会在讲 v8 引擎的时候说明。
