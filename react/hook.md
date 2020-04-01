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

### 使用规则

* 只能在函数最外层调用Hook，不能在循环、条件判断或子函数中调用

	React依赖Hook的调用顺序，确定每一次渲染中state、effect的对应关系。如果将hook放入条件或循环语句中，可能会造成两次渲染中hook执行情况对应不上，从而导致一系列问题。

* 只能在react函数组件和自定义Hook中调用Hook，不能在JavaScript函数中调用

### 系统自带的Hook

* state Hook

	useState返回**当前状态和一个更新状态的函数**，其功能与class组件的this.state完全相同，且当函数退出后，state中的变量也会被React保留

	**函数组件中只在首次渲染时创建state**，下次重新渲染时，直接返回当前state，而不是再次创建，useState为函数组件增加了状态

	调用更新state的函数时，state变量会被替换，而this.setState的操作是合并，仅替换state指定属性

	如果更新函数返回值与当前 state 完全相同，则随后的重渲染会被完全跳过。React使用Object.is比较算法来比较state

	更新函数参数
	* 目标值：直接进行数据更新
	* 函数式更新：新的state需要使用先前的state计算得出，将函数传递给setState。适用于摆脱hook的闭包场景

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

	接收一个context对象并返回该context的当前值，即上次组件中距离当前组件最近的`<MyContext.Provider>`的value属性

	当上层组件中的Provider更新时，useContext会触发重新渲染，并使用最新传递的context value值

* useReducer：通过reducer批量管理组件本地的state，useState替代方案

	返回当前的state以及与其配套的dispatch，通过dispatch更新state

	useReducer初始化：
	* 指定初始state：initState作为useReducer的第二个参数
	* 惰性初始化：init函数作为useReducer的第三个参数，initState将作为init函数的参数被执行

	如果 Reducer Hook 的返回值与当前 state 相同，React 将跳过子组件的渲染及副作用的执行

* useCallback：返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新

	`useCallback(fn, deps)`相当于`useMemo(() => fn, deps)`

	当把回调函数传递给使用引用相等性去避免非必要渲染的子组件时，它将非常有用

* useMemo

	仅当某个依赖项改变是才重新计算memoized值，避免每次渲染时都进行计算，当不提供依赖数组时每次渲染都会计算新的值

	传入useMemo的函数会在渲染期间执行，不要在这个函数内部执行与渲染无关的操作，副作用之类的操作可以放入useEffect中

	useMemo是一种性能优化手段，但是不能作为语义上的保证

* useRef

	返回一个可变的ref对象，该对象在组件的整个生命周期内保持不变，ref对象使用方法基本同正常的ref属性

	**useRef可以在`current`属性上保存任何属性值**，优点在于每次渲染都会返回同一个ref对象，不会创建新值。

	当ref.content中内容改变时不会进行通知，不会引发组件重新渲染。此类需求可以通过回调ref实现

* useImperativeHandle：自定义使用ref时子组件向父组件暴露的实例值
* useLayoutEffect：在所有DOM变更之后同步调用effect，区别于useEffect在于其为同步调用，DOM变更 -> useLayoutEffect调用 -> 浏览器绘制
* useDebugValue：可用于在 React 开发者工具中显示自定义 hook 的标签

### 自定义Hook

自定义Hook将需要复用的useState和useEffect相关的逻辑抽离出来，在不同的组件中可以直接调用该Hook

与系统自带hook相同，自定义hook每次调用都会产生独立的状态，不会相互影响

**自定义hook必须使用`use`开头**

可以在多个Hook之间传递参数：Hook本身即为函数，故Hook的参数可以为一个变量，当变量更新时，Hook本身也会得到更新

### hook FQA

* [数据获取](https://www.robinwieruch.de/react-hooks-fetch-data)
* 建议将一个大的state对象拆分为多个state变量，可以避免合并，而且逻辑拆分更容易
* **使用hook后，effect、组件内部的函数调用、事件处理会默认产生闭包**，其所使用的的状态是他被创建的那次渲染中的

	这是hook与class最大的不同
* 