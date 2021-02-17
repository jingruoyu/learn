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

fiber节点的主要结构为

```
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  // Fiber对应组件的类型 Function/Class/HostComponent
  this.tag = tag;
  // key属性
  this.key = key;
  // 大部分情况同type
  this.elementType = null;
  // 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
  this.type = null;
  // Fiber对应的真实DOM节点
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  // 指向父级Fiber节点
  this.return = null;
  // 指向子Fiber节点
  this.child = null;
  // 指向右边第一个兄弟Fiber节点
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  // 保存本次更新造成的状态改变相关信息
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;
    // 保存本次更新会造成的DOM操作
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;

```

在新的React架构中，每个Fiber节点对应一个React element，保存了该组件的类型（函数组件、类组件、原生节点）、对应的DOM节点、本次更新中该组件改变的状态、要执行的工作等信息

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

`Fiber reconciler`分为三个阶段
* schedule阶段，根据任务优先级进行调度，实现时间切片
* (可中断)render/reconciler通过构造`workInProgress tree`得出change
* (不可中断)commit应用这些DOMchange，renderer

#### render/reconciler

以`fiber tree`为基础，把每个fiber作为一个**工作单元**，自顶向下逐节点构造`workInProgress tree`

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

* render/reconciler

	componentWillMount
	componentWillReceiveProps
	shouldComponentUpdate
	componentWillUpdate

* commit/renderer

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

## 例子

```javascript
function App() {
  const [num, add] = useState(0);
  return (
    <p onClick={() => add(num + 1)}>{num}</p>
  )
}
ReactDOM.render(<App/>, document.getElementById('root'));
```

### mount

首次执行ReactDom.render时会创建fiberRootNode（源码中称为fiberRoot）和rootFiber。其中fiberRootNode是整个应用的根节点，rootFiber是<App />所在组件树的根节点

两个区别在于
* 整个应用的根节点只有一个，即fiberRootNode，其current指向当前页面上已渲染内容对应的Fiber树，称为current Fiber树
* 应用中可以多次调用ReactDom.render渲染不同的组件树，他们拥有不同的rootFiber

进入render阶段后，根据组件返回的JSX在内存中依次创建Fiber并连接在一起构成Fiber树，称为workInProgress Fiber树。构建过程中会尝试复用current Fiber树中已有的Fiber节点

**workInProgress Fiber树在首屏渲染时，只有rootFiber存在对应的current Fiber，即rootFiber.alternate**

[workInProgress Fiber](../../img/react/first-render.png)

### update

update时会开启依次新的render阶段并构建一棵新的workInProgress树

* Reconciler工作的阶段被称为render阶段。因为在该阶段会调用组件的render方法。
* Renderer工作的阶段被称为commit阶段。commit阶段会把render阶段提交的信息渲染在页面上。
* render与commit阶段统称为work，即React在工作中
* 如果任务正在Scheduler内调度，就不属于work。

## render

### Fiber tree的创建过程

render阶段开始于performSyncWorkOnRoot

```
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
```

workInProgress代表当前已创建的workInProgress fiber

performUnitOfWork方法会创建下一个Fiber节点并赋值给workInProgress，并将workInProgress与已创建的Fiber节点连接起来构成Fiber树。

Fiber tree的构建分为两个阶段

1. 递阶段

    此阶段从rootFiber开始向下深度优先遍历，为遍历到的每个Fiber节点调用beginWork方法，创建Fiber节点，并与之前的节点连接起来，为其创建子节点

    当遇到叶子节点时，进入回溯阶段

2. 归阶段

    此阶段调用completeWork处理Fiber节点

    当某个Fiber节点执行完completeWork，如果其存在兄弟Fiber节点（即fiber.sibling !== null），会进入其兄弟Fiber的“递”阶段

    如果不存在兄弟Fiber，会进入父级Fiber的“归”阶段。

    “递”和“归”阶段会交错执行直到“归”到rootFiber。至此，render阶段的工作就结束了

### beginWork

在beginWork函数中，分为update与mount两种情况

* mount时，暂无current，会根据workInProgress.tag的不同，创建不同类型的Fiber节点
* update时，需要根据`oldProps === newProps && workInProgress.type === current.type`判断节点能否直接复用之前的Fiber，无需新建

对于常见类型的组件，如（FunctionComponent/ClassComponent/HostComponent），最终会进入`reconcileChildren`

#### reconcileChildren

* 对于mount组件，会创建新的子Fiber节点
* 对于update组件，会将当前组件与之前的Fiber节点比较，根据比较结果生成新的Fiber节点

```javascript
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    // 对于mount的组件
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // 对于update的组件
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}
```

无论走哪个逻辑，最终都会向`workInProgress.child`节点赋值，作为本次beginWork的返回值，并作为下次performUnitOfWork执行时workInProgress的传参

#### effectTag

render阶段的工作是在内存中执行的，当工作结束后会通知Renderer需要指定的DOM操作。这些数据保存在fiber.effectTag中

要通知Renderer将Fiber节点对应的DOM节点插入页面，需要满足两个条件
* fiber.stateNode存在，即Fiber节点中保存了对应的DOM节点
* (fiber.effectTag & Placement) !== 0，即Fiber节点存在Placement effectTag

### completeWork

completeWork中分为处理自定义组件与HostComponent两种

处理HostComponent：

```javascript
case HostComponent: {
  popHostContext(workInProgress);
  const rootContainerInstance = getRootHostContainer();
  const type = workInProgress.type;

  if (current !== null && workInProgress.stateNode != null) {
    // update的情况
    updateHostComponent(
      current,
      workInProgress,
      type,
      newProps,
      rootContainerInstance,
    );
  } else {
    // mount的情况
    // ...省略
  }
  return null;
}
```

此过程中需要判断`workInProgress.stateNode`是否还存在相应的DOM节点

当update时，Fiber节点已经存在对应的DOM节点，所以不需要生成DOM节点，需要做的就是处理props，如
* onClick、onChange等回调函数的注册
* style prop
* 处理DANGEROUSLY_SET_INNER_HTML prop
* 处理children prop

updateHostComponent函数内部，被处理完的props会被赋值给workInProgress.updateQueue，并最终在commit阶段渲染到页面上

当mount时，为Fiber节点生成对应的DOM节点，并将后代DOM节点插入父DOM中，类似于update中处理props的过程

### effectList

completeWork的上层函数completeUnitOfWork中，每个执行完completeWork且存在effectTag的Fiber节点会被保存在一条被称为effectList的单向链表中。

effectList中第一个Fiber节点保存在fiber.firstEffect，最后一个元素保存在fiber.lastEffect。
在“归”阶段，所有有effectTag的Fiber节点都会被追加在effectList中，最终形成一条以rootFiber.firstEffect为起点的单向链表。

```
                       nextEffect         nextEffect
rootFiber.firstEffect -----------> fiber -----------> fiber
```

在commit阶段遍历effectList就能执行所有的effect

render阶段全部工作完成。在performSyncWorkOnRoot函数中fiberRootNode被传递给commitRoot方法，开启commit阶段工作流程

[workInProgress Fiber](../../img/react/fiber-commit-performance.png)

## commit

commit阶段根据fiber tree上的节点编辑执行渲染视图动作，可以分为三个子阶段
* before mutation（执行DOM操作前）
* mutation（执行DOM操作）
* layout（执行DOM操作后）

### before mutation

* 处理DOM节点渲染、删除后的autoFocus、blur逻辑
* 调用getSnapshotBeforeUpdate生命周期钩子
* 调度useEffect

当一个FunctionComponent含有useEffect或useLayoutEffect，他对应的Fiber节点也会被赋值effectTag。

### mutation

mutation阶段也是遍历effectList，对每个fiber节点执行三个操作
* 根据ContentReset effectTag重置文字节点
* 更新ref
* 根据effectTag分别处理，其中effectTag包括(Placement | Update | Deletion | Hydrating)

然后根据不同的effectTag执行不同的操作函数

### layout

该阶段的代码都是在DOM渲染完成（mutation阶段完成）后执行的。
该阶段触发的生命周期钩子和hook可以直接访问到已经改变后的DOM，即该阶段是可以参与DOM layout的阶段。

该阶段主要进行一些生命周期或者hooks的处理

**current Fiber树的切换**

```
root.current = finishedWork;
```

## diff算法

diff的入口在[reconcileChildFibers](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L1280)中, 该函数会根据newChild（即JSX返回的结果）类型调用不同的处理函数

```javascript
// 根据newChild类型选择不同diff函数处理
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
): Fiber | null {

  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // object类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        // 调用 reconcileSingleElement 处理
      // // ...省略其他case
    }
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 调用 reconcileSingleTextNode 处理
    // ...省略
  }

  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
  }

  // 一些其他情况调用处理函数
  // ...省略

  // 以上都没有命中，删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);

```

可以从同级的节点数量将Diff分为两类：
* 当newChild类型为object、number、string，代表同级只有一个节点
* 当newChild类型为Array，同级有多个节点

### 单节点diff

对于单个节点，类型为object为例，会进入[reconcileSingleElement](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L1141)

判断DOM节点可否复用

```javascript
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  
  // 首先判断是否存在对应DOM节点
  while (child !== null) {
    // 上一次更新存在DOM节点，接下来判断是否可复用

    // 首先比较key是否相同
    if (child.key === key) {

      // key相同，接下来比较type是否相同

      switch (child.tag) {
        // ...省略case
        
        default: {
          if (child.elementType === element.type) {
            // type相同则表示可以复用
            // 返回复用的fiber
            return existing;
          }
          
          // type不同则跳出循环
          break;
        }
      }
      // 代码执行到这里代表：key相同但是type不同
      // 将该fiber及其兄弟fiber标记为删除
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // key不同，将该fiber标记为删除
      deleteChild(returnFiber, child);
    }
    // 只在同层级对比
    child = child.sibling;
  }

  // 创建新Fiber，并返回 ...省略

```

从代码可以看出，React通过先判断key是否相同，如果key相同则判断type是否相同，只有都相同时一个DOM节点才能复用。
* 当child !== null且key相同且type不同时执行deleteRemainingChildren将child及其兄弟fiber都标记删除。
* 当child !== null且key不同时仅将child标记删除。

### 多节点diff

同级多个节点的Diff，一定属于以下三种情况中的一种或多种
* 节点更新
* 节点增加或减少
* 节点位置变化

Diff算法的整体逻辑会经历两轮遍历
* 第一轮遍历，处理更新的节点
* 第二轮遍历，处理剩下的不属于更新的节点

第一轮遍历步骤为
1.   let i = 0，遍历newChildren，将newChildren[i]与oldFiber比较，判断DOM节点是否可复用。
2.   如果可复用，i++，继续比较newChildren[i]与oldFiber.sibling，可以复用则继续遍历。
3.   如果不可复用，分两种情况：
  key不同导致不可复用，立即跳出整个遍历，第一轮遍历结束。
  key相同type不同导致不可复用，会将oldFiber标记为DELETION，并继续遍历
4. 如果newChildren遍历完（即i === newChildren.length - 1）或者oldFiber遍历完（即oldFiber.sibling === null），跳出遍历，第一轮遍历结束。

此时会产生有无遍历完成的情况

```
/ 之前
<li key="0" className="a">0</li>
<li key="1" className="b">1</li>
            
// 之后 情况1 —— newChildren与oldFiber都遍历完
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>
            
// 之后 情况2 —— newChildren没遍历完，oldFiber遍历完
// newChildren剩下 key==="2" 未遍历
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>
<li key="2" className="cc">2</li>
            
// 之后 情况3 —— newChildren遍历完，oldFiber没遍历完
// oldFiber剩下 key==="1" 未遍历
<li key="0" className="aa">0</li>

// 之后 情况4 —— 都没遍历完
<li key="0">0</li>
<li key="2">1</li>
<li key="1">2</li>
```

第二轮遍历根据第一轮遍历的结果分别讨论

* 同时遍历完：只需要在第一轮遍历中进行组件更新，diff结束
* newChildren没遍历完，oldFiber遍历完

    已有的主节点都复用了，这时还有新加入的节点，意味着本次有新节点插入，只需要遍历剩下的newChildren为生成的workInProgress fiber依次标记Placement

* newChildren遍历完，oldFiber没遍历完

    本次更新比之前的节点数量少，有节点被删除了。所以需要遍历剩下的oldFiber，依次标记Deletion

* newChildren与oldFiber都没遍历完

    意味着有节点在这次更新中改变了位置

#### 处理移动的节点

由于有节点改变了位置，所以不能再使用位置索引对比前后的节点

为了快速找到key对应的oldFiber，我们将所有还未处理的oldFiber存入以key-oldFiber为键值对的Map中

```javascript
const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
```

接下来遍历剩余的newChildren，通过newChildren[i].key就能在existingChildren中找到key相同的oldFiber。


#### 标记节点是否移动

需要寻找移动的节点

节点是否需要移动的参照物是：在diff过程中，最后一个可复用的节点在oldFiber中的位置索引（用变量lastPlacedIndex表示）

由于本次更新中节点是按newChildren的顺序排列。在遍历newChildren过程中，每个遍历到的可复用节点一定是当前遍历到的所有可复用节点中最靠右的那个，即一定在lastPlacedIndex对应的可复用的节点在本次更新中位置的后面。

那么只需要比较遍历到的可复用节点在上次更新时是否也在lastPlacedIndex对应的oldFiber后面，就能知道两次更新中这两个节点的相对位置改变没有。

**用变量oldIndex表示遍历到的可复用节点在oldFiber中的位置索引。如果oldIndex < lastPlacedIndex，代表本次更新该节点需要向右移动**

lastPlacedIndex初始为0，每遍历一个可复用的节点，如果oldIndex >= lastPlacedIndex，则lastPlacedIndex = oldIndex

[协助理解](https://juejin.cn/post/6844903905629831176)