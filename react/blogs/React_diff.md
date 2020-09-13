## react diff

[react diff算法](https://calendar.perfplanet.com/2013/diff/)

React中render函数的执行结果只是一个轻量化的对象，而不是一个真正的DOM节点，我们称之为虚拟DOM。React试图通过这种机制找到从之前的渲染结果到下一个结果之间的最少操作

### 逐层对比

在两个任意的树之间找到最少的操作步骤是一个O(n^3)问题。React使用简单而强大的启发式方法在O(n)中找到一个非常好的近似值

React仅仅逐层对比vDOM，这极大的减小了问题的复杂度，没有造成很大的损失。因为在web中元素移动到不同的层级是不常见的，更多的场景是元素的子节点在发生变化

### 列表

默认情况下，react会将上一个列表的第一个组件和下一个列表的第一个组件相关联，以此类推。我们也可以提供一个key属性来帮助React计算映射关系。在实践中，这通常用于唯一的标识一个子节点

### 组件

一个react App通常有很多用户自定义的组件组成，这些组件最终会变为一个主要由div组成的树。由于React只匹配具有相同type的组件，所以diff算法也会考虑这些信息

例如，如果<Header>被<ExampleBlock>替换，React将删除<Header>并创建一个<ExampleBlock>。我们不需要花费宝贵的时间去匹配两个不太可能相似的组件

### 事件委托

将事件侦听器绑定到DOM节点上是非常缓慢和消耗内存的，所以React采用了事件委托技术

React更进一步，重新实现了一个兼容W3C的事件系统，这意味着IE8事件处理错误已经成为过去，在跨浏览器时，所有的事件名都是一致的

其实现方式是，react中每个组件都有一个唯一id，react将所有的事件handler根据对应的组件id存储在一个map中（即一个哈希映射），然后只在根节点上只使用一个事件监听器监听所有的事件。当事件发生时，获取event.target上的元素id，然后到map中进行查找，触发相应事件

当组件挂载或卸载时，只是简单地从内部的对象中添加或删除这些handler映射即可

```javascript
// dispatchEvent('click', 'a.b.c', event)
clickCaptureListeners['a'](event);
clickCaptureListeners['a.b'](event);
clickCaptureListeners['a.b.c'](event);
clickBubbleListeners['a.b.c'](event);
clickBubbleListeners['a.b'](event);
clickBubbleListeners['a'](event);
```

常规的事件绑定机制中，浏览器需要为每个事件和监听器创建一个新的事件对象，这意味着要进行大量的内存分配。而React在启动时就会创建一个事件对象，之后一直在重用这个事件对象，大大减少了垃圾收集

### Rendering

#### 批处理

推荐 [batch update](https://zhuanlan.zhihu.com/p/28532725)

**react批处理**

当你在一个组件中调用setState时，react会将这个组件标记为dirty，在这个event loop的末尾，react会检查所有的脏组件并重新渲染她们

批处理意味着
* 在事件循环期间，只有一次DOM被更新
* setState是异步操作

这个属性是优化应用性能的关键，但是使用原生的JavaScript实现是比较困难的。在React中，这是默认行为

在组件生命周期、render或事件handler中执行setState时，react会将待执行的函数使用框架代码包裹起来，在待执行函数运行前创建一个update queue，如果函数中的同步操作改变state，则更新的queue中，最后处理update queue

但是，在异步操作中，比如fetch或setTimeout的回调中改变了state，此时原有的上下文已经消失，找不到对应的queue，被迫同步更新

react中对于非自身事件(microTask、macroTask), batch update将无法生效，故setTimeOut中，setState N次；react 通过Transaction实现batchUpdate，不依赖语言特性的通用模式

[setState异步操作](https://juejin.im/post/6844903934079975438)

React实现的batching为了跨平台，避免使用web接口，是在同一个微任务内批量更新的，只有先执行了框架代码，才有机会在执行业务代码后继续执行框架代码，因此 setTimeout、Promise 等业务代码先运行的场景，React 无法批量更新，被迫同步更新

**vue批处理**

vue的react在此方面的实现机制不同

vue的方案是利用nextTick，当遇到状态修改时，当前的watcher会被推入update queue，并且在当前任务中提交一个新的微任务，用于flush当前的update queue。这样一来，当前 task 中的其他 watcher 会被推入同一个 update queue 中。当前的任务执行完毕后，microtask中的下一个task就会开始执行，update queue会被flush，并进行后续的更新操作

为了使flush操作更早的开始，vue会尝试将其放到microtask中，遇到不支持的情况才会考虑setTimeout

对比React和Vue的方案
* React的实现方式更为稳定可控，但缺点是无法完全覆盖所有的情况
* Vue的实现对语言特性、运行环境都有很强的依赖，但是可以更好的覆盖所有的情况，只要是在同一个task中的修改，都可以进行batch update优化

#### Sub-tree Rendering

调用setState后，组件会为其子组件生成vDOM。如果在根节点上调用setState，则整个React应用将会被重新进行render。所有的组件都会调用他们的render方法，即使其并没有发生更改。这个机制听起来很低效，但实际过程中并没有接触到实际的DOM，所以性能不会受到影响

原因：
* 屏幕显示的元素有限，都在客观里的范围内
* 很少会在根节点上调用setState，通常都是在接受事件的组件上调用，范围有限

#### 选择性的字数渲染

用户可以自定义阻止组件的update：shouldComponentUpdate

根据组件的上一个和下一个属性/状态，您可以告诉React此组件没有更改，并且不必重新呈现它。如果正确地实现，这可以给您带来巨大的性能改进。

### 总结

React应用的技术都不是新的技术
* 批量读写操作更快
* 事件委托性能更好
* 。。。

react将这些技术变为默认行为，使得用户可以很轻松编写出一个性能优异的应用

React的性能主要花费在setState上，每次setState都会重新呈现整个子树。如果想优化性能，就要尽可能少的调用setState，并使用`shouldComponentUpdate`避免重新呈现大型子树