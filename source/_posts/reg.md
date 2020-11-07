---
title: JavaScript 正则表达式
date: 2019-11-11 21:25:00
tags:
description: Regular Expression 使用单个字符串描述、匹配一系列符合某个句法规则的字符串。
---

### JavaScript 正则表达式简介及工具使用

#### 什么是正则表达式

Regular Expression 使用单个字符串描述、匹配一系列符合某个句法规则的字符串。
简单说就是按照某种规则匹配符合条件的字符串

[工具网站：https://regexper.com/](https://regexper.com/)
[工具网站：GitHub 地址](https://github.com/javallone/regexper-static)

{% asset_img jser.png 工具网站截图 %}

工具网站可以把我们所写的正则表达式以示意图的方式表示出来，以防我们所写的正则表达式有错误。

### REGEXP 对象

- JavaScript 通过内置对象 RegExp 支持正则表达式
- 有两种方法实例化 RegExp 对象
  - 字面量
  - 构造函数

#### 字面量实例化

```js
var reg = /\bis\b/;
"He is a boy. This is a dog. Where is she?".replace(reg, "IS");
//结果
("He IS a boy. This is a dog. Where is she?");

var reg = /\bis\b/g;
"He is a boy. This is a dog. Where is she?".replace(reg, "IS");
//结果
("He IS a boy. This IS a dog. Where IS she?");
```

- ‘\b’代表单词边界
- ‘g’global 全局,使正则表达式匹配全文

{% asset_img is.png 工具网站截图 %}

#### 构造函数实例化

```js
var reg = new RegExp("\\bis\\b");
"He is a boy. This is a dog. Where is she?".replace(reg, "IS");
//结果
("He IS a boy. This is a dog. Where is she?");

var reg = new RegExp("\\bis\\b", "g");
"He is a boy. This is a dog. Where is she?".replace(reg, "IS");
//结果
("He IS a boy. This IS a dog. Where IS she?");

"He is a boy. Is he?".replace(/\bis\b/g, 0);
// 结果
("He 0 a boy. Is he?");

"He is a boy. Is he?".replace(/\bis\b/gi, 0);
// 结果
("He 0 a boy. Is he?");
```

#### 修饰符

- g: global 全文搜索，不添加，搜索到第一个匹配停止
- i: ignore case 忽略大小写，默认大小写敏感
- m: multiple lines 多行搜索

### 元字符

- 正则表达式由两种基本字符类型组成
  - 原义文本字符
    - abc
  - 元字符
- 元字符是在正则表达式中有特殊意义的非字母字符
  - ? \$ ^ . | \ ( ) { } [ ]

### 字符类

- 一般情况下正则表达式一个字符对应字符串一个字符
- 我们可以使用元字符[]来构建一个简单的类
- 所谓类是指符合某些特性的对象，一个泛指，而不是特指某个字符
- 表达式[abc]把 a 或 b 或 c 归为一类，表达式可以匹配这类的字符

{% asset_img abc.png 工具网站截图 %}

#### 字符类取反

- 使用元字符 ^ 创建 反向类/负向类
- 反向类的意思是不属于某类的内容
- 表达式[^abc]表示 不是字符 a 或 b 或 c 的内容

### 范围类

- 正则表达式还提供了**范围类**
- 我们可以使用 **[a-z]** 来连接两个字符表示 **从 a 到 z 的任意字符**
- 这是个闭区间也就是包含 a 和 z 本身
- 在 [] 组成的类内部可以连写的 [a-zA-Z]、[0-9-]

{% asset_img a-z.png 工具网站截图 %}

### JS 预定义类及边界

正则表达式还提供了预定义类来匹配常见字符串

{% asset_img 预定义类.png 预定义类 %}
{% asset_img 边界.png 边界 %}

### 量词

{% asset_img 量词.png 量词 %}

### 贪婪模式与非贪婪模式

贪婪模式，正则表达式在匹配的过程中会尽可能多的匹配

```js
"12345678".replace(/\d{3,6}/g, "X");
// 结果
("X78");
```

非贪婪模式，即希望正则表达式尽可能少的匹配，方法很简单，在量词后面加上 ？即可

```js
"12345678".replace(/\d{3,6}?/g, "X");
// 结果
("XX78");
```

### 分组

使用 ( ) 可以达到分组的功能，使量词作用于分组

```js
"a1b2c3d4".replace(/[a-z]\d{3}/g, "X");
// 结果
("a1b2c3d4");
"a1b2c3d4".replace(/([a-z]\d){3}/g, "X");
// 结果
("Xd4");
```

#### 反向引用

```js
"2016-11-25".replace(/\d{4}-\d{2}-\d{2}/g, "$1");
// 结果
("$1");
"2016-11-25".replace(/(\d{4})-(\d{2})-(\d{2})/g, "$2/$3/$1");
// 结果
("11/25/2016");
```

#### 忽略分组

不希望捕获某些分组，只需要在分组内加上 ?: 就可以

### 前瞻

- 正则表达式从文本头部向尾部开始解析，文本尾部方向称为前
- 前瞻就是在正则表达式在匹配到规则的时候，向前检查是否符合断言，后顾/后瞻方向相反
- JavaScript 不支持后顾
- 符合和不符合特定断言称为 肯定/正向 匹配和 否定/负向 匹配

```js
"a2*3".replace(/\w(?=\d)/g, "X");
// 结果
("X2*3");
"a2*34v8".replace(/\w(?=\d)/g, "X");
// 结果
("X2*X4X8");
"a2*3".replace(/\w(?!\d)/g, "X");
// 结果
("aX*3XXX");
```

### JS 对象属性

- global: 是否全文搜索，默认为 false
- ignore case: 是否大小写敏感，默认为 false
- multiline: 多行搜索，默认为 false
- lastIndex: 是当前表达式匹配内容的最后一个字符的下一个位置
- source: 正则表达式的文本字符串

### test 和 exec 方法

**test()**
用于测试字符串参数中是否存在匹配正则表达式模式的字符串，如果存在就返回 true ,如果不存在就返回 false

**exec()**

var re = /quick\s(brown).+?(jumps)/ig;
var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');

{% asset_img exec.jfif MDN网站截图 %}

### 字符串对象方法

- search() 方法用于检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串。返回第一个与 regexp 相匹配的子串的起始位置，找不到返回 -1
- search() 方法不执行全局匹配，它将忽略标志 g。它同时忽略 regexp 的 lastIndex 属性，并且总是从字符串的开始进行检索，这意味着它总是返回 stringObject 的第一个匹配的位置。
