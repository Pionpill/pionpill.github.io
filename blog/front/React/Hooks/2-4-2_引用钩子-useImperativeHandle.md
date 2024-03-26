---
difficulty: hard
type: origin
pre: +/front/React/Hooks/2-4-1_引用钩子-useRef +/front/React/Hooks/2-2-1_副作用钩子-useEffect
---

# useImperativeHandle

> 官方文档: [https://react.dev/reference/react/useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)

`useImperativeHandle` 允许我们自定义 `forwardRef` 中向外暴露的 `ref`，它的函数声明为：

```ts
useImperativeHandle<T, R extends T>(ref: Ref<T>|undefined, init: () => R, deps?: DependencyList): void;
```

- `ref`: `forwardRef` 的第二个参数
- `init`: 返回想暴露的方法的对象
- `deps`: 依赖项，和 `useEffect` 的依赖项类似

给个官网的例子:

```ts
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

感觉是 `useEffect` 和 `forwardRef` 的孩子。

## mountImperativeHandle

看源码（[✨约2608行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2608)）:

```ts
function mountImperativeHandle<T>(
  ref: {current: T | null} | ((inst: T | null) => mixed) | null | void,
  create: () => T,
  deps: Array<mixed> | void | null,
): void {
  // 依赖数组把 ref 也带上
  const effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : null;

  let fiberFlags: Flags = UpdateEffect | LayoutStaticEffect;
  mountEffectImpl(
    fiberFlags,
    HookLayout, // layout 阶段处理
    imperativeHandleEffect.bind(null, create, ref),
    effectDeps,
  );
}
```

### imperativeHandleEffect

```ts
function imperativeHandleEffect<T>(
  create: () => T,
  ref: {current: T | null} | ((inst: T | null) => mixed) | null | void,
): void | (() => void) {
  if (typeof ref === 'function') {
    // 执行方法
    const refCallback = ref;
    const inst = create();
    refCallback(inst);
    // 清除时的回调
    return () => {
      refCallback(null);
    };
  } else if (ref !== null && ref !== undefined) {
    // 将执行结果挂到 ref.current 上
    const refObject = ref;
    const inst = create();
    refObject.current = inst;
    // 清除时的回调
    return () => {
      refObject.current = null;
    };
  }
}
```

## updateImperativeHandle

看源码（[✨约2642行](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2642)）:

```ts
function updateImperativeHandle<T>(
  ref: {current: T | null} | ((inst: T | null) => mixed) | null | void,
  create: () => T,
  deps: Array<mixed> | void | null,
): void {
  const effectDeps =
    deps !== null && deps !== undefined ? deps.concat([ref]) : null;

  updateEffectImpl(
    UpdateEffect,
    HookLayout,
    imperativeHandleEffect.bind(null, create, ref),
    effectDeps,
  );
}
```

没啥好说的，一个经 `useEffect` 封装返回的 `ref`，文章也许可以放在副作用钩子下？