---
title: Summary of JavaScript basics
date: 2021-02-25 16:18:04
tags:
---

## JavaScript 的组成
---

1.核心(ECMAScript)
2.文档对象模型(DOM)
3.浏览器对象模型(BOM)

## 变量
---

ECMAScript 变量是松散类型的，意思是变量可以用于保存任何类型的数据。

- var  在ECMAScript的所有版本中都可以使用
- const/let只能在ECMAScript6及更晚的版本中使用

### var 关键字

- var 在全局作用域声明的变量会成为global对象的属性
- var 存在声明提升的问题

#### var 在全局作用域声明的变量会成为global对象的属性

```js
  var a = 123
  console.log(window.a)     // 123
  console.log(a)            // 123
```

#### var 声明提升

我们知道，代码是从上向下执行代码。如果我们在代码当中使用未声明的变量，代码就会报错，**但是总有例外，请看下面的例子。**
```js
  function foo() {
    console.log(age)
    var age = 26;
  }
  foo();  // undefined
```

### let 声明

let与var的作用差不多，但有着非常重要的区别。最明显的区别是，let声明的范围是块作用域，而var声明的范围是函数作用域。

```js
 if (true) {
   var name = 'Matt'
   console.log(name); // Matt
 }
 console.log(name);   // Matt
```

```js
  if (true) {
    let age = 26;
    console.log(age); // 26
  }
  console.log(age);   // ReferenceError: age 没有定义
```

在这里，age之所以不能被访问，是因为let的作用域是**块级作用域(现在的理解是两个大括号中间)，**而var的作用域是函数作用域/全局作用域(要看变量声明的位置)。

- 暂时性死区
- 全局声明
- 条件声明
- for循环中的let声明

#### 暂时性死区

还记得var的变量声明提升吗？

```js
  function foo() {
    console.log(age)
    var age = 26;
  }
  foo();  // undefined
```

如果我们换成let会怎么样呢？

```js
  function foo() {
    console.log(age)
    let age = 26;
  }
  foo();  // ReferenceError: age没有定义
```

由于let声明不存在变量提升问题，所以这个age在打印的时候访问不到。

#### 全局声明

```js
  var a = 123
  console.log(window.a)     // 123
  console.log(a)            // 123

  let b = 123
  console.log(window.b)     // undefined
  console.log(b)
```

#### 条件声明

由于let声明变量的时候会检测之前是否声明过相同的变量，所以会出现这样的代码。

```js
if (typeof name === 'undefined') {
  let name;
}

name = 'Matt'
```

仔细看这个代码，根据let的作用域这个if判断并不起作用的。let name的命令只会在块级作用域当中起作用，在最后一行的赋值时还是找不到name的。

#### for循环中的let声明

```js
  for (var i = 0; i < 5; i++) {
    setTimeOut(()=>{console.log(i),0})
  }
  // 5 5 5 5 5
```

```js
  for (let i = 0; i < 5; i++) {
    setTimeOut(()=>{console.log(i),0})
  }
  // 0 1 2 3 4
```

之所以会这样，是因为在退出循环的时候，迭代变量保存的是导致循环退出的值：5。 在之后执行超时逻辑是，所有的i都是同一个变量，因而输出的都是同一个最终值。
而在使用let声明迭代变量的时候，JavaScript引擎在后台会为每个迭代声明一个新的迭代变量。每个setTimeout引用的都是不同的变量实例，所以console.log输出的是我们期望的值，也就是循环执行过程中每个迭代变量的值。

## 数据类型
---

- undefined
- null 
- string
- number
- boolean
- symbol
- object

typeof 是个操作符，所以不必使用参数方式

### Undefined

```js
 let message;

 console.log(typeof message);  // undefined
 console.log(typeof age);      // undefined
```
由于typeof会对`声明但未初始化`以及`未声明`的变量均返回undefined;
`JavaScript 高级程序设计`书籍作者建议在声明变量的同时进行初始化，这样当typeof返回undefined的时候，就可以断定变量尚未声明，而不是声明了但未初始化。

### Null

null用来表示一个空对象指针，所以typeof null的返回值是object。

> 在定于将来要保存对象值的变量时，建议使用null来初始化，不要使用其他值。这样，只要检查这个变量的值是不是null就可以知道这个变量是否再后来被重新赋予了一个对象的引用。

```js
if (car != null) {
  // car 是一个对象的引用
}
```

### Number 

- 浮点数
- 值的范围
- NaN

#### 浮点数

> 由于存储浮点数值使用的存储空间是整数值的两倍，所以ECMAScript总是想方设法的把浮点数转换成整数。

```js
  const a = 0.1
  const b = 0.2
  if (a + b == 0.3) {  // 别这么干
    console.log('ok')
  }
```
事实上 a + b = 0.30000000000000004

> 之所以存在这种舍入错误是因为使用IEE754数值，这种错误并非ECMAScript所独有。其他使用相同格式的语言也有这个问题。

#### 值的范围

由于内存的限制，ECMAScript并不支持表示这个世界上的所有数值。

- 最大值 Number.MAX_VALUE 这个值在多数浏览器中是 1.7976931348623157e+308
- 最小值 Number.MIN_VALUE 这个值在多数浏览器中是 5e-324

判断数值是否在可计算范围内的方法 isFinite()

如果计算返回+Infinity 或者 -Infinity 该值就不能再进一步用于任何计算了。这是因为Infinity没有可用于计算的数值表示形式。

#### NaN

- 任何设计NaN的操作始终返回NaN
- NaN不等于包括自身在内的任何值

```js
console.log(NaN == NaN)  // false
```

**如何判断一个变量是NaN就成了问题**

> 为此，ECMAScript提供了isNaN()函数，把一个值传给isNaN()后，该函数会尝试把它转换成数值。任何不能转换成数值的值都会导致这个函数返回true。



