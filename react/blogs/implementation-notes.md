## stack reconciler实现笔记

[stack reconciler实现笔记](https://reactjs.org/docs/implementation-notes.html)

[stack reconciler实现笔记 中文版](https://jobbym.github.io/2017/02/14/react-Implementation-Notes/)

这篇文章是stack reconcile实现笔记集合

### stack reconciler

#### reconciler

`React DOM`和`React Native`这样不同的渲染器需要共享很多逻辑，特别的，`diff`算法应该尽可能的一直，以便代码在各个平台上表现如一

为了解决这个问题，不同的渲染器之间需要共享一些代码，我们称其为React中的协调器reconcile。当安排了setState之类的更新时，协调器会在虚拟DOM树上调用组件的render方法，执行挂载、更新或者卸载

协调器没有单独打包，因为目前没有提供公共的API，仅由React DOM和React Native之类的渲染器使用

#### stack reconciler

`stack reconciler`是为React 15及更早的版本提供的支持，目前已经停止使用