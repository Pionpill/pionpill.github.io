---
difficulty: hard
type: origin
---

# Promise

手写 Promise 是很多大厂常考的题目，但网上的文章多数只给结果，不讲解原由，整的我很懵。因此这里我从 PromiseA+ 规范开始，了解 Promise 具体的行为准则，再使用 TS 手写一个 MyPromise 对象。阅读本文前需要了解 Promise 基础知识（不是入门文章哦）。

## PromiseA+ 规范

就像 JavaScript 语法都有对应的 ECMAScript 规范，Promise 的实现也必须满足一定的规范。目前采用的是 [PromiseA+规范](https://promisesaplus.com/)，先简单介绍一下这个规范。

### Promise 状态

`Promise` 必须处于以下三个状态之一：`pending`，`fulfilled`，`rejected`。后两个状态一旦确定，就不能再被改变。
- `pending`(待定): 表示未解决，可以转换为另外两种状态之一。
- `fulfilled`(兑现): 表示成功完成，必须存在一个 `value`，且这个 `value` 不能改变。
- `rejected`(拒绝): 表示未能完成，必须存在一个 `reason`，且这个 `reason` 不能改变。

这里的不可改变是指 "immutable identity"(原文)，例如通过 `===` 比较相同，但是并不要求内部状态不可变化。即下面例子是可行的：

```ts
const obj = { a: 1 };
let promise = Promise.resolve(obj);

promise.then((value) => {
    console.log(value === obj);
    value.a = 2; // 内部状态改变是可行的
});

setTimeout(() => console.log(obj)); // { a: 2 }
```

这里的逻辑很好理解，`Promise` 内部维护一个状态，初始值为 `pending`，可以转换为 `fulfilled`/`rejected`。对应内部维护 `value`/`reason`。

注意这样一段代码：

```ts
new Promise((resolve, reject) => {
    console.log('111')
    resolve(1);
    console.log('222')
    reject(2);
    console.log('333')
})
```

最终三个 `log` 都会打印，`new Promise` 会同步执行，并不会因为执行了 `resolve`/`reject` 而停止或返回。但是，第一个 `resolve(1)` 执行之后，`Promise` 的状态就被改为 `fulfilled` 了，第二个 `reject(2)` 并没有任何意义（写与不写没有区别）。

### then 方法

`Promise` 必须提供一个 `then` 方法去获取当前的 `value` 或者 `reason`。`then` 函数声明必须为:

```ts
promise.then(onFulfilled, onRejected)
```

- `onFulfilled`, `onRejected` 都是可选的参数，如果他们不是函数，那么忽略。
- 如果 `onFulfilled`/`onRejected` 是函数，必须符合如下规则：
  - 必须在 `Promise` 状态变为 `fulfilled`/`rejected` 之后被调用，并且 `value`/`reason` 作为第一个参数。
  - 状态变更之前，不允许调用。
  - 不允许调用多次。
- `onFulfilled`/`onRejected` 必须等到执行上下文只存在 `platform code` 时调用（说人话：放入微任务队列）。
- `onFulfilled`/`onRejected` 回调函数在调用时的上下文（`this`值）应该是`undefined`，而不是指向某个特定的对象。
- `then` 可以被同一个 `promise` 多次调用，当状态变为 `fulfilled`/`rejected` 后，相关的回调函数必须依此执行。
- `then` 必须返回一个 `promise`:
  ```ts
  promise2 = promise1.then(onFulfilled, onRejected);
  ```
  - 如果 `onFulfilled`/`onRejected` 返回一个值 `x`，那么交给 `[[Resolve]](promise2, x)` 方法处理
  - 如果 `onFulfilled`/`onRejected` 抛出了错误 `e`，那么 `promise2` 必须以 `e` 为 `reason` 被 `reject` 掉。
  - 如果 `onFulfilled`/`onRejected` 不是函数，并进入了对应的状态，那么 `promise2` 对应的 `value`/`reason` 必须与 `promise1` 相同

这里逻辑很多，我归纳一下：
- `onFulfilled`/`onRejected` 一般为可选函数，且将内部维护的 `value`/`reason` 作为第一个参数，只有状态更改为 `fulfilled`/`rejected` 后才会在微任务中执行依此执行。
- `onFulfilled`/`onRejected` 如果不是函数，那么返回新 `promise2` 的 `value`/`reason` 必须与原来的相同。
- `onFulfilled`/`onRejected` 如果执行出错，那么 `reject` 掉，并将错误作为 `reason`
- `onFulfilled`/`onRejected` 如果返回新值 `x`，那么使用 `[[Resolve]](promise2, x)` 方法处理
- `then` 方法可以被调用多次，并且必须返回一个 `promise`（实测返回的新 `promise2` 并不是原先的 `promise1`）。

这段没什么特别要注意的，都是常规操作步骤，两个回调函数 `onFulfilled`/`onRejected` 如果执行出错，就 `reject` 掉错误原因 `e`。

### [[Resolve]] 方法

`[[Resolve]]` 方法是一个规范中定义的内部隐藏方法，用于处理 `onFulfilled`/`onRejected` 为函数且有返回值 `x` 的情形：`[[Resolve]](promise, x)`。其中 `promise` 表示返回的新 `Promise` 对象（规范讲的比较复杂，我这里简要说明）。

- 如果 `x === promise`，`reject` 掉：`TypeError`。（即不能返回新的 `promise`，否则会无限递归返回，想想什么情况下出现这种情形）
- 如果 `x` 是一个 `Promise`，采用它的 `state`（指状态与对应的 `value`/`reason`）并继续之前的逻辑。
  ```ts
  const promise1 = Promise.resolve("value");
  const promise2 = promise1.then(() => Promise.reject("reason"));
  promise2.then(
      (data) => console.log(data), // 不执行
      (err) => console.log(err) // 打印 reason
  );
  ```
- 如果 `x` 不是一个对象/函数。`resolve(x)`
- 如果 `x` 是一个对象/函数（很少遇到这种情形）
  - `let then = x.then`，如果这个过程出错，`reject` 掉。
  - 如果 `then` 是一个方法（认为它是一个 `Promise.then` 方法），执行 `then.call(x, m => [[Resolve]](m), n => reject(n))` 规则与常规 `Promise` 类似，出错则 `reject` 掉。
  - 如果 `then` 不是一个方法，`resolve(x)`

这部分逻辑主要处理了几种非常见情形，总而言之执行出错则多半需要 `reject` 异常。

## 手写 Promise

<p class="tip">下文使用 TypeScript 5.3.2 声明。2024 年应该都写 TS 了吧</p>

### 手写构造函数

了解上面规则后，开始手写，首先了解一下 `new Promise` 的声明：

```ts
PromiseConstructor new <unknown>(
  executor: (
    resolve: (value: unknown) => void, 
    reject: (reason?: any) => void
  ) => void
) => Promise<unknown>
```

我们仿照 `PromiseConstructor` 做一些准备工作，并写出基本的 `resolve`, `reject` 逻辑：

```ts
type ResolveFunction<T> = (value: T) => void;
type RejectFunction = (reason: any) => void;

class MyPromise<T> {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    // 设置初始值
    private state = MyPromise.PENDING;
    private value: T | undefined;
    private reason: any;

    constructor(executor: (resolve: ResolveFunction<T>, reject: RejectFunction) => void) {
        // 根据规范，有异常就 reject
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e);
        }
    }

    // 注意这里不是静态的 resolve/reject 方法哦
    private resolve = (value: T) => {
        // 如果状态不为 pending，则跳过
        if (this.state !== MyPromise.PENDING) return;
        this.state = MyPromise.FULFILLED;
        this.value = value;
    }

    private reject = (reason: any) => {
        if (this.state !== MyPromise.PENDING) return;
        this.state = MyPromise.REJECTED;
        this.reason = reason;
    }

    // 静态方法顺便加上
    static resolve<T>(value: T) {
        // 注意如果是 MyPromise 实例直接返回
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise<T>((resolve) => resolve(value));
    }

    static reject(reason: any) {
        return new MyPromise((_, reject) => reject(reason))
    }
}
```

目前为止非常简单：
- `resolve`/`reject` 方法修改内部维护的状态以及对应的 `value`/`reason`
- `executor` 方法传入 `resolve`/`reject` 并执行
  - 注意碰到异常就 `catch`
  - 如果状态已经改变，那么再次遇到 `resolve`/`reject` 方法会跳过

### 手写 then

然后我们来处理 `then` 逻辑，先看一下其中一种函数声明（回调函数返回值可以是任意类型）:

```ts
Promise<never>.then<void, void>(
  onfulfilled?: ((value: never) => void | PromiseLike<void>) | null | undefined, 
  onrejected?: ((reason: any) => void | PromiseLike<void>) | null | undefined
): Promise<...>
```

规范中有提到过：`onFulfilled`/`onRejected` 可以是多种类型。只有转换为对应的状态后，才会依此调用回调函数。考虑到 `then` 可以链式调用，回调函数需要依此执行，因此我们设计一个 `Array` 容器装入回调函数：

```ts
// 演示用 unknown，实际上有多个 interface 重载
type OnFulfilledCallback<T> = (value: T) => unknown;
type OnRejectedCallback = (reason: any) => unknown;

class MyPromise<T> {
    private onFulfilledCallbacks: OnFulfilledCallback<T>[] = [];
    private onRejectedCallbacks: OnRejectedCallback[] = [];

    private resolve = (value: T) => {
        if (this.state !== MyPromise.PENDING) return;
        this.state = MyPromise.FULFILLED;
        this.value = value;
        // 依此执行回调
        this.onFulfilledCallbacks.forEach(cb => cb && cb(value));
    };

    private reject = (reason: any) => {
        if (this.state !== MyPromise.PENDING) return;
        this.state = MyPromise.REJECTED;
        this.value = reason;
        this.onRejectedCallbacks.forEach((cb) => cb && cb(reason));
    };


    then(
        onFulfilled?: OnFulfilledCallback<T>,
        onRejected?: OnRejectedCallback
    ) {
        // 如果不是函数，执行原来的逻辑
        const realOnFulfilled =
            typeof onFulfilled === "function"
                ? onFulfilled
                : (value: T) => value;
        const realOnRejected =
            typeof onRejected === "function"
                ? onRejected
                : (reason: any) => {
                      throw reason;
                  };

        const promise2 = new MyPromise<T>((resolve, reject) => {
            // 如果没传就不用执行
            const fulfilledCb = onFulfilled ? () => {
                // 放到微任务去执行
                queueMicrotask(() => {
                    try {
                        const x = realOnFulfilled(this.value as T);
                        // [[Resolve]] 方法
                        MyPromise.InnerResolve(promise2, x, resolve, reject);
                    } catch (e) {
                        // 错误捕获
                        reject(e);
                    }
                });
            } : null;
            const rejectedCb = onRejected ? () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnRejected(this.reason);
                        MyPromise.InnerResolve(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            } : null;
            // 规范，状态非 pending 才执行
            switch (this.state) {
                case MyPromise.FULFILLED:
                    fulfilledCb && fulfilledCb();
                    return;
                case MyPromise.REJECTED:
                    rejectedCb && rejectedCb();
                    return;
                case MyPromise.PENDING:
                    fulfilledCb && this.onFulfilledCallbacks.push(fulfilledCb);
                    rejectedCb && this.onRejectedCallbacks.push(rejectedCb);
            }
        });
        return promise2;
    }
}
```

手写 `then` 有几个注意点：
- 判断传进来的回调类型，如果不是函数需要返回原始状态。
- 回调函数需要放在微任务队列中执行，需要捕获异常
- 最后的执行需要判断状态

### 手写 [[Resolve]]

一般情况下面试不会要求手写 `[[Resolve]]`，这块逻辑不常用，可以直接 `resolve(x)`，这里手写一下仅作了解:

```ts
  static InnerResolve<T>(
      promise: MyPromise<T>,
      x: unknown,
      resolve: ResolveFunction<T>,
      reject: RejectFunction
  ) {
      // 如果是 Promise 实例
      if (x instanceof MyPromise) {
          // 避免循环调用
          if (promise === x) {
              return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
          }
          // 用新的 Promise
          x.then(resolve, reject);
      }
      if (typeof x === "function" || typeof x === "object") {
          if (x === null) {
              return resolve(null as T); // 偷懒
          }
          // 下面都是处理一种很特殊的情形，x.then 存在且为函数，就认为需要执行
          const realX = x as any; // 跳过静态检测，不然很难写
          let then;
          try {
              then = realX.then;
          } catch (e) {
              reject(e);
          }
          if (typeof then === 'function') {
              let called = false; // 保证仅有一个被调用
              try {
                  then.call(
                      x,
                      (value: T) => {
                          if (called) return;
                          called = true;
                          MyPromise.InnerResolve(promise, value,resolve, reject);
                      },
                      (reason: any) => {
                          if (called) return;
                          called = true;
                          reject(reason);
                      }
                  )
              } catch (e) {
                  reject(e);
              }
          }
      } else {
          // 其实这种才是最常见的，直接 resolve
          resolve(x as T);
      }
  }
```

面试手写基本不会让实现 `[[Resolve]]`，直接走最常见的 `resolve(x)` 逻辑即可。最后我们实现一下 `catch` 和 `finally`:

```ts
// catch 本质上就是删减版的 then
catch(onRejected: OnRejectedCallback) {
    this.then(undefined, onRejected);
};

finally(onFinally: () => void) {
    // 1. 第一个 then 保证执行顺序与时机
    // 2. 第二个 then 还是返回原来的逻辑
    return this.then(
        (value) =>
            MyPromise.resolve(
                typeof onFinally === "function" ? onFinally() : onFinally
            ).then(() => value),
        (reason) =>
            MyPromise.resolve(
                typeof onFinally === "function" ? onFinally() : onFinally
            ).then(() => {
                throw reason;
            })
    );
}
```

## 常见误区

归纳一下常见的误区与面试考点：
- `promise` 状态是不可变的，但是 `then`/`catch` 返回的是新的 `promise`：
    ```ts
    const promise = Promise.reject("reason");
    promise
        .catch((reason) => {
            console.log(reason);    // reason
            return "1";
        })
        .then((value) => console.log(value)); // 1
    ```
    由于 `catch` 之后有返回值（只要 `then` 中有返回值），那么就会返回一个 `resolve(value)` 的新 `Promise` 对象。即 `then` 返回的 `promise2` 不是原来的 `promise`。
- 同一个 `promise` 状态始终不变，可以多次调用：
    ```ts
    const promise = Promise.reject("reason");
    promise
        .catch((reason) => {
            console.log(reason);    // reason
            return "1";
        })
        .then((value) => console.log(value));   // 1
    promise.catch((reason) => console.log(`second ${reason}`))  // second reason
    ```
    这里的 `promise` 即使执行过 `catch`/`then` 也不会改变自身内部的状态，因此第二次 `catch` 仍然会返回最原始的内部状态

## 完整代码 

```ts
type ResolveFunction<T> = (value: T) => void;
type RejectFunction = (reason: any) => void;

type OnFulfilledCallback<T> = (value: T) => unknown;
type OnRejectedCallback = (reason: any) => unknown;

class MyPromise<T> {
    static PENDING = "pending";
    static FULFILLED = "fulfilled";
    static REJECTED = "rejected";

    private state = MyPromise.PENDING;
    private value: T | undefined;
    private reason: any;

    private onFulfilledCallbacks: OnFulfilledCallback<T>[] = [];
    private onRejectedCallbacks: OnRejectedCallback[] = [];

    constructor(
        executor: (resolve: ResolveFunction<T>, reject: RejectFunction) => void
    ) {
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e);
        }
    }

    private resolve = (value: T) => {
        if (this.state !== MyPromise.PENDING) return;
        this.state = MyPromise.FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((cb) => cb && cb(value));
    };

    private reject = (reason: any) => {
        if (this.state !== MyPromise.PENDING) return;
        this.state = MyPromise.REJECTED;
        this.value = reason;
        this.onRejectedCallbacks.forEach((cb) => cb && cb(reason));
    };

    static resolve<T>(value: T) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise<T>((resolve) => resolve(value));
    }

    static reject(reason: any) {
        return new MyPromise((_, reject) => reject(reason));
    }

    then(
        onFulfilled?: OnFulfilledCallback<T>,
        onRejected?: OnRejectedCallback
    ) {
        const realOnFulfilled =
            typeof onFulfilled === "function"
                ? onFulfilled
                : (value: T) => value;
        const realOnRejected =
            typeof onRejected === "function"
                ? onRejected
                : (reason: any) => {
                      throw reason;
                  };

        const promise2 = new MyPromise<T>((resolve, reject) => {
            const fulfilledCb = onFulfilled
                ? () => {
                      queueMicrotask(() => {
                          try {
                              const x = realOnFulfilled(this.value as T);
                              MyPromise.InnerResolve(
                                  promise2,
                                  x,
                                  resolve,
                                  reject
                              );
                          } catch (e) {
                              reject(e);
                          }
                      });
                  }
                : null;
            const rejectedCb = onRejected
                ? () => {
                      queueMicrotask(() => {
                          try {
                              const x = realOnRejected(this.reason);
                              MyPromise.InnerResolve(
                                  promise2,
                                  x,
                                  resolve,
                                  reject
                              );
                          } catch (e) {
                              reject(e);
                          }
                      });
                  }
                : null;
            switch (this.state) {
                case MyPromise.FULFILLED:
                    fulfilledCb && fulfilledCb();
                    return;
                case MyPromise.REJECTED:
                    rejectedCb && rejectedCb();
                    return;
                case MyPromise.PENDING:
                    fulfilledCb && this.onFulfilledCallbacks.push(fulfilledCb);
                    rejectedCb && this.onRejectedCallbacks.push(rejectedCb);
            }
        });
        return promise2;
    }

    catch(onRejected: OnRejectedCallback) {
        return this.then(undefined, onRejected);
    }

    finally(onFinally: () => void) {
        return this.then(
            (value) =>
                MyPromise.resolve(
                    typeof onFinally === "function" ? onFinally() : onFinally
                ).then(() => value),
            (reason) =>
                MyPromise.resolve(
                    typeof onFinally === "function" ? onFinally() : onFinally
                ).then(() => {
                    throw reason;
                })
        );
    }

    static InnerResolve<T>(
        promise: MyPromise<T>,
        x: unknown,
        resolve: ResolveFunction<T>,
        reject: RejectFunction
    ) {
        if (x instanceof MyPromise) {
            if (promise === x) {
                return reject(
                    new TypeError(
                        "Chaining cycle detected for promise #<Promise>"
                    )
                );
            }
            x.then(resolve, reject);
        }
        if (typeof x === "function" || typeof x === "object") {
            if (x === null) {
                return resolve(null as T); // 偷懒
            }
            const realX = x as any; // 跳过静态检测，不然很难写
            let then;
            try {
                then = realX.then;
            } catch (e) {
                reject(e);
            }

            if (typeof then === "function") {
                let called = false;
                try {
                    then.call(
                        x,
                        (value: T) => {
                            if (called) return;
                            called = true;
                            MyPromise.InnerResolve(
                                promise,
                                value,
                                resolve,
                                reject
                            );
                        },
                        (reason: any) => {
                            if (called) return;
                            called = true;
                            reject(reason);
                        }
                    );
                } catch (e) {
                    reject(e);
                }
            }
        } else {
            resolve(x as T);
        }
    }
}
```