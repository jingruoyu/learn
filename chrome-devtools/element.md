## 元素面板

### 查看元素

* 查看和修改DOM树

	被选中的元素在DOM树中蓝色突出显示

	选中元素的几种方法：

	* 在元素上邮件选择检查
	* 在devtools中点击元素选择器选择鼠标选择视野内的元素
	* 在devtools中的DOM树中选择元素
	* 在console中筛选出元素，在结果上右键选择**Reveal in Elements panel**

* 查看和修改元素属性

	各个不同的tab中展示不同的元素属性
	* style（展示适用于元素的所有属性，包括被覆盖的属性、盒模型）
		- filter筛选相关属性、取值
		- filter后`:hov`按钮可以设置元素当前伪类
		- filter后`.cls`按钮可以为当前元素增加类名

		**调整属性值时，方向键调整步长为1，`alt`+方向键步长0.1，`shift`+方向键步长为10，`control+shift`+方向键步长为100**

	* Computed（最终适用于元素的属性、盒模型）
		默认只显示被设置的属性，可选择显示全部css属性
	* Event Listener（元素上绑定的事件监听器）
	* DOM断点
	* 属性

	为元素增加、删除或修改某些属性
	* 使用内联样式修改元素样式
	* 向特定的样式表中增加元素样式

		element面板style面板中长按`+`，可以选择向某一个样式表中增加新样式

	* 在特定的位置增加元素样式

		点击element面板style面板中某一条css规则右下角更多工具栏的加号，会在该条规则后增加新规则，新规则与旧规则在同一个样式表中

	* chrome颜色面板

		chrome中可以为元素的相关属性设置颜色值，颜色值前面的小方块可以预览颜色，点击小方块后，可以在颜色面板中进行调色等操作，其中包含取色笔。

### accessibility面板

accessibility面板用于展现与元素可访问性相关的属性，页面可访问性包括能否通过键盘或屏幕阅读器访问与页面元素是否使用正确

选中元素后，在其accessibility面板中，其可看到相关信息

* accessibility tree：DOM树的子集，其中仅包含在屏幕阅读器中会用到的元素
* ARIA属性：为正确表示页面内容屏幕阅读器所需的所有信息
* computed properties：部分元素属性是被动态计算得到的，显示在该栏中

部分视障人士对低对比度图案不敏感，元素在颜色面板中的`Contrast Ratio`如果是一个对号，则代表满足最低可访问性要求，两个对号表明满足增强的要求

### command menu

使用`Command+Shift+P (Mac)`or`Control+Shift+P (Windows, Linux, Chrome OS)`可以打开devtools的command面板，或者点击顶部右侧或下面console栏左侧的更多可以打开该面板

* rendering
	- paint flashing：高亮页面中需要重绘的区域
	- layer borders：展示页面的图层边界
	- FPS meter：展示屏幕的FPS，GPU内存占用与GPU加速情况
	- scrolling performance issues：高亮会减慢页面滚动的元素，包括触摸和滚轮事件处理程序以及其他主线程滚动事件的处理
		事件委托的使用会减小内存的占用，但是当chrome判断当前元素没有进行事件绑定时，在滚动等事件发生时绘制会更加流畅。而在过高层级的元素上绑定scroll，会与这种机制相矛盾
	- emulate CSS media：选择CSS媒体，打印机或者屏幕
* coverage

	**分析页面引入的js与css中使用和未使用的代码比例，选择每一个文件，可以看到其中使用与未使用到的代码**

* request blocking

	阻塞包含特定关键字的请求
