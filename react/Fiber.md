[Fiber理解](http://www.ayqy.net/blog/dive-into-react-fiber/)
[react基础原理-文科分享](https://xiaomi.f.mioffice.cn/docs/dock4opliFgH3ZIKg5cTbfd9BTf)

# Fiber

## stack reconciler

`stack reconciler`是为React 15及更早的版本提供的支持，目前已经停止使用，替代它的是fiber reconciler，其实质是在stack的基础上进行优化

`stack reconciler`对`render`、`reconciler`、DOM的处理方式为，每调用一个`render`生成对应的`element`对象，就进行相应的`reconciler`，然后如果发现子元素发生变动，再对子元素进行相同的递归遍历操作，最终根据生成的`element`对象进行DOM操作。

在此过程中，`render`、`reconciler`的执行即为不断地出栈入栈，故称为`stack reconciler`

缺点：同步任务，可能会长时间占用主线程，出现掉帧

## Fiber reconsider

`fiber reconciler`在`stack reconciler`的基础上进行了优化
* 将`render`与`reconciler`的工作变为可中断的，避免过长占用主线程

    `fiber reconciler`会在执行`render`前检查目前为止所有render与reconciler操作耗时，如果超过一定阈值，则让出主线程，避免产生页面无响应的情况

* 能不断地将任务进行优先级排序、rebase和复用
* 能够在父节点和子节点之间来回操作，以支持React中的布局
* 能够从render中返回多个元素
* 更好的支持错误边界

## 关键特性

* 渲染任务拆分为块，匀到多帧

	用于解决掉帧问题，拆分任务，每次只做一小段即返回主线程控制权，不再长时间占用。这种策略叫做cooperative scheduling，合作式调度

* 渲染任务的暂停、终止和复用
* 任务优先级
* 并发

react的杀手锏是vDOM，优点是
* UI操作变得简单
* 其他的硬件、VR，native App也可以virtual

react分为两部分
* `reconciler`寻找前后两个版本UI的差异
* renderer是插件式的，与平台相关，包括React DOM，React Native等

## 具体实现

### fiber tree

react运行时存在三种实例

```
Element -> Instances(vDOM tree node) -> DOM
```

Instances是根据Elements创建的，对组件及DOM节点的抽象表示，vDOM tree维护了组件状态以及组件与DOM树的关系

Stack reconciler是自顶向下的递归，导致主线程上的布局、动画等周期性任务以及交互响应就无法立即得到处理，影响体验

Fiber将任务拆分为一系列，每次只检查树上的一部分，有时间继续下一个任务。此种情况下需要更多的上下文信息，之前的vDOM tree难以满足，扩展出了fiber tree，在更新过程中，会根据现有的fiber tree构造出workInProgress tree，用于断点恢复

fiber tree上各节点的主要结构为

```
{
    stateNode,
    child,
    return, // 当前节点处理完毕后，应该返回到哪里。效果上与栈处理中return的地址相同
    sibling,
    ...
}
```

[fiber tree](../../img/react/fiber-tree.png)

**fiber tree实际上是一个单链表**


DOM
    真实DOM节点
-------
effect(临时)
    每个workInProgress tree节点上都有一个effect list
    用来存放diff结果
    当前节点更新完毕会向上merge effect list（queue收集diff结果）
-------
workInProgress(临时)
    workInProgress tree是reconcile过程中从fiber tree建立的当前进度快照，用于断点恢复
-------
current fiber
    fiber tree与vDOM tree类似，用来描述增量更新所需的上下文信息
-------
Elements
    描述UI长什么样子（type, props）

### `Fiber reconciler`

`Fiber reconciler`分为两个阶段
* (可中断)render/reconciler通过构造`workInProgress tree`得出change
* (不可中断)commit应用这些DOMchange

#### render/reconciler

以`fiber tree`为基础，吧每个fiber作为一个**工作单元**，自顶向下逐节点构造`workInProgress tree`

具体过程为
1. **如果当前节点不需要更新**，直接把子节点clone过来，跳到5；要更新的话打个tag
2. 更新当前节点状态（props, state, context等）
3. 调用shouldComponentUpdate()，false的话，跳到5
4. 调用render()获得新的子节点，并为子节点创建fiber（创建过程会尽量复用现有fiber，子节点增删也发生在这里）
5. 如果没有产生child fiber ? (该工作单元结束，把effect list归并到return，并把当前节点的sibling作为下一个工作单元) : 否则把child作为下一个工作单元
6. 如果没有剩余可用时间了，等到下一次主线程空闲时才开始下一个工作单元；否则，立即开始做
7. 如果没有下一个工作单元了（回到了workInProgress tree的根节点），第1阶段结束，进入pendingCommit状态

1-6为工作循环，7位出口

**`workInProgress tree`的构建过程就是diff的过程，通过`requestIdleCallback`来调度执行一组任务，每完成一组任务后，如果有剩余时间，则聚需处理下一个节点，否则在打开一个requestIdleCallback，然后将控制权交还给主线程，等待回调再继续构建`workInProgress tree`**

针对effect list：workInProgress tree的根节点身上的effect list就是收集到的所有side effect

由此可以观察到`Fiber reconciler`和`stack reconciler`的本质区别

但是`window.requestIdleCallback`只是尽力做到流畅，并不能绝对保证，具体的执行结果还是要看任务本身的耗时

#### commit

commit阶段直接同步执行完成
* 处理effect list：更新DOM树，调用生命周期函数，更新ref
* 所有更新commit到DOM树上

#### 生命周期函数

生命周期函数被分为两个阶段

* renderer/reconciler

	componentWillMount
	componentWillReceiveProps
	shouldComponentUpdate
	componentWillUpdate

* commit

	componentDidMount
	componentDidUpdate
	componentWillUnmount

第一个阶段的生命周期函数可能会被多次调用，默认低优先级，如果被高优先级任务打断，稍后重新执行

### 双缓冲技术

在react中最多会同时存在两棵Fiber tree，当前屏幕上显示内容对应的Fiber树称为current Fiber tree，正在内存中构建的Fiber树称为workInProgress Fiber tree

current Fiber树中的Fiber节点被称为current fiber，workInProgress Fiber树中的Fiber节点被称为workInProgress fiber，他们通过alternate属性连接。

```
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

React应用的根节点通过current指针在不同Fiber树的rootFiber间切换来实现Fiber树的切换。
当workInProgress Fiber树构建完成交给Renderer渲染在页面上后，应用根节点的current指针指向workInProgress Fiber树，此时workInProgress Fiber树就变为current Fiber树。

每次状态更新都会产生新的workInProgress Fiber树，通过current与workInProgress的替换，完成DOM更新。

### 优先级策略

每个工作单元运行时会有6种优先级

* synchronous 与之前的Stack reconciler操作一样，同步执行
* task 在next tick之前执行
* animation 下一帧之前执行，`requestAnimationFrame`调度
* high 在不久的将来立即执行，后三个全部由`requestIdleCallback`调度
* low 稍微延迟（100-200ms）执行也没关系
* offscreen 下一次render时或scroll时才执行

优先级机制带来两个问题
* 生命周期函数可能会被频频中断，触发顺序、次数没有保证
* 低优先级任务没有机会执行