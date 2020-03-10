# React进阶

## JSX

JSX本质为React.createElement()的语法糖

### React的声明

JSX编译后会调用React.createElement方法，故需要提前声明引入react变量

### 点表示法

组件自身也可作为一个对象的属性存在

### 首字母大写

React组件名首字母必须为大写。

React中默认首字母小写的为HTML标签，大写的为React组件，将调用React.component进行编译

### 运行时选择组件类型

如需运行时根据变量确定所使用的元素类型，需要将其先赋值给一个大写字母开头的变量，再用这个变量进行组件的渲染

    import React from 'react';
    import { PhotoStory, VideoStory } from './stories';

    const components = {
      photo: PhotoStory,
      video: VideoStory
    };

    function Story(props) {
      // 正确！JSX 标签名可以为大写开头的变量。
      const SpecificStory = components[props.storyType];
      return <SpecificStory story={props.story} />;
    }

### 属性的使用

JSX中有几种不同的方式指定属性

#### javascript表达式

使用javascript表达式对属性进行赋值

    <MyComponent foo={1 + 2 + 3 + 4} />

注意：if和for不算表达式

#### 字符串常量

可以将字符串常量作为属性值传递

    <MyComponent message="hello world" />

    <MyComponent message={'hello world'} />

两种方法等价

**字符串常量在进行传递时，不会对其进行HTML转义**，故`<3`与`$lt;3`相同

#### 属性值默认为true

如果没有给属性传值，则默认为true

    <MyTextBox autocomplete />
    <MyTextBox autocomplete={true} />

**不建议使用**

#### 扩展属性

可以使用ES6的对象扩展符将对象中所有属性传递过去

    function App1() {
      return <Greeting firstName="Ben" lastName="Hector" />;
    }

    function App2() {
      const props = {firstName: 'Ben', lastName: 'Hector'};
      return <Greeting {...props} />;
    }

**不建议使用，容易导致不相关属性的传递**

### 子节点的传递

组件内部可以使用props.chirldren获取外部传入的子节点，子节点的传入有以下方法

#### 字符串常量

在开始与结束标签之间放入一个字符串，则props.children就是那个字符串

JSX会移除空行和开始与结尾处的空格，字符串内部的换行会被压缩成一个空格。

#### JSX

    <MyContainer>
      <MyFirstComponent />
      <MySecondComponent />
    </MyContainer>

**一个React组件可以通过数组的形式返回多个元素**

#### javascript表达式

将用大括号`{}`包裹的javascript表达式作为子元素传递

    function Item(props) {
      return <li>{props.message}</li>;
    }

    function TodoList() {
      const todos = ['finish doc', 'submit pr', 'nag dan to review'];
      return (
        <ul>
          {todos.map((message) => <Item key={message} message={message} />)}
        </ul>
      );
    }

可以与其他类型的子代混合使用

#### 函数

props.children可以传递任何数据，包括函数。只要将该组件在React渲染前转换成React能够理解的结构即可。

    // Calls the children callback numTimes to produce a repeated component
    function Repeat(props) {
      let items = [];
      for (let i = 0; i < props.numTimes; i++) {
        items.push(props.children(i));
      }
      return <div>{items}</div>;
    }

    function ListOfTenThings() {
      return (
        <Repeat numTimes={10}>
          {(index) => <div key={index}>This is item {index} in the list</div>}
        </Repeat>
      );
    }

#### 布尔值、Null和undefined被忽略

false、null、undefined 和 true 都是合法的子元素，但它们不会直接被渲染

以下表达式等价：

    <div />

    <div></div>

    <div>{false}</div>

    <div>{null}</div>

    <div>{undefined}</div>

    <div>{true}</div>

React中，出现了`falsy`值，即强制类型转换后会变为false的值，包括有0，''，null，undefined 和 NaN

此处需注意，**0作为一个falsy，会被判断为false，不执行后续的逻辑，但其本身会被渲染**，而其他值渲染时会被忽略

    <div>
      {props.messages.length &&
        <MessageList messages={props.messages} />
      }
    </div>

**解决办法为使得&&前面的表达式始终为布尔值**

如果需要将false、true、null或者undefined出现在输出中，则必须先将其转换为字符串再加入到元素中。

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