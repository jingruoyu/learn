## 组件、元素、实例异同

应用运行期间，一个组件可能同时拥有多个实例，每个实例都有自身的props与state，这是传统的面向对象式UI编程

### 实例

**每个组件实例必须保留对其DOM节点和子组件实例的引用，并在适当的时候创建，更新和销毁它们。**

代码行数随着组件可能状态数量的平方增长，并且父级可以直接访问其子级组件实例，因此将来很难将它们分离。

### Elements Describe the Tree

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

React会重复这个过程，直到所有的组件都被基础DOM元素替换





https://reactjs.org/docs/implementation-notes.html