---
difficulty: easy
type: note
---

# MDX

> 官方文档: [https://mdxjs.com/docs/what-is-mdx](https://mdxjs.com/docs/what-is-mdx)

## MDX 语法

MDX 是 Markdown 与 JSX 语法的结合。它允许我们在 MD 文件中嵌入 JSX 语法，最终 MDX 文件会被编译成 JS 语法并解析到 HTML 中进行渲染。

### MDX VS MD

下面这些 markdown 语法是不被 MDX 支持的:
- 代码缩进
- 自动链接
- HTML 语法(被 JSX 语法代替)
- JSX 保留字符(需要转义)

### MDX VS JSX

MDX 在支持 JSX 的同时，也支持了绝大部分 JS 语法，甚至包括导入模块:
```js
import {Chart} from './chart.js'
import population from './population.js'
export const pi = 3.14

<Chart data={population} label={'Something with ' + pi} />
```

因此 MDX 往往与具体的前端项目分不开，一般无法脱离项目直接渲染 MDX 文档。一般地，我们在 React 项目中使用 MDX。

## 在项目中使用 MDX

### MDX 组件

MDX 最终会被编译为 JavaScript 文件，因此我们需要争对不同的打包工具下载对应的编译组件:
- 核心编译器: `@mdx-js/mdx`
- Webpack: `@mdx-js/loader`
- rollup(Vite): `@mdx-js/rollup`

针对不同的框架，还需下载对应的组件:
- React: `@mdx-js/react`

在下载完这些组件后,还需要对项目进行配置,针对不同项目,具体的配置方式参考[官网说明](https://mdxjs.com/docs/getting-started)

针对其他框架，甚至文本编辑器/IDE，MDX 都提供了对应的组件，请查看[官网文档](https://mdxjs.com/docs/getting-started)进行配置。

上述所有组件都使用 ts 编写，无需额外安装类型支持。

### MDX 如何起作用

假如我们有这样一串 MDX 代码:
```mdx
export const Thing = () => <>World</>

# Hello <Thing />
```

它大致上会被转换为如下 JSX 代码:
```jsx
/* @jsxRuntime automatic @jsxImportSource react */
export const Thing = () => <>World</>

export default function MDXContent() {
  return <h1>Hello <Thing /></h1>
}
```

最终，MDX 文件会导出一个项目组件(MDXContent)供我们使用。

实际上并没有这么简单，完整的转换后的 js 代码如下所示:

```js
/* @jsxRuntime automatic @jsxImportSource react */
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from 'react/jsx-runtime'

export const Thing = () => _jsx(_Fragment, {children: 'World'})

function _createMdxContent(props) {
  const _components = {
    h1: 'h1',
    ...props.components
  }
  return _jsxs(_components.h1, {
    children: ['Hello ', _jsx(Thing, {})]
  })
}

export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || {}
  return MDXLayout
    ? _jsx(MDXLayout, Object.assign({}, props, {children: _jsx(_createMdxContent, props)}))
    : _createMdxContent(props)
}
```

总而言之，MDX 为我们做了很多性能优化，并最终将 MDX 文件转换为了 JS 文件。我们只需要记住，在项目中一个 MDX 文件会被转换为项目组件。

### 引入 MDX 组件

引入 MDX 组件最简单的方式是将文件作为组件导入:

```js
import React from 'react'
import ReactDom from 'react-dom'
import Example from './example.mdx' // 假定 MDX 被编译成为 JS 组件

const root = ReactDom.createRoot(document.getElementById('root'))
root.render(<Example />)
```

同时也支持下面的引入方式:

```js
import * as everything from './example.mdx'
console.log(everything) // {Thing: [Function: Thing], default: [Function: MDXContent]}

import Content, {Thing} from './example.mdx'
console.log(Content) // [Function: MDXContent]
console.log(Thing) // [Function: Thing]
```

### MDX 传参

既然 MDX 能被编译成组件，那么我们也可以传参给 MDX 文件:

```mdx
# Hello {props.name.toUpperCase()}

The current year is {props.year}
```

传参方式为:

```jsx
import Example from './example.mdx'

React.createElement(Example, {name: 'Venus', year: 2021})

<Example name="Mars" year={2022} />
```

MDX 有一个特殊的属性: `components`, 它接收一个对象映射作为参数:

假设有如下 MDX 文件:

```mdx
# Hello *<Plant />*
```

我们可以这样使用它:

```jsx
import Example from './example.mdx'

<Example components={{Planet: () => <span style={{color: 'tomato'}}>Pluto</span>}} />
```

这样，下面的 `span` 标签内容将替换上文的 `Plant` 标签。

这里给出一些自定义 `components` 的例子:

```jsx
<Example
  components={{
    h1: 'h2',
    em: (props) => <i style={{color: 'goldenrod'}} {...props} />,
    wrapper: ({components, ...rest}) => <main {...rest} />,
    Planet: () => 'Neptune',
    theme: {text: (props) => <span style={{color: 'grey'}} {...props} />}
  }}
/>
```

此外，MDX 文件可以嵌套使用:

```mdx
import License from './license.md'
import Contributing from './docs/contributing.mdx'

# Hello world

<License />
<Contributing />
```

### MDXProvider

除非必要，不要特意使用 `MDXProvider`, 它完全可以用 `components` 代替。

当我们要给多个 MDX 组件传相同的 `components` 时，需要写很多重复的代码:

```mdx
import License from './license.md'
import Contributing from './docs/contributing.mdx'

# Hello world

<License components={props.components} />
<Contributing components={props.components} />
```

大部分框架也会遇到类似的情况，并提供了 `context` 作为解决方案，MDX 也给出了简化方案:

```diff
 import React from 'react'
 import ReactDom from 'react-dom'
 import Post from './post.mdx' // Assumes an integration is used to compile MDX -> JS.
 import {Heading, /* … */ Table} from './components/index.js'
+import {MDXProvider} from '@mdx-js/react'

 const components = {
   h1: Heading.H1,
   // …
   table: Table
 }

 const root = ReactDom.createRoot(document.getElementById('root'))
-root.render(<Post components={components} />)
+root.render(
+  <MDXProvider components={components}>
+    <Post />
+  </MDXProvider>
+)
```

此时我们就可以删除重复的代码:

```diff
-<License components={props.components} />
+<License />

-<Contributing components={props.components} />
+<Contributing />
```

同时 `MDXProvider` 也是支持嵌套使用的:

```jsx
<MDXProvider components={{h1: Component1, h2: Component2}}>
  <MDXProvider components={{h2: Component3, h3: Component4}}>
    <Content />
  </MDXProvider>
</MDXProvider>
```