---
difficulty: easy
type: note
---

# Less

<p class="hint">官方文档为英文，部分支持英文，但是没有完全翻译</p>

> 官方文档(英): [https://less.bootcss.com](https://less.bootcss.com)

Less(Leaner Style Sheets) 是一门**向后兼容**的 CSS 扩展语言。Less 对 CSS 增加了少许方便的扩展，Less 可以被编译为 CSS。很多主流的 CSS 包或 UI 框架(例如 styled-components, emotion, antd, bootstrap) 都借鉴了 Less 的思想。

全局安装并编译 Less:

```bash
npm i less -g
lessc styles.less styles.css
```

仅在项目中使用:

```bash
npm i less --save-dev
```

less 在服务端或浏览器上使用的方式，以及编译指令: [Less Usage](https://less.bootcss.com/usage)

## Less 基础语法

### 变量

Less 允许我们通过 `@var` 的方式自定义变量并在 CSS 中使用。

```less
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}
```

```css
#header {
  width: 10px;
  height: 20px;
}
```

### 混合

混合允许我们将一组属性从一个规则包含到另一个规则集中，具体写法是加上一个小括号，类似于函数执行:

```css
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```

混入其他规则集:

```css
#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```

### 嵌套

嵌套可以替代层叠或与层叠结合，假设有如下代码:

```css
#header {
  color: black;
}
#header .navigation {
  font-size: 12px;
}
#header .logo {
  width: 300px;
}
```

使用 Less 可以替换为:

```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
```

还可以使用此方法将伪选择器（pseudo-selectors）与混合（mixins）一同使用。下面是一个经典的 clearfix 技巧，重写为一个混合（mixin） (& 表示当前选择器的父级):

```less
.clearfix {
  display: block;
  zoom: 1;

  &:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
```

#### @规则嵌套和冒泡

@ 规则（例如 @media 或 @supports）可以与选择器以相同的方式进行嵌套。@ 规则会被放在前面，同一规则集中的其它元素的相对顺序保持不变。这叫做冒泡（bubbling）:

```less
.component {
  width: 300px;
  @media (min-width: 768px) {
    width: 600px;
    @media  (min-resolution: 192dpi) {
      background-image: url(/img/retina2x.png);
    }
  }
  @media (min-width: 1280px) {
    width: 800px;
  }
}
```

会被编译为:

```css
.component {
  width: 300px;
}
@media (min-width: 768px) {
  .component {
    width: 600px;
  }
}
@media (min-width: 768px) and (min-resolution: 192dpi) {
  .component {
    background-image: url(/img/retina2x.png);
  }
}
@media (min-width: 1280px) {
  .component {
    width: 800px;
  }
}
```

### 运算

算数运算符: `+,-,*,/` 可以对任何数字，颜色或变量进行运算。如果可能，算术运算会在加、减或比较之前会进行单位换算。计算的结果以最左侧操作数的单位类型为准。如果单位换算无效或失去意义，则忽略单位。无效的单位换算例如：px 到 cm 或 rad 到 % 的转换:

```less
// 所有操作数被转换成相同的单位
@conversion-1: 5cm + 10mm; // 结果是 6cm
@conversion-2: 2 - 3cm - 5mm; // 结果是 -1.5cm

// conversion is impossible
@incompatible-units: 2 + 5px - 3cm; // 结果是 4px

// example with variables
@base: 5%;
@filler: @base * 2; // 结果是 10%
@other: @base + @filler; // 结果是 15%
```

乘除法不做换算，因为这两种运算在大多数情况下没有意义，CSS 也不支持。Less 的乘除法仅对数字进行运算，单位为最左操作数的单位类型为准。

```less
@base: 2cm * 3cm;   // 结果是 6cm
```

还可以对颜色进行算数运算:

```less
@color: (#224488 / 2); // 结果是 #112244
background-color: #112244 + #111; // 结果是 #223355
```

不过 Less 提供了功能更强的色彩函数。

从 Less 4.0 开始，色彩运算需要在括号内执行，否则返回无效的字符串:

```less
@color: #222 / 2; // `#222 / 2`、
background-color: (#FFFFFF / 16); // #101010
```

可以通过修改配置的方式让运算生效，不过并不推荐。

#### calc() 特例

为了与 CSS 兼容，Less 并不会对 `calc()` 括号内的内容进行数学计算，但是会获取变量和数学公式的值。

```less
@var: 50vh/2;
width: calc(50% + (@var - 20px));  // 结果是 calc(50% + (25vh - 20px))
```

### 转义

转义 (Escaping) 允许你使用任意字符串作为属性或变量值。任何 `~"anything"` 或 `~'anything'` 形式的内容都将按原样输出。

```less
@min768: ~"(min-width: 768px)";
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

编译为:

```css
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```

从 Less3.5 开始，可以简写为:

```less
@min768: (min-width: 768px);
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

### 函数

less 内置了很多用于转换颜色，处理字符串，算术运算等的函数，例如:

```less
@base: #f04615;
@width: 0.5;

.class {
  width: percentage(@width);    // 转换为百分比
  color: saturate(@base, 5%);   // 饱和度增加 5%
  background-color: spin(lighten(@base, 25%), 8); // 亮度降低 25%，且色相值增加 8
}
```

### 命名空间和访问符

如果希望对混合 (mixins) 进行分组，可以用 Less 实现这一点，假设有如下 Less:

```less
#bundle() {
  .button {
    display: block;
    border: 1px solid black;
    background-color: grey;
    &:hover {
      background-color: white;
    }
  }
  .tab { ... }
  .citation { ... }
}
```

现在将 `.button` 类混合到 `#header a` 中，可以这样做:

```less
#header a {
  color: orange;
  #bundle.button();  // 还可以书写为 #bundle > .button 形式
}
```

### 映射

从 Less 3.5 开始，可以将混合和规则集作为一组值的映射使用:

```less
#colors() {
  primary: blue;
  secondary: green;
}

.button {
  color: #colors[primary];
  border: 1px solid #colors[secondary];
}
```

编译后:

```css
.button {
  color: blue;
  border: 1px solid green;
}
```

### 作用域

Less 的作用域和 CSS 的类似，首先在本地查找，如果找不到再前往父级查找，且查找的对象不必再引用声明之前定义:

```css
@var: red;
#page {
  #header {
    color: @var; // white
  }
  @var: white;
}
```

### 注释

Less 支持块注释和行注释

```less
/* 一个块注释
 * style comment! */
@var: red;

// 这一行被注释掉了！
@var: white;
```

### 导入

less 文件可以导入 less,css 等文件，如果导入的是 less 文件，可以省略扩展名:

```less
@import "library"; // library.less
@import "typo.css";
```

## Less 函数

<p class="hint">Less 的函数很多，这里只给出一些常用的</p>

### 逻辑函数

Less 支持两个逻辑函数 `if` 和 `boolean`。

#### if

`if` 函数需要三个参数:
- `condition`: 表达式，返回值必须是布尔类型
- `value1`: 判断为真的返回值
- `value1`: 判断为假的返回值

最基础的用法:

```less
if((2 > 1), 0, 3px)
```

`if` 函数同时支持以下运算符: `not`, `and`, `or`。

```less
if(not (true), foo, bar);
if((true) and (2 > 1), foo, bar);
if((false) or (isstring("boo!")), foo, bar);
```

<p class="version">在 3.6 版本之前, 表达式(第一个参数)必须用括号包起来。</p>

#### `boolean`

`boolean` 接受一个表达式作为参数，返回表达式的布尔结果。一般的用法是存储一个布尔变量:

```less
@bg: black;
@bg-light: boolean(luma(@bg) > 50%);

div {
  background: @bg; 
  color: if(@bg-light, black, white);
}
```

### 数学函数

Less 的数学函数非常多，这里只给出一个，其他的和 js Math 库提供的类似:

`ceil` 函数返回一个数值的向上取整值: 

```less
ceil(2.4)   // 3
```

### 类型函数

类型函数一般接受一个参数，允许我们检测这个参数是否符合条件:
- `isnumber`: 判断是否为数字，注意带单位的参数也会判断为 `true`
- `isstring`: 判断是否为字符串
- `iscolor`: 判断是否为颜色，颜色吗也返回 `true`
- `isurl`: 判断是否为 url，一般指使用 css `url` 函数的返回值
- `ispixel`: 判断是否为像素单位
- `isem`: 判断是否为 `em` 单位
- `ispercentage`: 判断是否为百分比
- `isunit`: 接受两个参数，第二个参数为单位，判断第一个参数单位是否为第二个参数: `isunit(4rem, rem)`
- `isdefined`: 判断变量是否被定义过
- `isruleset`: 判断是否为 ruleset

### 颜色函数

Less 提供的颜色函数非常丰富，除了定义颜色，我们还可以对颜色做各种变换处理。

#### 颜色定义函数

Less 提供了以下颜色定义函数:
- `rgb`: 接受三个参数，分别代表红绿蓝，三个参数可以是 0-255 的数值或者 0-100% 的百分数。
- `rgba`: 比 `rgb` 函数多了 alpha 通道参数，值可以是 0-100 的数值或者 0-100% 的百分数。
- `argb`: 将常规的颜色类型转换为 hex 形式(出于兼容设计)。
- `hsl`: 以 hsl 格式生成颜色，三个参数分别表示色调(0-360)，饱和度(0-1/0-100%)，亮度(0-1/0-100%)。
- `hsla`: 和 `rgba` 类似，增加了 alpha 通道。

#### 颜色通道函数

这里的函数用于获取颜色的"属性"，例如三原色值，亮度饱和对等。
- `hue`, `saturation`, `lightness`: 获取 HSL 颜色的色调，饱和度，亮度。
- `red`, `green`, `blue`: 获取 rgb 颜色的三原色值。
- `alpha`: 获取颜色透明度。

#### 颜色操作函数

这里的函数用于调整已有的一些颜色:
- `saturate`, `desaturate`: 增强/减弱颜色的饱和度。接受两个参数，第一个参数为 hsl 颜色，第二个参数为变化的百分数。
- `lighten`, `darken`: 增强/减弱颜色的亮度。接受两个参数，第一个参数为颜色，第二个参数为变化的百分数。
- `fadein`, `fadeout`: 增强/减弱颜色的不透明度。接受两个参数，第一个参数为颜色，第二个参数为变化的百分数。
- `fade`: 为颜色增加不透明度。接受两个参数，第一个参数为颜色，第二个参数为不透明度。
- `spin`: 调整颜色色调。接受两个参数，第一个参数为颜色，第二个参数为调整值。
- `mix`: 将两个颜色混合。接受三个参数，前两个为要混合的对象，第三个为混合对象所占百分比。
- `tint`, `shade`: 接受两个参数，将颜色与白色/黑色混合。第一个参数为要混合的对象，第二个为颜色占比。
- `greyscale`: 将彩色转换为黑白。

#### 颜色混合函数

这里的函数都接受两个颜色作为参数，以不同的方式将两种颜色混合起来(比较抽象):
- `multiply`: 将两个颜色值相乘，总是返回更深的颜色。
- `screen`: 将两个颜色值相除，总是返回更浅的颜色。
- `overlay`: 深的地方更深，浅的地方更浅，取决于第一个颜色。
- `softlight`: 和 `overlay` 类似，但不会出现纯黑纯白的情况。 
- `hardlight`: 和 `overlay` 效果相同，但作用域第二个颜色。

### 其他函数

Less 还提供了一些有用的函数:
- `color`: 接受一个参数(字符串)，将字符串转换为颜色。
- `image-size`: 接受一个图片路由作为参数，返回它的尺寸:
  ```less
  image-size("file.png");   // 10px 10px
  ```
- `image-width`, `image-height`: 和上面类似，但只返回宽度/高度。
- `convert`: 接受两个参数: 属性值与单位，根据第二个参数将属性值换算:
  ```less
  convert(9s, "ms")   // 9000ms
  convert(14cm, mm)   // 140mm
  ```
- `unit`: 接受两个参数: 属性值与单位，根据单位改变属性值:
  ```less
  unit(5, px)   // 5px
  unit(5em)     // 5
  ```
- `get-unit`: 获取参数的属性值。