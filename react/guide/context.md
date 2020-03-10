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

    defaultValue用于组件所处的树向上没有匹配到provider，如下例中的ThemedButton

    <Page>
        <ThemeContext.Provider value={this.state.theme}>
            <Toolbar changeTheme={this.toggleTheme} />
        </ThemeContext.Provider>
        <Section>
            <ThemedButton />
        </Section>
    </Page>

* Class.contextType
    * 可以使用`this.context`来消费最近`Context`上的那个值，可以再任何生命周期中访问，包括render函数
    * 通过public class filed，可以使用static初始化context
* Context.Consumer
    * 为内部的子元素订阅context变更
    * 子元素需要为函数，参数为上一个provider提供的value或其defaultValue
* Context.displayName
    设置在devtools中显示的context的内容

### 动态context

context的值是在provider中指定的，改变也只能在provider中改变，或使用provider提供的函数改变

* 直接将callback传递给子组件
* 通过context传递callback

但是callback都必须在于provider同级的地方定义

### 消费多个context

消费单个context可以为class指定contextType，从而重定义其context属性

消费多个context需要使用`Context.Consumer` API，使用函数组件，层层嵌套

### 注意事项

不要对Provider的value直接指定一个对象字面量，会导致每次重新渲染时Provider都会被赋值为新的对象，建议使用变量进行赋值