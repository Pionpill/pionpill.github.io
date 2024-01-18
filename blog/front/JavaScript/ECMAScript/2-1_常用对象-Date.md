---
difficulty: easy
type: note
---

# Date

> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)

## 作用

JS 的 `Date` 是基于 Unix 时间戳的，即自 1970-1-1 起经过的毫秒数(协调世界时)。

JS 原生创建 `Date` 对象的唯一方法是通过 `new` 操作符：
- `new Date()`: 创建当前时间(伦敦时间)
- `new Date(value: number | string)`: 传入 Unix 时间戳或者能被 `Date.parse()` 正确识别的字符串。
- `new Date(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number)`: 依此传入年月日等时间，注意这里的月份是指月份的 index，从 0 开始。

使用最后一种方式构建 `Date` 对象时，除了 `year` 的其他参数是可以超出范围的，`Date` 会自动加计算结果，例如: `new Date(2013, 13, 1)` 等于 `new Date(2014, 1, 1)`。

`Date` 还有几个常用的静态方法:
- `Date.now()`: 返回自 1970-1-1 起经过的毫秒数。
- `Date.parse()`: 解析一个表示日期的字符串，同样返回毫秒数。
- `Date.UTC()`: 接受和构造函数最长形式的参数相同的参数，返回毫秒数。

## 实例方法

几个常用的 get/set 方法如下:
- `Date.prototype.get/setDate()`: 获取/设置一个月中的某一日
- `Date.prototype.get/setDay()`: 获取/设置一周的第几天(0表示星期天)
- `Date.prototype.get/setFullYear()`: 获取/设置完整的年份
- `Date.prototype.get/setYear()`: 获取/设置年份，如果是 19xx 年，则只返回最后两位。
- `Date.prototype.get/setHours()`: 获取/设置小时
- `Date.prototype.get/setMilliseconds()`: 获取/设置毫秒数
- `Date.prototype.get/setMinutes()`: 获取/设置分钟数
- `Date.prototype.get/setMonth()`: 获取/设置月份
- `Date.prototype.get/setSeconds()`: 获取/设置秒数
- `Date.prototype.get/setTime()`: 获取/设置协调世界时
- `Date.prototype.get/setTimezoneOffset()`: 获取/设置协调世界时相对于当前时区的时间差值
- `Date.prototype.get/setUTCXXX()`: 获取/设置对应的协调时间

几个用于格式化显示的方法:
- `Date.prototype.toDateString()`: 以美式英语形式返回
- `Date.prototype.toISOString()`: 转换成 ISO 格式表述形式
- `Date.prototype.toJSON()`: 就是调用 `toISOString`，在 `JSON.stringify` 中使用
- `Date.prototype.toLocaleString()`: 返回本地时间格式
- `Date.prototype.toLocaleDateString()`: 只返回本地时间的日期部分
- `Date.prototype.toLocaleTimeString()`: 只返回本地时间的当天时间部分
- `Date.prototype.toString()`: 覆盖 `Object` 的 `toString` 方法
- `Date.prototype.toTimeString()`: 只返回当天时间部分
- `Date.prototype.toUTCString()`: 使用 UTC 时区
- `Date.prototype.valueOf()`: 覆盖 `Object` 的 `valueOf` 方法

由于 `Date` 对象的 `valueOf` 返回值为 `number` 类型，因此 `Date` 对象是可以做减法运算的。