---
title: TypeScript 入门教程
date: 2019-12-10 16:06:49
tags:
hidden: false
description: Regular Expression 使用单个字符串描述、匹配一系列符合某个句法规则的字符串。
---

### 前言

---

> TypeScript 可以让你在编写代码的时候“先知”之后会发生的错误；通过 IDE 的提示；

单单的学习新知识太枯燥，为了能更多的动脑子。

#### 安装 TypeScript

```bash
# 使用npm安装
npm install -g typescript
# 使用yarn安装
yarn global add typescript
```

以上两个命令会全局的安装 `typescript`，安装之后我们就可以在任何项目中直接执行 `tsc` 的命令了

我们在书写 `ts` 代码的时候我们一定要把文件的后缀由.js 改成.ts,`ts` 文件可以用该命令编辑成纯 js

```bash
tsc hello.ts
```

#### Hello TypeScript

---

```typescript
// hello.ts
function sayHello(person: string) {
  return "Hello," + person;
}
let user = "Tom";
console.log(sayHello(user));
```

在命令行里面输入以下内容，`ts` 文件就会被编译成 js 文件

```bash
tsc hello.ts
```

```typescript
// hello.js
function sayHello(person) {
  return "Hello," + person;
}
var user = "Tom";
console.log(sayHello(user));
```

TypeScript 中，使用 `:` 制定变量的类型，`:`的前后有没有空格都可以。

**TypeScript 只会惊醒静态检查，如果发现有错误，编译的时候就会报错。**

下面我们来看看传入的数据类型与定义的类型不一样的时候会报什么样子的错误。

```typescript
function sayHello(person: string) {
  return `Hello,${person}`;
}

let user = [0, 1, 2];
console.log(sayHello(user));
```

我们执行一下编译命令，看看是个什么样子的错误！

```bash
hello.ts:6:22 - error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

**虽然 TypeScript 给我们报错了，但是并不影响编译产出的文件，文件会正常的被编译出来。**

```js
function sayHello(person) {
  return "Hello,person";
}
var user = [0, 1, 2];
console.log(sayHello(user));
```

**但是我们是可以配置 ts 报错的时候是否还要产出 js 文件的，可以在 tsconfig.json 中配置 noEmitOnError 即可。关于 tsconfig.jsonde,请参阅[官方文档](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)**

### 基础类型

---

#### 布尔值

---

```ts
let isDone: boolean = false;
```

#### 数值

---

除了支持十进制和十六进制字面量，TypeScript 还支持 ECMAScript2015 中引入的二进制和八进制字面量。

```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let ovtalLiteral: number = 0o744;
```

#### 字符串

---

```ts
let name: string = "bob";
name = "smith";
```

除了这样，我们还可以使用**模板字符串**。

> 模板字符串（template string）是增强版的字符串，用反引号（&#96;）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

```typescript
// ts 版
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, My name is ${name}.

I'll be ${age + 1} years old next month.`;
```

```js
// 使用转化命令转化之后
var namew = "Gene";
var age = 37;
var sentence =
  "Hello, My name is " +
  namew +
  ".\n\nI'll be " +
  (age + 1) +
  " years old next month.";
```

#### 数组

---

在 TypeScript 中，定义数组的方式有两种。

```typescript
let list: number[] = [1, 2, 3];
```

另种方式是数组泛型：`Array<元素类型>`

```
let list: Array<number> = [1,2,3]
```

#### 任意值

---

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。这种情况下，我们不希望类型检查器对这些值进行检查而是直接让他们通过编译阶段的检查。那么我们可以使用`any`类型来标记这些变量。

```ts
let notSure: any = 4;
notSure = "mybe a string instead";
notSure = false;
```

对现有代码进行改写的时候，`any`类型是十分有用的，他允许你在编译是可选择地包含或移除类型检查。

```ts
let notSure: any = 4;
notSure.ifItExists();
notSure.toFixed();
```

当我们只知道一部分数据的类型是，`any`类型也是有用的。比如，你有一个数组，它包含了不同的类型的数据：

```ts
let list: any[] = [1, true, "free"];

list[1] = 100;
```

#### Null 和 Undefined

---

JavaScript 中 Null 和 Undefined 是六种基本类型中的两种，在 TypeScript 他们依然是两种基本类型。但是默认情况下，这两种基本类型是所有类型的子类型；也就是说你可以把 null 和 undefined 赋值给其他类型的变量。

例如：

```typescript
let name: string = "Gene";
let age: number = 37;
let height: undefined = undefined;

age = height;
```

```js
// 转换过程中没有报错
var namew = "Gene";
var age = 37;
var height = undefined;
age = height;
```

然而有的时候我们想让`age`只是`age`，能不能通过某些配置，使得`null`和`undefined`只能赋值给`void`和他们各自呢？

#### 空值

---

它表示没有任何类型。当一个函数没有返回值是，你通常会见到其返回值类型是 void:

```ts
function warnUser(): void {
  alert("this is my warning message");
}
```

声明一个`void`类型的变量没什么大用，因为他的值只可能是`undefined`和`null`

```ts
let unusable: void = null;
```

#### Never

---

`never`类型表示的是那些用不存在的值的类型。例如，`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型；

`never`类型是任何类型的子类型，也可以赋值给任何类型；然而没有类型是`never`的子类型或可以赋值给`never`类型（`never`本身除外）。

**下面是一些返回`never`类型的函数**

```ts
// 返回never的函数必须存在无法达到的重点
function error(message: string): never {
  throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
  return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {}
}
```

#### 元组 Tuple

---

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。

```ts
// 此处就好像是把数组先声明个类型，而且是一个复杂类型的数组
let x: [string, number];
x = ["hello", 10];
```

当访问一个已知索引的元素，会得到正确的类型：

```ts
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr
```

当访问一个越界元素的时候会使用联合类型替代：

```ts
x[3] = "world"; // OK,字符串可以赋值给（string|number）类型
console.log(x[5].toString()); // OK,'string' 和 ‘number’ 都有toString
x[6] = true; //Error,布尔不是（ string | number ）类型
```

联合类型是高级主题。

#### 枚举

---

`enum` 类型是对 JavaScript 标准类型的一个补充。使用枚举类型可以为一组数值赋予友好的名字。

```ts
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green;
```

默认情况下，从`0`开始为元素标号。我们可以手动的制定成员的数值。例如我们将上面的例子改成从`1`开始标号：

```ts
enum Color { Red=1, Green, Blue }
let c: Color = Color:Green;
```

或者全部采用手动赋值：

```ts
enum Color { Red=1, Green=2, Blue=4 }
let c: Color = Color:Green;
```

枚举类型提供的一个便利是你可以有枚举的值得到它的名字。例如，我们知道数值为 2，但是不确定它映射到 Color 里的哪个名字，我们可以查找相应的名字：

```ts
enum Color {
  Red = 1,
  Green,
  Blue
}
let colorName: string = Color[2];

// 下行代码会显示Green，因为上面代码里它的值是2
console.log(colorName);
```

#### 类型断言

---

有时候你会遇到这样的情况，你会比 typescript 更加了解某个值的详细信息。通常这会发生在你清楚的知道一个实体具有比它现有类型更确切的类型。

类型断言有两种形式。其一是“尖括号”语法：

```ts
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```

其二是`as`语法：

```ts
let someValue: any = "this is a string";
let strLength: number = (someValue as string).lenght;
```

两种形式是等价的。JSX 里面只有`as`语法断言是被允许的。


### 变量声明

---

`let` 和 `const` 是JavaScript里相对较新的变量声明方式。`let`在很多方面与`var`是相似的，但是可以帮助大家避免在JavaScript里常见的一些问题。`const`是对`let`的一个增强，它能阻止对一个变量的再次赋值。

#### var 声明

---

一直以来我们都是通过`var`关键字定义JavaScript变量。

```js
var a = 10;
```

我们也可以在函数内部定义变量：

```js
function f() {
  var messag
}


