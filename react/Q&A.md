## Q&A

### react 父组件状态改变，子组件是否渲染

state/props修改导致父组件重新渲染，render函数执行

此时子组件分为两种情况

* 子组件在父组件内部定义或import，在执行render函数时，都会再次执行生成新的实例，。所以会再次渲染
* 子组件是父组件的上层通过props传递下来，执行render时，返回的还是父组件的上层的render函数执行时，所生成的实例，故不会再次渲染

还有一种情况是可以将子组件import进来后，在父组件外层执行后得到一个实例，在父组件中直接使用此实例，这样每次渲染都是用的是同一个实例，不会涉及到重复刷新的问题，但是会无法向组件内部动态传入参数

此处需要注意react中component、instance与最终的react element的区别，直接声明或import进来的都是component，执行后才会获得instance与element

instance中还区分`public instance`与`_internalInstance`，`public instance`可以通过this访问到，`_internalInstance`只在react内部使用，详见`reconciler`实现

### 基于上一问题的性能优化点

* pureComponent

	针对prop与state进行浅比较，当赋予react组件相同的props和state时，render会渲染相同的内容，一些情况下可以提高性能

* shouldComponentUpdate

	生命周期方法，根据shouldComponentUpdate函数的返回值判断是否进行渲染，默认情况下state每次发生变化组件都会重新渲染

	当 props 或 state 发生变化时，shouldComponentUpdate() 会在渲染执行之前被调用。**返回值默认为 true，执行渲染操作**。手动编写此函数时，可以通过比较props与nextProps以及state与nextState，返回false即可跳过更新，。但是返回false并不能阻止子组件在state更改时重新渲染

	更建议使用pureComponent组件针对props与state进行浅比较，减少跳过必要更新的可能性

	不建议在shouldComponentUpdate中进行深比较或者JSON.stringify()，避免损害性能

	https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate

* React.memo(functionComponent[, callback])

	高阶组件，**仅检查props变更**，默认情况下只对复杂对象进行浅比较。如果想要控制对比过程，可以使用自定义的callback函数

	React.mome通过记忆组件渲染结果的方式来提高组件的性能表现，在此种情况下，react将跳过渲染组件的操作，并直接复用最近一次的渲染结果

	**NOTE**：callback函数的返回值与shouldComponentUpdate函数相反，如果props相等，返回true，否则返回false

* React.useMemo

	更细粒度的缓存控制，仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算

	```javascript
	import React, { useMemo } from 'react'
	export default (props = {}) => {
	    console.log(`--- component re-render ---`);
	    return useMemo(() => {
	        console.log(`--- useMemo re-render ---`);
	        return <div>
	            {/* <p>step is : {props.step}</p> */}
	            {/* <p>count is : {props.count}</p> */}
	            <p>number is : {props.number}</p>
	        </div>
	    }, [props.number]);
	}
	```

### memo与useMemo区别

* memo针对组件，粒度更大
* useMemo针对数据，粒度更小

https://zhuanlan.zhihu.com/p/105940433