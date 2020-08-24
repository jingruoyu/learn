## class

### 简介

ES5中实现继承是通过构造函数与原型对象，与其他语言不太相同

ES6中提供了class语法用于定义类，写法更为清晰，生成实例时使用方法与构造函数一致

* 类必须使用new调用，否则会报错
* **类本身就指向构造函数，其数据类型为函数**
* 类上面的方法定义在原型对象上
* 类定义的方法都是不可枚举的，与ES5不一致

#### constructor

当new命令生成类的实例对象时，自动调用此方法

一个类必须有constructor方法，如果显示定义，会自动添加一个空的constructor方法

**constructor中默认返回类的实例对象，即this，但也可以指定返回另外的对象**

```javascript
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo
// false
```

实例属性除了可以定义在constructor函数中，也可以定义在类的最顶层，此时不需要在实例属性前加this

#### 类的实例

* 必须使用new命令生成类的实例
* 除了定义在this上的数据，类中其他的属性都是定义在原型对象上的
* 类的所有实例共享一个原型对象

建议使用Object.getPrototypeof方法从实例上获取原型对象，避免对`__proto__`的依赖

#### getter/setter

在类的内部可以使用get、set关键字设置存值函数和取值函数，拦截对相应属性的操作

getter和setter是设置在属性的descriptor对象上的

这两个对象可以达到避免暴露对象内部属性的目的

#### class表达式

class可以使用类似于函数表达式的形式进行定义

```javascript
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
```

这个类的名字为Me
* 在类的内部，Me和MyClass都可以用
* 在类的外部，只能用MyClass

如果类的内部没有用到函数名，可以省略函数名

可以存在匿名的立即执行类，返回的是类的实例

**NOTE**
* class定义不存在变量提升
* name属性总是返回class关键字后面的类名
* 如果在某个方法前面加\*，则表示该方法为generator方法
* this指向问题

	类方法中this默认指向类的实例，但是当该方法被单独调用时，this会指向运行时所在环境

	解决办法：
	* constructor中对该函数bind this指向
	* constructor中定义箭头函数
	* 使用proxy，获取方法时自动绑定this

	但是前两种方法会导致方法都定义在实例上，尽量不要单独调用

### 静态方法

静态方法是指class本身所具有的方法，通过在方法名前增加static关键字定义

类中的方法都定义在原型对象上，都会被实例继承。但是静态方法不会被继承，只能通过类来直接调用。实例调用会不存在此方法

**如果静态方法中使用this，则this指向类，而不是实例**。而类上所拥有的，只有静态属性和静态方法

**父类的静态方法可以被子类继承，可以使用子类直接调用，可以在子类中使用super对象调用**

### 静态属性

静态属性是指class本身所具有的属性，即Class.propName，而不是定义在实例对象上的属性

目前只能在类的外部定义

```javascript
class Foo {
}

Foo.prop = 1;
Foo.prop // 1
```

但是ES6明确规定，Class内部只有静态方法，没有静态属性

目前有一个stage3的提案，规定了和静态方法类似的定义方法，写在实例属性的前面

### 私有方法和私有属性

私有方法和私有属性是指只能在类的内部访问的方法和变量，外部不能方法。但是ES6没有提供相应的方式

变通实现方式
* 命名区别：对私有的方法和属性命名加以却分，标明这是一个仅限于内部使用的私有方法。

	但是此方法不保险，外部还是可以访问到

* 将私有方法移出模块，需要时绑定this调用
* 将私有方法的名字设为symbol值，外部无法轻易获取

	但是Reflect.oenKeys依然可以拿到

目前有一个stage3阶段的提案，规定私有属性或方法以#开头，无法在类的外部调用

### new target

ES6为new命令引入了**new.target**属性，一般用在构造函数中，返回new命令作用于的那个构造函数

如果构造函数不是通过new命令或者Reflect.construct()调用，new.target会返回undefined

此属性可以用于判断构造函数的调用方式

**NOTE**：子类继承父类，会通过super调用父类，当实例化子类时，父类收到的new.target会是子类

## 继承

### class通过extends实现继承

ES5中通过修改原型链实现继承，ES6中使用extends会清晰很多

继承过程区别：
* ES5继承过程为先创建子类的实例对象this，再将父类的方法添加到this上
* ES6继承过程为先通过父类的构造函数完成this的塑造（super方法的调用），得到与父类实例对象相同的属性和方法，再用子类的构造函数修改this对象

所以**ES6中如果不调用super方法，子类就获取不到this对象，也只能够在super调用之后使用this**

如果子类没有定义constructor方法，则会默认添加一个包含super方法的constructor

### Object.getPrototyoeOf()

此方法可以用于从子类上获取父类，可以判断一个类是否继承了另一个类

### super

作为函数调用和对象使用，用法完全不同

#### 作为函数调用

子类中调用的super函数，代表父类的构造函数

**super执行后返回的是子类的实例**，原因上述已经说明。即B继承A的super的调用相当于`A.prototype.constructor.call(this)`

super函数只能用在子类的构造函数中，其他地方调用会报错

#### 作为对象使用

* 在普通方法中，指向父类的原型对象

	此时，父类实例上的方法或属性，无法通过super调用，只能获取原型对象上的属性或方法

	**子类普通方法中通过super调用父类的方法，该方法中的this指向当前子类实例**，通过super进行属性赋值同理。

* 在静态方法中，指向父类

	**子类普通方法中通过super调用父类的方法，该方法中的this指向当前子类**，与上面同理

由于作为函数调用和对象使用具有很大区别，故在舒勇super时，必须显示指定使用类型，否则会报错

**由于对象总是继承自其他对象的，所以可以在任何一个对象中使用super关键字**

### prototype属性和__proto__属性

* 子类的__proto__属性，表示构造函数的继承，总是指向父类
* 子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性

基类不存在父类，只是一个普通函数，继承自Function.prototype，故基类的__proto__属性指向Function.prototype

由上述可知，基类继承自Function.prototype，故基类的`class.prototype.__proto__`指向`Function.prototype.__proto__`，即`Obejct.prototype`

针对实例：子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性

### 继承

ES5中不能继承原生构造函数，因为在子类中执行原生构造函数时需要通过call或apply绑定this，传入参数，而原生构造函数会忽略这些方法传入的this，导致无法拿到内部属性

ES6中允许继承原生构造函数

不过ES6中继承Object需要注意，一旦发现Object方法不是通过new命令调用，则会忽略参数

### mixin多重继承

mixin是一种实现多重继承的方式，允许向一个类里面注入一些代码，使得一个类或多个类的功能能够“混入”另一个类