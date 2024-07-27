---
difficulty: middle
type: origin
pre: +/front/JavaScript/ECMAScript-Advance/1-2_原型-类
---

# 函数 new 实现

在实现 new 之前先要知道函数的成员在结果对象中分别承担什么角色。务必看过 "原型-类" 这篇文章。

由于 JS 无法新增运算符，因此我们只能通过函数来实现:

```js
new Func(...);
objFactory(Func, ...)
```

分析:
- 需要新建一个对象并返回
- 函数的属性时返回对象的属性
- 函数原型属性时返回对象的原型属性

```js
function objFactory(Constructor, ...args) {
  const obj = new Object()
  obj.__proto__ = Constructor.prototype; // 绑定原型属性
  Constructor.apply(obj, args) // 绑定实例属性
  return obj
}
```

## 函数返回值的影响

`Func` 返回的结果对 `new` 出的对象有影响:
- 返回对象: `new` 的结果只能访问返回对象的属性。
- 返回基本类型: 相当于没有返回。

因此需要改进一下:

```js
function objFactory(Constructor, ...args) {
  const obj = new Object()
  obj.__proto__ = Constructor.prototype;
  const result = Constructor.apply(obj, args)
  return typeof obj === 'object' ? result : obj;
}
```