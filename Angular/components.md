## Components

### overview

每个 component 包含如下部分

- 一个 HTML template，用于声明渲染内容
    * templateUrl：模板定义为外部文件
    * template：在component中定义template。template中需要换行时使用反引号包裹
- 一个 TypeScript class，用于定义行为
- 一个 CSS 选择器，定义 component 在模板中的使用方式
- (optional)应用在 component 上的 CSS 样式
    * styleUrls：引用外部文件，Array
    * styles：组件内部声明样式，接受一个包含CSS规则的字符串数组

Component 语法：

```
@Component({
  selector: 'app-component-overview',
  templateUrl: './component-overview.component.html',
  styleUrls: ['./component-overview.component.css']
})
```

### lifeCycle

![angular lifecycle](https://v2.angular.io/resources/images/devguide/lifecycle-hooks/hooks-in-sequence.png)

![Angular life-cycle sequence between parents and child components](https://www.intertech.com/angular-component-lifecycle/)

#### `ngOnInit`

init函数中执行初始化任务

* 在构造函数外部执行复杂的初始化。构造函数本身应该保持简单的逻辑，如不应该在构造函数中获取数据，避免在create组件或显示它之前请求数据
* 在init函数中初始化angular指令

#### `ngOnDestroy`

destroy中执行清理逻辑，释放相关资源，防止内存泄漏

* 取消订阅可观察对象和DOM事件
* 停止interval计时器
* 注销指令在全局中注册过的所有回调

### `AfterView`

`AfterView`包含`AfterViewInit`与`AfterViewChecked`，其根据视图的每一次数据变更采取石洞

在其中可以使用`@ViewChild`装饰器属性访问子视图

`AfterView hooks`的调用时机为Angular做完组件及其子组件的变更检测，故**此时需要确保hooks内的callback不会更改视图上的数据**，否则将会无法正常渲染

如果需要修改数据，就必须等待本轮渲染结束再进行更改，使用nextTick等方法

### `AfterContent`

Transclusion：内容投影，从组件外部导入HTML内容，并把它插入在component template指定位置的一种途径。内容投影的使用形式

* 元素标签内部使用HTML
* 组件模板中使用`ng-content`标签

    `ng-content`是外来内容的占位符，用于指定外部内容的插入位置

在AfterContent中需要使用`@ContentChild`装饰器访问子级内容

AfterContent与AfterView的不同

* AfterView更关心`viewChildren`，子组件的元素标签会**出现**在该组件的模板中
* AfterContent更关心`viewContent`，子组件会被Angular**投影**进该组件

Angular在AfterContent hooks与AfterView hooks之间，会有个小的时间窗口，允许修改host view。故可以在AfterContent hooks中修改数据

### `DoCheck`

