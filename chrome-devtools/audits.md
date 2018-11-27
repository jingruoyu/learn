## audits

audits 栏用于全面衡量页面性能

### 配置项

* device
	+ mobile：UA将会模拟一个移动端视口
	+ desktop：将会禁用移动端的设置

* audits

	此选项内可以选择希望在报告中统计的内容，禁用某些类别将会在报告中删除它们，禁用后将会稍微加快页面统计过程

	+ performance：页面重新加载过程中的运行状况
	+ progressive web app
	+ best practice
	+ accessibility:页面的可访问性
		页面可访问性包括能否通过键盘或屏幕阅读器访问与页面元素是否使用正确，此处主要针对第二项
	+ SEO 

* throttling

	+ `Simulated Fast 3G, 4x CPU Slowdown`：模拟移动端设备在3g，4倍CPU下的表现，不会真正节流，只是推断页面在移动条件下加载所需的时间
	+ `Applied Fast 3G, 4x CPU Slowdown`：会真正限制CPU核网络，导致更长的页面统计过程

### 页面统计结果

* error：如果统计结果中有error，请在一个空的window中重新打开页面进行统计，避免其他页面的干扰
* performance得分：页面的整体评估分数，得分越高，表现越好
* Metrics：此部分指标提供定量评估页面性能的数据
* opportunities：在页面加载过程中可以优化的部分
* Diagnostics：提供与页面加载时间相关的数据
* Passed Audits：页面性能评估中合格的部分

### 优化项

本例中所举出的优化项包括

* 压缩静态文件
* 设置多级图片大小，选择合适的图片
* 页面首次加载时只运行核心的CSS与JavaScript代码，其他内容懒加载

	- 使用coverage可以查看页面加载时js代码的执行情况，然后设置异步加载defer
	- 如果使用框架，可以利用框架中的工具，如webpack的[tree shaking](https://webpack.js.org/guides/tree-shaking/)进行代码简化

* 减轻主线程的工作

	通过performance可以看到主线程的运行