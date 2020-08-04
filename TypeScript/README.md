[TypeScript入门](https://ts.xcatliu.com/basics/primitive-data-types.html)

JavaScript超集，主要提供类型系统和对ES6的支持，ts最终会被编译为js文件

### 优点

* 类型检查

    可以在编译阶段发现错误，但即使编译出错，也可以生成js文件（可配置）

    TypeScript只在编译时进行类型的静态检查，如果发现有错误，则编译报错。而在运行时，和普通的JavaScript文件一样，不进行类型检查

* 增强编译器和IDE功能

### 语法

* 变量

    ```javascript
    let a: string = '123'
    ```

* 函数

    ```javascript
    function sayHello(person: string) {
        return 'Hello, ' + person;
    }

    let user = 'Tom';
    console.log(sayHello(user));
    ```