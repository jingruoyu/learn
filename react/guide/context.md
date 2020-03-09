### Context

Context提供了一个无需为每层组件手动添加props，就能在组件之间进行数据传输的方法，但是也使得组件复用性变差

使用Context的场景：共享全局数据

### 避免使用context

context使得组件复用性变差，应谨慎使用。

**层层传递属性的一个替代方案是层层传递组件。**

如果属性最终只是在底层的某个组件中使用，则可将该组件提升到顶层组件中，然后将组件传递下去

* 优点：控制反转，减少应用中传递的props数量，增强根组件把控度
* 缺点：强行提升底层组件，根组件会变得更复杂，且使用范围有限

context适用于在组件树的不同层级中需要访问同样一批数据，此时可以context将这些数据对所有组件进行广播，且后续的数据更新也能访问到

### API

* React.createContext
* Context.Provider
    Provider的value值变化时，内部所有消费组件都会被重新渲染，不会受制于`shouldComponentUpdate`函数
* Class.contextType
    * 可以使用`this.context`来消费最近`Context`上的那个值，可以再任何生命周期中访问，包括render函数
    * 通过public class filed，可以使用static初始化context
* Context.Consumer
    * 为内部的子元素订阅context变更
    * 子元素需要为函数，参数为上一个provider提供的value或其defaultValue
* Context.displayName
    设置在devtools中显示的context的内容