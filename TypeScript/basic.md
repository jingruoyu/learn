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