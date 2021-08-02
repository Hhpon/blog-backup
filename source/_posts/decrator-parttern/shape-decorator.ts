/**
 * 画形状
 * 需求一：我们从形状接口实现两个具体的类(圆、矩形)
 * 
 * 需求二：我们要在两个形状上面新增增加红色边框的功能
 * 
 * 尝试装饰器：
 * 
 * 只需要额外增加一个新职责类 1 * 1 = 1
 * 如果我们有四个形状 * 三个新职责组合  1 * 3 = 3
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

interface ShapeDecrator {
  shape: Shape
  draw: { (): void }
}

class RedShapeDecrator implements ShapeDecrator {
  shape: Shape
  constructor(shape: Shape) {
    this.shape = shape
  }
  draw() {
    this.shape.draw()
    this.setRedBorder()
  }
  setRedBorder() {
    console.log('Border Color: Red')
  }
}

console.log('--------sencond requirement--------')

const redCircle = new RedShapeDecrator(circle)
const redRectangle = new RedShapeDecrator(rectangle)

redCircle.draw()
redRectangle.draw()
