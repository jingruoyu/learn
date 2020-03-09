[七天学会NodeJS](http://nqdeng.github.io/7-days-nodejs/#1)

# Nodejs基础

Nodejs相当于一个解析器，运行平台，其中运行js语言，为js提供一系列的内置对象和方法

## 作用

Nodejs初始目标为实现高性能的Web服务器，这需要依赖事件机制与异步IO模型，js没有IO能力，且具备良好的事件机制，故二者相结合

## 运行

1. 命令行语句
2. 文件执行模式

    `process.argv`可以获取到命令行参数，真正的参数可以从argv[2]开始
    * argv[0]固定等于NodeJS执行程序的绝对路径
    * argv[1]固定等于主模块的绝对路径

    权限问题，在监听80或443端口时可能会有权限问题，建议针对单独文件设置权限

## [模块](http://nodejs.cn/api/modules.html)

### 代码模块化

建议将代码合理拆分到不同的js文件中，每个文件就是一个模块，文件路径即为模块名，CMD模块系统

启动程序的模块称为主模块

* `require`：用于在当前模块中加载和使用别的模块，传入一个模块名，返回一个模块导出对象

    模块名支持绝对路径与相对路径，且其中的`.js`可以省略

* `exports`：`exports`对象为当前模块导出对象，用于导出模块共有方法和属性

    在其他模块中通过`require`可以访问到当前模块的`exports`对象

    ```javascript
    exports.a = 1;
    ```

    `exports`是`module.exports`的简洁形式，一般这两个变量指向同一个对象
    * 但是如果为`exports`赋予了新值，它将不在绑定到`module.exports`
    * 但是如果`module.exports`属性被新对象完全替换时，通常也会重新赋值`exports`

* `module`：可以访问到当前模块的一些相关信息，最常用为替换当前模块的导出对象，如下示

    ```javascript
    module.exports = function () {
        console.log('Hello World!');
    };
    ```



### 模块初始化

**一个模块中的代码仅在模块第一次被使用时执行一次，并在执行过程中初始化模块的导出对象。之后，缓存起来的导出对象被重复利用**，被引用模块的内部代码不会多次执行

注意循环引用的场景

## 总结

* node是一个脚本解析器，任何操作系统下安装NodeJS本质上做的事情都是把NodeJS执行程序复制到一个目录，然后保证这个目录在系统PATH环境变量下，以便终端下可以使用node命令
* 命令行模式与文件模式
* nodejs使用CMD模块系统，所有模块在执行过程中只在初始化时执行一次

# 代码的组织和部署

## 模块路径解析规则

`require`模块路径解析依照以下规则逐步进行：
1. 内置模块：不做路径解析，直接返回内部模块导出对象
2. `node_modules`模块：从当前文件夹的`node_modules`文件夹找起，一直找到全局`node_modules`文件夹为止
3. `NODE_PATH`环境变量：引用环境变量，查找方式与`node_modules`模块相同

## 包package

1. `require`会自动使用所引用包路径下的`index.js`作为包的入口文件，便于引用
2. 可以在包中添加`package.json`文件，指明包的入口文件，内容如下

        {
            "name": "cat",
            "main": "./lib/main.js"
        }

## 命令行程序

命令行程序旨在将node的文件模式转为命令行模式执行，简化调用方式

阮一峰文章中有详细讲解：[命令行程序开发教程](http://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html)

## 工程目录

一个完整项目中一般会包含可执行脚本、API文件与第三方库，还应该有完整的文档与测试用例，故标准的工作目录应该和以下类似：

```
# 工程目录
    + bin/                          # 可执行脚本
    + doc/                          # 存放文档
    - lib/                          # 存放API相关代码
        echo.js
    + proxy                         # 数据代理目录
    + assets                        # 静态文件目录
    + node_modules/                 # 存放三方包
    + tests/                        # 存放测试用例
    package.json                    # 包描述文件，项目依赖项配置等
    README.md                       # 说明文件
```

## npm相关

### 发布npm包

1. `npm adduser`向`https://registry.npmjs.org/.`注册用户
2. 在包的`package.json`中放入必要字段
3. `npm publish`发布npm包

package.json中内容

```
{
    "name": "node-echo",           # 包名，在NPM服务器上须要保持唯一
    "version": "1.0.0",            # 当前版本号
    "dependencies": {              # 三方包依赖，需要指定包名和版本号
        "argv": "0.0.2"
      },
    "main": "./lib/echo.js",       # 入口模块位置
    "bin" : {
        "node-echo": "./bin/node-echo"      # 命令行程序名和主模块位置
    }
}
```

### 版本号

版本号分为三位，X.Y.Z，分别为主版本号、次版本号、补丁版本号，更新规则如下
* 如果只是修复bug，需要更新Z位
* 如果是新增了功能，但是向下兼容，需要更新Y位
* 如果有大变动，向下不兼容，需要更新X位

## 总结

1. 模块的路径解析规则，先内置模块后第三方模块，逐级向上查找
2. 模块require时两种简写：index.js入口文件与package.json入口配置
3. node命令行工具的使用，执行命令更简洁，在全局安装包上使用较多
4. 项目文件架构组织
5. npm包的发布