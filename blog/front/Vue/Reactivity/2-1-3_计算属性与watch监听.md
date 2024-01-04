---
difficulty: medium
type: note
rear: +/front/Vue/reactivity/3-1-2_概念-Fiber架构
---

# 计算属性与 watch 监听

## 计算属性与懒执行

### 懒执行

我们之前定义的副作用函数都是立即执行的，如果不希望它立刻执行，可以这样写:

```js
effect(
  () => {
    console.log(obj.foo)
  },
  {
    lazy: true  // 加一个配置项 lazy
  }
)
```

```js
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    fn()
    effectStack.pop(effectFn)
    activeEffect = effectStack[effectStack.length - 1]
  }
  effectFn.options = options
  effectFn.deps = []
  if (!options.lazy) {  // 不懒执行
    effectFn()
  }
  return effectFn   // 懒执行直接返回
}
```

通过这个配置项，我们返回了副作用函数本身，开发者可以选择在合适的时机调用:

```js
const effectFn = effect(() => {
  console.log(obj.foo)
}, { lazy: true })

effectFn()  // 手动执行
```

如果我们将传递给 `effect` 的函数看作一个 `getter`，那么这个 `getter` 函数可以返回任何值:

```js
const effectFn = effect(
  () => obj.foo + obj.bar,
  { lazy: true }
)

const value = effectFn()
```

我们再对 `effect` 函数做一些修改:

```js
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    const res = fn()  // 将函数的执行结果存储到变量中
    effectStack.pop(effectFn)
    activeEffect = effectStack[effectStack.length - 1]
    return res  // 返回函数
  }
  effectFn.options = options
  effectFn.deps = []
  if (!options.lazy) {
    effectFn()
  }
  return effectFn
}
```

这样我们就可以拿到副作用函数的执行结果。

### 计算属性

通过上面的代码，我们已经能够实现懒执行的副作用函数，并且能够拿到副作用函数的执行结果，那我们就可以实现计算属性了:

```js
function computed(getter) {
  const effectFn = effect(getter, { lazy: true })
  const obj = {
    get value() {
      return effectFn()
    }
  }
  return obj;
}
```

上面定义的 `computed` 函数会返回一个对象，该对象的 `value` 属性是一个访问器属性，每次读取 `value` 的值时，才会执行 `effectFn` 并将其结果作为返回值返回。

我们还需要给计算属性加上缓存功能:

```js
function computed(getter) {
  let value
  let dirty = true  // 表示是否要重新计算
  const effectFn = effect(getter, { 
    lazy: true 
    scheduler: () => { dirty = true }   // 每次触发副作用函数执行都需要重新计算属性值
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false;
      }
      return value;
    }
  }
  return obj;
}
```

这样，基本的计算属性功能就完成了。但还存在一个缺陷，下面代码执行时，`obj.foo` 的值不会触发副作用函数的渲染:

```js
const sumRes = computed(() => obj.foo + obj.bar)
effect(() => {
  console.log(sumRes.value)
})
obj.foo++
```

在 `effect` 方法中，副作用函数会被 `sumRes.value` 这个状态收集。`sumRes` 是一个计算属性，它内部有自己的 `effect` 并且是懒执行的，只有真正读取计算属性的值时才会执行。对于计算属性的 `getter` 函数来说(外层 `effect` 需要通过 getter 被收集)，它内部访问的响应式数据只会把 `computed` 内部的 `effect` 收集为依赖。而外层的 `effect` 并不会被内层 `effect` 中的响应式数据收集。

解决方法是，在读取计算属性的值时，手动调用 `track` 函数进行追踪；当计算属性以来的响应式数据发生变化时，在手动调用 `trigger` 函数触发响应:

```js
function computed(getter) {
  let value
  let dirty = true

  const effectFn = effect(getter, { 
    lazy: true 
    scheduler: () => { 
      if (!dirty) {
        dirty = true 
        trigger(obj, 'value') // 响应式数据发生变化，手动触发响应
      }
    }
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false;
      }
      track(obj, 'value') // 手动追踪
      return value;
    }
  }
  return obj;
}
```

这样，就相当于我们的计算属性的 `value` 也是一个响应式数据，它的副作用集合中包含外部的 `effect` 方法。

## watch 监听

### watch 的实现原理

基础的 watch API 就是观测一个响应式数据，发生变化时调用回调函数。

```js
watch(obj, () => {
  console.log('数据变了')
})

obj.foo++
```

实现思路是: 监听响应式数据 `source` 的变化，发生变化后调用回调函数。

```js
function watch(source, cb) {
  effect(
    () => traverse(source), // 递归读取 source 的属性
    {
      scheduler: cb
    }
  )
}

function traverse(value, seen = new Set()) {
  // 原始值，已被读过，什么都不做
  if (typeof value !== 'object' || value === null || seen.has(value))
    return;
  seen.add(value)
  for (const k in value) {
    traverse(value[k], seen)
  }
  return value
}
```

这样，我们就可以监听对象的任意属性，属性发生变化后就会触发回调函数执行。

#### 监听 getter

watch API 允许第一个参数是一个 `getter` 函数:

```js
watch(() => obj.foo, () => {
  console.log('obj.foo 的值变了');
})
```

在 `getter` 函数内部，用户可以指定该 `watch` 依赖哪些响应式数据，只有这些响应式数据变化时，才会触发回调函数执行:

```js
function watch(source, cb) {
  const getter = typeof source === 'function' ? source : () => traverse(source)

  effect(
    () => getter(),
    {
      scheduler: () => cb()
    }
  )
}
```

#### 获取新旧值

```js
function watch(source, cb) {
  const getter = typeof source === 'function' ? source : () => traverse(source)
  let oldValue, newValue

  const effectFn = effect(
    () => getter(),
    {
      lazy: true,
      scheduler() {
        // 在这里重新执行副作用函数，得到的是新值
        newValue = effectFn()
        // 传参
        cb(newValue, oldValue)
        // 更新旧值
        oldValue = newValue
      }
    }
  )
  // 手动调用副作用函数，拿到的是旧值
  oldValue = effectFn()
}
```

最核心的改动是使用 `lazy` 选项创建了一个懒执行的 `effect`。最后一行我们手动调用副作用函数得到旧值，然后在调度其中获取再次执行副作用函数获取新值，并将新旧值传给回调函数，最后刷新旧值。

<p class="warn">注意，在这系列文章首篇就说过，这里的代码不等于源代码。我们知道实际开发过程中多数情况下是拿不到 oldValue 的(或者说拿到的值不准)。这是因为只有 watch 执行过一次才能拿到旧值，也就是说，只有设置了 immediate 为 true，立即执行一次才能确保后续拿到的 oldValue 是准确的，否则要另行判断。</p>

### watch 立即执行与回调执行

#### 立即执行

默认情况下，一个 watch 的回调只会在响应式数据发生变化时才会执行，在 Vue 中可以通过参数 `immediate` 来指定回调是否需要立即执行，我们来实现这个功能:

```js
function watch(source, cb, options = {}) {
  const getter = typeof source === 'function' ? source : () => traverse(source)
  let oldValue, newValue

  // 将回调函数执行逻辑抽离出来
  const job = () => {
    newValue = effectFn()
    cb(newValue, oldValue)
    oldValue = newValue
  }

  const effectFn = effect(
    () => getter(),
    {
      lazy: true,
      scheduler: job,
    }
  )
  
  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}
```

#### 回调执行

Vue 还允许配置项 `flush` 来指定回调函数的执行时机，例如:

```js
watch(obj, () => {
  console.log('变化了')
}, {
  flush: 'pre'  // 还可以指定 post | sync
})
```

这个也很简单，写在调度器里面:

```js
scheduler: () => {
  // post: 放到微任务队列中执行
  if (options.flush === 'post') {
    const p = Promise.resolve()
    p.then(job)
  } else {
    job()
  }
}
```

对于 `flush` 为 `pre` 的情形，还无法实现，因为涉及到组件更新时机。

### 过期副作用与竞态问题

我们知道在 `watch` 中是可以写异步逻辑的，例如:

```js
let finalData
watch(obj, async() => {
  const res = await fetch('/api/xxx')
  finalData = res
})
```

如果我们两次触发了 `obj` 更新，就会发送两个请求 A, B。假如恰好两次更新的时间间隔很短，我们无法准确判断是哪个请求先返回，如果 B 先于 A 返回，那么 `finalData` 的结果就会出错(没有拿到最新的数据)。

Vue 是这样解决这个问题的:

```js
watch(obj, async(newValue, oldValue, onInvalidate) => {
  // 一个标签，用于表示当前副作用函数是否过期
  let expired = false;
  onInvalidate(() => {
    expired = true
  })

  const res = await fetch('/api/xxx')
  if (!expired) {
    finalData = res
  }
})
```

发送请求前，定义 `expired` 标志来标识当前副作用函数的执行是否过期；接着调用 `onInvalidate` 函数注册一个过期回调，当该副作用函数的执行过期时将 `expired` 标志变量设置为 `true`。

接着我们看一下 Vue 的 `watch` 实现:

```js
function watch(source, cb, options = {}) {
  const getter = typeof source === 'function' ? source : () => traverse(source)
  let oldValue, newValue

  let cleanup // 储存用户过期的回调
  function onInvalidate(fn) { // 定义 onInvalidate 函数
    cleanup = fn
  }

  const job = () => {
    newValue = effectFn()
    if (cleanup) {  // 执行回调函数之前，调用过期回调
      cleanup()
    }
    cb(newValue, oldValue, onInvalidate)  // 将 onInvalidate 传参
    oldValue = newValue
  }
}
```

`onInvalidate` 只是将函数赋值给了 `cleanup`，然后在 `job` 函数中判断并执行 `cleanup` 函数。

由于我们在回调函数内调用了 `onInvalidate`，所以会注册一个过期回调。每次执行回调函数之前要先检查过期回调是否存在，如果存在，会优先执行过期回调。由于在watch的回调函数第一次执行的时候，我们已经注册了一个过期回调，所以在watch的回调函数第二次执行之前，会优先执行之前注册的过期回调，这会使得第一次执行的副作用函数内闭包的变量expired的值变为true，即副作用函数的执行过期了。