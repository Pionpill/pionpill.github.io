---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-1-1_状态钩子-useState /front/React/Fiber/3-4-2_冲刷副作用
rear: +/front/React/Hooks/2-2-2_副作用钩子-useLayoutEffect
---

# useEffect

> 官方文档: [https://react.dev/reference/react/useEffect](https://react.dev/reference/react/useEffect)

## mountEffect

直接看源码（[✨约2456行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2456)）:

```ts
function mountEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  mountEffectImpl(
    PassiveEffect | PassiveStaticEffect,
    HookPassive,
    create,
    deps,
  );
}
```

这里处理两种副作用:
- `PassiveEffect`: 常规副作用, 例如状态更新
- `PassiveStaticEffect`: 只在 `mount` 阶段执行一次的副作用

源码（[✨约2405行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2405)）:

```ts
function mountEffectImpl(
  fiberFlags: Flags,
  hookFlags: HookFlags,
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  currentlyRenderingFiber.flags |= fiberFlags;
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    createEffectInstance(), // return {destroy: undefined}
    nextDeps,
  );
}
```

### pushEffect

源码（[✨约2276行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2276)）:

```ts
function pushEffect(
  tag: HookFlags,
  create: () => (() => void) | void,
  inst: EffectInstance,
  deps: Array<mixed> | null,
): Effect {
  const effect: Effect = {
    tag,  // 打上的标签
    create, // 执行逻辑
    inst, // {destroy: undefined}
    deps, // 依赖数组
    next: (null: any),
  };
  // 拿 FiberNode 的更新队列
  let componentUpdateQueue: null | FunctionComponentUpdateQueue =
    (currentlyRenderingFiber.updateQueue: any);
  // 空的话创建一个新队列对象(环)
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = (componentUpdateQueue: any);
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      // effect 添加到链表尾
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  return effect;
}
```

这两个函数的逻辑还是很好理解的, `pushEffect` 创建了一个 `Effect` 对象, 同时更新 `FiberNode.updateQueue` 的 `lastEffect` 属性, 这允许我们直接通过 `FiberNode` 访问到副作用信息. 最后将 `Effect` 返回给 `hook.memorizedState` 属性.

涉及到两个新的数据结构, 一个是 `Effect`（[✨约214行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L214)）:

```ts
type EffectInstance = {
  destroy: void | (() => void),
};

export type Effect = {
  tag: HookFlags, // 打上的标签
  create: () => (() => void) | void, // 开发者定义的副作用函数
  inst: EffectInstance, // 一个对象，里面有 destroy 方法用于卸载时清除副作用
  deps: Array<mixed> | null,  // 依赖数组
  next: Effect, // 指向下一个副作用
};
```


还有一个 `FunctionComponentUpdateQueue`（[✨约1021行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L1021)）:

```ts
createFunctionComponentUpdateQueue = () => {
  return {
    lastEffect: null, // 最后一个副作用, 是一个链表
    events: null, // 组件内部的事件监听器
    stores: null, // 组件内部的状态
    memoCache: null,  // 开启 memo 后才有
  };
};
```

那么我们可以通过 `FiberNode.updateQueue` 或 `Hook.memorizedState` 访问到副作用对象.

## updateEffect

看源码（[✨约2422行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2422)）:

```ts
function updateEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  // 这里不处理 PassiveStaticEffect
  updateEffectImpl(PassiveEffect, HookPassive, create, deps);
}
```

```ts
function updateEffectImpl(
  fiberFlags: Flags,
  hookFlags: HookFlags,
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const effect: Effect = hook.memoizedState;
  const inst = effect.inst;
  if (currentHook !== null && nextDeps !== null) {
    const prevEffect: Effect = currentHook.memoizedState;
    const prevDeps = prevEffect.deps;
    // 前后依赖数组是否相同
    if (areHookInputsEqual(nextDeps, prevDeps)) {
      hook.memoizedState = pushEffect(hookFlags, create, inst, nextDeps);
      return;
    }
  }

  currentlyRenderingFiber.flags |= fiberFlags;

  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    inst,
    nextDeps,
  );
}
```

这边的逻辑也很简单，判断运行过程中依赖数组是否有变化，如果有，则 `pushEffect` 多打上一个 `HookHasEffect` 标签，否则只打上 `hookFlags` 标签。

看一下比较 `deps` 的方法（[✨约427行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L427)）：

```ts
function areHookInputsEqual(
  nextDeps: Array<mixed>,
  prevDeps: Array<mixed> | null,
): boolean {
  if (prevDeps === null) {
    return false;
  }
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}
```

<p class="tip">rerender 阶段使用的 useEffect 实现也是 updateEffect。</p>

## 执行副作用

副作用的具体执行是在 `flushPassiveEffects` 方法中（参考 [冲刷副作用](https://pionpill.github.io/blog/front/React/Fiber/3-4-2_%E5%86%B2%E5%88%B7%E5%89%AF%E4%BD%9C%E7%94%A8)，可以回去再看一遍），这个方法主要在 commit 阶段开始时执行，是一个低优先级任务。（参考 [commit-概述](https://pionpill.github.io/blog/front/React/Fiber/3-6-1_commit-%E6%A6%82%E8%BF%B0)）。

我们直接看一下 `effect` 的具体执行逻辑（之前讲过，这里再讲一遍），执行副作用方法`commitHookEffectListMount`（[✨约3363行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L3363)）:

```ts
function commitHookEffectListMount(flags: HookFlags, finishedWork: Fiber) {
  // 注意这里用的是函数组件
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      // 这里判断哪些 flag 要执行
      if ((effect.tag & flags) === flags) {
        const create = effect.create;
        const inst = effect.inst;
        // 执行副作用
        const destroy = create();
        // 返回 destroy，方便卸载时清理
        inst.destroy = destroy;
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```

这里有一个注意的地方，`const destroy = create()`，也即我们在 `useEffect` 钩子中副作用响应函数的返回值就是卸载时需要执行的逻辑。

卸载副作用方法: `commitHookEffectListUnmount`（[✨约567行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L567)）:

```ts
function commitHookEffectListUnmount(
  flags: HookFlags,
  finishedWork: Fiber,
  nearestMountedAncestor: Fiber | null,
) {
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    // 遍历所有副作用
    do {
      // 这里判断哪些 flag 要执行
      if ((effect.tag & flags) === flags) {
        const inst = effect.inst;
        // 拿到卸载副作用的方法
        const destroy = inst.destroy;
        if (destroy !== undefined) {
          inst.destroy = undefined;
          // 执行 destroy()
          safelyCallDestroy(finishedWork, nearestMountedAncestor, destroy);
        }
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```
