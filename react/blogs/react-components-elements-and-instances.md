## 组件、元素、实例异同

应用运行期间，一个组件可能同时拥有多个实例，每个实例都有自身的props与state，这是传统的面向对象式UI编程

### 实例

**每个组件实例必须保留对其DOM节点和子组件实例的引用，并在适当的时候创建，更新和销毁它们。**

代码行随着组件可能状态数量的平方增长，并且父级可以直接访问其子级组件实例，因此将来很难将它们分离。

https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html
https://reactjs.org/docs/implementation-notes.html