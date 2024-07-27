---
difficulty: middle
type: note
pre: +/front/JavaScript/ECMAScript-Advance/2-4_上下文-this
---

# this

> 参考文献: [冴羽的博客](https://github.com/mqyqingfeng/Blog/issues/6)  

<p class="tip">冴羽关于JS上下文的博客写的太好了，强烈建议看一下原文，本系列只在原博客的基础上使用了 ES6 语法</p>

## Reference

Reference 是只存在于规范中的类型，它由三个部分组成：
- base value: 属性所在的对象...(只能是 Object, Boolean, String, Number, undefined, Environment Record)
- referenced name：属性的名称
- strict reference：不重要

<p class="tip">原文没有解释 Environment Record  是什么，可以简单理解为全局环境</p>

例如：

```js
var foo = {
    bar: function () {
        return this;
    }
};
 
foo.bar(); // foo

// bar对应的Reference是：
var BarReference = {
    base: foo,
    propertyName: 'bar',
    strict: false
};
```

Reference 有两个重要方法：
- `GetBase`：返回 base value
- `IsPropertyReference`：简单理解为判断 base value 是否为对象
```js
var foo = 1;

var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};

GetValue(fooReference) // 1;
```

## 如何确定 this 值

ECMAScript 规范规定当函数调用时，如何确定 `this` 的值(只关心重要的几步):

```
1.Let ref be the result of evaluating MemberExpression.
6.If Type(ref) is Reference, then
    a.If IsPropertyReference(ref) is true, then
        i.Let thisValue be GetBase(ref).
    b.Else, the base of ref is an Environment Record
        i.Let thisValue be the result of calling the ImplicitThisValue concrete method of GetBase(ref).
7.Else, Type(ref) is not Reference.
    a.Let thisValue be undefined.
```

翻译一下就是:
```
1. 计算 MemberExpression 的结果赋值给 ref
6. 如果 ref 是一个 Reference 类型
    a. 如果 IsPropertyReference(ref) 为真，this 值为 GetBase(ref)
    b. 否则，base 值为 Environment Record，this 值为 ImplicitThisValue(this)
7. 否则，this 值为 undefined
```

`ImplicitThisValue` 在严格模式下始终返回 `undefined`

### MemberExpression

`MemberExpression` 可以是以下类型:
- 原始表达式
- 函数定义表达式
- 属性访问表达式
- 对象创建表达式

通俗地理解 `MemberExpression` 就是 `()` 左边的部分。

```js
function foo() {
    console.log(this)
}

foo(); // MemberExpression 是 foo

function foo() {
    return function() {
        console.log(this)
    }
}

foo()(); // MemberExpression 是 foo()

var foo = {
    bar: function () {
        return this;
    }
}

foo.bar(); // MemberExpression 是 foo.bar
```

### 判断 ref 是否为一个 Reference 类型

这就要看规范如何处理各种 `MemberExpression` 了，以 `foo.bar()` 为例，查询 `Property Accessors` 规范时有这样一段说明:

> Return a value of type Reference whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.

所以它是一个 `Reference` 类型，对应值为:

```js
var Reference = {
  base: foo,
  name: 'bar',
  strict: false
};
```

通过 `IsPropertyReference(ref)` 计算为真（因为 foo 是一个对象），因此 `this = GetValue(ref)` 即 `foo`。

至于其他操作，例如: `(false || foo.bar)()` 查询 ` Binary Logical Operators` 规范，发现 `Let lval be GetValue(lref)` 因为使用了 `GetValue` 操作，因此返回的不是 `Reference` 类型，`this` 值为 `undefined`(严格模式)。

此外有一个最常见的情形:

```js
function f() {
  console.log(this);
}

f()
```

此时的 Reference 值为:

```js
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};
```

`f` 类型为函数，并不满足 `IsPropertyReference(ref)`，因此返回 `undefined`。

## 总结

如果每次确定 `this` 值都翻一遍 ECMAScript 规范太过麻烦，在一般场景下我们可以简单理解：`this` 为调用函数的对象。

<p class="tip">非严格模式下，最外层始终有一个 globalThis 对象，严格模式下，如果外层没有对象，this 为 undefined</p>

但是针对一些特殊情形，我们则需要具体分析。