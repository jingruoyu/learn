# React进阶

# 高级指引

## 代码分割

配合懒加载只加载当前用户所需要的内容，避免体积过大导致加载时间过长，不影响实际的整体代码体积

### 动态import

动态import为代码分割最佳方式

```javascript
import('./math').then(math => {
    console.log(math)
})
```

### React.lazy

```javascript
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

引用`OtherComponent`组件的父组件在第一次渲染时，会自动导入包含`OtherComponent`的包

加载`OtherComponent`的父元素可以指定fallback属性，进行优雅降级

**React.lazy仅支持默认导出**，如果要支持命名导出，需要增加中间模块，将想要导出的模块重新导出为默认模块

## 错误边界

react 16引入错误边界，避免部分JavaScript错误导致整个应用崩溃

错误边界在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误，但是其无法以下错误
* 事件处理函数：事件回调不会在渲染期间触发，故当其抛出异常不影响当时的渲染，可以通过try/catch进行内部的错误捕获
* 异步代码
* 服务端渲染
* 错误边界本身跑出的错误

class组件具备以下两个生命周期中任意一个或两个时，即为错误边界
* `static getDerivedStateFromError()`用于渲染备用UI
* `componentDidCatch()`用于打印错误信息

**只有class组件才可以成为错误边界组件**

错误边界使用类似于try...catch，仅可以捕获子组件的错误，无法捕获自身错误。如果当前错误边界无法处理错误信息，则该错误信息会冒泡至最近的上层错误边界

### 未捕获错误行为

**自react 16起，任何未被错误边界捕获的错误将会导致整个组件树被卸载**，这要求
* 页面中所有可能报错的地方都要包含在错误边界中
* 相互独立的功能区域要用不同的错误边界

### 与try/catch区别

* `try/catch`是命令式的
* react组件是声明式的，错误边界保留了声明式的性质

## 高阶组件HOC

Higher Order Components

高阶组件是基于REACT组合特性形成的一种设计模式，是指参数是组件，返回值为新组件的**函数**

**组价是将props转换为UI，高阶组件是将组件转换为另一个组件**，HOC不会修改传入的组件，也不会使用继承来复制其行为，HOC通过将组件包装在容器组件中来组成新组件

### 约定：

1. 高阶组件应该将不相关的props传递给被包裹的组件
2. 最大化可组合性，即输入参数类型和输出结果类型相同，便于进行串联组合
3. 包装显示名称以便轻松调试

### 注意事项

1. 不要再render方法中调用高阶组件
    如果在render方法中调用高阶组件，会造成每次渲染更新时都会生成一个新的高阶组件，导致组件被重新渲染。这会造成性能问题和重新挂载后组件的状态丢失

    一般在组件之外创建HOC，则组建只会创建一次，如果确实需要动态创建HOC，则在组件生命周期中进行

    **React diff算法使用组件标识来确定一个组件是应该更新现有子树还是将其丢弃并挂载新子树**
    * 如果render返回的组件与前一个渲染中的组件相同(===)，则递归更新子树
    * 如果不相等，则完全卸载前一个子树，挂载新子树
2. 静态方法需单独复制

    高阶组件不会复制传入组件的静态方法，需要手动进行复制，可以使用npm包，或者将静态方法导出后在高阶组件中直接复制

### 使用组合避免修改原始组件

使用高阶组件是应避免修改原始组件，否则将会导致原始组件不能按照HOC增强之前使用

高阶组件与**容器组件模式**类似，容器组件将高层和低层关注点分离，由容器管理订阅和状态，并将 prop 传递给低层组件

## Fragments

<React.Fragment>可以将内部的子节点分组，但是其自身不会向DOM添加额外节点

```
<React.Fragment>
  <td>Hello</td>
  <td>World</td>
</React.Fragment>
```

* <React.Fragment>可以简写为`<></>`
* Fragment仅支持key属性，但是简写时不能使用
  ```
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </React.Fragment>
  ```

## 性能优化

### 常规操作

使用生产版本、webpack打包、tree shaking、performance分析

### 虚拟化长列表

### 避免调停（优化渲染条件）

React中构建并维护了一套内部的UI渲染描述，即为虚拟DOM。当组件的props或state变更，会将当前的vDOM与之前的vDOM进行对比，判断节点是否需要更新，以节省资源

若要省略对比操作，手动控制刷新，可以覆盖shouldComponentUpdate，控制返回true（执行React更新流程）或者false（跳过整个更新过程）。注意，**返回true后，React也会进行vDOM判断**

`shouldComponentUpdate`根据某些条件判断是否进行渲染，如果要根据props与state的**浅比较**，可以通过继承`React.PureComponent`类。

**NOTE**：使用过程中需要注意`React.PureComponent`是依据浅比较的形式进行，故如果要更改相关属性，一定要赋予新的值，可以使用解构赋值或其他方法

### 组件更新的三种情况

* 自身state变化
* 父级传递props变化
* context变化

## Protals

将子节点渲染到父组件以外的DOM节点，常用于对话框、悬浮框、提示框等

    ReactDOM.createPortal(child, container)

Protal中子元素的事件冒泡行为与普通的React元素一致，**一个从 portal 内部触发的事件会一直冒泡至包含 React 树的祖先，即便这些元素并不是 DOM 树 中的祖先**

## Profiler

用于测量渲染一个React应用的渲染代价，找出其中渲染较慢的部分

## Render Props

在React组件中使用一个值为函数的prop共享代码的技术，即使用props将函数传入目标组件，函数中渲染子组件，在目标组件中调用函数完成渲染，功能在于可以在调用过程中传入参数

render props可以代替实现高阶组件HOC

**NOTE**：`Render Props`与`React.PureComponent`一起使用需要注意，内联函数会导致PureComponent每次比较都得到true，可以使用实例方法避免

## 静态类型检查

Flow与TypeScript

## 严格模式

严格模式调用方式为

    <React.StrictMode>
      <div>
        <ComponentOne />
        <ComponentTwo />
      </div>
    </React.StrictMode>

只针对`React.StrictMode`中的内容及其后代元素进行检查

严格模式有助于
* 识别不安全的生命周期，避免使用过时的寿命周期方法
* 使用过时字符串`ref API`的警告
* 使用废弃的`findDOMNode方法`的警告
* 检测意外的副作用：数据获取、订阅或手动修改DOM

    React分为两个阶段工作，渲染与提交。
    * 渲染阶段确定需要进行哪些更改。此阶段React调用render，将结果进行diff
    * 提交阶段发生在React应用变化时，此阶段还会调用`componentDidMount`和`componentDidUpdate`等生命周期方法

* 检测过时的context API

## propTypes类型检查

* 可以使用`propTypes`对props属性进行类型检查，可以针对单个属性进行
* 可以使用`defaultProps`指定props中属性的默认值，确保父组件没有指定属性时有一个默认值

`propTypes`类型检查发生在`defaultProps`赋值后，所以类型检查也适用于`defaultProps`

## 非受控组件

* 受控组件：表单数据由React组件进行管理，真实数据存储于组件中
* 非受控组件：表单数据由DOM节点进行处理，真实数据存储于DOM节点中

部分情况下，有些组件的值不能存储于组件中，只能存储在DOM节点里，如上传文件，此时就需要使用非受控组件，利用ref、DOM等API进行处理

## Web Components

Web Compoennts是HTML5中的API，为可复用组件提供强大封装，可以和React搭配使用