---
difficulty: hard
type: origin
pre: +/front/React/Fiber/4-1-3_diff-单节点
---

# 多节点 diff

如果新节点是多个 `ReactElement` 对象构成的数组，就会进入多节点 `diff` 过程，其对应的代码为:

```ts
if (isArray(newChild)) {
  const firstChild = reconcileChildrenArray(
    returnFiber,
    currentFirstChild,
    newChild,
    lanes,
  );
  return firstChild;
}
```

## reconcileChildArray

这部分代码很长，先简单看一遍:

```ts
  function reconcileChildrenArray(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChildren: Array<any>,
    lanes: Lanes,
  ): Fiber | null {
    let knownKeys: Set<string> | null = null;
    let resultingFirstChild: Fiber | null = null; // 第一个新子节点
    let previousNewFiber: Fiber | null = null; // 上一个新节点
    let oldFiber = currentFirstChild; // 旧节点
    let lastPlacedIndex = 0;
    let newIdx = 0; // 新节点下标
    let nextOldFiber = null; // 下一个参与比较的旧节点
  
    // 首轮循环，遍历整个旧节点链表
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      // 位置不匹配，oldFiber 设置为 null 退出循环
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        // 拿下一个旧节点
        nextOldFiber = oldFiber.sibling;
      }
      // 通过 key 值生成新的节点，如果无法匹配会返回 null
      const newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        lanes,
      );
      if (newFiber === null) {
        // 退出
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        break;
      }

      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          deleteChild(returnFiber, oldFiber);
        }
      }
      // 打上插入标记
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      // 第一次循环
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      // 开始下一轮匹配
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    // 刚好匹配完
    if (newIdx === newChildren.length) {
      // 删除就节点中多的
      deleteRemainingChildren(returnFiber, oldFiber);
      if (getIsHydrating()) {
        const numberOfForks = newIdx;
        pushTreeFork(returnFiber, numberOfForks);
      }
      return resultingFirstChild;
    }

    // 旧节点利用完，但是新节点没有创建完
    if (oldFiber === null) {
      // 遍历剩余的新节点，一一创建加上去
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
        if (newFiber === null) {
          continue;
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        // 第一次循环
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      if (getIsHydrating()) {
        const numberOfForks = newIdx;
        pushTreeFork(returnFiber, numberOfForks);
      }
      return resultingFirstChild;
    }

    // 到这里说明存在不匹配的情形，把剩余所有的旧节点放入一个 map 结构中
    const existingChildren = mapRemainingChildren(oldFiber);

    // 第二次循环
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        lanes,
      );
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            existingChildren.delete(
              newFiber.key === null ? newIdx : newFiber.key,
            );
          }
        }
        // 确定位置进行插入
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
    }

    if (shouldTrackSideEffects) {
      // 删除没用的旧节点
      existingChildren.forEach(child => deleteChild(returnFiber, child));
    }

    if (getIsHydrating()) {
      const numberOfForks = newIdx;
      pushTreeFork(returnFiber, numberOfForks);
    }
    return resultingFirstChild;
  }
```

整个过程比较复杂，可以梳理为两大部分
- 遍历旧节点：通过 `key` 判断是否可以复用，在这个过程中只有相同下标的新旧节点会尝试复用。这个过程会出现如下几种情形:
  - 旧节点遍历完，新节点也正好复用完，那么直接返回结果
  - 旧节点遍历完，新节点数量大于旧节点数量，生成剩余不能复用且未创建新节点并接到新节点链上
  - 匹配过程中同位置新旧节点 `key` 不同，停止遍历操作，进入下一步骤。
- 将所有未复用的旧节点存在一个 `map` 容器中，键为 `key`，新节点创建过程中通过 `key` 查询该容器是否有可复用的节点，有则复用，没有新建。

## 首次循环

首次循环相关的代码如下:

```ts
// 跳出条件：旧节点不存在 或 新节点复用完
for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
  // 位置不匹配，跳出循环
  if (oldFiber.index > newIdx) {
    nextOldFiber = oldFiber;
    oldFiber = null;
  } else {
    // 拿下一个旧节点
    nextOldFiber = oldFiber.sibling;
  }
  // 通过 key 值生成新的节点，如果无法匹配会返回 null
  const newFiber = updateSlot(
    returnFiber,
    oldFiber,
    newChildren[newIdx],
    lanes,
  );
  if (newFiber === null) {
    // 退出
    if (oldFiber === null) {
      oldFiber = nextOldFiber;
    }
    break;
  }
  if (shouldTrackSideEffects) {
    if (oldFiber && newFiber.alternate === null) {
      deleteChild(returnFiber, oldFiber);
    }
  }
  // 打上插入标记
  lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
  if (previousNewFiber === null) {
    resultingFirstChild = newFiber;
  } else {
    previousNewFiber.sibling = newFiber;
  }
  // 开始下一轮匹配
  previousNewFiber = newFiber;
  oldFiber = nextOldFiber;
}
```

这里看一下简化的 `updateSlot` 方法:

```ts
function updateSlot(
  returnFiber: Fiber,
  oldFiber: Fiber | null,
  newChild: any,
  lanes: Lanes,
): Fiber | null {
  const key = oldFiber !== null ? oldFiber.key : null;

  if (typeof newChild === 'object' && newChild !== null) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE: {
        // key 相同时更新节点
        if (newChild.key === key) {
          const updated = updateElement(
            returnFiber,
            oldFiber,
            newChild,
            lanes,
          );
          currentDebugInfo = prevDebugInfo;
          return updated;
        } else {
          return null;
        }
      }
    }

    if (
      isArray(newChild) ||
      getIteratorFn(newChild) ||
      (enableAsyncIterableChildren &&
        typeof newChild[ASYNC_ITERATOR] === 'function')
    ) {
      if (key !== null) {
        return null;
      }
      const updated = updateFragment(
        returnFiber,
        oldFiber,
        newChild,
        lanes,
        null,
      );
      currentDebugInfo = prevDebugInfo;
      return updated;
    }
  }
  return null;
}
```

如果 `key` / `type` 不相同就返回 `null`，我们知道这个就可以了。

如果能创建所有的新节点，说明旧元素没有做任何调整，或者删去了尾部的一些元素，那么只需要删除剩下的元素并返回即可:

```ts
if (newIdx === newChildren.length) {
  // 删除就节点中多的
  deleteRemainingChildren(returnFiber, oldFiber);
  if (getIsHydrating()) {
    const numberOfForks = newIdx;
    pushTreeFork(returnFiber, numberOfForks);
  }
  return resultingFirstChild;
}
```

如果旧节点遍历完成后，新节点没有创建完成，说明新增了元素，此时需要创建新增的节点:

```ts
// 旧节点利用完，但是新节点没有创建完
if (oldFiber === null) {
  // 遍历剩余的新节点，一一创建加上去
  for (; newIdx < newChildren.length; newIdx++) {
    const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
    if (newFiber === null) {
      continue;
    }
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    if (previousNewFiber === null) {
      resultingFirstChild = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
  if (getIsHydrating()) {
    const numberOfForks = newIdx;
    pushTreeFork(returnFiber, numberOfForks);
  }
  return resultingFirstChild;
}
```

## 第二轮处理

如果在首轮处理过程中，同位置新旧节点 `key` 不同，那么会进入第二轮处理过程，首先将剩余的旧节点放入一个容器中:

```ts
const existingChildren = mapRemainingChildren(oldFiber);

function mapRemainingChildren(
  currentFirstChild: Fiber,
): Map<string | number, Fiber> {
  const existingChildren: Map<string | number, Fiber> = new Map();
  let existingChild: null | Fiber = currentFirstChild;
  while (existingChild !== null) {
    if (existingChild.key !== null) {
      existingChildren.set(existingChild.key, existingChild);
    } else {
      existingChildren.set(existingChild.index, existingChild);
    }
    existingChild = existingChild.sibling;
  }
  return existingChildren;
}
```

很简单的一个 `Map` 结构，但如果我们不手动添加 `key` 的话，React 会默认使用数组下标作为 `key`。

在此之后，循环创建剩余的新节点，创建过程中从上述 `Map` 容器中查找是否有可复用的节点，没有则新建:

```ts
for (; newIdx < newChildren.length; newIdx++) {
  const newFiber = updateFromMap(
    existingChildren,
    returnFiber,
    newIdx,
    newChildren[newIdx],
    lanes,
  );
  if (newFiber !== null) {
    if (shouldTrackSideEffects) {
      if (newFiber.alternate !== null) {
        existingChildren.delete(
          newFiber.key === null ? newIdx : newFiber.key,
        );
      }
    }
    // 确定位置进行插入
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    if (previousNewFiber === null) {
      resultingFirstChild = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}
```