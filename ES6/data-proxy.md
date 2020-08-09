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

* deleteProperty
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