---
difficulty: medium
type: organize
---

# MutationObserver

`MutationObserver` 用于监听 DOM 变化，使用它时需要创建实例对象并传入回调函数:

```ts
// mutations 表示被监听的元素
const observer = new MutationObserver((mutations) => {
  // 被监听的元素变化时，触发回调
  mutations.forEach((mutation) => {
    console.log(mutation.type); // 打印出变化类型
  });
});
```

其中 `mutation` 表示被监听的对象，它的 `type` 属性表示变化类型，常见的包括:
- `attributes`: 属性变化
- `childList`: 子节点变化
- `subtree`: 后代节点变化

它有三个方法:
- `observe`: 传入需要监测的 DOM 和监听的变化类型。
- `disconnect`: 阻止 `MutationObserver` 实例继续接收的通知，直到再次调用其 observe() 方法。
- `takeRecords`: 从 `MutationObserver` 的通知队列中删除所有待处理的通知。