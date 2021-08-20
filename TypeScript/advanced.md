# 进阶

## 类型别名

类型别名用于给一个类型起一个新名字

类型别名通常用于

* 指定一个联合类型
* 指定一组类型集合，多次使用

```typescript
type ID = number | string;

type Point = {
    x: number;
    y: number;
};
```

## 字符串字面量类型

字符串字面量类型用来约束取值只能是某几个字符串中的一个。

```typescript
type EventNames = 'click' | 'scroll' | 'mousemove';
```

注意两者均用**type**进行定义

## 元组

数组合并了相同类型的对象，元组（Tuple）合并了不同类型的对象

```typescript
let tome: [string, number] = ['Tom', 25];
```

* 可以只对其中一项赋值
* 但是对变量整体做初始化或赋值时，需要提供所有元组类型指定的项

**越界元素**：越界元素类型被限制为元组每个类型的联合类型

## 枚举

枚举类型的概念来源于C#

Enum枚举类型用于取值被限定在一定范围内的场景

枚举成员会被赋值为从0开始递增的数字，同时也会对枚举值到枚举名进行反向映射。

实现原理即为创建一个map，枚举成员和index均为其中的key，枚举成员和index互为key-value关系

```typescript
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 0); // true
console.log(Days[0] === "Sun"); // truex
```

### 手动赋值

可以给枚举项手动赋值，未赋值的枚举项会接着上一个枚举项递增。

如果未赋值的项与手动赋值的重复了，ts不会检查这一点，这样会导致index对应的value产生覆盖问题，后面的覆盖前面的，所以尽量不要出现覆盖

* 手动赋值可以不是数字，此时需要使用类型断言让tsc无视类型检查
* 手动赋值可以使用小数或负数

### 常数项和计算所得项

枚举项有两种类型

* 常数项
* 计算所得项：通过计算才能获取对应值。如果跟在计算所得项后面是未手动赋值的向，则会因为无法获得初始值而报错

#### 常数项

满足以下条件的枚举成员会被当作常数

* 不具有初始化函数并且之前的枚举成员是常数
* 枚举成员使用常数枚举表达式初始化。常数枚举表达式是TypeScript表达式的子集，可以在编译阶段求值

### 常数枚举

使用`const enum`定义的枚举类型，其与普通枚举的区别在于，在编译阶段会被删除，且其中不能包含计算成员

```typescript
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];

// 编译为
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

### 外部枚举

外部枚举时使用`declare enum`声明枚举类型，declare定义的内容编译时会被删除

外部枚举也可以使用`declare const enum`同时定义并声明

## Class

TypeScript 除了实现了所有 ES6 中的类的功能以外，还添加了一些新的用法。

### 修饰符

* public：修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是public的
* private：修饰的属性或方法是私有的，不能在声明它的类的外部访问
* protected：修饰的属性或方法是受保护的，与private相似，区别在于**它在子类中也是允许被访问的**

在ts编译后的代码中，并没有限制`private`属性的外部可访问性

#### 当构造函数的修饰符为`private`时，该类不允许被继承或者实例化

### 参数属性

修饰符和`readonly`还可以使用在构造函数参数中，等同于类中定义该属性同时对该属性赋值

`readonly`：只读属性关键字，只允许出现在属性声明、索引签名或者构造函数中，与其他访问修饰符同时存在的话，需要写在其后面

### 抽象类

`abstract`用于定义抽象类和其中的抽象方法

抽象类使用注意

* 不允许被实例化
* 抽象类中的抽象方法必须被子类实现

抽象类在ts最终编译结果中仍然存在，抽象方法不会存在

### 类的类型

给class加上TypeScript类型，方法与接口类似

## class与interface

interface可以用于**对象的形状**进行描述

### 类实现接口

一般的，类只能继承自另一个类。当不同类之间有一些共有特性时，此时可以把特性提取为`interfaces`，使用`implements`实现，即为在`class`中实现了这个特性

```typescript
interface Alarm {
    alert(): void;
}

interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```

### 接口继承接口

接口与接口之间可以是继承关系

```typescript
interface Alarm {
    alert(): void;
}

interface LightableAlarm extends Alarm {
    lightOn(): void;
    lightOff(): void;
}
```

### 接口继承类

TypeScript中接口可以继承类，因为在声明class时，既创建了一个class，同时也创建了一个同名的interface，故可以将其既当做类使用，也当做接口使用

同名interface中仅包含对应的实例属性与实例方法，**不包含constructor、静态属性与静态方法**

**接口继承类**实质上还是**接口继承接口**

## 声明合并

如果定义了两个相同名字的函数、接口或类，那么他们会合并成一个类型

### 函数的合并

可以通过重载定义多个函数类型

### 接口的合并

接口中的属性在合并时会简单的合并到一个接口中

**合并的类型属性必须是唯一的**，如果存在多个同名接口的同名属性类型存在冲突会报错

接口中方法的合并与函数的合并相同

### 类的合并

类的合并与接口合并规则一致
