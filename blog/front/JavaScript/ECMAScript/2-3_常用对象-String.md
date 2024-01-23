---
difficulty: easy
type: note
---

# String

> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)

## 作用

常见的有三种创建 `string` 的方法:

```js
const s1 = 'string1';     // 字面量
const s2 = `string${2}`;  // 模板字符串
const s3 = String(NaN);   // 工厂函数
```

理论上也可以通过 `new String()` 创建 `String` 对象，并且此时使用 `typeof` 判断会返回 `object`，但是不应该这样做。

JS 的 `string` 很特殊，是简单类型，它是不可写的，无法更改一个 `string` 变量，只能重新开辟内存空间。

<p class="tip">类似于 Python 的 tuple 类型</p>

对象转换为 `string` 过程中会先后尝试获取: `[Symbol.toPrimitive]('string')`, `toString`, `valueOf` 的值。

## 静态方法

有三种创建 `string` 类型的静态方法:
- `String.fromCharCode()`: 使用指定的 Unicode 值序列创建字符串
- `String.fromCodePoint()`: 使用指定的码位序列创建字符串
- `String.raw()`: 使用原始模板字符串创建字符串

## 实例属性与方法

重要的实例属性只有一个: `length` 返回字符串长度。String 的实例方法很多，我将其分为几类:

查询相关实例方法:
- `String.prototype.charAt()`: 返回指定索引处的字符
- `String.prototype.at()`: 返回指定索引处的字符，可以传负值，表示从后往前
- `String.prototype.charCodeAt()`: 返回指定 UTF-16 码元的索引值
- `String.prototype.codePointAt()`: 返回从某个位置开始的指定 UTF-16 码元的索引值
- `String.prototype.startsWith()`: 判断字符串是否以传入的值结尾
- `String.prototype.endsWith()`: 判断字符串是否以传入的值结尾
- `String.prototype.includes()`: 判断字符串是否存在传入的值
- `String.prototype.indexOf()`: 搜索传入的值，并返回第一次出现的索引，如果找不到返回 -1
- `String.prototype.lastIndexOf()`: 搜索传入的值，并返回最后一次出现的索引，如果找不到返回 -1
- `String.prototype.search()`: 正则匹配
- `String.prototype.match()`: 正则匹配，在返回值上与 `search` 有所不同
- `String.prototype.matchAll()`: 正则匹配，返回的是所有匹配项的迭代器
- `String.prototype.localCompare()`: 指示一个参考字符串 `compareString` 是否在排序顺序前面或之后或与给定字符串相同
- `String.prototype.isWellFormed()`: 判断字符串是否存在任何单独代理项
- `String.prototype.toWellFormed()`: 将单独代理项都替换为 Unicode 字符

转换相关实例方法:
- `String.prototype.concat()`: 合并两个(或多个)字符串文本并返回
- `String.prototype.normalize()`: 返回调用字符串值的 Unicode 规范化形式
- `String.prototype.padStart()`: 使用指定字符串在开头填充当前字符串并返回
- `String.prototype.padEnd()`: 使用指定字符串在尾部填充当前字符串并返回
- `String.prototype.repeat()`: 返回当前字符串重复 n 次组成的字符串
- `String.prototype.replace()`: 替换匹配的字符串
- `String.prototype.replaceAll()`: 替换匹配的所有字符串
- `String.prototype.slice()`: 提取字符串的一部分并返回一个新字符串
- `String.prototype.split()`: 由指定字符串将原字符串拆分，返回拆分后的字符串数组
- `String.prototype.substring()`: 获取子串
- `String.prototype.toLowerCase()`: 转换为当小写
- `String.prototype.toUpperCase()`: 转换为当大写
- `String.prototype.toLocalLowerCase()`: 转换为当前语言环境的小写
- `String.prototype.toLocalUpperCase()`: 转换为当前语言环境的大写
- `String.prototype.trim()`: 修剪开头结尾的空格
- `String.prototype.trimStart()`: 修剪开头的空格
- `String.prototype.trimEnd()`: 修剪结尾的空格