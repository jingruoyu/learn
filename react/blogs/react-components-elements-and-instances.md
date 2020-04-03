## 组件、元素、实例异同

[组件、元素、实例异同](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)

应用运行期间，一个组件可能同时拥有多个实例，每个实例都有自身的props与state，这是传统的面向对象式UI编程

### 实例管理

**每个组件实例必须保留对其DOM节点和子组件实例的引用，并在适当的时候创建，更新和销毁它们。**

代码行数随着组件可能状态数量的平方增长，并且父级可以直接访问其子级组件实例，因此将来很难将它们分离。

实例在React中的重要性远远低于大多数面向对象的UI框架

### Elements Describe the Tree

以下所指元素均为React元素

React中，元素就是描述组件实例或DOM节点及其所需属性的普通对象，仅包含组件类型、属性和组件中的子元素

元素不是实际上的组件实例，相反，这是一种告诉React希望在屏幕上看到什么的方法。故元素是一个不可变对象，上面只有两个字段

```javascript
{
    type: (string | ReactClass),
    props: Object
}
````

#### DOM元素

当element的type为string时，代表一个DOM节点的tag，此时element的props对应元素的属性，即为React即将渲染的内容

元素间嵌套通过props中的chirldren属性指定，children可以为对象（一个子元素）或数组（多个子元素）

优点： 描述树中DOM元素都只是描述而不是真实的实例，比实际DOM元素轻很多，创建、销毁耗费的资源都很小

React元素很容易遍历，不需要解析

#### 组件元素

element的type也可以是与React组件相对应的函数组件或类组件，在React中，描述组件的元素也是一个元素，与DOM节点相同，可以混合使用

```JavaScript
const DeleteAccount = () => ({
  type: 'div',
  props: {
    children: [{
      type: 'p',
      props: {
        children: 'Are you sure?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Yep'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Cancel'
      }
   }]
})

// 代表了如下组件

const DeleteAccount = () => (
  <div>
    <p>Are you sure?</p>
    <DangerButton>Yep</DangerButton>
    <Button color='blue'>Cancel</Button>
  </div>
)
```

#### 组件封装元素树

当React发现一个元素的type是函数组件或类组件，它会明白即将渲染的是一个组件，会对其赋予相应的props。

```javascript
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
// 转化为
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

React会重复这个过程，直到所有的组件都被基础DOM元素替换

对React组件来说，props是输入，element树是输出

返回的element树可以包含描述DOM节点的元素和描述组件的元素，这使得可以在不依赖组件内部DOM结构的情况下组成UI的独立部分

我们使用React创建、更新和销毁实例，并且使用从组件返回的元素描述实例，React负责管理实例

#### 组件可能是类或者函数

共有三种创建组件的方式
* 函数组件
* 工厂模式： React.createClass
* 类继承：React.Component

函数组件与类组件有些许不同，之前类组件的功能更为强大，但hook的出现为函数组件也增加了状态与钩子，所以二者现在使用区别不是很大

无论是函数组件还是类组件，本质上都是以props为输入，elements tree为输出

#### 自顶向下的解析

React对elemetns树的解析是自定向下，该过程是在在调用ReactDOM.render或setState时触发的。解析结束后，React会知道DOM树的结果，最终会以最小更改集去更新DOM节点，或者在react-native中基于特定平台进行渲染

这样的解析过程是React易于优化的原因。当组件树的某一部分变得太大导致不能有效访问时，就可以跳过这个过程或者在props未改变时直接对比组件树其他部分，以进行性能优化。React和immutability可以协同工作，判断props是否发生变化，进行最大的优化

仅有使用类声明的组件才会拥有实例，你永远不必直接创建他们，React会做这件事。虽然存在从父组件访问子组件实例的机制，但是仅用于命令性的操作，通常应该避免使用

React会为每一个class组件创建实例，所以你可以用面向对象的形式编写组件，在组件中可以使用方法和本地状态，实例由React进行创建和管理，无需处理

### Summary

* **元素**：一个普通对象，用于描述在屏幕上展示的DOM节点或组件。元素可以在他们的属性中包含其他元素，创建一个React元素代价很小，一旦创建了一个元素，它就永远不会发生突变
* **组件**：组件有三种声明方式，但本质上，组件都是以props作为输入，返回一个元素树作为输出

当一个组件接收到一些props时，这是因为它的某个父组件返回了一个使用它命名的type和对应的props。此即为**props在React中流动的方向：父组件到子组件**

函数组件没有实例，只有类组件有实例，React会为每个类组件创造实例，无需手动处理

类组件中，this指向React产生的实例，用于存储本底状态和生命周期事件

创建react元素可以使用JSX、createElement或createFactory，不要在代码中直接写React对象，他们仅在底层使用
