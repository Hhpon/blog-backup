---
title: IIFE(立即调用函数表达式)
date: 2019-12-17 16:13:30
tags:
---

### IIFE(立即调用函数表达式)

---

IIFE 是一个定义时就会立即执行的 JavaScript 函数。

```js
(function() {
  statements;
})();
```

这是一个被称为自执行匿名函数的设计模式，主要包含两部分(两部分都是括号)。第一部分是包围在圆括号运算符()里的一个匿名函数，这个匿名函数拥有独立的词法作用域。这不仅避免了外界访问此 IIFE 中的变量，而且有不会污染全局作用域。

第二部分再一次使用（）创建了一个立即执行函数表达式，JavaScript 引擎到此将直接执行函数。

```js
(function() {
  var name = "Barry";
})();
// 无法从外部访问变量name
name;
```

将 IIFE 分配给一个变量，不是存储 IIFE 本身，而是存储 IIFE 执行后返回的结果。

```js
var result = (function() {
    var name = 'Barry';
    return name;
})
// IIFE 执行后返回的结果：
result； //'Barry'
```


