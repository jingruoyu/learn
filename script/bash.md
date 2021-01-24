[bash教程](https://wangdoc.com/bash/intro.html)

# shell语言学习

## shell含义

`shell`原意是外壳，与`kernel`的内核相对应，比喻内核外面的一层，即用户与内核交互的对话界面

shell的含义：
* 一个程序，提供一个与用户对话的命令行环境(command line interface，简写为CLI)
* 一个命令解释器，解释用户输入的命令。脚本都通过shell的解释执行，而不通过编译
* 一个工具箱，提供各种小工具，供用户方便的使用操作系统功能

## shell环境

* Bourne Shell（sh）
* Bourne Again shell（bash）
* C Shell（csh）
* TENEX C Shell（tcsh）
* Korn shell（ksh）
* Z Shell（zsh）
* Friendly Interactive Shell（fish）

Linux的shell种类众多，其中`Bourne Again Shell`，即`Bash`应用最为广泛

```bash
# 查看当前运行的shell
echo $SHELL

# 查看系统安装的所有shell
cat /etc/shell
```

shell脚本第一行的`#!/bin/bash`指定解释当前脚本文件的shell程序路径，告诉系统使用哪种解释器执行shell，该路径可以在`/etc/shell`中看到

### 命令行提示符

```
[user@hostname]$
```

* user：用户名
* hostname：主机名

root用户的提示符，不以`$`结尾，而以`#`结尾，用来提示用户权限的不同。root权限下权限较大，不要出现误操作

### shell脚本运行方法

* 作为可执行程序

    ```
    chmod +x ./test.sh  #使脚本具有执行权限
    ./test.sh  #执行脚本
    ```

    此处需要写成`./test.sh`，直接写为`test.sh`后linux系统会去PATH中寻找`test.sh`环境变量，无法正确执行，而使用`./test.sh`明确告诉系统在当前目录中查找文件

* 作为解释器参数

    ```
    /bin/sh test.sh
    /bin/php test.php
    ```

    这种运行方式直接运行解释器，将shell脚本文件名作为参数传入。这种情况下无需在脚本第一行指定解释器信息，会被外部解释器覆盖

## 语法学习

### 基础语法

#### echo

在屏幕上输出一行文本，可以将该命令的参数原样输出

参数：
* -n：取消输出末尾的回车
* -e：解释引号中的一些特殊字符，否则默认情况下会直接让特殊字符变为普通字符直接输出

#### 命令格式

* 长短参数
* 不同参数空格间隔，多余空格直接忽略
* 每一行的结尾加上反斜杠，Bash 就会将下一行跟当前行放在一起解释

#### 分号

分号是命令的结束符，使得一行可以放置多个命令，上一个命令执行完后执行第二个命令

第二个命令总是接着第一个执行，无论第一个执行成功或失败

#### `&&`和`||`

* command1 && command2：如果command1执行成功则执行command2
* command1 || command2：如果command1执行失败则执行command2

#### type

type可以查看命令是内置命令还是外部程序

* -a：查看一个命令所有定义
* -t：查看命令类型，alias，keyword，function，builtin，file

#### 快捷键

* Ctrl + L：清除屏幕，相当于clear命令
* Ctrl + D：关闭shell会话

一次Tab不全，两次Tab列出所有选项

### 变量

#### 变量定义

* 变量名不加`$`
* 变量名与等号之间不能有空格

#### 变量使用

使用一个定义过的变量，在变量名前面加`$`即可，如`$name`。同时也可在变量名外面加大括号`${name}`，帮助解释器识别变量边界

#### 只读变量

使用readonly命令可以将变量定义为只读变量，只读变量的值不能改变

```
myUrl="http://www.google.com"
readonly myUrl
```

#### 删除变量

使用unset命令可以删除变量，变量被删除后不能再次使用

unset命令不能删除只读变量

#### 变量类型

* 局部变量：在脚本或命令中定义，仅在当前shell实例中有效，其他shell启动的程序不能访问局部变量
* 环境变量：所有的程序，包括shell启动的程序，都能访问环境变量，有些程序需要环境变量来保证其正常运行。必要的时候shell脚本也可以定义环境变量
* shell变量：由shell程序设置的特殊变量，有一部分是局部变量，一部分是环境变量，这些变量保证了shell的正好运行

### 字符串

#### 单引号

* 单引号中的任何字符都会原样输出，**单引号字符串中变量无效**
* 单引号字符串中不能单独出现一个单引号，必须成对出现，可作为字符串拼接使用

#### 双引号

* 双引号中可以使用变量
* 双引号中可以出现转义字符

#### 反引号

反引号内部的字符串被shell解释为命令行，在执行时，shell会先执行该命令，并它的标准输出结果取代整个引号部分

#### 字符串操作

* 字符串拼接

    字符串拼接的两种方法
    * 变量定义时拼接

        ```
        greeting="hello, "$your_name" !"
        greeting_1="hello, ${your_name} !"
        greeting_2='hello, '$your_name' !'
        ```

    * 变量使用时拼接

        ```
        echo $greeting  $greeting_1
        ```

* 获取字符串长度

    ```
    string="abcd"
    echo ${#string} #输出 4
    ```

* 提取子字符串

    ```
    string="runoob is a great site"
    echo ${string:1:4} # 输出 unoo
    ```

    从字符串的第2个字符开始截取4个字符，不改变源字符串

### 数组

