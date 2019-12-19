---
title: 用vue学习Angular
date: 2019-12-18 09:34:59
tags:
description: 用Vue的一些概念去学习Angular的语法
---

### 前言

---

学习本来是个枯燥无味的事情，所以我为了强制我的脑子不停的思考的方法就是边学边写点什么，这让我想起了我当初“机械制造技术基础“考试之前，我用了同样的方法，我把老师给画的考点全部在本子上潮鞋

在学习`Angular`之前，我们应该能在`Angular`的‘环境’里面书写`Angular`的语法，但是我们没法像`Vue`一样使用`cdn`的方法直接创建一个`Vue`的‘环境’，但是好在官方文档给了我们一个线上的‘环境’，能让我们直接书写`Angular`的语言，并且看到编译以后的结果。

[点此在 StackBlitz 上创建一个新项目](https://stackblitz.com/angular/krnapkaxypn)

### 两种框架的项目目录对比

**由于我也是初学，所以项目目录认识的也不全，Vue 的也只是平时的一个小项目的目录，基本没有代表性，但是这个 Angular 的目录是教程中的一个例子的目录结构，对于初学者还是能有所提示的。**

<div style='display: flex;justify-content: space-around;align-items: center;'>
  <img src='vue.jpg' title='Vue 目录结构'><img src='angular.png' title=‘Angular 目录结构’>
</div>

#### Vue 目录结构

Vue 的目录是脚手架自动创建的，App.vue 是 Vue 项目的根组件，router 文件夹是 vue-router 的路由配置，components 是用来存放组件的

#### Angular 目录结构

在 Angular 中，前缀名一样的一般是一个组件的不同组成部分。比如 app.component 是 Angular 应用的根组件，就好像 Vue 中的 App.vue 一样。另外在 app 目录下的其他文件就是目录的组件了，不知道当项目很大的时候会如何架构，但是在最基本的官方案例中是如此放置的。
此外我们还能看到一个名叫`app-routing.module.ts`的文件，功能就像他的名字一样，他就是用来配置 Angular 应用的路由的。
以上所说的在我的理解中都是视图部分，在 Angular 中视图与数据处理分的比较清楚，在刚刚入门 Vue 的时候没有这种感觉，不知道是因为刚刚学习 Vue 的时候自己是个小白还是因为框架文档讲述的区别。
既然刚刚的视图组件都是用来展示数据的，那么问题来了，我们如何获取并处理数据呢？

`service`是用来获取数据并处理数据的模块

### 模板语法

---

**由于我们是用 Vue 的概念去学习 Angular，所以我会对比着说两种框架中类似的概念，能让我在学习 Angular 的时候重新夯实 Vue**

#### 回顾 Vue 的模板语法

---

##### 插值

- 文本
  > 数据绑定最常见的形式就是使用“Mustache”语法的文本插值
  ```Vue.js
  <span>Message: {{ msg }}</span>
  <span v-once>这个将不会改变: {{ msg }}</span>
  ```
- 原始 HTML
  > 双大括号会将数据解释为普通文本，而非 HTML 代码。为了输出真正的 HTML，你需要使用 v-html 指令
  ```vue.js
  <p>Using mustaches: {{ rawHtml }}</p>
  <p>Using v-html directive: <span v-html="rawHtml"></span></p>
  ```
- 特性
  > Mustache 语法不能作用在 HTML 特性上，遇到这种情况应该使用 v-bind 指令
  ```vue.js
  <div v-bind:id="dynamicId"></div>
  ```
- 使用 JavaScript 表达式

  > 迄今为止，在我们的模板中，我们一直都只绑定简单的属性键值。但实际上，对于所有的数据绑定，Vue.js 都提供了完全的 JavaScript 表达式支持。

  ```vue.js
  {{ number + 1 }}

  {{ ok ? "YES" : "NO" }}

  {{
    message
      .split("")
      .reverse()
      .join("")
  }}

  <div v-bind:id="'list-' + id"></div>
  ```

##### 指令

指令是带有`v-`前缀的特殊特性。指令的指责是，当表达式的值改变时，将其产生的连带影响，响应式的作用与 DOM。

- v-if
  > v-if 指令将根据表达式 seen 的值的真假来插入/移除 `<p>` 元素。
- v-bind
  > v-bind 指令可以用于响应式地更新 HTML 特性
- v-on
  > v-on 指令可用于监听 DOM 事件

#### Angular 的模板语法

---

##### 插值

- 文本的处理方法相同
  在页面文本这部分，Angular 的处理方法与 Vue 相同，都是使用双括号的方法

  ```angular.js
  <span>Message: {{ msg }}</span>
  ```

- 原始 HTML

  这个还没有发现

- 特性的绑定方法

  ```angular.js
  // 此处的iphone应该是个变量 <a [title]="iphone"></a>
  ```

##### 指令

- v-if === \*ngIf
- v-bind === []
- v-on === ()
