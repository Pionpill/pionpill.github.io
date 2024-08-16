---
difficulty: easy
type: organize
---

# requestAnimationFrame

`requestAnimationFrame(callback)` 是浏览器提供的一个用于帧动画处理的接口。它可以在浏览器重绘的时候触发回调。`requestAnimationFrame` 会触发一个宏任务，它在界面布局之前执行，具体的执行实际可参考: [浏览器帧渲染](https://pionpill.github.io/blog/front/React/Fiber/3-1-1_%E6%A6%82%E5%BF%B5-%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B8%A7%E6%B8%B2%E6%9F%93)

`requestAnimationFrame` 经常与 `performance.now()` 结合使用，后者表示页面加载到现在的时间，单位 ms(拥有5位小数)。

一般情况下我们会这样写代码:

```js
const example = (delay: number) => {
  const startTime = performance.now();
  const tick = () => {
    // 执行具体逻辑
    const currentTime = performance.now();
    if (currentTime - startTime < delay) {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}
```

`delay` 表示我们需要多少时间内完成某个动画/事件。如果需要在下一次重绘时继续执行，则需要使用 `requestAnimationFrame` 继续调用具体的执行逻辑。

注意：`requestAnimationFrame` 会在每次重绘时调用，因此它的回调函数不应该执行过于复杂的逻辑。

由于 `requestAnimationFrame` 基本会在每帧执行的特性，它还可以做一些辅助性工作，例如：模拟 `setTimeout` 部分功能:

```ts
const mSetTimeout = (callBack: Function, delay: number) => {
  const startTime = performance.now();
  const tick = () => {
    const currentTime = performance.now();
    if (currentTime - startTime > delay) {
      callBack();
    } else {
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
};
```