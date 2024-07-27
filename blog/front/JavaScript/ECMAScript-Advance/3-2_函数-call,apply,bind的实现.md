---
difficulty: middle
type: origin
---

# 函数 call,apply,bind 的实现

函数原型上的 `call`, `apply` 方法都是用于绑定 `this` 的，他们功能相同，区别是参数传递，第一个参数都是 `this` 绑定的目标:
- `call`: 第二个以外的参数是函数的形参。
- `apply`: 第二个参数是一个数组，表示函数接受的所有参数。

## call, apply 的实现

假设有如下例子:

```js
const obj = {
  value: 1,
}

function func() {
  console.log(this.value)
}

func.call(obj) // 1
```

我们想要模拟 `call` 的实现，就需要让 `func` 所在作用域链的 AO 中存在 `value`，如果直接执行 `func` 显然是没有的，它的作用域链上只有全局上下文的 AO。所以我们需要这样做让它变成这样:

```js
const obj = {
  value: 1,
  func: function () {
    console.log(this.value)
  }
}

obj.func()
```

我们需要做到两点:
- 让 `func` 的作用域链中存在第一个参数的上线文的AO
- 执行完成后，重制作用域链

更通俗一点，我们需要：
- 让函数成为对象的属性
- 执行该函数
- 删除对象的该函数属性

```js
obj.func = func
obj.func()
delete obj.func
```

那么，就需要这样实现:

```js
Function.prototype.mCall = function (context) {
  context.fn = this;
  const result = context.fn();
  delete context.fn;
  return result;
}

func.mCall(obj)
```

<p class="tip">为什么这里的 this 就是函数本身，因为函数的本质是 Function 构造函数的一个实例对象！</p>

### 参数传递

除了 `this` 绑定，`call`, `apply` 还要解决参数传递问题: `arguments`。

`arguments` 本质上是一个类数组，但不具备数组的一些方法 `slice`, `concat` 等，也不可以迭代。

那么我们可以这样写:

```js
Function.prototype.mCall = function (context) {
  context.fn = this;
  const args = []
  for (let i = 1; i < arguments.length; i++) {
    args.push(arguments[i])
  }
  const result = context.fn(...args);
  delete context.fn;
  return result;
}
```
<p class="tip">有些回答会这样写: var result = eval('context.fn(' + _args + ')')。这是因为 ES6 之前没有 ...args 解构函数参数语法，使用 eval 并不安全，不建议这样做。</p>

更简单一点，使用函数参数解构语法:

```js
Function.prototype.mCall = function (context, ...args) {
  context.fn = this;
  const result = context.fn(...args); // apply: context.fn(args)
  delete context.fn;
  return result;
}
```

有一些注意点，如果目标是 `undefined`, `null` 应该绑定 `window`(严格模式下 `undefined`)。如果是基本类型，应该绑定对应的包装类型，所以要再改一下

```js
Function.prototype.mCall = function (context, ...args) {
  if (context === null || context === undefined) {
    context = globalThis;
  } else {
    context = Object(context);
  }
  context.fn = this;
  const result = context.fn(...args); // apply: context.fn(args)
  delete context.fn;
  return result;
}
```

apply 只需要将 `context.fn(...args)` 改成 `context.fn(args)` 就可以了。

## bind 的实现

`bind` 返回的是函数，不是函数执行结果，因此这样实现:

```js
Function.prototype.mBind = function (context, ...args1) {
  const self = this;
  return function (...args2) {
    return self.apply(context, args1.concat(args2))
  }
}
```

这里用到了闭包，为啥要得到 `self` 呢，如果不使用 `self`，我们执行完 `mBind` 之后得到一个函数:

```js
function func(...args) {
  return this.apply(context, args1.concat(args2))
}
```

这里的 `this` 指向全局上下文。因为它的作用域链上的确有 `mBind.AO`，但：

```js
mBindContext.AO = {
  arguemnts: { length: 1, 0: context}
  context: xxx
}
```

是的，这里没有 `this`，因此 `this` 指向了绑定函数所在环境。所以需要 `const self = this`，将 `self` 添加到 `mBind.AO` 中。

### 解决 new 问题

`bind` 生成的函数有一个特性，被 `new` 之后，`this` 绑定失效。解决方案如下（原理在 `new` 专题中）:

```js
Function.prototype.mBind = function (context, ...args1) {
  const self = this;
  const bindFunc =  function (...args2) {
    return self.apply(this instanceof bindFunc ? this : context, args1.concat(args2))
  }
  // 继承原函数的原型
  bindFunc.prototype = self.prototype;
  return bindFunc;
}
```

`bindFunc.prototype = self.prototype` 在修改 `bindFunc.prototype` 时也会修改原函数的原型，为此，我们可以使用一个空函数进行中转:

```js
Function.prototype.mBind = function (context, ...args1) {
  const self = this;
  const newFunc = func () {}
  const bindFunc =  function (...args2) {
    return self.call(this instanceof newFunc ? this : context, args1.concat(args2))
  }
  // 继承原函数的原型
  newFunc.prototype = self.prototype;
  bindFunc.prototype = new newFunc();
  return bindFunc;
}
```