---
title: 深入Vue双向绑定原理
date: 2021-03-21 19:53:18
tags:
description: 本文主要比较`Vue2.0`与`Vue3.0`双向绑定的原理，以及由二者不同的原理造成的一些差异，并对该差异产生的原因进行简单的分析...
---

### 前言
---

本文主要比较`Vue2.0`与`Vue3.0`双向绑定的原理，以及由二者不同的原理造成的一些差异，并对该差异产生的原因进行简单的分析。
- `Vue2.0`双向绑定的主要实现原理是`Object.defineProperty()`方法
- `Vue3.0`双向绑定的主要实现原理是`ES6`新增的`Proxy()`对象
所以本文阐述的双向绑定的原理的区别简单来说就是上述两种方法对于`劫持`对象属性的不同。但是为了详细说清楚不同原理造成的差异，我们必须从源码说起。
`Vue`双向绑定应用的设计模式是`发布-订阅模式`，由于设计模式能更好的说明不同类之间的意图，对于我们理解源码有很大的帮助(Ps:对于笔者是的) ，所以我们将从这个设计模式说起。
`发布-订阅模式`在很多文章中都被认为成`观察者模式`，包括在《Javascript设计模式与开发实践》一书中，作者表示
> 发布-订阅模式又叫观察者模式

经过笔者考察二者在是实现上还是有些区别，但是能确定`发布-订阅模式`是`观察者模式`的一种变体。

[Vue2.0双向绑定源码](https://github.com/vuejs/vue/blob/dev/src/core/observer/index.js#L156-L193)

### 观察者模式 VS 发布-订阅模式
---

#### 观察者模式

> 它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

![观察者模式.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2939865e06cc4920bfd235586e7be7b1~tplv-k3u1fbpfcp-watermark.image)

观察者模式中主要由两类对象组成，一种是发布者(主题)，一种是观察者。

- 发布者 -- 为观察者提供注册功能，在需要的时候给观察者发送消息
- 观察者 -- 实现上需要监听发布者的改变

具体实现我们来看一下代码(TypeScript)

```ts
class Observer {
  update() {
    //  do something
    console.log("收到通知")
  }
}

class Subject {
  observerLists: Observer[] = []

  publish() {
    this.observerLists.forEach((observer) => {
      observer.update()
    })
  }
  trigger(observer: Observer) {
    this.observerLists.push(observer)
  }
}

const observer = new Observer()
const subject = new Subject()

subject.trigger(observer)

subject.publish()  //收到通知
```

这就是最简单的观察者模式的实现方式，该模式主要含有两种类型的对象，而且这两种对象之间是“互相了解”的。

#### 发布-订阅模式

事实上，`发布-订阅模式`与`观察者模式`的意图是没有太大的区别的，都是为了监听一个对象的变化，并且在这个对象改变的时候通知另一个对象。但是现在两个对象之间是“互相了解”(耦合)的，那么为了解耦两种对象之间的关系，我们可以来看一下`发布-订阅模式`有什么新的改变呢？

![发布-订阅模式.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1034f14f4f847f58d6547d02ab336c5~tplv-k3u1fbpfcp-watermark.image)

我们再来看一下具体代码的实现(TypeScript)


```ts
class Dep {
  observerLists: Observer[] = []
  publish() {
    this.observerLists.forEach((observer) => {
      observer.update()
    })
  }
  trigger(observer: Observer) {
    this.observerLists.push(observer)
  }
}

class Observer {
  update() {
    //  do something
    console.log("收到通知")
  }
}

class Subject {
  deps: Dep[] = []
  change() {
    this.deps.forEach((dep) => dep.publish())
  }
  depend(dep: Dep) {
    this.deps.push(dep)
  }
}

const observer = new Observer()
const subject = new Subject()
const dep = new Dep()

subject.depend(dep) // 发布者关联消息中心
dep.trigger(observer) // 观察者关联消息中心
subject.change() // 收到通知
```

与观察者模式相比较，该模式增加了消息中心的对象来做消息的调度工作。
而我们一会要看的`Vue`源码，就是通过这种方式实现的。

### Vue 双向绑定原理解析

#### Vue 2.0 VS 3.0 有哪些不同

- 2.0 响应式数据都要提前data里面声明
- 2.0 响应式数据对数组的效果不理想
- 2.0 响应式数据需要对多级对象进行深度遍历影响性能

那造成2.0这些问题的原因是什么呢？

#### 手写 Vue 双向绑定部分源码

![发布-订阅模式.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/803f90361dc04e3ab8ca501763358d4c~tplv-k3u1fbpfcp-watermark.image)

我们举个简单的双向绑定的例子：页面上存在`input`输入框以及一个`p`标签，我们要实现一个在输入框输入的内容会自动显示在`p`标签当中的功能。其实就是手写一个最普通的一个双向绑定。

1. `Observer`作为发布者，用来做检测data数据改变的功能
2. `Dep`作为消息中心，用来管理`Observer`与`Subscriber`之间的消息传递
3. `Subscriber`作为观察者，数据有改变时被通知并执行`update`方法

代码的具体实现(html + ts)

*建议您自己手写一边，最好是再用调试模式看一下执行过程。*

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <input type="text" id="input" /><br />
    <span id="p"></span>
    <script src="./vue-ts.js"></script>
  </body>
</html>
```

```ts
/**
 * 为了更好的理解博客
 * (https://juejin.cn/post/6844903601416978439#heading-10)
 * 中所讲的Vue2.0双向绑定原理，所以自己再重新实现一下这个方法(ts)
 */
let uid = 0

class Dep {
  id = uid++
  subs: Subscriber[] = []
  static target: Subscriber | null = null

  addSub(sub: Subscriber): void {
    this.subs.push(sub)
  }

  notify(): void {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
}

class Subscriber {
  depIds: { [propName: string]: Dep } = {}
  vm: Vue
  cb: any
  expOrFn: any
  val: any

  constructor(vm: Vue, expOrFn: any, cb: any) {
    this.vm = vm
    this.expOrFn = expOrFn
    this.cb = cb
    this.val = this.get()
  }

  update() {
    this.run()
  }

  run() {
    const val = this.get()
    if (this.val !== val) {
      this.val = val
      this.cb.call(this.vm, val)
    }
  }

  get() {
    Dep.target = this
    console.log(this.vm)
    const val = this.vm.data[this.expOrFn]

    Dep.target = null
    return val
  }

  addDep(dep: Dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this)
      this.depIds[dep.id] = dep
    }
  }
}

class Observer {
  value: any
  constructor(value: any) {
    this.value = value
    this.walk()
  }
  walk() {
    Object.keys(this.value).forEach((key) => this.defineReactive(this.value, key, this.value[key]))
  }
  defineReactive(obj, key, val) {
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      set(newValue) {
        console.log(val)
        if (val === newValue) return
        val = newValue
        observe(newValue)
        dep.notify()
      },
      get() {
        console.log(val)
        if (Dep.target) {
          dep.depend()
        }
        return val
      },
    })
  }
}

const observe = (value) => {
  if (!value || typeof value !== "object") return
  return new Observer(value)
}

class Vue {
  data: any
  constructor(option: { data: any }) {
    this.data = option.data
    Object.keys(this.data).forEach((key) => this.proxy(key))
    observe(this.data)
  }
  $watch(expOrFn: any, callback: any) {
    new Subscriber(this, expOrFn, callback)
  }
  proxy(key: string) {
    Object.defineProperty(this, key, {
      get() {
        return this.data[key]
      },
      set(newValue: any) {
        this.data[key] = newValue
      },
    })
  }
}

const demo: any = new Vue({
  data: { text: "" },
})

const input = document.getElementById("input")
const p = document.getElementById("p")

input.addEventListener("input", (event: any) => {
  demo.text = event.target.value
})

demo.$watch("text", (val: string) => (p.innerHTML = val))
```

理解源码之后我们来分析一下为什么存在上面我们说的三个问题

- 2.0 响应式数据都要提前data里面声明；响应式数据是通过`访问器属性(getter/setter)`实现的，但是我们声明的时候声明的是对象的`数据属性`，是通过调用方法`defineReactive()`设置的响应式数据。假设我们的Vue实例化之后在代码中声明了一个属性，那么这个属性是没有调用过`defineReactive()`方法的。
- 2.0 响应式数据对数组的效果不理想；响应式数据是通过`访问器属性(getter/setter)`实现的，当数组改变的时候无法检测到。最常见改变数组的方法：'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'*（不包括改变数组的指向）*
- 2.0 响应式数据需要对多级对象进行深度遍历影响性能；2.0中为了能全面的对数据进行监听，所以要把多级对象进行深度遍历，为每个对象(PS:包括深度)的属性设置`访问器属性`

那么`Proxy`如何避免以上问题呢？


```js
const data = {
  title: "userInfo",
  andy: {
    name: "啦啦啦",
  },
}

const newData = new Proxy(data, {
  set() {
    console.log("设置data的值")
    return Reflect.set(...arguments)
  },
})

newData.title = "infoMation" // 设置data的值
```
**`Proxy`只需要给整个对象做劫持就可以，不需要为每个属性增加访问器属性**


```js
const data = [123, 123]

const newData = new Proxy(data, {
  set() {
    console.log("设置data的值")
    return Reflect.set(...arguments)
  },
})

newData.push(456) // 设置data的值
console.log(newData)  // [123,123,234]
```
**`Proxy`天生就可以劫持数组的改变**


```js
const newData = new Proxy(data, {
  set() {
    console.log("设置data的值")
    return Reflect.set(...arguments)
  },
})

newData.title = "infoMation" // 设置data的值
newData.andy.name = "吼吼吼" //  未打印
newData.andy = { name: "吼吼吼" } // 设置data的值
```
**`Proxy`只能劫持代理对象的直系属性，多级属性改变也无法劫持，所以也需要做深层遍历劫持；
由于`Proxy`可以代理整个对象，所以相比直线深层遍历其实“不深”**

### 文章参考来源

1. [Vue2.0双向绑定源码](https://github.com/vuejs/vue/blob/dev/src/core/observer/index.js#L156-L193)
2. [发布-订阅模式和观察者模式真的不一样？](https://segmentfault.com/a/1190000020211587)
3. [面试官: 实现双向绑定Proxy比defineproperty优劣如何?](https://juejin.cn/post/6844903601416978439#heading-12)