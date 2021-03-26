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
* shouldComponentUpdate
* React.memo

### memo与useMemo区别

https://zhuanlan.zhihu.com/p/105940433