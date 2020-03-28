## Hook

[Why React’s new Hooks API is a game changer](https://itnext.io/why-reacts-hooks-api-is-a-game-changer-8731c2b0a8c)
[useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)

### hook 作用

React缺点

* 组件间难以复用状态逻辑，需要借助render props和高阶组件，但是这需要重新组织组件结构

	**Hook可以在无需更改组件结构的情况下复用状态逻辑**

* 复杂组件的生命周期中包含很多不同的逻辑

	class生命周期中包含逻辑过多，需要进行拆分

	**Hook将组建中相互关联的部分拆分成更小的函数**，而非按照生命周期进行分割

* class组件与function组件在this工作方式上存在不同

	**Hook不能在class组件中使用**，只能在函数组件中使用，hook为函数组件添加了状态

综上述，Hook是为了解决以上问题而诞生的

### Hook概览

Hook是一种复用**状态逻辑**的方式，不复用状态本身，Hook的每次调用都会产生完全独立的state

#### 使用规则

* 只能在函数最外层调用Hook，不能在循环、条件判断或子函数中调用
* 只能在react函数组件和自定义Hook中调用Hook，不能在JavaScript函数中调用

#### 系统自带的Hook

* state Hook

	useState返回**当前状态和一个更新状态的函数**，其功能与class组件的this.state完全相同，且当函数退出后，state中的变量也会被React保留

	**函数组件中只在首次渲染时创建state**，下次重新渲染时，直接返回当前state，而不是再次创建，useState为函数组件增加了状态

	调用更新state的函数时，state变量会被替换，而this.setState的操作是合并，仅替换state指定属性

* Effect Hook

	useEffect相当于componentDidMount + componentDidUpdate + componentWillUnmount 三个生命周期。**默认React在每次DOM更新完毕后调用effect，包括第一次渲染**，可以增加依赖数组

	`useEffect`特性：
	* `useEffect`可以多次调用，关注点分离，将不相关逻辑分离到不同的effect中
	* **`useEffect`可以返回一个函数，React会在下一次渲染前或组件卸载前执行该函数**，可以执行一些清除操作，删除effect内部定义的变量等

		在下一次渲染前执行清除函数的必要性：一个例子，每次渲染的effect都是新生成的，如果上一次渲染中effect函数定义一个DOM对象在DOM树中被引用，会导致内存泄露

	依赖数组的使用：
	* 无依赖数组：每次DOM更新均执行effect
	* 有依赖数组：DOM更新后检查依赖数组是否变化，发生变化effect，无变化则跳过

		如果依赖数组指定为空数组，则effect不依赖于任何值，effect只会在组件挂载和卸载时执行。**但此情况下，effect中props和state会一直保持初始值**

	`effect`特性：
	* useEffect的参数effect在每次渲染时都会生成新的，在此机制下每个effect都属于一次特定的渲染，故获取到的state都是最新的
	* **effect不会造成阻塞**，除了需要测量布局外，大部分情况下均为异步执行

* useContext：不使用组件嵌套即可订阅React的Context
* useReducer：通过reducer批量管理组件本地的state

#### 自定义Hook

自定义Hook将需要复用的useState和useEffect相关的逻辑抽离出来，在不同的组件中可以直接调用该Hook

与系统自带hook相同，自定义hook每次调用都会产生独立的状态，不会相关影响

**自定义hook必须使用`use`开头**