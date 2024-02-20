---
difficulty: middle
type: note
---

# Nuxt.js 基础

> 官方文档: [https://nuxt.com/docs/getting-started/introduction](https://nuxt.com/docs/getting-started/introduction)

<p class="tip">本文默认读者对 Vue 生态，NextJS，SSR 有一定的了解。由于 Nuxt 和 Next 的很多理念甚至实现方案，代码书写习惯都是相似的，这里不再赘述，可以参考我的 NextJS 博客。</p>

NuxtJS 和 NextJS 入门非常类似，都通过文件夹/文件名控制路由，文件夹/文件都有固定的功能，都提供全栈解决方案。

NuxtJS 要求 NodeJS 版本高于 18.0.0，可通过如下指令快速搭建一个 NuxtJS 项目:

```bash
npx nuxi@latest init <project-name>
```

## 项目结构

### 配置文件

常用的配置文件有两个:
- `nuxt.config.ts`: nuxt 相关配置，例如路由，api
- `app.config.ts`: 项目相关的配置，例如主题色，meta 信息

Nuxt 有一个对开发者很友好的特点: 默认支持 vite 打包。(该死的 NextJS 默认使用 webpack)

### 视图

NuxtJs 有几种特殊的组件，分别承担着不同的角色:
- `app.vue`: 项目的常规入口视图，可以不写。
- `Components`: 在 `components/` 目录下创建组件，这些组件会被项目自动识别(无需显示导入)。
- `Pages`: 在 `pages/` 目录下创建的内容讲自动创建对应的路由，例如 `pages/about.vue` 对应 `/about` 路由下的内容
- `Layouts`: 在 `layouts/` 目录下创建的组件会包裹对应的 Page，使用 `<slot/>` 插入 Page 的内容，这种设计理念的好处见我的 `NextJS` 博客。

### 资源

NuxtJS 有两个文件夹可以放资源文件:
- `public/`: 存放不经 Nuxt 处理的资源文件
  - 在项目中可以直接通过路径访问到，例如一个 `public/img/nuxt.png` 可以通过 `src="img/nuxt.png"` 访问
  - 放置的文件不会被 webpack/vite 处理，资源文件会被直接复制到输出目录中，保持原始的路径，结构，名称
- `assets/`: 存放经由 Nuxt 处理的资源文件
  - 项目中无法直接通过路径访问到，需要添加一个 `~` 前缀，例如 `assets/img/nuxt.png` 通过 `src="~/assets/img/nuxt.png"` 访问。
  - 放入的文件会被 webpack/vite 处理，经过压缩，优化，转换等

## 路由系统

### 基于文件的路由系统

Nuxt 的路由系统是基于 vue-router 的，每个在 `pages/` 目录下的文件/文件夹都会按一定的规则创建对应的路由。

假设有如下文件结构:

```js
| pages/
---| about.vue
---| index.vue
---| posts/
-----| [id].vue
```

效果等同于:

```js
{
  "routes": [
    {
      "path": "/about",
      "component": "pages/about.vue"
    },
    {
      "path": "/",
      "component": "pages/index.vue"
    },
    {
      "path": "/posts/:id",
      "component": "pages/posts/[id].vue"
    }
  ]
}
```

### 路由跳转

Nuxt 有自己的路由跳转组件: `<NuxtLink>`, 它本质上是一个 `<a>` 标签，Nuxt 对它做了一些封装与优化:

```html
<NuxtLink to="/about">About</NuxtLink>
```

也可以通过 `useRoute` 钩子获取路由对象，进行命令式操作:

```js
const route = useRoute()
console.log(route.params.id)
```

## SEO 与 Meta

### 默认配置

默认情况下，我们可以通过 `nuxt.config.ts` 配置项目的 head 信息，例如:

```js
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  }
})
```

不过这里只能写死配置信息。

### useHead 与 useSeoMeta

这两个钩子允许我们动态调整网页的 head 与 meta 信息:

```js
useHead({
  title: 'My App',
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'test'
  },
  script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
})
```

```js
useSeoMeta({
  title: 'My Amazing Site',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
```

### 声明式组件

除了上述两种命令式调整 head 信息的方式，Nuxt 还提供了很多组件: `Head`, `Title`, `Html`... 利用这些组件我们可以声明式调整 head 信息:

```html
<script setup lang="ts">
const title = ref('Hello World')
</script>

<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="title" />
      <Style type="text/css" children="body { background-color: green; }" ></Style>
    </Head>

    <h1>{{ title }}</h1>
  </div>
</template>

```