---
title: 文档流
date: 2019-11-11 21:48:30
tags:
description: 文档流：即文档正常排列的布局格式，而布局的基础就是盒模型；盒模型：即内容、内边距、边框、外边距组成；浏览器在渲染页面的过程中会算出每个盒模型应该占据的位置大小，然后根据文档的排列方式(正常的排列方式组合定位、浮动等非正常排列方式)显示每一个盒模型，这就是文档的基本组成。
---

### 文档流

**文档流**：即文档正常排列的布局格式，而布局的基础就是盒模型；
**盒模型**：即内容、内边距、边框、外边距组成；浏览器在渲染页面的过程中会算出每个盒模型应该占据的位置大小，然后根据文档的排列方式(正常的排列方式组合定位、浮动等非正常排列方式)显示每一个盒模型，这就是文档的基本组成。

一般情况下，盒子无非两种，块级元素、内联元素；

- 块级元素默认情况下宽度为父元素的 100%，高度默认为内容高度；
- 内联元素默认情况下宽度为内容宽度，高度也为内容高度，且不能给内联元素设置宽高。
- 元素显示规则：每一个块级元素沾满一行，内联元素之间会分享一行的空间，因为内联元素的宽度是由内容撑开的。
- 不要给内联元素设置宽、高、外边距、内边距、边框；
  **在此基础上显示的布局就是文档流**

### 定位

使文档不按照文档流排列的的方法之一

```
position: static|absolute|relative|fixed;
```

#### static 静态定位(默认属性)

将元素放入正常文档流中的位置，该属性为默认属性;

```html
<div class="box1"></div>
<div class="box2"></div>
<div class="box3"></div>
<div class="box4"></div>
```

```css
div {
  width: 500px;
  height: 100px;
}
.box1 {
  background-color: red;
}
.box2 {
  background-color: green;
}
.box3 {
  background-color: blue;
}
.box4 {
  background-color: yellow;
}
```

{% asset_img static.png %}

#### relative 相对定位

依然占据的正常文档流中的位置，但是显示位置根据设置的 top、bottom、left、right 有所区别。当设置具体位置时，设置为相对定位的元素是以正常文档流中的位置做参考的。

```html
<div class="box1"></div>
<div class="box2"></div>
<div class="box3"></div>
<div class="box4"></div>
```

```css
div {
  width: 500px;
  height: 100px;
}
.box1 {
  background-color: red;
}
.box2 {
  background-color: green;
  position: relative; /*此处新增了相对定位，并且增加了上左的50px的偏移*/
  top: 50px;
  left: 50px;
}
.box3 {
  background-color: blue;
}
.box4 {
  background-color: yellow;
}
```

{% asset_img relative.png %}

#### absolute 绝对定位

元素位置不再存在于文档流中，以定位父元素为基准决定显示位置，top 等意义为距离定位父元素上边的间距，其他边等同。也正是由于这个因素，当把 top，bottom 都设置为 0 的时候，该元素的高度即为父元素的 100%;另外定位元素不耽误 margin 起作用。

**注：定位父元素是定位元素的 position 属性不为 static 的父级元素，如无此种元素，定位父级为 html**

```html
<div class="box1"></div>
<div class="box2"></div>
<div class="box3"></div>
<div class="box4"></div>
```

```css
div {
  width: 500px;
  height: 100px;
}
.box1 {
  background-color: red;
}
.box2 {
  background-color: green;
  position: absolute; /*此处新增了绝对定位，并且增加了上左的50px的偏移*/
  top: 50px;
  left: 50px;
}
.box3 {
  background-color: blue;
}
.box4 {
  background-color: yellow;
}
.box5 {
  border: 1px solid black;
}
```

{% asset_img absolute.png %}

**绿盒子增加了绝对定位以后他原来的位置不再存在，蓝盒子占据了绿盒子原来的位置，而绿盒子以他的定位父元素为基准，根据 top、left 进行偏移**

##### 使用定位来设置定位元素的大小

对于定位盒子的 top、left、right、bottom 的定义，还有一种说法是可以有助于理解设置大小的情况。
以 top 为例，top 是用来设置定位元素的上边与定位父元素的上边之间的间距的。所以如果 top、bottom 设置为 0，则定位元素的高度即为定位父元素的 100%;

#### z-index

如果多个元素设置成定位，并且存在重合区域的时候，就会存在一个元素遮挡了另一个元素的情况，这时候要根据实际情况来决定哪一个元素显示在上方，这个时候就会用到 z-index

网页有一个 z 轴：一条从屏幕表面到你的脸（或者在屏幕前面你喜欢的任何其他东西）的虚线。z-index 值影响定位元素位于该轴上的位置；正值将它们移动到堆栈上方，负值将它们向下移动到堆栈中。默认情况下，定位的元素都具有 z-index 为 auto，实际上为 0。

请注意，z-index 只接受无单位索引值；你不能指定你想要一个元素是 Z 轴上 23 像素—— 它不这样工作。 较高的值将高于较低的值，这取决于您使用的值。 使用 2 和 3 将产生与 300 和 40000 相同的效果。

#### fixed 固定定位

这与绝对定位的工作方式完全相同，只有一个主要区别：绝对定位固定元素是相对于 元素或其最近的定位祖先，而固定定位固定元素则是相对于浏览器视口本身。
