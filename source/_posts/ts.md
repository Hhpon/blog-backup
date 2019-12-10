---
title: TypeScript 入门教程
date: 2019-12-10 16:06:49
tags:
description: Regular Expression 使用单个字符串描述、匹配一系列符合某个句法规则的字符串。
---

### 前言

---

单单的学习新知识太枯燥，为了能更多的动脑子。

#### 安装 TypeScript

```bash
# 使用npm安装
npm install -g typescript
# 使用yarn安装
yarn global add typescript
```

以上两个命令会全局的安装 typescript，安装之后我们就可以在任何项目中直接执行 tsc 的命令了

我们在书写 ts 代码的时候我们一定要把文件的后缀由.js 改成.ts,ts 文件可以用该命令编辑成纯 js

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

在命令行里面输入以下内容，ts 文件就会被编译成 js 文件

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

TypeScript 中，使用:制定变量的类型，：的前后有没有空格都可以。

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

**但是我们是可以配置 ts 报错的时候是否还要产出 js 文件的，可以在 tsconfig.json 中配置 noEmitOnError 即可。关于 tsconfig.jsonde,请参阅[官方文档](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)([中文文档](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/tsconfig.json.html))**

### 基础

---




