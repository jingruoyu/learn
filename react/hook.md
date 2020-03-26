## Hook

### hook 作用

React缺点

* 组件间复用状态逻辑很难，需要借助render props和高阶组件，但是这需要重新组织组件结构

	**Hook可以在无需更改组件结构的情况下复用状态逻辑**

* 复杂组件的生命周期中包含很多不同的逻辑

	**Hook将组建中相互关联的部分拆分成更小的函数**，而非按照生命周期进行分割

* class组件与function组件在this工作方式上存在不同

	**Hook不能在class组件中使用**，只能在函数组件中使用

综上述，Hook是为了解决以上问题而诞生的

### Hook概览

Hook是一种复用**状态逻辑**的方式，不复用状态本身，Hook的每次调用都会产生完全独立的state

#### 系统自带的Hook

* state Hook

	useState返回**当前状态和一个更新状态的函数**，其功能与class组件的this.state完全相同，且当函数退出后，state中的变量也会被React保留

	另函数组件中只在首次渲染时创建state，下次重新渲染时，直接返回当前state，而不是再次创建

	调用更新state的函数时，如果state是引用类型，则state会被合并，而this.setState的操作是替换

* Effect Hook

	useEffect相当于componentDidMount + componentDidUpdate + componentWillUnmount 三个生命周期，React在每次DOM完成修改后调用，包括第一次渲染

	* useEffect可以多次调用，关注点分离
	* useEffect可以返回一个函数，React 会在组件卸载的时候执行清除操作，调用函数

* useContext：不使用组件嵌套即可订阅React的Context
* useReducer：通过reducer批量管理组件本地的state

#### 使用规则

* 只能在函数最外层调用Hook，不能在循环、条件判断或子函数中调用
* 只能在react函数组件和自定义Hook中调用Hook，不能在JavaScript函数中调用

#### 自定义Hook

自定义Hook即为将需要复用的useState和useEffect相关的逻辑抽离出来，在不同的组件中可以直接调用该Hook

每次调用都会产生独立的状态，不会相关影响