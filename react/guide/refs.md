## Refs

React中，父子组件一般通过props进行数据交互，但是也可以使用refs控制子组件或DOM元素

### 创建Refs

使用`React.createRef()`创建Refs，并通过ref属性添加到React元素

### 访问Refs

ref被传递给元素后，可以通过ref的current属性访问该节点

* ref属性用于HTML元素时，current指向该DOM元素
* ref属性用于class组件时，current指向组件的挂载实例
* ref不能在函数组件上直接使用，因为函数组件没有实例

    但是可以通过refs转发将ref挂载到函数组件内部的一个元素或者class组件上

    可以在函数组件内部使用ref

### 回调refs

ref属性传递一个函数，该函数以React组件实例或DOM元素作为参数

如果回调ref以内联函数形式定义，则在更新时会被调用两次
1. 创建新的函数实例，清空旧的ref设置新的，传入参数为null
2. 挂载到DOM节点，传入参数为DOM元素

可以通过将ref回调函数定义为class绑定函数的形式解决，不过无关紧要

### Refs转发

允许某些组件接受ref，并将其向下传递给子组件

* `React.createRef()`创建一个`React ref`，保存为变量ref
* 将创建的ref作为JSX属性，传递给父组件
* 使用`React.forwardRef`定义的父组件获取到第二个ref参数，此处需注意ref不属于props
* 父组件将ref参数传递给子组件
* 挂载完成后，`ref.current`指向子组件

慎用refs转发，应将其视为破坏性更改

#### 高阶组件中转发refs

高阶组件中转发refs分为两步，传递ref到容器组件 + 传递ref到输入组件
1. 传递ref到容器组件类似于普通的ref转发，组件定义使用`React.forwardRef`，ref值传入使用`React.createRef()`
2. 传递ref到输入组件类似于普通的props传递，容器组件将ref作为一个特殊的props传入，之后取出，再放入输入组件中
