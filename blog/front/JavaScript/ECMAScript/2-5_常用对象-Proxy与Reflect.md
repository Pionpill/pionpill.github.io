---
difficulty: medium
type: organize
---

# Proxy 与 Reflect

## Proxy

> 浏览器兼容性: [caniuse](https://caniuse.com/?search=Proxy)  
> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

### 作用

Proxy 的意思是代理，它可以封装某一个对象并提供方法拦截操作，例如拦截 getter，setter，apply 等。

<p class="discuss">类似于 Python 的特殊方法 (什么类似，抄袭😡!)；和 Java 的反射，TS 的装饰器作用上有异曲同工之处。</p>

使用 `Proxy` 的方式是 `new` 一个代理对象，看一下构造函数的原型:

```ts
// 使用方式
const p = new Proxy({}, {/* ... */})
// 函数声明
new <T extends object>(target: T, handler: ProxyHandler<T>): T;
```

`Proxy` 接收两个参数:
- `target`: 被代理的对象
- `handler`: 处理器，可以理解为一个配置项，键为需要拦截的操作，值为拦截方法

```ts
const ori = { a: 1 }

const p = new Proxy(ori, {
    get: (target, p, receiver) => {
        return p === "a" ? "a" : receiver[p];
    }
})

console.log(ori.a)  // 1 原对象不受影响
console.log(p.a)    // a 代理对象走自定义 getter 逻辑
```

### 拦截器

拦截器中可拦截的操作众多，拦截方法被称作 trap(捕获器)，捕获器一般可以收这几个参数:
- `target`: 被代理的对象
- `receiver`: 代理对象(或继承自代理对象的对象)
- `p`: 传入的属性键值

看一下有代表性的几个捕获器:

```ts
interface ProxyHandler<T extends object> {
    // 拦截代理对象的 getter 操作
    get?(target: T, p: string | symbol, receiver: any): any;

    // 拦截代理对象的 setter 操作
    set?(target: T, p: string | symbol, newValue: any, receiver: any): boolean;

    // 拦截 in 操作符
    has?(target: T, p: string | symbol): boolean;

    // 拦截 Reflect.ownKeys 方法
    ownKeys?(target: T): ArrayLike<string | symbol>;

    // 拦截 Object.defineProperty 方法
    defineProperty?(target: T, property: string | symbol, attributes: PropertyDescriptor): boolean;
}
```

可以看到拦截器不仅可以拦截原对象本身的方法，还可以拦截 JS 的 `in`, `new` 等操作符，也可以拦截 `Object`, `Reflect` 的一些静态方法。

## Reflect

> 浏览器兼容性: [caniuse](https://caniuse.com/?search=javascript%20Reflect)  
> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)  
> 发布版本: ES2015

### 作用

`Reflect` 是一个内置对象，提供拦截 JS 操作的方法。`Reflect` 只有静态属性和方法，且它的静态方法名和 `Proxy` 拦截器方法名相同。

`Reflect` 提供的所有 API 都有替代的写法，引入 `Reflect` API 更多地是为了实现代码统一化与标准化。使用 `Reflect` 与使用旧方法相比有如下不同:
- `Reflect` 对象可以拿到语言内部的方法，而无需再操作原型链。
- `Reflect` 部分方法执行失败时会返回 `false`，而不是抛错。
- `Reflect` 会让代码更倾向于函数式编程，面向对象编程，而不是命令式编程。
- `Reflect` 和 `Proxy` 对象的方法一一对应。

### 静态方法

看一下有代表性的几个静态方法:

```ts
declare namespace Reflect {
    // 等效于 Object.defineProperty
    function defineProperty(target: object, propertyKey: PropertyKey, attributes: PropertyDescriptor & ThisType<any>): boolean;

    // 等效于 Object.deleteProperty，key 不存在是不会抛错，会返回 false
    function deleteProperty(target: object, propertyKey: PropertyKey): boolean;

    // 等效于 object['key'], object.key 但是可以处理代理对象的拦截等特殊情形，第三个参数可以解决 this 指向问题
    function get<T extends object, P extends PropertyKey>(
        target: T,
        propertyKey: P,
        receiver?: unknown,
    ): P extends keyof T ? T[P] : any;

    // 等效于 propertyKey in target
    function has(target: object, propertyKey: PropertyKey): boolean;
}
```

总而言之，在 `Proxy` 中尽量使用 `Reflect` 操作，可以解决很多复杂场景下的 this 指向，ts 报错等问题。

### Reflect 实际运用

#### Reflect 解决 ts 报错

我们来看这样一段 ts 代码:

```ts
const ori = { a: 1 };

const p = new Proxy(ori, {
    get: (target, p, receiver) => {
        return p === "a" ? "a" : receiver[p];   // 1. 从 receiver 上拿属性
        return p === "a" ? "a" : target[p];     // 2. 从 target 上拿属性
        return p === "a" ? "a" : Reflect.get(target, p);    // 3. 用 Reflect 从 target 上拿属性
    },
});

console.log(p.a)
```

猜猜哪个 return 语句能在 ts 环境下正确返回(第一个肯定行，因为上面的例子我就是这样写的😅)。答案是第二个报错，其他都能正常通过。报错如下:

```bash
error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ a: number; }'.
  No index signature with a parameter of type 'string' was found on type '{ a: number; }'.
```

我们来分析一下走第二条 `return` 语句的 ts 类型:
- 首先 `const ori = { a: 1 }`，此时 `ori` 对象可以索引的键只有一个: `a`，如果传入其他键会报错。
- 走到 `return` 语句这里，获取 `target[p]` 时，`p` 的类型是 `string | symbol`，这是在 `Proxy` 的函数声明中定义的。
- 此时 `p` 的类型并不满足 `ori` 对象的索引条件，因为它不一定是 `a`，所以抛错。

那么为什么其他的 `return` 语句走得通呢:
- 第一条，从 `Proxy` 的 getter 函数声明中得知: `receiver` 是 `any` 类型，因此可以走通。
- 第三条，从 `Reflect.get` 函数声明中得知，传入的第一个参数 `target` 类型为: `T extends object`，因此在 `Reflect.get` 函数执行过程中并不认为 `target` 只有 `a` 可以作索引。并且返回值也很清楚: `P extends keyof T ? T[P] : any` 只有 `key` 可索引是才返回 `T[P]`。

总的来说，`Reflect.get` 一定程度上弱化了对象的键索引类型。

如果一定要让第二条 `return` 语句走通，可以手动指定 `ori` 的类型:

```ts
const ori: Record<string | symbol, any> = { a: 1 };
```

相等于这一步 `Reflect.get` 帮我们做了。

#### Reflect 解决 this 指向

> 参考自一个问题: [ES6的Proxy中，为什么推荐使用Reflect.get而不是target[key]？](https://juejin.cn/post/7050489628062646286)

注意，下面代码是 js 写的，ts 写的话根本走不通:

```js
const ori = {
    _name: "people",
    get name() {
        return this._name;
    },
};

const People = new Proxy(ori, {
    get: (target, prop, receiver) => target[prop],
});

let Man = { _name: 'man' }
Object.setPrototypeOf(Man, People)
console.log(Man._name) // man
console.log(Man.name) // people
```

这个很好理解，拿 `name` 的时候，自己身上没有，就去原型链上找，原型链上 `this` 指向 `ori` 的 `_name` 属性，所以返回 `people`。

如果我想要让子类的属性覆盖呢，即 `Man.name` 返回 `man`，通过 `Reflect` 可以非常方便地实现:

```js
get: function (target, prop, receiver) {
    return Reflect.get(target,prop,receiver);
}
```

我们把 `get` 捕获器的第三个参数 `receiver` 传给 `Reflect.get` 就可以了。`receiver` 会让 `this` 指向调用者，此时拿 `name` 就会指向 `receiver`。