---
difficulty: easy
type: note
---

# Array

> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)

## 作用

JavaScript 的数组是 `Array` 对象，不同于传统 C 语言的数组，JS 的数组有两大特点:
- 大小可调整
- 可以包含不同数据类型

<p class="tip">JS 的数组本质上是引擎封装的一个对象，相较于编译语言直接操作内存的数组，它更类似于 Java 中的容器 ArrayList。下文统一将数组称为 Array 对象以做区分</p>

`Array` 对象继承自 `Object` 对象。因此除了常规的使用整数下标访问元素，还可以通过整数的字符串形式访问元素，但是不同通过 `.` 运算符访问元素。

```js
const a = [1,2,3]
console.log(a[0])   // 1
console.log(a['0']) // 1
console.log(a.0)    // error
```

通过整数访问元素时会调用整数的 `toString` 方法将其转换为字符串再取值，因此也可以这样写:

```js
const obj = {
  [Symbol.toPrimitive]: (hint) => {   // 优先调用
    if (hint === 'string')
      return '2'
  },
  toString: () => '0',  // 如果没有上面的，则调用这个
}
const a = [1,2,3]

console.log(a[obj])   // 3
```

## 静态方法

`Array` 有四个静态方法:
- `Array.from()`: 从数组对象或可迭代对象创建一个新的 `Array` 实例
- `Array.fromAsync()`: 同上，用于做异步处理
- `Array.isArray()`: 用于判断对象是否为 `Array`
- `Array.of()`: 接收可变数量的参数，创建一个 `Array` 对象包含它们

## 实例属性与方法

### 数组长度

`Array` 重要的实例属性只有一个: `length` ，这个属性非常特殊，我们可以通过下标直接为 `Array`对象添加元素，这可能会改变数组的 `length` 属性:

```js
const a = [1, 2, 3]
a[5] = 6

console.log(Object.keys(a)) // [ '0', '1', '2', '5' ]
console.log(a.length) // 6
```

也可以直接改变 `length` 属性，进而控制 `Array` 容器的长度:

```js
const a = [1, 2, 3]
a.length = 5

console.log(a)    // [ 1, 2, 3, <2 empty items> ]
console.log(a.length)   // 5
console.log(a[4])   // undefined
```

如果 `length` 值小于当前 `Array` 容器 `length`，会直接删除多余的元素，因此，可以通过下面方式删除数组:

```js
const a = [1, 2, 3]
a.length = 0

console.log(a)  // []
```

所以最好以对象的逻辑操作 `Array`，而不是传统的数组。

### 实例方法

查询方法:
- `Array.prototype.includes()`: 判断数组是否存在某个元素
- `Array.prototype.indexOf()`: 返回某个元素第一次出现的索引
- `Array.prototype.lastIndexOf()`: 返回某个元素最后一次出现的索引

获取属性方法: 
- `Array.prototype.at()`: 查找指定索引处的元素，接受负值
- `Array.prototype.keys()`: 获取索引的迭代器，一般没什么用，除非你乱改 `length`
- `Array.prototype.values()`: 获取元素的迭代器
- `Array.prototype.entries()`: 返回每个索引键值对组成的迭代器，类似于 `Object.entries()` 不过键是索引下标

改变自身方法:
- `Array.prototype.pop()`: 移除最后一个元素并返回
- `Array.prototype.push()`: 尾部添加元素并返回最新的 `length`
- `Array.prototype.shift()`: 移除第一个元素并返回
- `Array.prototype.unShift()`: 头部添加元素并返回最新的 `length`
- `Array.prototype.reverse()`: 就地反转数组
- `Array.prototype.sort()`: 就地对数组元素排序
- `Array.prototype.splice()`: 就地添加/删除元素
- `Array.prototype.copyWith()`: 在数组内复制数组元素序列

返回新数组方法:
- `Array.prototype.concat()`: 返回拼接的新数组
- `Array.prototype.fill()`: 用静态值填充数组中从开始索引到结束索引的所有元素
- `Array.prototype.slice()`: 提取数组的一部分并返回一个新数组
- `Array.prototype.flat()`: 返回一个新数组，所有子数组元素递归地连接到其中，直到指定的深度
- `Array.prototype.flatMap()`: 类似于 `flat` 但对每个元素都调用给定的函数
- `Array.prototype.join()`: 将数组的所有元素连接为字符串
- `Array.prototype.toReversed()()`: 返回一个反转后的新数组
- `Array.prototype.toSorted()`: 返回一个排序后的新数组
- `Array.prototype.toSpliced()`: 返回添加/删除元素后的新数组
- `Array.prototype.with()`: 返回一个给定索引处元素被替换后的新数组

查询高阶函数:
- `Array.prototype.every()`: 每个元素都满足则返回 true
- `Array.prototype.some()`: 任意元素都满足则返回 true
- `Array.prototype.find()`: 返回第一个满足条件的元素
- `Array.prototype.findIndex()`: 返回第一个满足条件的元素索引
- `Array.prototype.findLast()`: 返回最后一个满足条件的元素
- `Array.prototype.findLastIndex()`: 返回最后一个满足条件的元素索引

处理高阶函数:
- `Array.prototype.forEach()`: 对数组每个元素指定回调函数
- `Array.prototype.map()`: 返回每个元素调用函数结果的数组
- `Array.prototype.filter()`: 返回一个新数组，其中包含调用所提供的筛选函数返回为 true 的所有数组元素
- `Array.prototype.reduce()`: 数组从左到右执行回调函数，最后简化为单个值
- `Array.prototype.reduceRight()`: 数组从右到左执行回调函数，最后简化为单个值