/**
 * 传统面向对象语言的装饰者模式
 */

interface Fire {
  fire: { (): void }
}

class Plane implements Fire {
  fire() {
    console.log('发射普通子弹')
  }
}

class MissileDecorator implements Fire {
  plane: Plane
  constructor(plane: Plane) {
    this.plane = plane
  }
  fire() {
    this.plane.fire()
    console.log('发射导弹')
  }
}

class AtomDecorator implements Fire {
  plane: Plane
  constructor(plane: Plane) {
    this.plane = plane
  }
  fire() {
    this.plane.fire()
    console.log('发射原子弹')
  }
}

var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);

plane.fire();