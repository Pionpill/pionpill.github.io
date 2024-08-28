---
difficulty: medium
type: origin
---


# setInterval 优化方案

## setInterval 的缺陷

说明 `setInterval` 缺陷之前，需要了解两个重要的前置概念：
- JS是单线程的。
- 浏览器事件循环机制。

简要概括浏览器事件循环机制：每次循环从取出一个宏任务并执行，过程中如果遇到微任务，则将微任务放进微任务队列，等待宏任务执行完成后，再依此执行微任务。

<p class="warn">setInterval 本质上是确定时间将回调函数加入到任务队列中，而不是何时执行回调函数。真正执行回调函数的时间是不确定的，取决于事件循环机制，如果此时有其他耗时任务未处理完，那么不会取出定时任务执行。</p>

`setInterval` 将回调函数加入到任务队列的完整逻辑如下：
- 事件线程进行计时，直到到达间隔时间
- 在任务队列中查询是否已经存在该定时器
  - 如果存在，则跳过
  - 如果不存在，将回调函数添加到任务队列中
- 直到 `clearInterval` 取消定时执行

因此这里存在一些问题：
- 无法保证每次都是间隔固定的时间执行任务（单线程导致）
- 如果某些任务过长，某些间隔的任务可能会被直接跳过（机制导致）

<p class="discuss">关于跳过任务这点，个人认为这不是一种设计上的缺陷，在很多场景下（例如首屏渲染）我们的确不需要定时任务一定执行，JS 是单线程的，无法预见执行栈的任务合适做完，适当抛弃过时的任务也是一种优化策略。</p>

## setTimeout 实现 setInterval

一道经典面试题，直接给结果：

```ts
const mSetInterval = (callBack: (...args: any[]) => void, delay: number, ...args: any[]) => {
  let timeId: number = 0;
  const func = () => {
    callBack(...args);
    timeId = setTimeout(func, delay);
  }
  timeId = setTimeout(func, delay);
  return () => clearTimeout(timeId)
}
```

`setTimeout` 的机制和 `setInterval` 类似：定时将任务添加到任务队列中。但是 `setTimeout` 不会检查任务队列中是否已经存在任务，因为它不需要定时处理，它只注入一次。我们的代码中每次都是新的 `timeout` 任务。

这样从机制上解决了 `setTimeout` 跳帧的问题，但是这两个 API 有一些共性问题：
- 他们都有一个最小时间，一般是 4ms。
- 他们都受事件循环机制的约束，如果任务队列中还有前置任务要处理，那么他们必须延后执行。

此外，用户显示屏一般是 60 帧，一帧也就是 16.6ms，不同的显示器刷新频率不同，在一帧中，浏览器除了执行 JS 任务，还要解析 HTML，CSS 任务。因此具体的任务执行时间是不确定的。而且由于浏览器精度问题，如果一个定时任务执行了很长时间（例如几天），那么这些小的时间精度问题就会积累起来，导致后续任务执行时机出错。

## requestAnimatedFrame

`requestAnimatedFrame` 是浏览器提供的一个用于绘制动画的 API，它会在浏览器每次重绘时调用（每帧会调用一次），具体的执行时机如下：

![帧时间](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2Fframe.svg)

`requestAnimatedFrame` 有两个很牛逼的特性：
- 每帧都会调用（只要有新的任务）
- 不受事件循环机制约束，它在帧渲染过程中会优先执行，即使任务队列中还有其他任务

因此我们可以这样实现（简单实现，可以改进的地方很多）:

```ts
const frameSetInterval = (callBack: (...args: any[]) => void, delay: number, ...args: any[]) => {
  let startTime = performance.now()
  let taskId = 0;

  const func = () => {
    const currentTime = performance.now();
    if (currentTime - startTime > delay) {
      callBack(...args);
      startTime += delay; // 很多文章喜欢写 startTime = currentTime 这样会造成误差
    }
    taskId = requestAnimationFrame(func);
  }
  requestAnimationFrame(func);

  return () => cancelAnimationFrame(taskId);
}
```

但他也有缺点：
- 无法保证具体执行时间：由于帧执行时机的问题会有几ms的偏差，但这个偏差不会累加。
- 帧丢失的情况下，不会调用该 API。

## worker 线程

即使是 `requestAnimatedFrame`，还是没法解决 JS 单线程的问题：如果浏览器有长任务，导致帧丢失，例如一个 160ms 的任务，使用了 10 帧来渲染，那么就有 9 帧不会调用 `requestAnimatedFrame`。这类问题的唯一的解决方案是：多线程。

给个简单的例子:
```ts
// 主文件，vite 打包项目
import TaskWorker from "./worker.ts?worker";
const worker = new TaskWorker();
worker.onmessage = (event: any) => console.log(event.data)
worker.postMessage({ data: 'data' })
```

```ts
// worker 线程
const func = (data: any) => {
    // 具体执行逻辑，这里给的很简单
    return '1'
}

self.onmessage = (event) => {
    setInterval(() => {
        const result = func(event.data)
        self.postMessage(result);
    }, 100)
}
```

使用 worker 线程的好处如下:
- 它基本能保证在间隔时间内执行完你的逻辑，如果不能那么你需要想办法将复杂任务拆分了。
- 不会受主线程任务影响，也不会影响主线程任务，不用担心任务队列中还有其他任务。

但是 worker 线程仍然时有缺点的：
- 主要缺点：无法解决 `setInterval`，`setTimeout` 时间精度导致的误差问题
- 无法调用 `requestAnimatedFrame` 方法

## 终极方法

如果项目一定需要你：
- 长时间仍然保证定时器不出现精度问题
- 任务一定要定时执行，不会被事件循环中其他任务阻塞导致延期或丢失

那么就只能：`requestAnimatedFrame` + worker（取两者的优点）:

```ts
import TaskWorker from "./worker.ts?worker";

const worker = new TaskWorker();
worker.onmessage = (event: any) => console.log(event.data)

const frameSetInterval = (delay: number, ...args: any[]) => {
  let startTime = performance.now()
  let taskId = 0;

  const func = () => {
    const currentTime = performance.now();
    if (currentTime - startTime > delay) {
      // 任务放到 worker 线程中去处理
      worker.postMessage({ data: {...args} })
      startTime += delay;
    }
    taskId = requestAnimationFrame(func);
  }

  requestAnimationFrame(func);
  return () => cancelAnimationFrame(taskId);
}
frameSetInterval(1000);
```

```ts
const func = (data) => {
  // 执行具体函数
  return performance.now()
}

self.onmessage = (event) => {
  const result = func(event.data);
  self.postMessage(result);
}
```

这样就形成了一个相对完善的解决方案：
- 不会出现累计的时间误差
- 不会因为主线程其他任务阻塞worker线程任务

但也有几个缺陷：
- 由于 `requestAnimatedFrame` 执行时机的问题，具体执行时间会有几毫秒的误差，但这个误差不会累积。
- 无法将无法序列的参数传递到 worker 线程，例如函数，当然可以转换为字符串再用不安全的 `eval` 执行。

总而言之，本文给出了几个 API 的具体执行逻辑以及一些应用场景，具体如何执行则需要开发者根据时机场景决定。也许可以结合这些 API 写一套更复杂但精度更高的定时方案？四种方式简单总结如下:

| API                  | 丢失任务 | 事件循环 | 时间误差       | 主要缺陷             |
| -------------------- | -------- | -------- | -------------- | -------------------- |
| setInterval          | 会       | 等待     | 存在，且会累积 | 丢失任务             |
| setTimeout           | 不会     | 等待     | 存在，且会累积 | 时间误差，等待执行栈 |
| requestAnimatedFrame | 不会     | 优先执行 | 存在，但不累积 | 帧丢失则触发时机不准 |
| worker               | 不会     | 不受影响 | 依赖于触发机制 | 无法传递不可序列参数 |