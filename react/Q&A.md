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

https://zhuanlan.zhihu.com/p/105940433

### react hooks为什么需要顺序调用

https://zhuanlan.zhihu.com/p/200855720

此处涉及到vNode的数据结构

### setState的同步异步问题

[React官方解答](https://zh-hans.reactjs.org/docs/faq-state.html#why-is-setstate-giving-me-the-wrong-value)

调用setState其实是异步的，即在调用之后，可能不会立即在this.state上映射为新的值。如果需要基于当前state进行计算，则向setState传递一个函数

**setState什么时候是异步的？**

event handler内部的setState是异步的，但是在setTimeout等异步函数回调中调用的setState可以理解为同步的

### 同步异步更新状态问题

React设计为异步更新是为了将状态更改进行批量操作，避免不必要的重新渲染来提升性能

**为什么不默认全部设计为异步更新**

React具有跨平台特性，所以前端使用时分为react和react-dom两部分，setState操作是在react的reconciler中执行的，setTimeout、Promise等都是前端平台特有的API，无法进行针对性优化

### React与vue不同

#### batch update

* vue的状态更改是通过事件队列中的微任务完成的，故所有的状态更改都可以进行批量更新
* react由于跨平台性，是通过在event handler的前后分别插入hook执行的，但是对于setTimeout等异步回调无能为力

#### 更新机制

* vue是自动更新机制，在首次render时收集依赖，依赖变化时重新渲染。其弊端是需要对所有的state进行监听，消耗内存。优化方式是对不会变化的数据进行Object.freeze()冻结
* react是手动更新，setState后，会调用整个vDOM树的diff，找出需要render的组件。在此过程中，可能会由于state存放位置的问题，导致渲染范围过大，出现性能问题，是react的一个优化点

react + mobx也可以实现类似于vue的依赖收集、定点更新机制，可以参见react-mobx-lite，这个库只支持react函数式组件

react与vue在性能上不存在十分大的区别，主要还是取决于开发者与业务场景

#### 接口

* vue中模板语法需要使用vue的指令，学习成本偏高
* react使用jsx语法，与js基本相同，学习成本更低

#### 一个例子

[vue demo](https://codesandbox.io/s/boring-feistel-8gcqg?file=/src/App.vue)

```javascript
// react
{status ? <HelloWorld msg={'hello1'}> : <HelloWorld msg={'hello2'}>}

// vue
<HelloWorld v-if="status" msg='hello1'>
<HelloWorld v-else msg='hello1'>
```

status会在true、false之间变化，问组件内部生命周期的执行情况

* React中，切换状态时，由于状态变化导致父组件重新render，子组件也会重新渲染，所以每次会执行对应组件的生命周期
* vue中，切换状态时，直接更新对应status，然后执行vDOM diff操作，判断前后key和type均相同，故直接复用element，没有重新执行渲染。故beforeMount类的生命周期只执行一次，后期触发的都是update。

	另外如果调用组件时如果增加key属性，则会导致diff时无法复用，也会每次执行mount生命周期