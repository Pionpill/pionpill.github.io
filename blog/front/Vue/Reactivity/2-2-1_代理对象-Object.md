---
difficulty: medium
type: note
pre: +/front/Vue/reactivity/2-1-3_计算属性与watch监听 /front/JavaScript/ECMAScript/2-5_常用对象-Proxy与Reflect /front/JavaScript/ECMAScript/1-1_基本对象-Object
rear: +/from/Vue/reactivity/2-2-2_代理对象-Array.md
---

# 代理对象-Object

<p class="tip">阅读本文前需要了解 ES6 的 Proxy 与 Reflect API。</p>

## 代理与反射

### 代理复合操作

`Proxy` 可以代理对象的基本语义。基本语义对应对象的十三个内部方法，例如 getter。 `Proxy` 提供的 `handler` 都属于基本语义拦截器。

与基本语义相对的叫复合操作，例如调用对象的某个函数，实际上这个过程包含两个基本语义操作：获取对象属性(`get`)，执行该属性(`call`)。知道这点后我们就可以用 `handler` 拦截对象属性的函数执行:

```js
const obj = {
  arrowFn: () => console.log('arrowFn'),
  fn() {console.log('commonFn')}
}

const proxy = new Proxy(obj, {
  get: (target, prop, receiver) => {
    console.log(prop)
    return target[prop];
  }
})

proxy.fn()  // fn commonFn
proxy.arrowFn() // arrowFn arrowFn
```

### Reflect 解决 this 指向问题

我们先前的响应式系统里有这样一段代码:

```js
get(target, key) {
  track(target, key);
  return target[key];
}
```

`target[key]` 会出一个经典的 `this` 指向问题，细节参考这篇文章: [Reflect 解决 this 指向问题](https://pionpill.github.io/blog/front/JavaScript/ECMAScript/2-5_%E5%B8%B8%E7%94%A8%E5%AF%B9%E8%B1%A1-Proxy%E4%B8%8EReflect#Reflect%E5%AE%9E%E9%99%85%E8%BF%90%E7%94%A8)。解决方案是使用如下代码替换 `target[key]`:

```js
get(target, key, receiver) {
  track(target, key);
  return Reflect.get(target, key, receiver);
}
```

为了避免类似的问题，下文所有的 get 方法都使用 `Reflect.get` 实现。

## 代理 Object

前面的文章中，已经实现了对象 `get` 操作的代理。但是通过 `Proxy` 的 `get` 拦截器代理的读取操作只是"一种"读取操作。以下操作也会设计的读取操作:
- `in`: 判断对象原型上是否存在给定的 key: `key in obj`
- `for...in`: 循环遍历对象

<p class="version">Vue2 使用 Object.definedProperty 实现响应式系统，因此没法监测上述操作，由于 Vue3 采用了 ES6 提供了权限 Proxy 和 Reflect API，新的响应式系统更加全面。</p>

回顾一下 ECMAScript 规定的对象的十三个内部方法，我们会发现 `Proxy` 也正好有十三个拦截器。这十三个拦截器与内部方法是一一对应的关系，因此，我们可以通过 `Proxy` 拦截器实现我们的需求:
- `in`: 通过 `has` 拦截器代理
- `for...in`: 通过 `ownKeys` 拦截器代理

此外，我们还可以监听删除操作，只需要通过 `deleteProperty` 拦截器代理即可。

## 合理地触发响应

我们的响应式系统还有一些细节要完善，例如当值没有发生变化时，应该不需要触发响应才对。这很简单，在 `set` 拦截器里面比较变化前后的值就可以了，但需注意 `NaN` 无法通过全等来判断，因此要另行判断处理。

我们封装一个 `reactive` 函数，为对象创建响应式数据:

```js
function reactive(obj) {
  return new Proxy(obj, {
    // xxx
  })
}
```

`reactive` 只是对 `Proxy` 进行了一层封装，我们创建一个例子:

```js
const obj = {}
const proto = { bar: 1 }
const child = reactive(obj)
const father = reactive(proto)

Object.setPrototypeOf(child, father)

effect(() => {
  console.log(child.bar) // 1
})
child.bar = 2
```

这个例子中我们设置了一个继承关系，并调用 `child` 的 getter, setter 方法。

在实际使用过程中，会触发两次响应式变化。这是因为，如果获取不到当前对象的某个属性时，会尝试在原型链上获取属性，这个过程会让 `child` 与 `father` 都被响应式监听，setter 过程同理触发两次副作用函数执行。

我们要屏蔽原型引起的更新，通过 `Proxy` 拦截器的 `target` 与 `receiver` 参数判断即可，`target` 始终表示原始对象，`receiver` 则是代理对象。我们在 `get` 拦截器中添加一句:

```js
get (target, key, receiver) {
  // 通过 raw 属性获取原始对象
  if (key === 'raw') {
    return target;
  }

  track(target, key);
  return Reflect.get(target, key, receiver);
}
```

<p class="tip">通过 raw 获取原始对象是有缺陷的，因为用户可能会自定义 raw 属性，更好的方式是通过定义一个 Symbol 属性</p>

这样我们就可以在 `set` 拦截器中判断 `receiver` 是否为 `target` 的代理对象了:

```js
set(target, key, newVal, receiver) {
  // 省略
  // 仅 receiver 是 target 的代理对象是触发
  if (target === receiver.raw) {
    if (oldVal !== newVal && (oldVal === oldVal || newVal=== newVal)) {
      trigger(target, key, type)
    }
  }
  // 省略
}
```

## 浅响应与深响应

目前我们实现的响应式监听是浅响应: 即只监听直接属性的变化。假设我们对如下对象进行监听:

```js
const obj = reactive({ foo: {bar: 1} });
obj.foo.bar = 2;
```

`obj.foo.bar = 2` 这个过程可以细分为如下步骤:
- get: `obj.foo`，由于 `obj` 是响应式对象，这个过程会被监听
- set: `foo.bar = 2`，此时 `foo` 对象并不是响应式对象，也就不会触发副作用函数

如果要递归建立响应式对象，在 `get` 拦截器中添加如下代码即可:

```js
get(target, key, receiver) {
  if (key === 'raw') {
    return target
  }
  track(target, key)
  
  // 判断值类型并建立响应式对象
  const res = Reflect.get(target, key, receiver)
  if (typeof res === 'obj' && res !== null) {
    return reactive(res)
  }
  return res
}
```

如果只需要监听直接属性，则不添加该功能即可，Vue3 的 `shallowReactive` 就只监听直接属性:

```js
function createReactive(obj, isShallow = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'raw') {
        return target
      }

      const res = Reflect.get(target, key, receiver);
      track(target, key);

      if (isShallow) {
        return res;
      }
      if (typeof res === 'object' && res !== null) {
        return reactive(res)
      }
      return res
    }
  })
}
```

```js
function reactive(obj) {
  return createReactive(obj);
}

function shallowReactive(obj) {
  return createReactive(obj, true)
}
```

## 只读和浅只读

我们希望一些数据是只读的，那么只需要拦截 `set` 和 `delete` 操作即可:

```js
function createReactive(obj, isShallow = false, isReadOnly = false) {
  return new Proxy(obj, {
    set(target, key, newVal, receiver) {
      if (isReadOnly) {
        console.warn(`属性 ${key} 是只读的`)
        return true
      }
      // ......
    },

    deleteProperty(target, key) {
      if (isReadOnly) {
        console.warn(`属性 ${key} 是只读的`);
        return true;
        // ......
      }
    }
  })
}
```

这样通过第三个参数，我们就实现了属性只读。同时当一个数据是只读时，也就没必要建立响应联系，因此，修改 `get` 拦截器:

```js
get(target, key, receiver) {
  // ......
  if (!isReadOnly) { 
    track(target, key)
  }
  // ......
}
```
最后我们封装一个方法:

```js
function readonly(obj) {
  return createReactive(obj, false, true)
}
```

目前实现的是浅只读，如果要实现深只读，还需要修改递归监听代码:

```js
get(target, key, receiver) {
  // ......
  const res = Reflect.get(target, key, receiver)
  // ......
  if (typeof res === 'object' && res !== null) { 
    return isReadOnly ? readonly(res) : reactive(res)
  }
  // ......
}
```

对应的浅只读方法如下:

```js
function shallowReadonly(obj) {
  return createReactive(obj, true, true)
}
```