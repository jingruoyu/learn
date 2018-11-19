## source

### 断点

F8跳过此断点，F10跳过下个函数调用，F11进入下个函数调用，shift+F11跳出当前函数调用，F9直接进入下个函数调用

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
* 事件监听断点
	选择某一种或一类事件进行监听，可以监听全局范围内该事件的发生，事件发生时进行断点

*

### watch

watch可以监听变量值的变化，避免重复的`console.log`，其监视对象不仅限于变量，可以将任何有效的JavaScript表达式存储在监视表达式中

但是个人觉得watch需要配合断点使用，可以简化操作，避免重复调用对象，相比`console.log`优点有限

### overrides

可以直接在source中修改页面的js和css，`Ctrl + s`保存后即可使用，但是页面刷新后修改会丢失。

overrides可以对修改进行本地化保存，以后页面针对此文件的请求也会直接使用该文件