---
difficulty: medium
type: note
pre: +/front/Vue/reactivity/2-2-1_代理对象-Object
rear: +/front/Vue/reactivity/2-2-3_代理对象-Map,Set
---

# 代理对象-Array

`Array` 也是 `Object`，因此实现数组代理时绝大部分代码都可以复用。但是，`Array` 是一个异质对象，它的 `[[DefineOwnPrototype]]` 内部方法与常规对象不同。

<p class="tip">异质对象是指 13 个内部方法逻辑与常规对象有所不同的对象。</p>

看一下数组元素或属性的"读取"操作:
- 通过索引访问数组元素值: `arr[0]`
- 访问数组长度: `arr.length`
- 把数组当作对象: `for...in` 遍历
- 遍历数组: `for...of`
- 数组的原型方法: `concat`, `join`, `every`, `some`, `find`, `findIndex`

然后是"设置"操作:
- 通过索引修改数组元素值: `arr[1] = 3`
- 修改数组长度: `arr.length = 0`
- 数组的栈方法: `push`, `pop`, `shift`, `unshift`
- 修改数组的原型方法: `splice`, `fill`, `sort`

## 数组索引与 length

通过数组索引访问元素的值和访问对象属性效果相同，都能建立响应式联系。但是通过索引设置数组元素却不同，`set` 拦截器拦截的是内部的 `[[DefineOwnPrototype]]` 方法。

### 侦听索引

在 `Array` 的 `[[DefineOwnPrototype]]` 规范中有一个特殊情况: 如果设置的索引值大于数组当前的长度，那么要更新数组的 `length` 属性，因此我们需要修改 `set` 拦截器:

```js
set(target, key, newValue, receiver) {
  // ......
  const type = Array.isArray(target)
    ? Number(key) < target.length ? 'SET' : 'ADD'
    : Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
  // ......
  trigger(target, key, type)
  // ......
}
```

如果对象是数组，且索引值小于当前数组长度，则视作 SET 操作，否则视作 ADD 操作。如果是 ADD 操作，则触发数组对象 `length` 属性相关的副作用函数重新执行:

```js
function trigger(target, key, type) {
  const depsMap = bucket.get(target)
  // ......
  if (type === 'ADD' && Array.isArray(target)) {
    // 取出 length 属性相关的副作用函数
    const lengthEffects = depsMap.get('length')
    // 将这些副作用函数添加到 effectsToRun 中，待执行
    lengthEffects && lengthEffects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn)
      }
    })
  }
  // ......
}
```

### 侦听 length

同样，修改 `length` 属性也会影响数组元素，索引值大于等于新 `length` 属性值的元素需要触发响应，为了实现这个功能，需要将新的属性值传递到 `trigger` 函数中:

```js
set(target, key, newValue, receiver) {
  // ......
  if (target === receiver.raw) {
    if (oldVal !== newVal && (oldVal === oldVal || newVal=== newVal)) {
      // 增加第四个参数，即触发响应的新值
      trigger(target, key, type, newVal)
    }
  }
  // ......
}
```

然后修改 `trigger` 函数:

```js
function trigger(target, key, type, newVal) {
  // ......
  if (Array.isArray(target) && key === 'length') {
    // 索引大于或等于新的 length 值的元素
    // 所有相关联的副作用函数取出并添加到 effectsToRun 中待执行
    depsMap.forEach((effects, key) => {
      if (key > newVal) {
        effects.forEach(effectFn => {
          if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
          }
        })
      }
    })
  }
  // ......
}
```

## 遍历数组

### for...in 遍历

使用 `for...in` 遍历数组与常规对象没什么不同，同样使用 `ownKeys` 进行拦截:

```js
ownKeys(target) {
  track(target, ITERATE_KEY)
  return Reflect.ownKeys(target)
}
```

对于一个普通对象来说，只有当添加或删除属性值时才会影响`for...in`循环的结果。所以当添加或删除属性操作发生时，我们需要取出与`ITERATE_KEY`相关联的副作用函数重新执行。不过，对于数组来说情况有所不同，我们看看哪些操作会影响`for...in`循环对数组的遍历:
- 添加新元素: `arr[100] = 'bar'`
- 修改数组长度: `arr.length = 0`

无论是为数组添加新元素，还是直接修改数组的长度，本质上都是因为修改了数组的`length`属性。

```js
ownKeys(target) {
  // 侦听数组 length 属性的变化
  track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)
  return Reflect.ownKeys(target)
}
```

这样无论是为数组添加新元素，还是直接修改 `length` 属性，都能够正确地触发响应了。

### for...of 遍历

`for...of` 用来遍历实现了迭代协议 @@iterator 的对象。@@name 标志在 ECMAScript 规范里指代内建的 `symbols` 值(参考[Symbol博客](https://pionpill.github.io/blog/front/JavaScript/ECMAScript/1-3_%E5%9F%BA%E6%9C%AC%E5%AF%B9%E8%B1%A1-Symbol#%E7%B3%BB%E7%BB%9Fsymbol))，如果我们想要拦截 `for...of` 遍历操作，就需要找到其依赖的基本语义。

查 ECMAScript 规范会发现数组迭代器的执行会读取数组的 `length` 属性。如果迭代的是数组元素值，还会读取数组的索引。因此我们之前的工作就已经能保证其正确工作了。

使用 `for...of` 循环(或者取 `values`，数组的 `values` 就返回迭代器)会读取到数组的 `Symbol.iterator` 属性。为了避免发生错误，以及性能上的考虑，不应该与 `symbol` 属性建立响应联系，因此需要修改 `get` 拦截函数:

```js
get(target, key, receiver) {
  // ......
  if (!isReadonly && typeof key !== 'symbol') {
    track(target, key)
  }
  // ......
}
```

## 数组查找方法

一般场景中，数组的查找方法都能建立响应关系，因为查找方法内部会访问数组的 `length` 属性以及数组的索引。

### 重复的代理对象

但也有特殊场景不按照预期工作，以 `includes` 方法为例:

```js
const obj = {}
const arr = reactive([obj])
console.log(arr.includes(arr[0])) // false
```

上述代码运行结果为 `false`，这和我们之前写的 `get` 拦截器有关:

```js
if (typeof res === 'object' && res !== null) {
  // 如果值可以被代理，则返回代理对象
  return isReadonly ? readonly(res) : reactive(res)
}
```

我们通过 `arr[0]` 获取数组元素时，返回了数组元素的封装对象，即使被代理的对象是相同的，每次获取元素时(调用 `reactive` 方法)都会返回新的代理对象，因此判断出错了。

解决方法如下所示:

```js
// 定义一个 Map 实例，存储原始对象到代理对象的映射
const reactiveMap = new Map()
function reactive(obj) {
  const existionProxy = reactiveMap.get(obj)
  if (existionProxy) return existionProxy

  const proxy = createReactive(obj)
  reactiveMap.set(obj, proxy)

  return proxy
}
```

这样我们就可以避免创建重复的代理对象。

### 获取原始对象

下面的代码也会出错:

```js
const obj = {}
const arr = reactive([obj])
console.log(arr.includes(obj))  // false
```

因为我们的 `get` 拦截器返回的是数组元素的代理对象，因此肯定找不到原始对象。为了解决这个问题，只能重写数组的 `includes` 方法并实现自定义的行为，首先需要修改 `get` 拦截器:

```js
get(target, key, receiver) {
  // ......
  if (Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)) {
    return Reflect.get(arrayInstrumentations, key, receiver)
  }
  // ......
}
```

然后重写 `includes` 方法:

```js
const originMethod = Array.prototype.includes
const arrayInstrumentations = {
  includes: function(...args) {
    // this 是代理对象，先在代理对象中查找，将结果存储到 res 中
    let res = originMethod.apply(this, args)
    if (res === false) {
      // 通过 this.raw 拿到原始数组，再去其中查找并更新 res 值
      res = originMethod.apply(this.raw, args)
    }
    return res
  }
}
```

这样，Array 就可以识别原始对象了，`indexOf`, `lastIndexOf` 也需要这样处理。

## 隐式修改数组长度的原型方法

数组的几个方法会隐式修改数组长度，例如: `push`, `pop`, `shift`, `unshift`, `splice`。以 `push` 为例，向数组中添加元素时，既会读取数组的 `length` 属性值，也会设置属性的 `length` 属性值。

这会导致两个独立的副作用函数互相影响。例如下面代码运行会导致栈溢出:

```js
const arr = reactive([])
effect(() => arr.push(1))
effect(() => arr.push(2))
```

问题的原因是 `push` 方法的调用会间接读取 `length` 属性。所以，只要我们"屏蔽"对 `length` 属性的读取，从而避免在它与副作用函数之间建立响应联系。

```js
// 标记是否进行追踪。默认值为 true，即允许追踪
let shouldTrack = true
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrayInstrumentations[method] = function(...args) {
    // 调用原始方法之前，禁止追踪
    shouldTrack = false;
    let res = originMethod.apply(this, args);
    // 恢复原来的行为，允许追踪
    shouldTrack = true;
    return res
  }
})
```

同时修改 `tack` 方法:

```js
function track(target, key) {
  if (!activeEffect || !shouldTrack) return
  // .....
}
```

当标记变量 `shouldTrack` 的值为 `false` 时，即禁止追踪时，`track` 函数会直接返回。这样，当 `push` 方法间接读取 `length` 属性值时，由于此时是禁止追踪的状态，所以 `length` 属性与副作用函数之间不会建立响应联系。