---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-4-1_引用钩子-useRef
---

# useId

> 官方文档: [https://react.dev/reference/react/useId](https://react.dev/reference/react/useId)

`useId` 实现原理和 `useRef` 相同。

## mountRef

`mountId` 会生成一个唯一 id，其他过程和 `mountRef` 类似（[✨约3268行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3268)）

```ts
function mountId(): string {
  const hook = mountWorkInProgressHook();
  const root = ((getWorkInProgressRoot(): any): FiberRoot);
  const identifierPrefix = root.identifierPrefix;

  // 通过一些全局变量和 FiberTree 的标识生成唯一 id
  let id;
  if (getIsHydrating()) {
    const treeId = getTreeId();
    id = ':' + identifierPrefix + 'R' + treeId;
    const localId = localIdCounter++;
    if (localId > 0) {
      id += 'H' + localId.toString(32);
    }
    id += ':';
  } else {
    const globalClientId = globalClientIdCounter++;
    id = ':' + identifierPrefix + 'r' + globalClientId.toString(32) + ':';
  }

  hook.memoizedState = id;
  return id;
}
```

## updateRef

`updateRef`（[✨约3305行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3305)）:

```ts
function updateId(): string {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}
```

嗯，一个非常简单帮助我们生成唯一 `id` 并持续保有的钩子。