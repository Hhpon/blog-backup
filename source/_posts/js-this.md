---
title: 彻底搞懂 JavaScript 中的 this 指向
date: 2021-04-17 10:18:23
tags:
description: 标准函数中，this引用的是把函数当成方法调用的上下文对象...

---

## 前言
---

本文将从以下几方面阐述 Javascript 中 this 的指向问题。
- 标准函数中，`this`的引用值是什么
- 箭头函数中，`this`的引用值是什么
- 使用`new`关键字创建对象时，`this`的引用值是什么
- 闭包中使用`this`时，`this`的引用值什么

## 标准函数中，this 的引用值是什么
> 标准函数中，this引用的是把函数当成方法调用的上下文对象

**在标准函数中`this`的值是会根据方法被调用的情况改变所引用的值**


```js
window.identity = "The Window"
let object = {
    identity: 'My Object',
    getIdentityFunc() {
        console.log(this.identity)
    }
}
object.getIdentityFunc()  // My Object
const getIdentityFunc = object.getIdentityFunc
getIdentityFunc()  // The Window
```

## 箭头函数中，this 的引用值是什么
> 在箭头函数中，this引用的是定义箭头函数的上下文

**由此可以看出箭头函数中的`this`引用值是固定的**

```js
window.identity = "The Window"
let object = {
    identity: 'My Object',
    testIdentity: this.identity,
    getIdentityFunc:() => {
        console.log(this.identity)
    }
}
console.log(object.testIdentity)  // The Window
object.getIdentityFunc()  // The Window
```

面试的时候我就遇到了这个问题，当时我心想
>“在箭头函数中，this引用的是定义箭头函数的上下文对象”

大家如果仔细比较这两句话可以发现我心里想的多了两个字(或者说我就是囫囵的看了一遍书，根本没有好好的去理解、去验证)，这两个字不多不少让我把`this`的引用值认为成`object`这个对象了，所以我认为最后的结果应该是`My Object`。

那么我们现在来具体的看看这个定义箭头函数的上下文是什么呢？
**在我看来，我们可以把this值看成上下文**

那**定义箭头函数的上下文**其实就是`object`的`this`值呗；那我们要知道的其实就是`object`的`this`的`identity`属性是什么呗?

在上方代码的倒数第二行就是为了说明这个问题，由于属性`testIdentity`的值是`The Window`我们能得出`object`的`this`引用值其实是`window`；

由于函数`getIdentityFunc`中的`this`引用值其实是`object`的`this`，也就是`window`。所以函数`getIdentityFunc`中的`this.identity`是`The Window`。

### 既然箭头函数中的 this 是固定的，那么类似 call 的函数能改变 this 的引用值吗

在JS中我们可以使用`call`、`apply`、`bind`方法改变`this`指向，既然箭头函数的`this`值引用值是固定的，那我们能使用这几个方法改变这个引用值吗?

看下面的代码

```js
window.identity = "The Window"
let object = {
    identity: 'My Object',
    getIdentityFunc() {
        console.log(this.identity)
    }
}
let object1 = {
    identity: 'My Object1'
}
object.getIdentityFunc.call(object1)  // My Object1
```

```js
window.identity = "The Window"
let object = {
    identity: 'My Object',
    testIdentity: this.identity,
    getIdentityFunc:() => {
        console.log(this.identity)
    }
}
console.log(object.testIdentity)  // The Window
object.getIdentityFunc()  // The Window
object.getIdentityFunc.call(object)  // The Window
```

对比这两处代码我们能发现call方法根本无法改变箭头函数的`this`的引用值。

## 使用 new 关键字创建对象时，this 的引用值是什么
> 在实例中this的引用值是当前所在的实例


```js
window.identity = "The Window"

function Obj() {
  this.identity = "My Object"

  this.getIdentityFunc = function () {
    console.log(this.identity)
  }

  this.getIdentityFunc1 = () => {
    console.log(this.identity)
  }
}

const obj = new Obj()
obj.getIdentityFunc()  // My Object
obj.getIdentityFunc1() // My Object
```

我们可以看到两个函数中输出的都是`My Object`，`getIdentityFunc`函数的结果也之前调用的差别不大，因为在这个函数里面`this`的引用值依然是`obj`这个上下文对象。

但是在函数`getIdentityFunc1`中，虽然都是箭头函数(和第二个例子的代码做比较)，但是这一次的结果确实`My Object`，也就是说这一次的`this`引用值是对象`obj`。

那么这个情况的原因是什么呢？我们来回忆一下刚刚第二个例子里面箭头函数的`this`值是等于对象`object`的`this`值，事实上这一次也是。所以造成这两次结果不同的原因其实是这两次的“函数上下文”不一样了。

- 第二个例子中 `object`的函数上下文`this`引用值是`window`
- 这次`obj`的函数上下文`this`的引用值是他自己`obj`

## 闭包中使用 this 时，this 的引用值什么
> 在闭包中使用 this 会让代码变复杂。如果内部函数没有使用**箭头函数**定义，则 this 对象会在运行时绑定到执行函数的上下文。如果在全局函数中调用，则 this 在非严格模式下等于 window，在严格模式下等于 undefined。如果作为某个对象的方法调用，则 this 等于这个对象。

从这一段话中我们可以提取出以下几条信息。

1. 如果闭包的内部函数是使用箭头函数定义的，基本不受影响，我们只需要按照箭头函数的`this`指向判断方法判断就可以。
2. 如果在全局函数中调用，则 this 在非严格模式下等于 window，在严格模式下等于 undefined
3. 如果作为某个对象的方法调用，则 this 等于这个对象

#### 内部函数使用箭头函数定义的，基本不受影响

```js
window.identity = "The Window"
let object = {
  identity: "My Object",
  getIdentityFunc() {
    const doit = () => {
      console.log(this.identity)
    }
    return doit
  },
}

object.getIdentityFunc()() // My Object
```

#### 如果在全局函数中调用，则 this 在非严格模式下等于 window，在严格模式下等于 undefined

```js
window.identity = "The Window"
let object = {
  identity: "My Object",
  getIdentityFunc() {
    return function () {
      console.log(this.identity)
    }
  },
}

object.getIdentityFunc()() // The Window
```

#### 如果作为某个对象的方法调用，则 this 等于这个对象

```js
window.identity = "The Window"
let object = {
  identity: "My Object",
  testIdentity: this.identity,
  getIdentityFunc: () => {
    console.log(this.identity)
  },
  getIdentityFunc1() {
    return function () {
      console.log(this.identity)
    }
  },
  getIdentityFunc2() {
    function doit() {
      console.log(this.identity)
    }
    return doit
  },
  getIdentityFunc3() {
    const doit = () => {
      console.log(this.identity)
    }
    return doit
  },
}

object.getIdentityFunc() // The Window
object.getIdentityFunc1()() // The Window
object.getIdentityFunc2()() // The Window 
object.getIdentityFunc3()() // My Object

let object1 = {
  identity: "My Object1",
  getIdentityFunc1: object.getIdentityFunc1(),
  getIdentityFunc2: object.getIdentityFunc2(),
}

object1.getIdentityFunc1()  // My Object1
object1.getIdentityFunc2()  // My Object1
```

## 练习题目


```js
const test = {
  name: "Bill",
  show1: function () {
    console.log(this.name)
  },
  show2: () => {
    console.log(this.name)
  },
  show3: () => {
    function innerFunction() {
      console.log(this.name)
    }
    innerFunction()
  },
}

test.show1()
test.show2()
test.show3()

// 参考答案
Bill
undefined
undefined
```


```js
var name = "window"

var person1 = {
  name: "person1",

  foo1: function () {
    console.log(this.name)
  },

  foo2: () => console.log(this.name),

  foo3: function () {
    return function () {
      console.log(this.name)
    }
  },

  foo4: function () {
    return () => {
      console.log(this.name)
    }
  },
}

var person2 = { name: "person2" }

person1.foo1() 
person1.foo1.call(person2)
person1.foo2()
person1.foo2.call(person2)
person1.foo3()()
person1.foo3.call(person2)()
person1.foo3().call(person2)
person1.foo4()()
person1.foo4.call(person2)()
person1.foo4().call(person2)

// 参考答案
person1
person2
window
window
window
window
person2
person1
person2
person1
```


```js
var name = "window"

function Person(name) {
  this.name = name

  this.foo1 = function () {
    console.log(this.name)
  }
  this.foo2 = () => console.log(this.name)
  this.foo3 = function () {
    return function () {
      console.log(this.name)
    }
  }
  this.foo4 = function () {
    return () => {
      console.log(this.name)
    }
  }
}

var person1 = new Person("person1")
var person2 = new Person("person2")
person1.foo1()
person1.foo1.call(person2)
person1.foo2()
person1.foo2.call(person2)
person1.foo3()()
person1.foo3.call(person2)()
person1.foo3().call(person2)
person1.foo4()()
person1.foo4.call(person2)()
person1.foo4().call(person2)

// 参考答案
person1
person2
person1
person1
window
window
person2
person1
person2
person1
```

```js
window.identity = "The Window"

let object = {
  identity: "My Object",
  testThis: this.identity,
  getIdentityFunc() {
    console.log(this.identity)
  },
  getIdentityFunc1: () => {
    console.log(this.identity)
  },
  getIdentityFunc2: () => {
    function innerFunction() {
      console.log(this.identity)
    }
    innerFunction()
  },
  getIdentityFunc3() {
    return function () {
      console.log(this.identity)
    }
  },
  getIdentityFunc4() {
    return () => {
      console.log(this.identity)
    }
  },
  getIdentityFunc5: () => {
    return function () {
      console.log(this.identity)
    }
  },
  getIdentityFunc6: () => {
    return () => {
      console.log(this.identity)
    }
  },
  getIdentityFunc7() {
    console.log(this.identity)
    function innerFunction() {
      console.log(this)
      console.log(this.identity)
    }
    innerFunction()
  },
  getIdentityFunc8() {
    const innerFunction = () => {
      console.log(this.identity)
    }
    innerFunction()
  },
}

object.getIdentityFunc() // My Object
let getIdentityFunc = object.getIdentityFunc
getIdentityFunc() // The Window

object.getIdentityFunc1() // The Window
let getIdentityFunc1 = object.getIdentityFunc1
getIdentityFunc1() // The Window

object.getIdentityFunc2() // The Window
let getIdentityFunc2 = object.getIdentityFunc2
getIdentityFunc2() // The Window

object.getIdentityFunc3()() // The Window
let getIdentityFunc3 = object.getIdentityFunc3()
getIdentityFunc3() // The Window

object.getIdentityFunc4()() // My Object
let getIdentityFunc4 = object.getIdentityFunc4()
getIdentityFunc4() // My Object

object.getIdentityFunc5()() // The Window
let getIdentityFunc5 = object.getIdentityFunc5()
getIdentityFunc5() // The Window

object.getIdentityFunc6()() // The Window
let getIdentityFunc6 = object.getIdentityFunc6()
getIdentityFunc6() // The Window

object.getIdentityFunc7()
object.getIdentityFunc8()

// 参考答案

My Object
The Window
The Window
The Window
The Window
The Window
The Window
The Window
My Object
My Object
The Window
The Window
The Window
The Window
The Window
My Object
```

## 文章参考文献

- 《JavaScript 高级程序设计》
- [JavaScript之彻底搞懂this的指向](https://www.jianshu.com/p/b1e0eb9151f9)