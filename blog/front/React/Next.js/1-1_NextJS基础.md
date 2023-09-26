---
difficulty: easy
type: note
---

# Next.js 基础

> 官方文档: [https://nextjs.org/docs](https://nextjs.org/docs)

<p class="tip">本文及后续博客需要以下前置技术: HTML, CSS, JS, TS, React</p>

## Next.js 介绍

### Next.js 简介

Next.js 是一个**基于 React** 的**全栈** Web 应用搭建框架。Next.js 会帮我们自动配置环境，利用 Next.js 我们可以更专注于应用本身。Next.js 的主要功能包括:
- 路由: 基于文件系统的路由配置。
- 渲染: 可以选择服务器渲染(SSR)或者客户端渲染(CSR)，支持静态与动态渲染。在 Edge 和 Node.js 上使用了流式传输。
- fetch: 使用 async/await 获取数据，拓展了 `fetch` API。
- CSS: 支持各种 CSS 形式: CSS Modules，Tailwind CSS，CSS-in-JS。
- 其他: 支持 TypeScript，可以利用图片，脚本...提高用户体验。

Next.js 目前的迭代速度非常快，从 2018 年发布 5 版本到现在(2023.9) 发布 13.4 版本，5年多的时间迭代了 8 个大版本。并且目前的更新速度也非常快，在 [Next.js Github 仓库](https://github.com/vercel/next.js) 中可以看到，几乎每周都会发布 3-4 个测试版本。我的博客以最新的更新内容为准。

### 启动一个 Next.js 项目

确保安装了 Node.js 16.14 或更新版本。

通过 `create-next-app` 指令可以快速启动一个 Next.js 项目:

```bash
npx create-next-app@latest
```

启动之后会有很多选项，根据项目需求选择/填写就可以了。react 和 next 这两个依赖是必须的:

```json
"dependencies": {
  "next": "13.4.19",
  "react": "18.2.0",
  "react-dom": "18.2.0"
  // 如果启用了 ts  
  "typescript": "5.2.2"
  "@types/node": "20.5.9",
  "@types/react": "18.2.21",
  "@types/react-dom": "18.2.7",
}
```

同时增加了如下脚本
```json
"scripts": {
  "dev": "next dev",        // 开发模式启动
  "build": "next build",    // 创建生产用 application
  "start": "next start",    // 启一个 Next.js 生产服务
  "lint": "next lint"       // ESLint
},
```

依此执行如下指令就可以启动这个 Next.js 项目了:

```bash
npm i
npm run dev
```

这就非常神奇了，我们只下载了 react，next 这两个有实际功能的包，没有任何的打包工具(vite/webpack)，也没有路由组件，应用就启动了。这些都由 Next.js 帮我们做了！

## 项目结构

这里假设我们选择 App Router 使用 src/ 目录，那么应该有如下文件结构(部分常见文件省略):

```bash
|- .next    # nextjs 配置文件夹(一般不需要手动改)
|- public   # 放静态资源
|- src      # 源文件，写代码的地方
    |- app  # app router 组件位置，如果是 pages router 则为 pages
|- next.config.js   # nextjs 项目配置文件
```

前面提到过，NextJS 的路由配置是基于文件的，因此不同名称的文件会承担其独特的作用，Next.js 文件名及其对应的作用为:
- layout: 该路由下所有的共享布局元素，切换路由时保留状态，不重新渲染。这里的元素可供多个界面复用。
- template: 模板组件，与 layout 类似，但切换路由会重绘，不保留状态。
- page: 具体界面，正常访问对应路由返回的内容，功能类似于 index 文件。
- loading: 加载界面。
- not-found: 404 返回的界面。
- error: 错误界面。
- global-error: 全局错误界面。
- route: 配置路由信息。这个文件只能是 .js/.ts 文件。
- default: 暂时不知道怎么用。

假设 `blog/` 路由下有如上几个文件，那么访问该路由会显示 `page` 文件返回的内容。出于错误处理、优化、组件复用等目的，`page` 返回的内容会和 `layout`、`template` 等文件中的内容整合在一起并返回。