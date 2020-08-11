## proxy

proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于对编程语言进行编程

proxy在目标对象外架设了一层拦截，外界对该对象的访问，都必须先通过这层拦截，故**可以通过proxy对外界的访问进行过滤和改写**

```javascript
var  proxy = new Proxy(target, handler);
```

ES6原生提供了proxy构造函数，生成proxy实例。target表示所要拦截的目标对象，handler用于定制拦截行为，也是一个对象

**如果要使proxy起作用，必须针对Proxy实例进行操作，而不能直接对target进行操作**

proxy还可以作为其他对象的原型对象，当访问到原型对象上的属性时，即会调用proxy上的方法

### handler支持的拦截操作

#### get

get方法用于拦截某个属性的读取操作，可继承

如果一个属性不可写且不可配置，则proxy不能修改该属性，否则会报错

#### set

set方法用于拦截某个属性的赋值操作，可以进行数据校验、数据绑定、实现内部属性等操作

如果一个属性不可写且不可配置，则proxy对这个属性的set代理将不生效

#### has

用于拦截hasProperty操作、in运算符，判断对象是否具有某个属性，返回布尔值

has只能拦截hasProperty，不能拦截hasOwnProperty，即不能判断一个属性是对象的继承属性还是自身属性

has对`for...in`循环无效

#### deleteProperty

用于拦截delete操作，如果这个方法抛出错误或者返回false，则当前属性无法被delete命令删除

* ownKeys
* getOwnPropertyDescriptor
* defineProperty
* preventExtensions
* getPrototypeOf
* isExtensible
* setPrototypeOf

#### apply

拦截Proxy实例作为函数调用、call、apply操作

直接调用`Reflect.apply`方法，也会被拦截

#### construct

拦截 Proxy 实例作为构造函数调用的操作，用于拦截new命令

必须返回一个对象，否则报错

### revocable

可取消的Proxy实例

目标对象不允许直接访问，只能通过代理访问，可以在访问结束后收回访问权限，不允许再次方案

### this

Proxy不是针对目标对象的透明代理，它会导致代理后目标对象内部的this均指向proxy，使得在对象上调用方法与在proxy上调用方法结果可能不一致

## Reflect

Reflect对象的设计目的为
* 将Object对象上一些属于语言内部的方法放在Reflect上
* 修改一些Object方法的返回结果，使其变得更合理
* 让Object操作都变成函数行为

	目前某些Object的操作是命令式，如`name in obj`，`delete obj.name`，Reflect介入使其变为函数行为

* Reflect对象的方法与Proxy对象的方法一一对应

	Proxy对象可以方便的调用对应的Reflect方法，完成默认行为，作为修改行为的基础。即无论Proxy怎样修改行为，都可以在Reflect上获取到默认行为

### 静态方法

#### get(target, name, receiver)

查找并返回target对象的name属性，如果没有该属性，则返回undefined

如果name属性部署了读取函数（getter），则读取函数的this绑定receiver

如果第一个参数不是对象，该方法会报错

#### set(target, name, value, receiver)

设置target对象的name属性等于value，如果该属性设置了setter，则复制函数的this绑定receiver

当在`Proxy.set`中使用`Reflect.set`时，如果`Reflect.set`传入`receiver`，会导致触发`Proxy.defineProperty`。这是因为`Proxy.set`的`receiver`参数总是指向当前的`Proxy`实例，而`Reflect.set`一旦传入`receiver`，就会将属性赋值到`receiver`上面，导致触发`defineProperty`拦截。如果`Reflect.set`没有传入`receiver`，那么就不会触发`defineProperty`拦截

如果第一个参数不是对象，该方法会报错

#### has(obj, name)

`Reflect.has`方法对应`name in obj`里面的in运算符

如果Reflect.has()方法的第一个参数不是对象，会报错

#### deleteProperty(obj, name)

等同于delete obj[name]，用于删除对象属性

该方法返回一个布尔值。如果删除成功，或者被删除的属性不存在，返回true；删除失败，被删除的属性依然存在，返回false

如果第一个参数不是对象，该方法会报错

#### apply(func, thisArg, args)

`Reflect.apply`方法等同于`Function.prototype.apply.call(func, thisArg, args)`,用于绑定this对象后执行给定函数

```javascript
const ages = [11, 33, 12, 54, 18, 96];

// 旧写法
const youngest = Math.min.apply(Math, ages);
const oldest = Math.max.apply(Math, ages);
const type = Object.prototype.toString.call(youngest);

// 新写法
const youngest = Reflect.apply(Math.min, Math, ages);
const oldest = Reflect.apply(Math.max, Math, ages);
const type = Reflect.apply(Object.prototype.toString, youngest, []);
```

#### 其他方法不赘述

### 观察者模式实现

```javascript
const queueTask = new Set()

const observe = fn => queueTask.add(fn)

const observable = obj => new Proxy(obj, {set}

function set(target, key, value, receiver) {
	Reflect.set(target, key, value, receiver)
	queueTask.forEach(observer => observer())
}

const person = observable({
  name: '张三',
  age: 20
});

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observe(print);
person.name = '李四';
```