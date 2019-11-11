---
title: Js 中文排序
date: 2019-11-08 15:22:15
tags:
description: 学习于网易云音乐webapp开发时给歌手按照拼音排序
---

### sort() 方法

#### 语法

```js
arrayObject.sort(sortby);
//sortby 可选，规定排序顺序，必须是函数
//返回值：对数组的引用。请注意，数组在原数组上进行排序，不生成副本。
```

如果没有引用函数，默认按照字符编码的顺序进行排序；
若希望按照其他方法排序，需提供比较函数。该函数要比较两个值，并返回一个用于说明这两个值的相对顺序的数字。
比较函数应该具有两个参数 a 和 b，其返回值如下：

- 若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。
- 若 a 等于 b，则返回 0。
- 若 a 大于 b，则返回一个大于 0 的值。

#### 例子 1

```js
<script type="text/javascript">
  var arr = new Array(6) arr[0] = "George" arr[1] = "John" arr[2] = "Thomas"
  arr[3] = "James" arr[4] = "Adrew" arr[5] = "Martin" document.write(arr + "
  <br />
  ") document.write(arr.sort())
</script>

//输出
//George,John,Thomas,James,Adrew,Martin
//Adrew,George,James,John,Martin,Thomas
```

#### 例子 2

```js
<script type="text/javascript">
  var arr = new Array(6) arr[0] = "10" arr[1] = "5" arr[2] = "40" arr[3] = "25"
  arr[4] = "1000" arr[5] = "1" document.write(arr + "<br />
  ") document.write(arr.sort())
</script>

//输出
//10,5,40,25,1000,1
//1,10,1000,25,40,5
```

**请注意，上面的代码没有按照数值的大小对数字进行排序，要实现这一点，就必须使用一个排序函数：**

```js
<script type="text/javascript">

function sortNumber(a,b)
{
return a - b
}

var arr = new Array(6)
arr[0] = "10"
arr[1] = "5"
arr[2] = "40"
arr[3] = "25"
arr[4] = "1000"
arr[5] = "1"

document.write(arr + "<br />")
document.write(arr.sort(sortNumber))

</script>

//输出
//10,5,40,25,1000,1
//1,5,10,25,40,1000
```

### charAt() 方法

charAt() 方法可返回指定位置的字符。

#### 语法

```js
stringObject.charAt(index);
//index 必需 表示字符串中某个位置的数字，即字符在字符串中的下标。
//注释：字符串中第一个字符的下标是 0。如果参数 index 不在 0 与 string.length 之间，该方法将返回一个空字符串。
```

### charCodeAt() 方法

charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。

#### 语法

```js
stringObject.charCodeAt(index);
//index 必需 表示字符串中某个位置的数字，即字符在字符串中的下标。
//注释：字符串中第一个字符的下标是 0。如果 index 是负数，或大于等于字符串的长度，则 charCodeAt() 返回 NaN。
```

#### 实例

```js
<script type="text/javascript">
  var str="Hello world!" document.write(str.charCodeAt(1))
</script>
// 输出 101
```

### localeCompare() 方法

用本地特定的顺序来比较两个字符串。

#### 语法

```js
stringObject.localeCompare(target);
//target 要以本地特定的顺序与 stringObject 进行比较的字符串。
//返回值 说明比较结果的数字。如果 stringObject 小于 target，则 localeCompare() 返回小于 0 的数。如果 stringObject 大于 target，则该方法返回大于 0 的数。如果两个字符串相等，或根据本地排序规则没有区别，该方法返回 0。
//注释 把 < 和 > 运算符应用到字符串时，它们只用字符的 Unicode 编码比较字符串，而不考虑当地的排序规则。以这种方法生成的顺序不一定是正确的。
```

综合以上几个方法就可以把中文、数字、英文等按照一定顺序排列了

#### 实际应用

```js
let arr = [
  "",
  "A001",
  "V002",
  "V003",
  "_123",
  "133",
  "2334",
  "大124",
  "小afaf",
  "a001",
  "v004",
  "马龙",
  "中华",
  "中国"
];
arr.sort(function(a, b) {
  let max_length = Math.max(a.length, b.length),
    compare_result = 0,
    i = 0;
  while (compare_result === 0 && i < max_length) {
    compare_result = compare_char(a.charAt(i), b.charAt(i));
    i++;
  }
  return compare_result;
});
function compare_char(a, b) {
  var a_type = get_char_type(a),
    b_type = get_char_type(b);
  if (a_type === b_type && a_type < 4) {
    return a.charCodeAt(0) - b.charCodeAt(0);
  } else if (a_type === b_type && a_type === 4) {
    return a.localeCompare(b);
  } else {
    return a_type - b_type;
  }
}

function get_char_type(a) {
  var return_code = {
    nul: 0,
    symb: 1,
    number: 2,
    upper: 3,
    lower: 4,
    other: 5
  };
  if (a === "") {
    return return_code.nul; //空
  } else if (a.charCodeAt(0) > 127) {
    return return_code.other;
  } else if (a.charCodeAt(0) > 122) {
    return return_code.symb;
  } else if (a.charCodeAt(0) > 96) {
    return return_code.lower;
  } else if (a.charCodeAt(0) > 90) {
    return return_code.symb;
  } else if (a.charCodeAt(0) > 64) {
    return return_code.upper;
  } else if (a.charCodeAt(0) > 58) {
    return return_code.symb;
  } else if (a.charCodeAt(0) > 47) {
    return return_code.number;
  } else {
    return return_code.symb;
  }
}
console.log(arr);
//["", "_123", "133", "2334", "A001", "V002", "V003", "a001", "v004", "大124", "小afaf", "马龙", "中华", "中国"]
```
