## performance

展现页面在运行时的性能，找出其中耗时较长的部分进行优化

[performance事件参考](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/performance-reference)

### 工具使用

#### 概览

* FPS线：绿色越深，FPS越高，当看到一条红线FPS过低甚至损害用户体验
* CPU栏：CPU栏火焰图颜色与底部summary统计栏中颜色相对应。当CPU栏被占满时，应该寻找方法减少CPU工作量

	在火焰图上看到一到三条垂直的虚线，蓝线代表`DOMContentLoaded`事件，绿线代表首次绘制的时间，红线代表`load`事件
	+ DOMContentLoaded：当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完成加载。但是同步的JavaScript会暂停DOM的解析，而且`DOMContentLoaded`必须等待其所属的script之前的样式表加载解析完成才会触发
	* load：浏览器已经加载了所有的资源，包括样式表、图像与子框架等

#### 堆栈栏

* frame栏：鼠标悬停在frame栏顶部浅绿色区域，会展现当前帧的展现时间与当时的FPS，点击后在summary中查看更多
* network栏：查看网络请求瀑布流，点击每个请求后在summary中查看更多

	不同请求会用颜色作为区分，HTML蓝色，CSS紫色，JS黄色，图片绿色。高优先级请求左上角有深蓝色块，低优先级请求左上角为浅蓝色块，如下图所示

	[network](../img/performance-network.png)

	* 请求前面的细线代表`Connection start`事件组的所有内容，即为`Request Sent`前的所有内容
	* 请求的浅色部分代表`Request Sent`和`Waiting (TTFB)`
	* 请求的深色区域代表`Content Download`
	* 请求后面的细线代表等待主线程所花费的事件，这部分在network面板中没有反映出来

* main栏：展示主线程的活动。x轴代表时间，每一个bar都代表一个事件，y轴代表回调栈，上层的事件调用了下层的事件

	当在事件的右上角看到红色的三角标时，表明当前事件可能存在问题，在summary栏会显示更详细的提示

	紫色代表渲染活动，深黄色代表脚本活动，同一个脚本所使用的颜色是相同的

	按住shift，可以使用鼠标在main面板中选择一个精确的时间区域，并且底部会显示选中的时间长度

#### 底部综合栏

* summary tab：展示事件详细信息
* call tree tab：查看当前时间区域内工作量最大的`root activities`
	`root activities`位于每个事件回调栈的底层，在火焰图的最上面，是最高等级的事件

	+ self time：执行事件自身所花费的时间
	+ total time：该事件及其所调用的子事件全部花费的时间

* Bottom-Up tab：查看当前时间区域内花费时间最多的活动，相同的活动时间可累加
	+ self time：直接在活动自身中花费的时间总和
	+ total time：该活动及其子活动花费的时间总和
* Event log tab：按照录制过程的顺序查看活动
* setting

可以在performance中使用`Ctrl + F`搜索目标词，会在火焰图中进行查找

### 代码建议

* 不要编写会强制浏览器重新计算布局的 JavaScript。将读取和写入功能分开，并首先执行读取，避免布局抖动
* 不要使您的 CSS 过于复杂。减少使用 CSS 并保持 CSS 选择器简洁
* 尽可能地避免布局。选择根本不会触发布局的 CSS
* 绘制比任何其他渲染活动花费的时间都要多。请留意绘制瓶颈

## JavaScript profiler

`JavaScript profiler`可以提供JavaScript的CPU分析

### 工具使用

#### 视图模式

* chart：火焰图，直观表示一段时间CPU分析

	火焰图的高度与调用堆栈的深度相对应，颜色随机，但是函数的颜色在调用过程中始终保持一致

	高调用堆栈不一定很重要，只是表示调用了大量的函数。 但宽条表示调用需要很长时间完成。 这些需要优化

* Heavy (Bottom Up)：按照函数对性能的影响列出函数，让您可以检查函数的调用路径
* Tree (Top Down)：显示调用结构的总体状况，从调用堆栈的顶端开始