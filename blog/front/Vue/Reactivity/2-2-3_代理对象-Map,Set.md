---
difficulty: medium
type: note
pre: +/front/Vue/reactivity/2-2-2_代理对象-Array
rear: +/front/Vue/reactivity/2-2-4_代理原始值
---

# 代理对象-Map,Set

<p class="tip">Map 和 Set 的很多行为类似，而且 `Set` 一般都是用 `Map` 实现的，因此放在一起讲。</p>


`Map/Set` 与一般的对象不同，它是通过 `get` 和 `set/add` 获取与修改元素。

## 代理 Map,Set

运行如下代码:

```js
const s = new Set([1, 2, 3])
const p = new Proxy(s, {})
console.log(p.size) 
// Method get Set.prototype.size called on incompatible receiver [object Object]
```

这里报错了: 在不兼容的receiver上调用了 size 方法。`Set.prototype.size` 是一个访问器属性，当访问 `p.size` 时，访问器属性的 `getter` 函数会立即执行，此时我们可以通过修改receiver来改变getter函数的this的指向:

```js
const p = new Proxy(s, {
  get(target, key, receiver) {
    if (key === 'size') {
      // 访问器属性拿原始对象值
      return Reflect.get(target, key, target)
    }
    return Reflect.get(target, key, receiver)
  }
})
```

此外还有个 `delete` 方法也会抛出类似的错误，但 `delete` 是一个方而不是访问器属性，需要这样处理:

```js
get(target, key, receiver) {
  if (key === 'size') {
    return Reflect.get(target, key, target)
  }
  // 将方法与原始数据对象 target 绑定后返回
  return target[key].bind(target)
}
```

## 建立相应联系

`Map` 仅一个只读的实例属性: `size`，其他都是方法，因此追踪依赖比较简单:

```js
get(target, key, receiver) {
  if (key === 'size') {
    // 建立响应联系
    track(target, ITERATE_KEY)
    return Reflect.get(target, key, target)
  }
  return target[key].bind(target)
}
```

当调用了改变容器的方法时，需要触发响应式副作用，处理方式和 `Array` 类似，需要自定义方法:

```js
get(target, key, receiver) {
  if (key === 'raw') return target
  if (key === 'size') {
    track(target, ITERATE_KEY)
    return Reflect.get(target, key, target)
  }
  // 使用自定义方法
  return mutableInstrumentations[key]
}
```

```js
// 自定义方法
const mutableInstrumentations = {
  add(key) {
    // this 指向代理对象
    const target = this.raw
    // 优化，如果值已经存在，不触发响应(因为 size 不变)
    const hadKey = target.has(key)
    const res = target.add(key)
    if (!hadKey) {
      trigger(target, key, 'ADD')
    }
    return res
  },

  delete(key) {
    const target = this.raw
    const hadKey = target.has(key)
    const res = target.add(key)
    // 这里是存在才触发响应
    if (hadKey) {
      trigger(target, key, 'ADD')
    }
    return res
  }
}
```

## 避免污染原始数据

`Map` 有 `set` 和 `get` 两个方法，调用 `get` 方法读取数据时，需要调用 `track` 函数追踪依赖建立相应联系；调用 `set` 方法时，需要 `trigger` 触发响应:

```js
const mutableInstrumentations = {
  get(key) {
    const target = this.raw
    const had = target.has(key)
    track(target, key)
    if (had) {
      const res = target.get(key)
      // 这里用了深响应
      return typeof res === 'object' ? reactive(res) : res
    }
  },

  set(key, value) {
    const target = this.raw
    const had = target.has(key)
    const oldValue = target.get(key)
    target.set(key, value)
    if (!had) {
      trigger(target, key, 'ADD')
    } else if (oldValue !== value || (oldValue === oldValue && value === value)) {
      trigger(target, key, 'SET')
    }
  }
}
```

这里的 `set` 方法存在一个隐患，如果传入的值是一个代理对象，也即 `Map` 的元素是一个代理对象，那么如果我们操作原始对象，也会触发响应式变化。

不应该这样设计，我们应该保证原始数据不被污染，否则会产生不必要的麻烦，处理方式很简单:

```js
set(key, value) {
  const target = this.raw
  const had = target.has(key)
  const oldValue = target.get(key)
  // 代理对象获取原始数据
  target.set(key, value.raw || value)
  if (!had) {
    trigger(target, key, 'ADD')
  } else if (oldValue !== value || (oldValue === oldValue && value === value)) {
    trigger(target, key, 'SET')
  }
}
```

## 处理 forEach

`Map` 的遍历操作只和键值对的数量有关，因此任何会修改 `Map` 对象键值对数量的操作都应该触发副作用函数的重新执行。当 `forEach` 函数被调用时，应该让副作用函数与 `ITERATE_KEY` 建立响应联系:

```js
forEach(callback) {
  const target = this.raw
  track(target, ITERATE_KEY)
  target.forEach(callback)
}
```

这里通过原始数据对象调用了原生的 `forEach` 方法，这意味着，传递给 `callback` 回调函数的参数将是非响应式数据，因此 `Map` 元素发生变化不会被响应式侦听，我们改造一下: 

```js
// 第二个参数也加上
forEach(callback, thisArgs) {
  // 把原始对象封装成响应式对象
  const wrap = (val) => typeof val === 'object' ? reactive(val) : val
  const target = this.raw
  track(target, ITERATE_KEY)
  target.forEach((v,k) => callback.call(thisArgs, wrap(v), wrap(k), this))
}
```

`Map` 的 `forEach` 有个特殊之处，他返回的是 `key`, `value` 组成的 `entity`，因此 `key`, `value` 中任何一个值变化都应该触发响应式变化。因此我们在 `trigger` 中需要增加一些判断:

```js
function trigger(target, key, type, newVal) {
  // ......
  // Map 的 SET 操作触发副作用执行
  if (
    ['ADD', 'DELETE'].includes(type) || 
    (type === 'SET' && Object.prototype.toString.call(target) === '[object Map]')
  ) {
    const lengthEffects = depsMap.get('length')
    lengthEffects && lengthEffects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn)
      }
    })
  }
  // ......
}
```

## 处理迭代器

`Map` 相关的迭代器方法有三个: `entries`, `keys`, `values`，此外还可以使用 `for...of` 迭代。

<p class="tip">甚至可以调用 Symbol.iterator 获取迭代器，但这和 entries 方法获取的是同一个东西。</p>

首先我们要让代理对象允许迭代：

```js
[Symbol.iterator]() {
  const target = this.raw
  const itr = target[Symbol.iterator]()
  // 迭代元素代理
  const wrap = (val) => typeof val === 'object' ? reactive(val) : val
  track(target, ITERATE_KEY)
  return {
    next() {
      const { value, done } = itr.next()
      return {
        value: value ? [wrap(value[0]), wrap(value[1])] : value,
        done
      }
    }
  }
}
```

由于 `p.entries` 与 `p[Symbol.iterator]` 等价，所以我们可以使用同样的代码来实现对 `p.entries` 函数的拦截:

```js
const mutableInstrumentations = {
  [Symbol.iterator]: iterationMethod,
  entries: iterationMethod,
}

function iterationMethod() {
  const target = this.raw
  const itr = target[Symbol.iterator]()
  const wrap = (val) => typeof val === 'object' ? reactive(val) : val
  track(target, ITERATE_KEY)
  return {
    // 实现迭代器协议
    next() {
      const { value, done } = itr.next()
      return {
        value: value ? [wrap(value[0]), wrap(value[1])] : value,
        done
      }
    },
    // 实现可迭代协议
    [Symbol.iterator]() {
      return this
    }
  }
}
```

## 处理 keys 与 values 方法

这两个方法的实现和 `entities` 非常类似:

```js
const mutableInstrumentations = {
  [Symbol.iterator]: iterationMethod,
  entries: iterationMethod,
  values: valuesIterationMethod
}

function valuesIterationMethod() {
  const target = this.raw
  // 这里拿的是原始的 values 方法
  const itr = target.values()
  const wrap = (val) => typeof val === 'object' ? reactive(val) : val
  track(target, ITERATE_KEY)
  return {
    // 实现迭代器协议
    next() {
      const { value, done } = itr.next()
      return {
        // 只需要包裹 value
        value: wrap(value),
        done
      }
    },
    // 实现可迭代协议
    [Symbol.iterator]() {
      return this
    }
  }
}
```

`keys` 取原始对象的 `keys` 方法即可。

但是这有个问题，之前我们的代码里面写过:

```js
type === 'SET' && Object.prototype.toString.call(target) === '[object Map]'
```

`Map` 的 `SET` 操作会触发响应式变化，这对于 `values` 和 `entities` 来说是对的，但是 `keys` 不关心值的变化。解决方案是单独给 `keys` 绑定响应关系:

```js
function keysIterationMethod() {
  const target = this.raw
  const itr = target.values()
  const wrap = (val) => typeof val === 'object' ? reactive(val) : val
  // 与 MAP_KEY_ITERATE_KEY 建立联系
  track(target, MAP_KEY_ITERATE_KEY)
  return {
    next() {
      const { value, done } = itr.next()
      return {
        value: wrap(value),
        done
      }
    },
    [Symbol.iterator]() {
      return this
    }
  }
}
```

触发响应式关系时同样:

```js
function trigger(target, key, newVal) {
  // ......
  if (
    ['ADD', 'DELETE'].includes(type) || 
    (type === 'SET' && Object.prototype.toString.call(target) === '[object Map]')
  ) {
    const iterateEffects = depsMap.get(MAP_KEY_ITERATE_KEY)
    // .......
  }
  // ......
}
```