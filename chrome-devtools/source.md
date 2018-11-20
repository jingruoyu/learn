## source

### 断点

#### 断点类型

* 代码行断点

	代码某一行断点，source面板设置或debugger

	可以为行断点设置触发条件，右键该断点，edit breakpoint中即可设置

* XHR断点

	当XHR请求的URL中包含特定的字符串时，devtools将在该请求`send()`函数调用行进行断点

	在`XHR/fetch breakpoint`中右键可以添加相应断点，输入特殊字符串即可

* DOM断点

	针对DOM进行某种操作时触发断点
	- 属性改变：Triggered when an attribute is added or removed on the currently-selected node, or when an attribute value changes.
	- 子树改变：当前选中节点的子节点移出、添加，或子节点的内容发生改变时触发，当元素自身或子节点属性发生变化时不会被触发
	- 节点移除：Triggered when the currently-selected node is removed
* Global listeners

	显示绑定在 window 对象上的事件监听

* 事件监听断点
	选择某一种或一类事件进行监听，可以监听全局范围内该事件的发生，事件发生时进行断点

* js异常断点

	source面板中右上角的`Pause on exceptions`可以在页面抛出异常是进行断点，下面的可选项`Pause on caught exceptions`可以在错误被捕获是进行断点（即断点会在`try...catch`中的try）

* 函数断点

	使用`debug(functionName)`，作用类似于在该函数第一行设置代码行断点。**必须确保该function在当前作用域内**，否则会抛出关于`ReferenceError`

#### 断点操作

* F8跳过此断点
* F9直接进入下个函数调用
* F10单步执行跳过下个函数调用
* F11单步执行进入下个函数调用
* shift+F11跳出当前函数调用，
* 执行代码到某行：在函数被中断时，可以在某一行代码上右键选择执行到此处，代码会执行到此处进行中断
* 重新执行堆栈函数：函数被中断时，在堆栈区右键选择`Restart frame`，堆栈顶部函数将会被重新执行

	**实际操作过程中发现，选择重新执行后，仍然需要resume此时断点，才会进入重新执行**

#### 线程内容

当使用`web workers`或者`service workers`时，threads窗口将会展现正在使用的线程，通过配合断点的使用，可以看到相应线程中的数据

### watch

watch可以监听变量值的变化，避免重复的`console.log`，其监视对象不仅限于变量，可以将任何有效的JavaScript表达式存储在监视表达式中

但是个人觉得watch需要配合断点使用，可以简化操作，避免重复调用对象，相比`console.log`优点有限

### snippets

可以将一些会在多个页面重复运行的小脚本保存为代码段，代码段会在已打开页面的上下文执行，可以配合断点使用

**snippets可以访问全局范围的变量，如window等**，但是无法访问对断点处的局部变量

### overrides

可以直接在source中修改页面的js和css，`Ctrl + s`保存后即可使用，但是页面刷新后修改会丢失。

overrides可以对修改进行本地化保存，以后页面针对此文件的请求也会直接使用该文件

### 将预处理代码映射到源代码

`chrome devtools`可以基于文件的source maps，将预处理压缩过后的代码映射到源代码，从而在原始文件中设置断点和浏览代码。[预处理器](https://developers.google.com/web/tools/setup/setup-preprocessors#debugging-and-editing-preprocessed-content)

`devtools`中运行`source maps`时，JavaScript不会编译，实际运行的是编译后的代码，但是此时错误、日志和断点都将映射到开发代码。

devtools -> setting -> source 中可以开启或者关闭JS与CSS的source map功能

### BlackBox Script 代码黑盒

当一份js代码设为BlackBox后，将会在debug时进行忽略。

* `BlackBox`的js代码在堆栈中会被置灰，不可选
* `BlackBox`的js代码不可以进行单步调试

**此功能适用于信任的第三方代码，在调试时确认与问题无关即可忽略**

打开方式：
* 打开文件，右键选择`BlackBox Script`
* 在堆栈栏右键选择`BlackBox Script`
* setting -> Blackboxing -> Add pattern -> 输入脚本名称或其名称的正则表达式

**devtools中F1可以直接进入setting**

### 文件编辑

**可以直接修改JavaScript和CSS文件，保存后即可使用，但是页面刷新后修改就会丢失**