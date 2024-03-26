---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-2-1_副作用钩子-useEffect /front/React/Fiber/3-6-4_commit_DOM挂载后
rear: +/front/React/Hooks/2-2-3_副作用钩子-useInsertionEffect
---

# useLayoutEffect

> 官方文档: [https://react.dev/reference/react/useLayoutEffect](https://react.dev/reference/react/useLayoutEffect)

<p class="warn">只有副作用仅需执行一次，且依赖完整的首屏渲染 DOM 时才考虑使用这个钩子。</p>

## 具体实现

### mountLayoutEffect

上源码（[✨约2556行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2556)）：

```ts
function mountLayoutEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  let fiberFlags: Flags = UpdateEffect | LayoutStaticEffect;
  return mountEffectImpl(fiberFlags, HookLayout, create, deps);
}
```

和 `mountEffect` 不同的是，传递给 `mountEffectImpl` 的前两个参数不同。

### updateLayoutEffect

上源码（[✨约2570行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2570)）：

```ts
function updateLayoutEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  return updateEffectImpl(UpdateEffect, HookLayout, create, deps);
}
```

和 `updateEffect` 的不同也是前两个参数不同。

<p class="tip">rerender 阶段使用的 useLayoutEffect 实现也是 updateLayoutEffect。后文如果不单独说明，默认 rerender 和 update 阶段使用同一种实现</p>

对比一下，`useEffect` 与 `useLayoutEffect`:
- `Flags`: `useEffect` 打上的是 `PassiveEffect`, `useLayoutEffect` 是 `UpdateEffect`
- `HookFlags`: `useEffect` 打上的是 `HookPassive`, `useLayoutEffect` 是 `HookLayout`

打上的标签不同，这两个钩子的执行时机必然也不一样。

## 执行时机

通过前面几篇文章我们知道 `useEffect` 产生的被动副作用会在浏览器有空的时候执行，是一个低优先级的异步任务。

但 `useLayoutEffect` 不同，它是一个同步任务，且有固定的执行顺序，在 `commitLayoutEffects` 方法中执行(`commit` 的最后阶段)，在该方法中有这样一段代码（[✨约1041行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L1041)）：

```ts
switch (finishedWork.tag) {
  case FunctionComponent:
  case ForwardRef:
  case SimpleMemoComponent: {
    recursivelyTraverseLayoutEffects(
      finishedRoot,
      finishedWork,
      committedLanes,
    );
    // 如果有 Update 标签
    if (flags & Update) {
      commitHookLayoutEffects(finishedWork, HookLayout | HookHasEffect);
    }
    break;
  }
// xxx
```

具体执行顺序参考 [commit-概述](https://pionpill.github.io/blog/front/React/Fiber/3-6-1_commit-%E6%A6%82%E8%BF%B0#%E4%B8%BB%E8%A6%81%E9%98%B6%E6%AE%B5)，函数调用栈参考 [commit-DOM挂在后](https://pionpill.github.io/blog/front/React/Fiber/3-6-4_commit-DOM%E6%8C%82%E8%BD%BD%E5%90%8E)，我们直接看一下执行逻辑（[✨约619行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L619)）：

```ts
// commitHookLayoutEffects 方法调用
function commitHookEffectListMount(flags: HookFlags, finishedWork: Fiber) {
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        // Mount 阶段
        const create = effect.create;
        const inst = effect.inst;
        const destroy = create();
        inst.destroy = destroy;
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```

逻辑和 `setState` 类似，但是只会在 `mount` 阶段调用 `create` 方法执行副作用函数。

比较这两个副作用钩子:
- `useEffect`: 异步执行，低优先级，在 `render` 和 `commit` 阶段都有可能执行
- `useLayoutEffect`: 同步执行，只在 `mount` 的 `layout` 阶段(`commit` 阶段最后一段)执行一次。

一般首选 `useEffect` 钩子，它的性能更好，不会造成阻塞。如果需要依赖完整的 `DOM` 才会使用 `useLayoutEffect`。