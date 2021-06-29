# 工程

## 代码检查

### 代码检查方案

目前以及将来TypeScript提供的代码检查方案是`typescript-eslint`

JavaScript项目中一般使用`ESLint`进行代码检查，搭配`typescript-eslint`即可用于TypeScript风格检查

### TypeScript使用ESLint

* 安装`eslint`
* ESLint默认使用`Espree`进行语法解析，无法识别TypeScript的一些语法，故需要安装`@typescript-eslint/parser`，替代掉默认的解析器
* 安装`@typescript-eslint/eslint-plugin`作为对eslint默认规则的补充
* 增加配置文件

同一个目录下有多个配置文件，ESLint只会使用一个，优先级顺序为

* .eslintrc.js
* .eslintrc.yaml
* .eslintrc.yml
* .eslintrc.json
* .eslintrc
* package.json

建议使用js文件作为配置文件

常用配置项含义

#### parser

ESLint默认使用Espree作为解析器，可以在配置文件中指定一个不同的解析器

#### parserOptions

常用于设置语法解析器的一些配置，选项有

* ecmaVersion：指定ECMAScript的版本
* sourceType：源码类型，可以指定为script或module
* ecmaFeature：表示想使用的额外语言特性

  * globalReture：允许在全局作用域下使用 return 语句
  * impliedStrict：启用全局strict mode
  * jsx：启用jsx

#### Plugins

ESLint支持使用第三方插件，可以使用`plugins`关键字来存放插件名字的列表

#### Rules

设置规则

### vscode集成ESLint

在编辑器中集成ESLint检查，可以在开发过程中就发现错误，甚至进行修复

### 使用Prettier修复格式错误

`Prettier`聚焦于代码的格式化，通过**语法分析**，重新整理代码的格式，让所有人的代码都保持同样的风格

优点

* 可配置化
* 支持多种语言
* 继承多数编辑器
* 简洁的配置项

需要注意的是，由于 ESLint 也可以检查一些代码格式的问题，所以在和 Prettier 配合使用时，一般会把 ESLint 中的代码格式相关的规则禁用掉，否则就会有冲突

## 编译选项

### allowJs

允许编译js文件，设置为 true 时，js 文件会被 tsc 编译，否则不会

在项目中js、ts混合开发时需要设置

### allowSyntheticDefaultImports

允许对不包含默认导出的模块使用默认导入。这个选项不会影响生成的代码，只会影响类型检查

设置为true时，可以使用ES6 import语法直接导入commonJS规范的模块