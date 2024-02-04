---
difficulty: easy
type: note
---

# Set

> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)

## 作用

集合 `Set` 用于存储任何类型的唯一值。在大多数语言中 `Set` 都是从 `Map` 改造的，因此它们有很多类似的地方，例如:
- 集合中的元素是有序的
- 元素采用零值相等进行比较 (+0 与 -0 相等，NaN 相等)
- 查找操作性能优于 `Array`

`Set` 的构造函数接收一个可迭代对象，`new Set(iterable[])` 的过程中会自动过滤重复的元素，因此也常常用 `Set` 排除重复的元素。如果不传入任何参数则构建一个空 `Set` 对象。

## 实例属性与方法

`Set` 常用的实例属性只有一个: `size`，用于获取容器元素的数量，并且该属性是只读的，无法像 `Array` 的 `length` 一样操作容器大小。

`Set` 的常用实例属性如下:
- `Set.prototype.add()`: 如果 `Set` 中不存在具有相同值的元素，则插入
- `Set.prototype.clear()`: 删除所有元素
- `Set.prototype.delete()`: 删除指定元素，返回布尔值表示是否成功删除
- `Set.prototype.has()`: 判断是否存在指定元素
- `Set.prototype.forEach()`: 为每个元素执行一次回调函数
- `Set.prototype.keys/values()`: 返回每个元素的值
- `Set.prototype.entries()`: 返回每个元素的 `[value, value]` 数组

从最后两个方法可以看出，`Set` 就是 `Map` 实现的。

## WeakSet

`WeakSet` 与 `Set` 的关系和 `WeakMap` 与 `Map` 的关系类似:
- `WeakSet` 没有 `size` 属性
- `WeakSet` 只有 `add`, `delete`, `has` 三个实例方法
