---
difficulty: easy
type: note
---

# VueRouter 基础

> VueRouter 官网文档: [https://router.vuejs.org/zh/](https://router.vuejs.org/zh/)

<p class="hint">简要介绍 Vue Router 的概念与使用方式</p>

VueRouter 主要干一件事，让组件映射到路由上。项目安装指令:

```bash
npm i vue-router
```

## 基础用法

<p class="discuss">View Router 使用上和 React Router 非常像，如果学过后者，可以跳着读。</p>

在我们的组件中使用 VueRouter 涉及到两个基础组件:
- `router-link`: 类似于 `a` 标签，有一个必填的 `to` 属性，表示要跳转的路由，会生成一个链接，点击跳转路由。这个标签可以让 VueRouter 在不重新加载页面的情况下更改 URL。
- `router-view`: 将显示与 url 对应的组件，可以放在任何地方。

```html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <router-link to="/">Go to Home</router-link>
    <router-link to="/about">Go to About</router-link>
  </p>
  <router-view></router-view>
</div>
```

定义路由组件，通过 `createRouter` 创建路由组件(假设写好了 Home, About 两个组件):

```js
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),  // 路由模式
  routes, // `routes: routes` 的缩写
})

const app = Vue.createApp({})
app.use(router)
app.mount('#app')
```

在组件中可以以 `this.$router` 的形式访问路由，在组合式 API 的 `setup` 函数中可以通过 `useRouter` 或 `useRoute` 钩子访问，这两种方式是完全等价的(下文都用 $router 方便一点)。

```js
export default {
  computed: {
    username() {
      return this.$route.params.username
    },
  },
  methods: {
    goToDashboard() {
      if (isAuthenticated) {
        this.$router.push('/dashboard')
      } else {
        this.$router.push('/login')
      }
    },
  },
}
```

## 动态路由

动态路由使用路径参数来表示即可，具体语法是 `:param`:

```js
const routes = [
  // 动态字段以冒号开始
  { path: '/users/:id', component: User },
]
```

这样的话 URL 中 `/users` 下一级路由字段就会被捕获为 id，具体使用:

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
}
```

可以同时设置多个路由，对会映射到 `$route.params` 上相应的字段:

| 匹配模式                       | 匹配路径                 | $route.params                          |
| :----------------------------- | :----------------------- | :------------------------------------- |
| /users/:username               | /users/eduardo           | { username: 'eduardo' }                |
| /users/:username/posts/:postId | /users/eduardo/posts/123 | { username: 'eduardo', postId: '123' } |

### 处理路由变化

当切换路由时，相同的组件实例将被复用。因为两个路由渲染相同的组件，复用更高效。不过，这也意味着组建的**生命周期钩子不会被调用**。

如果要对路由变化做出响应，最简单的方法时在 watch 上监听 `$route` 对象上的属性:

```js
created() {
  this.$watch(
    () => this.$route.params,
    (toParams, previousParams) => {
      // 对路由变化做出响应...
    }
  )
}
```

也可以使用 `beforeRouteUpdate`:

```js
async beforeRouteUpdate(to, from) {
  // 对路由变化做出响应...
  this.userData = await fetchUser(to.params.id)
}
```

### 捕获所有路由

常规参数只能捕获 url 片段之间的字符(用 `/` 分隔)。如果要匹配任意路径，可以用自定义的路径参数正则表达式，在路径参数后面的括号中加入正则表达式:

```js
const routes = [
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  // 将匹配以 `/user-` 开头的所有内容，并将其放在 `$route.params.afterUser` 下
  { path: '/user-:afterUser(.*)', component: UserGeneric },
]
```

<p class="tip">看不懂没关系，先看下面的。</p>

## 路由的匹配语法

<p class="tip">为了简单起见，这小节代码都省略 component 属性，只关注 path 值</p>

### 在参数中自定义正则

有时候我们需要根据参数内容分配不同的路由，这时候可以用正则表达式，正则表达式写在动态路由地后面，用括号包裹(反斜杠需要转义):

```js
const routes = [
  // /:orderId -> 仅匹配数字
  { path: '/:orderId(\\d+)' },
  // /:productName -> 匹配其他任何内容
  { path: '/:productName' },
]
```

这里我们定义了两个路由 `/:orderId` 和 `/:productName`，如果是数字会匹配到 `orderId` 上，否则匹配到 `productName`。

<p class="tip">routes 数组的顺序并不重要!</p>

### 可重复的参数

如果需要匹配具有多个部分的路由，如 `/first/second/third`，应该用 * 和 + 标记:

```js
const routes = [
  // 1个或多个 /:chapters ->  匹配 /one, /one/two, /one/two/three, 等
  { path: '/:chapters+' },
  // 0个或多个 /:chapters -> 匹配 /, /one, /one/two, /one/two/three, 等
  { path: '/:chapters*' },
]
```

这将提供一个参数数组，而不是一个字符串，使用路由也必须传数组:

```js
// 给定 { path: '/:chapters*', name: 'chapters' },
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// 产生 /
router.resolve({ name: 'chapters', params: { chapters: ['a', 'b'] } }).href
// 产生 /a/b

// 给定 { path: '/:chapters+', name: 'chapters' },
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// 抛出错误，因为 `chapters` 为空
```

也可以在括号后增加它们与正则结合使用:

```js
const routes = [
  // 仅匹配数字
  // 匹配 /1, /1/2, 等
  { path: '/:chapters(\\d+)+' },
  // 匹配 /, /1, /1/2, 等
  { path: '/:chapters(\\d+)*' },
  // 匹配 /, /1, 等
  { path: '/:chapters(\\d+)?' },
]
```

### 路由配置

默认情况下，所有路由是不区分大小写的，并且能匹配带有或不带有尾部斜线的路由。VueRouter 提供了两个参数来进行路由配置:
- `strict`: 尾部不许加斜线
- `sensitive`: 大小写敏感

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 将匹配 /users/posva 而非：
    // - /users/posva/ 当 strict: true
    // - /Users/posva 当 sensitive: true
    { path: '/users/:id', sensitive: true },
    // 将匹配 /users, /Users, 以及 /users/42 而非 /users/ 或 /users/42/
    { path: '/users/:id?' },
  ],
  strict: true, // 对所有路由生效
})
```

## 嵌套路由

嵌套路由在父路由中加上 `children` 属性就行了，`children` 属性值的写法和 `routes` 一模一样:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 <router-view> 内部
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

记得给子路由的组件留出 `router-view` 就行了。

### 嵌套的命名路由

处理命名路由(下文会讲)时，通常需要给子路由命名:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    // 请注意，只有子路由具有名称
    children: [{ path: '', name: 'user', component: UserHome }],
  },
]
```

这将确保导航到 `/user/:id` 时始终显示嵌套路由。

在一些场景中，你可能希望导航到命名路由而不导航到嵌套路由。例如，你想导航 `/user/:id` 而不显示嵌套路由。那样的话，你还可以命名父路由，但请注意重新加载页面将始终显示嵌套的子路由，因为它被视为指向路径 `/users/:id` 的导航，而不是命名路由：

```js
const routes = [
  {
    path: '/user/:id',
    name: 'user-parent',
    component: User,
    children: [{ path: '', name: 'user', component: UserHome }],
  },
]
```

## 编程式导航

除了 `<router-link>` 创建 a 标签来定义导航链接，还可以借助 router 的实例方法，通过编写代码来实现。

### 导航到不同的位置

在 Vue 实例中，可以通过 `this.$router.push` 导航到不同的地方，从名字上也看得出，就是给浏览器的 history 栈添加一个新的记录，`<router-link :to="...">` 本质上也是调用了这个方法。

该方法的参数可以是一个字符串路径，或者一个描述地址的对象:

```js
// 字符串路径
router.push('/users/eduardo')
// 带有路径的对象
router.push({ path: '/users/eduardo' })
// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })
// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })
// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```

如果提供了 `path`, `params` 会被忽略:

```js
const username = 'eduardo'
// 我们可以手动建立 url，但我们必须自己处理编码
router.push(`/user/${username}`) // -> /user/eduardo
// 同样
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// 如果可能的话，使用 `name` 和 `params` 从自动 URL 编码中获益
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
// `params` 不能与 `path` 一起使用
router.push({ path: '/user', params: { username } }) // -> /user
```

由于属性 `to` 与 `router.push` 接受的对象种类相同，所以两者的规则完全相同。

`router.push` 和所有其他导航方法都会返回一个 Promise，让我们可以等到导航完成后才知道是成功还是失败。

### 替换当前位置

作用和 `router.push` 一毛一样，唯一的区别是不会再浏览器的 history 栈中添加记录，下面两种写法是等价的:

```js
router.push({ path: '/home', replace: true })
router.replace({ path: '/home' })
```

### 横跨历史

`router.go` 提供了在浏览器 history 栈中推进或后退的操作:

```js
// 向前移动一条记录，与 router.forward() 相同
router.go(1)
// 返回一条记录，与 router.back() 相同
router.go(-1)
// 前进 3 条记录
router.go(3)
// 如果没有那么多记录，静默失败
router.go(-100)
router.go(100)
```

## 命名路由和命名视图

### 命名路由

Vue 允许我们给路由命名:

```js
const routes = [
  {
    path: '/user/:username',
    name: 'user',
    component: User,
  },
]
```

如果要链接到一个命名的路由，可以这样做:

```html
<!-- 声明式 -->
<router-link :to="{ name: 'user', params: { username: 'erina' }}">
  User
</router-link>
```

```js
// 命令式
router.push({ name: 'user', params: { username: 'erina' } })
```

### 命名视图

如果想要同时展示多个视图，而不是嵌套展示，就可以使用命名视图。直接看代码吧:

```html
<router-view name="LeftSidebar"></router-view>
<router-view></router-view>
<router-view name="RightSidebar"></router-view>
```

我们定义了两个命名视图，如果不命名的话，默认就是 `default`。然后我们配置到 `router` 中:

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: Home,
        // LeftSidebar: LeftSidebar 的缩写
        LeftSidebar,
        // 它们与 `<router-view>` 上的 `name` 属性匹配
        RightSidebar,
      },
    },
  ],
})
```

<p class="discuss">有点语法糖的味道，完全可以再写一个中间组件，将 LeftSidebar，RightSidebar 放进去，再导入到路由中。</p>

## 重定向和别名

### 重定向

重定向价格 `redirect` 参数就可以了，值可以是路由或者命名路由:

```js
const routes = [{ path: '/home', redirect: '/' }]
const routes = [{ path: '/home', redirect: { name: 'homepage' } }]
```

<p class="warn">请注意，导航守卫(下文会讲)并没有应用在跳转路由上，而仅仅应用在其目标上。在上面的例子中，在 /home 路由中添加 beforeEnter 守卫不会有任何效果。</p>

甚至可以是一个方法:

```js
const routes = [
  {
    // /search/screens -> /search?q=screens
    path: '/search/:searchText',
    redirect: to => {
      // 方法接收目标路由作为参数
      // return 重定向的字符串路径/路径对象
      return { path: '/search', query: { q: to.params.searchText } }
    },
  },
]
```

#### 相对重定向

重定向把子路由前的斜杠取消就是相对重定向:

```js
const routes = [
  {
    // 将总是把/users/123/posts重定向到/users/123/profile。
    path: '/users/:id/posts',
    redirect: to => {
      // 相对位置不以`/`开头
      // 或 { path: 'profile'}
      return 'profile'
    },
  },
]
```

### 别名

将 `/` 别名为 `/home`，意味着当用户访问 `/home` 时，URL 是 `/home`，但实际正在访问 `/`。

```js
const routes = [{ path: '/', component: Homepage, alias: '/home' }]
```

如果路由有参数们需要再任何绝对别名中包含它们:

```js
const routes = [
  {
    path: '/users/:id',
    component: UsersByIdLayout,
    children: [
      // 为这 3 个 URL 呈现 UserDetails
      // - /users/24
      // - /users/24/profile
      // - /24
      { path: 'profile', component: UserDetails, alias: ['/:id', ''] },
    ],
  },
]
```

<p class="discuss">个人觉得，还是不要乱用别名好，项目容易乱。</p>

## 路由组件传参

在组建中直接使用 `$route` 会与路由紧密耦合，限制了组件的灵活性，我们可以通过 `props` 配置来解除这种行为。

原始代码:

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const routes = [{ path: '/user/:id', component: User }]
```

替换成:

```js
const User = {
  // 请确保添加一个与路由参数完全相同的 prop 名
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const routes = [{ path: '/user/:id', component: User, props: true }]
```

当 `props` 被设置为 `true` 时，`route.params` 将被设置为组件的 props。

对于由命名视图的路由，必须为每个命名视图定义 `props` 配置:

```js
const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false }
  }
]
```

当 props 是一个对象时，他将原样设置为组件 props。

```js
const routes = [
  {
    path: '/promotion/from-newsletter',
    component: Promotion,
    props: { newsletterPopup: false }
  }
]
```

你可以创建一个返回 props 的函数。这允许你将参数转换为其他类型，将静态值与基于路由的值相结合等等。

```js
const routes = [
  {
    path: '/search',
    component: SearchUser,
    props: route => ({ query: route.query.q })
  }
]
```

URL `/search?q=vue` 将传递 `{query: 'vue'}` 作为 props 传给 `SearchUser` 组件。

## 历史模式

目前有两种主流的历史模式:
- hash 模式: URL 之前会带一个哈希字符(#)，可以理解为将视图做了一个哈希映射，浏览器会自动根据哈希值找资源渲染页面。
- H5 模式: 浏览器根据 URL 访问对应的文件，如果我们的页面是一个 SPA(单页面应用)，直接访问 URL 可能会定义不到对应的文件而报 404 错。

<p class="tip">要解决这个问题，一个方法是在服务器上添加回退回路，或者在 nginx 上进行配置。另一个方法是加一个 404.html 文件，出现 404 错误会进入这个文件查资源，将 404.html 和我们的入口文件 index.html 设置为一样，这样进入 404 的时候就会回到正常逻辑。</p>

H5 模式是现在主流的模式:

```js
const router = createRouter({
  history: createWebHistory(),
  // ...
})
```