---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-2-2_副作用钩子-useLayoutEffect
---

# useInsertionEffect

> 官方文档: [https://react.dev/reference/react/useInsertionEffect](https://react.dev/reference/react/useInsertionEffect)

<p class="warn">这个钩子是为 CSS-in-JS 打造的</p>

目前主流的 CSS-in-JS 实现方案有三种：
- 编译器静态提取到 CSS 文件，例如：`styled-component`
- 内联样式，例如 ` <div style={{ opacity: 1 }}>`
- 运行时注入 `<style>` 标签

前两种是 React 官方建议的方案，第三种可以运行时动态改变 CSS 样式，但是有两个缺陷:
- 运行时注入会使浏览器频繁地重新计算样式。
- 如果在 React 生命周期中某个错误的时机进行运行时注入，它可能会非常慢。

第一个缺陷没法解决，是动态改变的必然代价，`useInsertionEffect` 可以解决第二个问题，指定注入的生命周期。

<p class="tip">和 useLayoutEffect 有点类似，useInsertionEffect 也会在固定的时机运行。</p>

## 具体实现

实现上非常简单，只有打的标签不同（[✨约2542行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2542)）:

```ts
function mountInsertionEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  mountEffectImpl(UpdateEffect, HookInsertion, create, deps);
}

function updateInsertionEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  return updateEffectImpl(UpdateEffect, HookInsertion, create, deps);
}
```

## 执行时机

`HookInsertion` 标记的副作用会在 `commit` 阶段的 `commitMutationEffects` 方法中被执行，具体执行方法是 `commitHookEffectListMount`。细节不再展开，处理逻辑和前面的大致相同。

`commitMutationEffects` 处于替换阶段树的前一阶段，在此阶段应用动态样式可以减小对 react 其他事务的影响。

<p class="discuss">本人没使用过这个钩子，所以知道的很少。希望大佬补充一些应用场景。</p>