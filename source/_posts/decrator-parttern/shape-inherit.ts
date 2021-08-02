/**
 * 画形状
 * 需求一：我们从形状接口实现两个具体的类(圆、矩形)
 * 
 * 需求二：我们要在两个形状上面新增增加红色边框的功能
 * 问题一：我们能不能直接去修改原来的代码？
 * 开闭原则 => 可以重构
 * 继承一下，实现我们的功能
 * 
 * 回忆刚刚的弊端：两个形状 * 一个新职责组合  2*1 = 2
 * 如果我们有四个形状 * 三个新职责组合  4 * 3 = 12
 */

interface Shape {
  draw: { (): void }
}

class Circle implements Shape {
  draw() {
    console.log('Shape: Circle')
  }
}

class Rectangle implements Shape {
  draw() {
    console.log('Shape: Rectangle')
  }
}

const circle = new Circle()
const rectangle = new Rectangle()

circle.draw()
rectangle.draw()

class RedCircle extends Circle {
  constructor() {
    super()
  }
  draw() {
    super.draw()
    this.setRedBorder()
  }
  setRedBorder() {
    console.log('Border Color: Red')
  }
}

class RedRectangle extends Rectangle {
  constructor() {
    super()
  }
  draw() {
    super.draw()
    this.setRedBorder()
  }
  setRedBorder() {
    console.log('Border Color: Red')
  }
}

const redCircle = new RedCircle()
const redRectangle = new RedRectangle()

console.log('--------sencond requirement--------')

redCircle.draw()
redRectangle.draw()