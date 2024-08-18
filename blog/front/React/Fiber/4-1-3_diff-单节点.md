---
difficulty: hard
type: origin
pre: +/front/React/Fiber/4-1-2_diff-文本节点
---

# 单节点 diff

单节点是最为常见的情形，当节点类型为 `ReactElement` 时触发，对应的代码如下:

```ts
case REACT_ELEMENT_TYPE: {
  const firstChild = placeSingleChild(
    reconcileSingleElement(
      returnFiber,
      currentFirstChild,
      newChild,
      lanes,
    ),
  );
  return firstChild;
}
```

## reconcileSingleElement

核心代码如下:

```ts
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement,
  lanes: Lanes,
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  // 开启循环：遍历原有的节点
  while (child !== null) {
    // key 相同
    if (child.key === key) {
      const elementType = element.type;
      // Fragment 单独处理
      if (elementType === REACT_FRAGMENT_TYPE) {
        if (child.tag === Fragment) {
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(child, element.props.children);
          existing.return = returnFiber;
          validateFragmentProps(element, existing, returnFiber);
          return existing;
        }
      } else {
        // elementType 相同或者是懒加载模式 type 相同
        if (
          child.elementType === elementType ||
          (typeof elementType === 'object' &&
            elementType !== null &&
            elementType.$$typeof === REACT_LAZY_TYPE &&
            resolveLazy(elementType) === child.type)
        ) {
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(child, element.props);
          coerceRef(returnFiber, child, existing, element);
          existing.return = returnFiber;
          return existing;
        }
      }
      // key 相同，但是 type 不同，把剩余的旧节点全删了
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // key 不同，把当前这个旧节点删了
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }

  // 到这里说明没匹配上
  if (element.type === REACT_FRAGMENT_TYPE) {
    const created = createFiberFromFragment(
      element.props.children,
      returnFiber.mode,
      lanes,
      element.key,
    );
    created.return = returnFiber;
    validateFragmentProps(element, created, returnFiber);
    return created;
  } else {
    // 创建新的节点
    const created = createFiberFromElement(element, returnFiber.mode, lanes);
    coerceRef(returnFiber, currentFirstChild, created, element);
    created.return = returnFiber;
    return created;
  }
}
```

`FRAGMENT` 的处理逻辑跳过，捋一下现在的场景，我们 `update` 的节点类型是单节点，但旧有的节点类型不确定，可能是一个单节点或多节点，因此使用了一个 `while` 循环遍历所有的旧节点，主要 `diff` 流程为：
- 首先遍历旧节点链，通过 `key` 进行比对
  - 如果 `key` 不同，直接删除这个旧节点
  - 如果 `key` 相同，比较 `type` 值
    - `type` 也匹配，那么直接复用这个旧节点，剩余的旧节点全部删除。
    - `type` 不匹配，那么也不可能有剩下的 `key` 相同的节点，删除所有旧节点，退出循环

React 同级节点的 `key` 必须是不同的，否则会报错。如果 `key` 相同，那么上述流程会走很多不必要的过程，造成性能浪费。