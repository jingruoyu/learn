## hook

[Why React’s new Hooks API is a game changer](https://itnext.io/why-reacts-hooks-api-is-a-game-changer-8731c2b0a8c)

React的Hooks API允许用户在组件间共享与状态有关的逻辑

React面临最大的挑战是如何在组件间灵活的共享行为以实现复用，或者只是达到关注点分离的目标。目前的每种方案都存在一些相关的问题。不过，React刚刚发布的**Hooks API**可以解决之前的大部分问题

### 之前的解决方案

#### Mixins

当React初次发布时，ES5中还没有可用的类，所以React附带了自己的类创建方法`React.createClass`，该方法将许多方法从一个对象合并到用户自己创建的组件中

但是这在类的继承上会导致一些问题，由mixins导入的方法没有文档，继承之后开发者不知道都继承到了哪些功能，如何使用。所以React在引入基于ES6的新API时，决定完全删除Mixins

#### 高阶组件 Higher Order Components

高阶组件是将高阶函数的功能边城概念应用于React组件的一种尝试。思想是将原组件包裹在提供行为的外部组件中构成最终的组件，并向其传递props。这与高阶函数通过闭包传递数据的做法类似

**优点**：可以通过props清楚看到向组件传递的数据

**缺点**：
* 高阶组件较为复杂
* 无法区分传递给HOC的数据与传递给原始组件的数据
* 组件可能依赖于HOC中的数据，删除HOC后无法工作
* 行为组件包含渲染组件，最终可能得到巨大的渲染树

    行为组件：主要用于管理状态逻辑的组件，比如HOC

#### render props

render props是最新的趋势，为HOC造成的一些问题提供了解决办法。render props通过为函数prop将子组件注入父组件，之后进行渲染，此过程中父组件可以为子组件提供一些操作和数据，此时组件是一个闭包结构

**缺点**：
* 组件的层级结构错误
* 可能会将子组件用内联函数的形式进行传递，可能造成性能问题，详见render props与PureComponent
* 造成了很多闭包结构，但实际上组件应该是内联结构
* 导致非常冗余的组件JSX