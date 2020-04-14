## stack reconciler实现笔记

[stack reconciler实现笔记](https://reactjs.org/docs/implementation-notes.html)

[stack reconciler实现笔记 中文版](https://jobbym.github.io/2017/02/14/react-Implementation-Notes/)

[相关视频](https://www.youtube.com/watch?v=_MAD4Oly9yg)

这篇文章是stack reconcile实现笔记集合

### stack reconciler 基础

#### reconciler

`React DOM`和`React Native`这样不同的渲染器需要共享很多逻辑，特别的，`diff`算法应该尽可能的一直，以便代码在各个平台上表现如一

为了解决这个问题，不同的渲染器之间需要共享一些代码，我们称其为React中的协调器reconcile。当安排了setState之类的更新时，协调器会在虚拟DOM树上调用组件的render方法，执行挂载、更新或者卸载

协调器没有单独打包，因为目前没有提供公共的API，仅由React DOM和React Native之类的渲染器使用

#### stack reconciler

`stack reconciler`是为React 15及更早的版本提供的支持，目前已经停止使用，替代它的是fiber reconciler，其实质是在stack的基础上进行优化

`stack reconciler`对`render`、`reconciler`（即diff）、DOM的处理方式为，每调用一个`render`生成对应的`element`对象，就进行相应的`reconciler`，然后如果发现子元素发生变动，再对子元素进行相同的递归遍历操作，最终根据生成的`element`对象进行DOM操作。

在此过程中，`render`、`reconciler`的执行即为不断地出栈入栈，故称为`stack reconciler`

#### fiber reconciler

`fiber reconciler`在`stack reconciler`的基础上进行了优化
* 将`render`与`reconciler`的工作变为可中断的，避免过长占用主线程

    `fiber reconciler`会在执行`render`前检查目前为止所有render与reconciler操作耗时，如果超过一定阈值，则让出主线程，避免产生页面无响应的情况

* 能不断地将任务进行优先级排序、rebase和复用
* 能够在父节点和子节点之间来回操作，以支持React中的布局
* 能够从render中返回多个元素
* 更好的支持错误边界

### stack reconciler 原理

#### 概览

reconciler自身没有一个公共的的API，React DOM和React Native中的Renderers使用reconciler，依托用户编写的React Component，有效的更新用户视图

#### mounting是递归过程

首次加载component

	ReactDOM.render(<App />, rootEl)

React DOM将App组件传入reconciler，reconciler判断组件类型。此处的组件即为React element，即为一个对象
* 如果是函数，则调用`App(props)`，获取返回的元素
* 如果是类，则创建一个实例`new APP(props)`，调用生命周期的`componentWillMount`方法，之后调用`render`函数获取已渲染的element

无论是哪种方式，reconciler都会得到App组件的渲染目标"renderered to"

这个过程是递归的，App可能渲染为B组件，B可能渲染为C组件。当reconciler会通过用户定义的component渲染逻辑，向下递归的获取数据

参见博客中伪代码。

**此处重点解释了class组件和函数组件返回的都是一个element对象，该对象上有type、props属性**

**NOTE**
* React element是使用一个简单地对象来表示组件的type和props
* 用户定义的component可以是类或者函数，但它们都会表达成element
* mounting是一个递归过程，通过给定一个React element顶点，可以创建一棵DOM或Native树

#### 挂载元素

如果我们最终没有渲染一些内容到屏幕上，那么这一过程是无效的

除了用户自定义的组件之外，React元素也可以表示特定平台的组件(host组件)，如div等

**当一个元素的type是string时，我们会将其当做一个host组件处理。**当reconciler遇到一个host组件时，它会让渲染器处理加载它。例如，React DOM会创建一个DOM节点

如果host组件有子节点，reconciler会根据上述规则进行递归加载，无论子节点的类型是什么。

子节点生成的DOM节点会被追加到父级DOM节点下，并依次递归，最终生成完整的DOM结构

**NOTE**

reconciler自身不与DOM绑定。元素挂载的准确结果取决于渲染器，在React DOM中是一个DOM节点，React DOM Server中是一个字符串，React Native中是一个代表本地视图的数字

参见博客中伪代码。

**此处重点在于针对host component，以及其中children的处理**，整体上都是在不停的递归调用mount函数以获取组件内部DOM结构，然后使用mountHost生成DOM节点并绑定