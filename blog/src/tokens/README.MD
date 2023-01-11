你需要在 token.ts 文件中写入自己的 token，否则一些组件将无法加载:

```ts
export const token = {
    mapbox: "your token"
}
```