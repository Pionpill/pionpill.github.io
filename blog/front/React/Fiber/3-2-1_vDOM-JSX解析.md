---
difficulty: medium
type: origin
pre: +/front/React/Fiber/3-1-2_概念-Fiber架构
rear: +/front/React/Fiber/3-2-2_vDOM-FiberNode
---

# JSX 解析

> 主要源码: [ReactElement](https://github.com/facebook/react/blob/main/packages/react/src/ReactElement.js)

## JSX 与 babel

JSX 是一种**描述当前组件内容的数据结构**。JSX 不是由 react 解析的，而是通过 babel 编译后交给 `React.createElement` 处理。

```
JSX -> babel -> React.createElement -> vDOM
```

<p class="tip">其实 babel 编译过程中使用到的 react jsx 插件也是 react 团队提供的。但是 JSX 并不符合 H5 语法标准。需要经过 babel 这类的编译器转换为标准的 js 代码才能交给 react 框架处理。</p>

在 React 17 之前，使用 JSX 语法需要显式引入 react 模块：

```js
import React from 'react';
```

如果不这样做会报错未定义变量 React 。React17 引入了一个名为 React JSX Transform 的转译器，能够在编译阶段将 JSX 语法转换为普通的 JS 代码，也就不需要依赖 React 模块了。

JSX 并不是 react 独有的，在 vue 项目中也可以使用 JSX 语法。因此，在 babel 编译过程中可以指定相关插件将 JSX 编译为哪个函数调用(react 中默认为 createElement)。

<p class="tip">JSX 编译过程不是重点(作者不了解 babel 编译原理😅)，所以我们跳过这一步。</p>

## createElement

> 官方 API 文档[英]: [https://react.dev/reference/react/createElement](https://react.dev/reference/react/createElement)

### createElement 的功能

先看一下函数声明:

```ts
function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    type: keyof ReactHTML,
    props?: ClassAttributes<T> & P | null,
    ...children: ReactNode[]): DetailedReactHTMLElement<P, T>;
```

他接受三个参数:
- `type`: 一般是 string 类型，比如常见的 html 标签名，自定义组件名。也可以是 React 支持的组件(function | class | component)，比如 `Fragment`。
- `props`: 元素属性，比如 class，自定义的 prop。注意 `ref` 和 `key` 比较特殊。他们直接挂在 `element.key`, `element.ref` 上，其他属性挂在 `element.prop.xxx` 上。
- `children`: 子节点，一般为 ReactNode 类型的数组，也可以是 string，null...

`createElement` 方法的返回值是一个带有如下属性的 React 元素:
- `type`: 元素类型
- `props`: 元素属性，包含 children
- `ref`: 传过来的 ref
- `key`: 唯一标识，做优化用的

使用 `createElement` 创建的 React 元素有如下特点:
- 所有元素和它的 `props` 都是不可变的，在创建之后不允许改变他们的任一属性。在开发模式种，react 会冻结元素及其 `props` 强制开发者遵守这一原则。
- 使用 JSX 语法创建元素时必须使用**大驼峰**命名法创建。大驼峰创建的 `<Element/>` 会被正确传给 `createElement<Element>`，如果使用小驼峰法创建，则会传字符串给 `createElement<element>`（被认为是原生标签）。
- 在传递 `children` 属性时，如果 `children` 是可知的，应该通过 `createElement('h1', {}, child1, child2, ...)` 的方式传递。如果是变化的，则应该传递 `createElement('h1', {}, chidList)`。同时传 key 给每个数组元素。

下面为某个元素的 JSX 创建语法与等效的 `createElement` 函数调用:

```jsx
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

### createElement 源代码

源码地址：[✨约602行](https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js#L602)

```js
export function createElement(type, config, children) {
  let propName;
  const props = {};
  let key, ref, self, source = null;

  // 1. 属性处理逻辑: 赋值给 props
  if (config != null)
    // ...........

  // 2. children 处理逻辑
  const childrenLength = arguments.length - 2;
  // ...........

  // 3. 处理标签默认属性
  if (type && type.defaultProps)
    // ............

  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props );
}
```

这个方法本质上是一个预处理器，接收 JSX 编译后的三个参数，分别对他们进行处理，最后创建一个 ReactElement 对象(实际上是一个函数，但是它首字母大写，就认为他是个对象好了)返回。

我们分别看一下 3 个处理过程:
1. config 逻辑: 处理 `key`, `ref`, `props`
    ```js
    if (config != null) {
      config.ref !== undefined && ref = config.ref;
      // 最终转换为了 str 类型
      config.key !== undefined && key = '' + config.key;

      self = config.__self ?? null;
      source = config.__source ?? null;
      // 只保留必要的属性
      for (propName in config) {
        if (
          hasOwnProperty.call(config, propName) &&
          // 排除 key, ref, __self, __source 这些属性
          !RESERVED_PROPS.hasOwnProperty(propName)
        ) {
          props[propName] = config[propName];
        }
      }
    }
    ```
2. children 逻辑：多个 children 转为数组
    ```js
    const childrenLength = arguments.length - 2;
    // 只有一个子元素，或者子元素是数组
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      // 转换为数组
      const childArray = Array(childrenLength);
      for (let i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      if (__DEV__ && Object.freeze) {
        // DEV 环境封印 children!
        Object.freeze(childArray);
      }
      // 最终放到 props 里面了
      props.children = childArray;
    }
    ```
3. type 逻辑: 默认属性加到 props 里面去
    ```js
    // 如果传进来的标签有默认属性，加到 props 里面取
    if (type && type.defaultProps) {
      const defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }
    ```

### ReactElement

这个对象就更简单了，直接上代码（[✨约177行](https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js#L177)）:

```js
function ReactElement(type, key, ref, self, source, owner, props) {
  const element = {
    // 一个标识：确定某个对象是 React Element
    $$typeof: REACT_ELEMENT_TYPE, 
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  };
  return element;
}
```

这就返回了一个对象，里面有我们需要的数据。在测试环境做了一些访问限制。

<p class="tip">剧透，react 组件冻结 props 和 children 的原因有: 在只读模式下，保证内部数据可靠；在 diff 时，通过浅比较判断是否需要更新组件，提高性能。后文会详细讨论这种做法带来的影响。</p>

这里的 `$$typeof` 标识会在如下方法中使用:

```js
export function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```

我们在写 react 组件时，常用到 ClassComponent 和 FunctionComponent。他们所对应的 `type` 分别是 `AppClass`,`AppFunc`。例如某某个函数组件对应的 Element 结构可能如下:

```js
{
  $$typeof: Symbol(react.element),
  key: null,
  props: {},
  ref: null,
  type: ƒ AppFunc(),
  _owner: null,
  _store: {validated: false},
  _self: null,
  _source: null 
}
```

由于这两种形式的组件 type 都是 Function 类型，可以这样判断是否为类组件:

```js
ClassComponent.prototype.isReactComponent = {};
```

## JSX 与 vDOM

上文理了一遍 JSX -> ReactElement 的过程，总结一下，这个过程将 JSX 语法转换为了一个对象，这个对象包含的数据及注意点如下:

```js
{
  $$typeof: REACT_ELEMENT_TYPE, // 标识它是一个 ReactElement
  type: type, // 标记它的类型
  key: key, // 优化用的 key，一个字符串
  ref: ref, // 一个引用
  props: props, // 元素属性，children 也在里面。会被冻结
  _owner: owner, // 指向父元素
}
```

这是一个完整的 ReactElement 但还不是 vDOM。要想在 Fiber 架构进行更新，它还缺少了如下内容:
- Scheduler: 需要一个优先级。
- Reconciler: 组件的 state。
- Renderer: 被 Reconciler 打上的标记。

在组件 mount 过程中，Reconciler 会根据 JSX 描述的内容生产对应的 vDOM。在 update 过程中，则将 JSX 与现有的 vDOM 数据对比，生成对应的 vDOM，根据结果为 vDOM 打上标记。