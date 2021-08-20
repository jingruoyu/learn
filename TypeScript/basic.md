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

* 一个接口只能定义一个任意属性
* 任意类型的对应的value类型必须涵盖其它所有确定类型和可选类型，可以使用联合类型
* 一个任意属性可以对应多个自定义属性

#### 属性名与值类型

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

数组中常使用any、表示允许出现任意类型

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

常用的类数组都有自己的接口定义，属于TS的内置对象

## 函数的类型

### 声明式

```javascript
function sum(x: number, y: number): number {
    return x + y;
}
```

#### 调用函数时参数的数量必须与声明时相等

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

直接使用联合类型会导致输入类型和输出类型不能建立严格对应关系，故需要使用重载

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

## 泛型

### 基本使用

可以使用泛型创建可重用的组件，一个组件可以支持多种类型的数据，用户可以用自己的数据类型来使用组件

泛型可以理解为具有参数的类型，根据参数确定最终输出的类型

```javascript
function identity<T>(arg: T): T {
    return arg;
}

identity<string>('test')
```

也可以通过类型推论的形式得出泛型的具体类型

```javascript
identity('test')
```

也可以定义多个类型参数

```javascript
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

### 泛型约束

可以对泛型的使用进行约束，禁止函数使用某些类型之外的参数，保证内部逻辑的正确

```javascript
// 函数参数必须具有length属性，如果不具有length属性则会在编译阶段报错
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```

### 泛型接口

可以使用泛型接口定义函数形状

```javascript
interface CreateArrayFunc {
    <T>(length: number, value: T): Array<T>;
}

// 定义函数形状
let createArrayFunc: CreateArrayFunc;
// 将泛型参数提前到接口名上
let createArrayFunc: CreateArrayFunc<any>;
```

### 泛型类

```javascript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
```

### 默认参数

可以为泛型中的类型参数指定默认类型，当使用泛型时没有在代码中直接指定类型参数，类型推断也无法推测出，默认类型就会起作用

```javascript
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```

## 断言

类型断言能够将联合类型对应为其中的一个类型，相当于告诉TypeScript变量的具体类型，避免ts报错，但是可能会引起后续js执行时的错误

```javascript
variable as interfaces
```

目前并没有变量和接口之间直接关联的方法，所以使用断言先假设变量为某一类变量，**再通过获取这类变量特有的属性或方法判断此假设是否成立**

### 断言的用途

#### 父类断言为更加具体的子类

可以使用断言判断一个变量在父类下更加具体的子类，这里也可以使用instanceof代替。但是有时候需要将一个变量断言为一个接口，此时无法使用instanceof，只能使用断言

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

如果A兼容B，则A能够被断言为B，B也能被断言为A

这里的A兼容B是指B extends A，B中拥有A的所有属性，A是B的父类

TypeScript是结构类型的系统，类型之间的对比只会比较他们之间最终的结构，而会忽略他们定义时的关系

任何类型都可以被断言为 any，any 可以被断言为任何类型

#### 任何类型都兼容any，any也兼容任何类型

### 双重断言

* 任何类型都可以被断言为any
* any可以被断言为任何类型

利用此属性可以使用双重断言，现将一个类型断言为any，再断言为任意类型

```javascript
cat as any as fish
```

但是双重断言会打破断言的兼容性原则，导致运行出现错误

### 类型断言 vs 类型转换

类型断言只影响TypeScript编译时的类型，在编译结束后断言语句会被删除，不会真正影响到变量的类型

如果想要真正改变变量的类型，需要使用类型转换的方法

### 类型断言 vs 类型声明

* A类型能够被断言为B类型，要求**A兼容B或B兼容A**
* A类型声明的变量能够被赋值为B类型的变量，要求**A兼容B**，B extends A

    即父类的实例不能赋值给类型为子类的变量，但是子类的实例可以赋值给类型为父类的变量

**类型声明比类型断言要求更为严格**

### 类型断言 vs 泛型

泛型是指在定义函数、接口或类的时候，不预先指定具体的类型，而是在使用的时候再指定类型的一种特性

## 声明文件

通常我们会将声明语句放到一个单独的文件中，文件以`.d.ts`后缀

TypeScript一般会解析项目中所有的`.ts`文件，也会将声明文件同时解析，此时其他的`.ts`文件就会获得相关的类型定义

### 语法规范

**声明文件中只能定义类型，切勿在声明语句中定义具体实现**

库的使用场景

#### 全局变量

* declare var：声明全局变量
* declare function：声明全局函数
* declare class：声明全局类
* declare enum：声明枚举类型
* declare namespace：声明（含子属性的）全局变量，可以进行嵌套。namespace中可以进行其他属性的声明

    目前已经不推荐namespace，而是使用ES6的模块化方案export

* interface和type声明全局类型，无需declare

    * 为减少命名冲突，最好将其放到namespace下
    * 声明合并，可以组合同一个变量的多个声明语句，他们会进行不冲突的合并

#### npm包

npm包声明文件可能存在与

* 与该包绑定在一起，在package.json中寻找types字段或者`index.d.ts`文件
* 已经发布到`@types`中，直接安装

如果都不存在，需要自己写声明文件，声明文件存放位置

* node_modules/@types/packagename/index.d.ts，但是node_modules文件夹不稳定，又被删除的风险
* 根目录下新建一个types文件夹，通过配置tsconfig.json

声明文件语法

* `export`导出变量
* `export namespace`导出含有子属性的对象
* `export default`ES6默认导出，只有function、class、interface可以默认导出
* `export =`commonjs导出模块，但只能导出一个变量

#### UMD库

既可以通过`script`标签引入，又可以通过`import`导入的库，称作UMD库

相比于npm包类型声明文件，需要额外声明一个全局变量，ts提供了新语法`export as namespace`

#### 直接扩展全局变量

有时第三方库扩展了一个全局变量，但对应的类型没有来得及更新，就会导致ts编译错误，此时可以通过**声明合并**，为此类型上添加属性或方法

#### 在npm包或UMD库中扩展全局变量

对于`npm`包或`UMD`库，如果导入此库之后会扩展全局变量，则需要使用另一种语法在声明文件中扩展全局变量的类型，那就是`declare global`

#### 模块插件

有时通过 import 导入一个模块插件，可以改变另一个原有模块的结构，ts提供了`declare module`，它可以用来扩展原有模块的类型


### 声明文件的依赖

声明文件之间的依赖的导入方式

* import

    ```javascript
    import * as moment from 'moment';
    ```

* 三斜线指令

    涉及到全局变量时需要使用三斜线代替import

    * 书写一个全局变量的声明文件，全局变量的声明文件中不允许出现import等关键字，否则会被视为一个npm包或UMD库，不再是全局变量的声明文件
    * 需要依赖一个全局变量的声明文件，全局变量不支持通过import导入

    ```typescript
    /// <reference types="jquery" />

    declare function foo(options: JQuery.AjaxSettings): string;
    ```

    三斜线指令也可以用在拆分全局变量的声明文件，如JQuery，最后再向外统一导出一个变量

## 内置对象

TypeScript为js中的很多内置对象定义好了类型

### ECMAScript内置对象

### DOM和BOM内置对象

### TypeScript核心库

[TypeScript核心库](https://github.com/Microsoft/TypeScript/tree/main/src/lib)定义了所有浏览器需要用到的类型，并且是预置在TypeScript中的

核心库中不包含nodejs部分

Node.js不是内置对象的一部分，故如果想用ts写nodejs，需要引入第三方声明文件

`npm install @types/node --save-dev`
