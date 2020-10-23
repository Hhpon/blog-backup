---
title: JavaScript 异步编程
date: 2020-10-21 21:19:20
tags:
description: 异步 -- Javascript 最基础的概念
---

### 基础概念
---

同学A早上八点准时上课，早上起床之后他需要花费10分钟的时间热牛奶，3分钟的时间上厕所，2分钟的时间刷牙；

问： 理想情况下同学A这些事情最少花费多长时间。

最聪明的做法是在加热牛奶的间隙去洗漱上厕所，最少花费的时间也就是10分钟；事实上Javascript也有类似的事情；

大型网站在加载过程中需要运行大部分的Javascript代码，其中就有“耗时间”的任务以及普通任务；JavaScript的设计者是个聪明人，使用类似“加热牛奶”的过程执行Javascript任务； --- 异步编程

程序运行过程中存在一个任务队列，普通任务一个个被执行，当遇到异步操作的时候会把异步代码放入其他线程以不影响任务队列的执行，当任务队列中普通任务执行完毕时，异步操作会再次回到任务队列中执行相应的回调函数。

### Promise
---

那么异步编程的使用方法是什么样子的呢？随着Javascript的发展，Promise作为最新的异步编程方法有着特别方便的使用方式。

#### 异步编程展示出什么效果呢？

思考如下代码,是先打印123还是先打印234？

```js
<script>
  function doit(){
    console.log(123)
  }
  doit()
  console.log(234)
</script>
```

思考如下代码,是先打印123还是先打印234？
```js
<script>
  db.collection('todo').get().then(res=>{
    console.log(123)
  }).catch(err=>{
    console.log(err)
  })
  console.log(234)
</script>
```

`.then()`与`catch()`是针对异步函数的两种不同情况触发的回调函数，前者为函数运行成功后的回调函数，后者为函数抛出错误时的回调函数。

思考如下代码，console打印的a是多少？

```js
<script>
  let a = '';
  db.collection('todo').get().then(res=>{
    a = 123
  }).catch(err=>{
    console.log(err)
  }).finally()
  console.log(a)
</script>
```
