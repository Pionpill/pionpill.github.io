---
difficulty: hard
type: origin
pre: /front/JavaScript/ECMAScript-Advance/4-1_Promise-规范与手写
---

# Promise 静态方法

这节手写几个 `Promise` 静态方法，注意 PromiseA+ 规范并不涉及这几个静态方法，这里只考虑最常见的情形，其他情形类比 PromiseA+ 规范推断即可。

## Promise.all

`Promise.all` 接受一个 `Promise` 可迭代对象作为输入，异步执行并返回一个新的 `Promise`:
- 如果所有的 `Promise` 都最终变成 `fulfilled` 状态，那么按顺序返回 `value` 组成的数组。
- 如果任一 `Promise` 变成 `rejected` 状态，则返回一个状态为 `rejected` 的 `Promise` 对象。 

需要注意的一点是要求按顺序返回，因此需要借助 `index` 确保顺序。

```ts
const promiseAll = <T>(promises: Array<Promise<T> | T>) => {
    return new Promise<T[]>((resolve, reject) => {
        let count = 0;
        const fulfilledArray: Array<T> = new Array(promises.length);

        promises.forEach((promise, index) => {
            if (promise instanceof Promise) {
                promise.then(
                    (value) => {
                        count += 1;
                        fulfilledArray[index] = value;
                        if (count === promises.length) {
                            resolve(fulfilledArray);
                        }
                    },
                    (reason) => {
                        reject(reason);
                    }
                );
            } else {
                count += 1;
                fulfilledArray[index] = promise;
            }
        });
    });
};
```

## Promise.allSettled

`Promise.allSettled` 作用和 `Promise.all` 类似，区别如下：
- 无论 `promise` 成功或失败，都加入返回数组。
- 返回数组的元素是一个对象，包含 `status` 状态，以及 `value`/`reason` 具体的值。

```ts
type FulfilledResult<T> = { value: T; status: "fulfilled" };
type RejectedResult = { reason: any; status: "rejected" };
type PromiseResult<T> = FulfilledResult<T> | RejectedResult;

const promiseAllSettled = <T>(promises: Array<Promise<T> | T>) => {
    return new Promise((resolve) => {
        const resultArray: Array<fulfilledResult<T> | rejectedResult> =
            new Array(promises.length);
        let count = 0;

        const handleFinfish = () => {
            count++;
            if (count === promises.length) {
                resolve(resultArray);
            }
        };

        promises.forEach((promise, index) => {
            if (promise instanceof Promise) {
                promise.then(
                    (value) => {
                        resultArray[index] = { status: "fulfilled", value };
                        handleFinfish();
                    },
                    (reason) => {
                        resultArray[index] = { status: "rejected", reason };
                        handleFinfish();
                    }
                );
            } else {
                resultArray[index] = { status: "fulfilled", value: promise };
            }
        });
    });
};
```

## Promise.any

这个就是 `Promise.all` 的反向操作，任一 `promise` 兑现时，返回这个 `promise`，所有都拒绝的话，返回包含拒绝原因数组的 `AggregateError` 拒绝。

```ts
const promiseAny = <T>(promises: Array<Promise<T> | T>) => {
    return new Promise((resolve, reject) => {
        let count = 0;
        const resultArray: Array<any> = new Array(promises.length);
        promises.forEach((promise, index) => {
            if (promise instanceof Promise) {
                promise.then(
                    (value) => resolve(value),
                    (reason) => {
                        resultArray[index] = reason;
                        count++;
                        if (count === promises.length) {
                            reject(resultArray)
                        }
                    }
                )
            } else {
                return resolve(promise);
            }
        })
    })
}
```

## Promise.race

这个最简单，任一 `promise` 兑现时，返回一个包含兑现结果的 `Promise`:

```ts
const promiseRace = <T>(promises: Array<Promise<T> | T>) => {
    return new Promise((resolve, reject) => {
        promises.forEach((promise) => {
            if (promise instanceof Promise) {
                promise.then(
                    (value) => resolve(value),
                    (reason) => reject(reason),
                )
            } else {
                return resolve(promise);
            }
        }); 
    })
}
```

四个静态方法就写完了。实际使用中传入的 `promises` 一般是可迭代对象 `Iterable<Promise<T> | T>`，使用 `for...of` 转换为数组即可。