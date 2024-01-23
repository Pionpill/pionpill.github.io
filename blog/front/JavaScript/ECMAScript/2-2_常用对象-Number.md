---
difficulty: easy
type: note
---

# Number

> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)

## 作用

`Number` 是简单类型 `number` 的包装类，可以使用 `Number(value)` 将 `string` 转换为 `number` 类型。语法上可以使用 `new Number(value)` 创建  `Number` 实例，但是不推荐这样做。

所有的 `Number/number` 类型都是双精度浮点数，例如:

```js
255 === 255.0; // true
255 === 0b11111111; // true（二进制表示）
```

JavaScript 的 `Number` 类型类似于 `Java` 中的 double，是双精度 64 位二进制格式，IEEE 754 双精度浮点数 64 位可以分为 3 个部分:
- sign: 1 位表示符号
- exponent: 11 位表示指数
- mantissa: 52 位表示尾数

$$Number = (-1)^{sign} · (1+mantissa) · 2^{exponent}$$

对象转换为 `Number` 过程中会先后尝试获取: `[Symbol.toPrimitive]('number')`, `valueOf`, `toString` 的值。

`Number()` 方法会将假值转换为 0，如果不可解析位数字，则返回 NaN。

## 静态属性与方法

常用的静态属性包括:
- `Number.EPSILON`: 两个可表示数的最小间隔
- `Number.MIN/MAX_SAFE_INTEGER`: 最大最小的安全整数
- `Number.MIN/MAX_VALUE`: 可表示的最大最小的树
- `Number.NaN`: Not a Number
- `Number.NEGATIVE/POSITIVE_INFINITY`: 正负无穷

常用的静态方法包括:
- `Number.isFinite()`: 判断是否有限
- `Number.isInteger()`: 判断是否位整数
- `Number.isNaN()`: 判断是否为 NaN
- `Number.isSafeInteger()`: 判断是否是安全的整数
- `Number.parseFloat()`: 转换为浮点数
- `Number.parseInt()`: 转换为整数

## 实例方法

理论上构建 `Number` 实例的唯一方法是 `new Number(xxx)`，这种写法不推荐。JS 编译器会非常智能地在基本类型与包装类型之间转换，所以 `number` 也可以用这些方法:
- `Number.prototype.toExponential()`: 返回指数形式字符串
- `Number.prototype.toFixed()`: 返回定点表示法表示数值地字符串
- `Number.prototype.toPrecision()`: 返回定点/指数表示法至指定精度的字符串

## BigInt

> MDN 官方文档: [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

`BigInt` 可以用来表示任意大的整数，一般用于展示大于 `2^53-1` 的整数。有两种创建 `BigInt` 对象的方式:
- 字面量: 在整数字面量后面加 `n`，例如 `10n`
- 面向对象: 通过 `BigInt(value: string | number)` 构建

`BigInt` 的多数行为类似 `Number`，以下行为除外:
- 不能用于 `Math` 对象中的方法
- 不能合 `Number` 实例混合运算，必须转换为统一类型
- `BigInt` 转为 `Number` 是存在精度丢失问题

使用 `typeof` 测试 `BigInt` 对象会返回 `bigint`。

`BigInt` 可以使用绝大多数操作符，`>>>`(无符号右移)不可以，且不支持单目 + 运算。使用除法运算时会向零取整: `5n / 2n === 2n`。

`BigInt` 可以与 `Number` 进行比较，但是不严格相等。

对 `BigInt` 值使用 `JSON.stringify()` 会引发 `TypeError`，如果需要可以实现 `toJSON` 方法:

```js
BigInt.prototype.toJSON = function () {
  return this.toString();
};
```