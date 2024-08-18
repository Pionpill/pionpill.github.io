---
difficulty: hard
type: origin
pre: +/front/React/Fiber/4-1-1_diff-基础
---

# 文本节点 diff

文本节点的 diff 非常简单，借此机会讲一下几个重要的方法，上代码：

```ts
if (
  (typeof newChild === 'string' && newChild !== '') ||
  typeof newChild === 'number' ||
  typeof newChild === 'bigint'
) {
  return placeSingleChild(
    reconcileSingleTextNode(
      returnFiber,
      currentFirstChild,
      '' + newChild,
      lanes,
    ),
  );
}
```

如果子节点类型为 `string`(且不是空串), `number`, `bigint`，那么会触发文本节点的 diff。

简单看一下 `placeSingleChild` 方法:

```ts
function placeSingleChild(newFiber: Fiber): Fiber {
  // 需要跟踪副作用，且不存在视图对应的 FiberNode
  if (shouldTrackSideEffects && newFiber.alternate === null) {
    // 打上插入标签
    newFiber.flags |= Placement | PlacementDEV;
  }
  return newFiber;
}
```

在更新过程中 `shouldTrackSideEffects` 始终为 `true`，只有 `mount` 阶段改值为 `false`

## reconcileSingleTextNode

```ts
function reconcileSingleTextNode(
  returnFiber: Fiber, // 父节点
  currentFirstChild: Fiber | null, // 子节点
  textContent: string, // 内容（字符串）
  lanes: Lanes,
): Fiber {
  // There's no need to check for keys on text nodes since we don't have a
  // way to define them.
  if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
    // 已经存在文本节点，更新一下
    deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
    // 复用原来的，更新一下 textContent
    const existing = useFiber(currentFirstChild, textContent);
    existing.return = returnFiber;
    return existing;
  }
  // 创建一个新的节点
  deleteRemainingChildren(returnFiber, currentFirstChild);
  const created = createFiberFromText(textContent, returnFiber.mode, lanes);
  created.return = returnFiber;
  return created;
}
```

这个方法开头作者写了一注释: There's no need to check for keys on text nodes since we don't have a way to define them. 因此文本节点不存在（也没必要）通过 `key` 复用。

这里有一个逻辑比较难理解: 为什么都要进行 `deleteRemainingChildren` 操作。当前正在构建中的节点是文本类型，根本就没有 `remainingChildren`。这是因为无法确定视图中对应位置节点的类型，如果视图中对应位置是一个节点数组，那么只需要保留第一个元素并替换，其他元素删除即可。

我们看一下 `deleteRemainingChildren` 操作:

```ts
function deleteRemainingChildren(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
): null {
  let childToDelete = currentFirstChild;
  while (childToDelete !== null) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
  return null;
}

function deleteChild(returnFiber: Fiber, childToDelete: Fiber): void {
  const deletions = returnFiber.deletions;
  if (deletions === null) {
    returnFiber.deletions = [childToDelete];
    returnFiber.flags |= ChildDeletion;
  } else {
    deletions.push(childToDelete);
  }
}
```

把需要删除的节点记录在了父节点的 `deletions` 属性上。（重申：render 阶段只打标签，无法操作 DOM）。