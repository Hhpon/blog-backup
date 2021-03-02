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

### Symbol 类型

- Symbol()
- Symbol.for()
- Symbol.keyFor()
- 使用符号作为对象属性

**内容没有看全**

### Object

- constructor 用于创建当前对象的函数。
- hasOwnProperty(propertyName): 用于判断当前对象实例(不包括原型)上是否存在给定的属性。要检查的属性名必须是字符串或符号。
- isPrototypeOf(object): 用于判断当前对象是否为另一个对象的原型。
- propertyIsEnumerable(protoryName): 用于判断给定的属性是否可以使用for-in语句枚举。与hasownProperty()一样，属性名必须是字符串。
- toLocaleString(): 返回对象的字符串表示，该字符串反映对象所在本地化执行环境。
- toString(): 返回对象的字符串表示。
- valueOf(): 返回对象对应的字符串、数值或布尔值表示。通常与toString()的返回值相同。

> 由于在ECMAScript中Object是所有对象的基类，所以任何对象都有这些属性和方法。

**注意：严格来讲，ECMA-262中的对象不一定适用于Javascript中的其他对象。比如浏览器环境中的DOM对象和BOM对象，都是有宿主环境定义和提供的宿主对象。而宿主对象不受ECMA-262约束，所以他们肯恩会也可能不会继承Object。**

## 变量、作用域与内存
---

> Javascript变量是松散类型的，而且变量不过就是特定时间点一个特定值的名称而已。由于没有规则定义变量必须包含什么数据类型，变量的值和数据类型在脚本生命期内可以改变。**这样的变量很有意思，很强大，当前也有很多问题。**

- 原始值与引用值
- 执行上下文与作用域
- 垃圾回收

### 原始值与引用值

保存原始值的变量是**按值**访问的，因此我们操作的也是存储在变量中的实际值；
保存引用值的变量是**按引用**访问的，因此我们操作的实际上也是对该对象的引用而非实际的对象本身。

- 复制值
- 传递参数

#### 复制值

```js
let num1 = 5
let num2 = num1

num1 = 10

console.log(num1)   // 10
console.log(num2)   // 5
```

```js
let obj1 = new Object()
let obj2 = new Object()

obj1.name = 'Nicholas'

console.log(obj2.name)  // 'Nicholas'
```

#### 传递参数

ECMAScript中所有函数的参数都是按值传递的。如果是原始值，那么就跟原始值变量的赋值一样，如果是引用值，那么就跟引用值变量的复制一样。

**实际上参数传递就是复制值**

### 执行上下文与作用域

**变量或函数的上下文决定了他们可以访问哪些数据，以及他们的行为。**每个上下文都有一个关联的**变量对象(例如一个函数里面有很多局部变量，那么这些局部变量就都属于这个变量对象)**而这个上下文中定义的所有变量和函数都存在于这个对象上。虽然无法通过代码访问变量对象，但后台处理数据会用到它。

全局上下文(浏览器里面是window对象,node.js环境里面是global对象)是最外层的上下文。根据ECMAScript实现的宿主环境，表示全局上下文的对象可能不一样。

- 全局上下文 变量对象就是window(浏览器环境是window对象,node.js环境是global对象)
- 函数上下文 变量对象就是活动对象(最基本的活动对象就是arguments)

全局上下文的变量对象始终就是作用域链的最后一个变量对象。

- 作用域链增强
- 变量声明

#### 作用域链增强

两种方式

- try/catch 语句的catch块 -- 创建一个新的变量对象，这个变量对象会包含要抛出的错误对象的声明。
- with语句 -- 严格模式根本不起作用

#### 变量声明

- var 存在变量提升的问题
- let、const 块级作用域 -- 由最近的一对包含花括号 {} 界定。
- 标识符查找 -- 在作用域链上读取或写入标识符时，JavaScript引擎会沿着作用域链挨个查看变量对象中是否含有该标识符，直到查到为止。

**注意：** 标识符查找并非没有代价。访问局部变量比访问全局变量要快，因为不用切换作用域。不过，JavaScript引擎在优化标识符查找上做了很多工作，将来这个差异可能就微不足道了。

### 垃圾回收

JavaScript是使用垃圾回收的语言，开发者是不需要管理内存的。

**基本原理：** 标记不再使用的变量，由垃圾回收程序回收该变量。

- 标记清理 -- 最常用的策略，用一定的办法标记上不再使用的变量。
- 引用计数 -- 为变量的引用次数计数，数字为零的时候回收它。
- 性能 -- 垃圾回收程序比较耗费性能，所以我们要在合适的范围内降低垃圾回收程序的执行次数。
- 内存管理 -- 由于给浏览器分配的内存特别少，所以我们要想保证页面的性能良好，就要优化内存占用。
  - 解除引用 -- 如果数据不再必要，那么把它设置成null。

## 基本引用类型

**引用值是某个特定引用类型的实例**

- Date
- RegExp
- 原始值包装类型

#### Date

Date现如今有很多方法，除了获取数据的方法，格式化时间的方法不能使用，因为各个浏览器实现的方式不同。

#### RegExp

[正则表达式内容可以参见另外一片文章](https://www.hhp.im/2019/11/11/reg/)

#### 原始值包装类型

> 为了方便操作原始值，ECMAScript提供了三种特殊的引用类型：Boolean、Number、String

```js
let s1 = 'some text'
let s2 = s1.substring(2)
```

> 我们知道，原始值本身不是对象，因此逻辑上不应该有方法。而实际上这个例子又确实按照预期运行了。这是因为后台进行了很多处理，从而实现了上述操作。具体来说，当第二行访问s1时，是以读模式访问的，也就是要从内存中读取变量保存的值。在以读模式访问字符串值的任何时候，后台都会执行以下3步：
> - 创建一个 String 类型的实例
> - 调用实例上的特定方法
> - 销毁实例