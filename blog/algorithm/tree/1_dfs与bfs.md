---
difficulty: easy
type: organize
---

# 深度优先与广度优先搜索

深度优先（dfs）与广度优先（bfs）是两种常见的树/图遍历方式，在前端处理 DOM，文件树时经常用到。

假如有如下结构：

```ts
interface TreeNode {
    children?: Node[];
}
```

## 深度优先

深度优先从当前节点开始，优先访问其子节点，直到访问到叶子节点，然后回溯。

最简单的深度优先使用递归依次访问：

```ts
const dfsRecursive = <T extends TreeNode>(node: T, visited: Set<T>) => {
    if (!node || visited.has(node)) {
        return;
    }
    visited.add(node);
    if (!node.children) {
        return
    }
    for (let i = 0; i < node.children.length; i++) {
        dfsRecursive(node.children[i], visited);
    }
}
```

递归的优点是容易理解，但会产生函数递归栈占用内存，可递归的都可以遍历，下面是栈实现代码：

```ts
const dfsStack = <T extends TreeNode>(node: T) => {
    const stack: Array<TreeNode> = [node];
    const visited = new Set<T>();

    while (stack.length) {
        const current = stack.pop() as T;

        if (!current || visited.has(current)) {
            continue;
        }

        visited.add(current);

        if (!current.children) {
            continue;
        }
        for (let i = current.children.length; i >= 0; i--) {
            stack.push(current.children[i]);
        }
    }

    return visited
}
```

## 广度优先

广度优先先遍历同级节点再遍历子节点，把上面代码改一改就是广度优先了：

```ts
const bfsStack = <T extends TreeNode>(node: T) => {
    const queue: Array<TreeNode> = [node];
    const visited = new Set<T>();

    while (queue.length) {
        const current = queue.shift() as T;

        if (!current || visited.has(current)) {
            continue;
        }

        visited.add(current);

        if (!current.children) {
            continue;
        }
        for (let i = 0; i < current.children.length; i++) {
            queue.push(current.children[i]);
        }
    }

    return visited
}
```

两者唯一的区别是数组中元素如何加入以及如何取出当前元素处理：
- DFS：栈结构，始终将第一个子元素放在栈顶，弹栈优先处理排序靠前的子元素
- BFS：队列结构，先进先出处理。

JavaScript 的 Array 可以表示 List，Stack，Queue 等结构，写起来非常方便