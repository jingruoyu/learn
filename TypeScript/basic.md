## 基本数据类型

* Boolean
* Number

    ```javascript
    let decLiteral: number = 6;
    let hexLiteral: number = 0xf00d;
    // ES6 中的二进制表示法
    let binaryLiteral: number = 0b1010;
    // ES6 中的八进制表示法
    let octalLiteral: number = 0o744;
    let notANumber: number = NaN;
    let infinityNumber: number = Infinity;
    ```

* String
* Symbol
* undefined和null

    **undefined和null是所有类型的子类型，包括void，故将undefined和null赋值给其他类型的变量不会报错**

* 空值（void，不属于基本数据类型）

    可以使用空值void表示没有任何返回值的函数

    ```javascript
    function alertName(): void {
        alert('My name is Tom');
    }
    ```

    空值类型的变量只能被赋值为undefined或null

## 任意值 any

普通类型的变量，在赋值过程中改变类型是不被允许的。但如果为**any类型**，则允许被赋值为任意类型

* 在任意值上访问任何属性都是允许的
* 也可以调用任何方法
* 对任意值的任何操作，返回的内容类型都是任意值

## 类型推论

如果变量没有明确声明指定类型，TS会根据其初始化的赋值时推测一个类型

但如果变量在声明时既没有指定类型也没有初始化，则会被识别为任意值类型，不进行类型检查

## 联合类型

联合类型表示取值可以为多种类型的一种

```javascript
let myFavoriteNumber: string | number;
```

* 当不确定变量到底是联合类型中的哪种类型时，其只能访问联合类型中所有类型的公共方法或属性
* 当变量被赋值后，其会根据类型推论进行推断，此时即可访问特定类型下的属性，访问其他属性会报错

## 接口 interfaces

接口用于定义对象的类型，是对行为的抽象，具体如何行动需要由类class去实现

TypeScript中的接口不仅可以对类的行为进行抽象，也可以对**对象的形状**进行描述

### 确定属性

```javascript
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
```

变量的属性与常规定义的确定属性必须完全一致，不能增加或减少属性

### 可选属性

需要定义可选属性，可以使用?描述符

```javascript
interface Person {
    name: string;
    age?: number;
}
```

### 任意属性

使用任意属性可以添加自定义的属性

```javascript
interface Person {
    name: string;
    age?: number;
    [propName: string]: string | number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
    address: 'aaaaa'
};
```

* 一个接口只能定义一个任意类型
* 一个任意类型可以对应多个自定义属性

**属性名与值类型**
* 如果任意类型的**key指定为string**，则对应的value类型必须涵盖其它所有确定类型和可选类型，可以使用联合类型
* 如果任意类型的**key指定为number**，则对应的value类型与其他类型无关

### 只读属性

如果希望对象中的一些字段只能在创建的时候被赋值，可以使用readonly

```javascript
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}
```

注意：
* 只读的约束是指给对象赋值后，不能再单独向只读属性赋值
* 可以对一个变量重复赋值，此时不受内部只读属性的限制

## 数组的类型

### type[]

```javascript
let fibonacci: number[] = [1, 1, 2, 3, 5]
```

* 数组的项中不允许出现其他的类型
* 数组的方法参数也会根据数组在定义是约定的参数类型进行限制，如push方法

### 数组泛型

```javascript
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

### 使用接口定义数组

```javascript
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

此方法一般会被用来表示**类数组**对象

类数组不是数组类型，所以不能直接使用数组的定义方法，需要使用接口定义

## 函数的类型

### 声明式

```javascript
function sum(x: number, y: number): number {
    return x + y;
}
```

**调用函数时参数的数量必须与声明时相等**

### 函数表达式

* 简单形式

    ```javascript
    let mySum = function (x: number, y: number): number {
        return x + y;
    };
    ```

* 标准形式

    ```javascript
    let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
        return x + y;
    };
    ```

此处注意TypeScript中的`=>`和ES6的箭头函数不同，TypeScript中的`=>`主要用于表示函数的定义，左边是输入类型，右边是输出类型

### 接口定义函数形状

```javascript
interface SearchFunc {
    (source: string, subString: string): boolean;
}
```

### 可选参数

```javascript
function sum(x: number, y?: number): number {
    return x + y;
}
```

可选参数后不允许再出现必须参数

### 参数默认值

可以为函数参数设定默认值，设定默认值后该参数会被识别为可选参数，即不再受可选参数必须在必需参数后的约束

```javascript
function buildName(firstName: string, lastName: string = 'Cat') {
    return firstName + ' ' + lastName;
}
```

### 剩余参数

TypeScript中需要显示指定剩余参数，剩余参数本质上是一个数组，直接使用数组的定义方法即可

```javascript
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}
```

### 重载

重载允许一个函数接受不同数量或者类型的参数，进行不同的处理，此处主要处理不同类型的参数

直接使用联合类型会导致输入类型和输出类型不能建议严格对应关系，故需要使用重载

```javascript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

此处先定义函数，最后进行函数的实现

## 断言

类型断言能够将联合类型对应为其中的一个类型，相当于告诉TypeScript变量的具体类型，避免ts报错，但是可能会引起后续js执行时的错误

```
variable as interfaces
```

目前并没有变量和接口之间直接关联的方法，所以使用断言先假设变量为某一类变量，**再通过获取这类变量特有的属性或方法判断此假设是否成立**

### 断言的用途

#### 将任何一个类型断言为any

将一个变量断言为any后，我们即可随意操作这个变量，因为在any类型的边梁上，访问任何属性都是允许的

```javascript
(window as any).foo = 1;
````

这是ts中解决类型问题的最后一个手段，但是可能会掩盖真正的问题

#### 将any断言为一个具体的类型

旧代码中可能会有一些any类型的变量，新的开发过程中，最好能够将其断言为一个具体的类型，防止其滋生出更多的any类型

```javascript
function getCacheData(key: string): any {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom = getCacheData('tom') as Cat;
tom.run();
```

### 断言的限制

如果A能够被断言为B，只需要A兼容B或B能够兼容A即可

TypeScript是结构类型的系统，类型之间的对比只会比较他们之间最终的结构，而会忽略他们定义时的关系