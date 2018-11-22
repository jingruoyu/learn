## audits

audits 栏用于全面衡量页面性能

### 配置项

* device
	+ mobile：UA将会模拟一个移动端视口
	+ desktop：将会禁用移动端的设置

* audits

	此选项内可以选择希望在报告中统计的内容，禁用某些类别将会在报告中删除它们，禁用后将会稍微加快页面统计过程

* throttling

	+ `Simulated Fast 3G, 4x CPU Slowdown`：模拟移动端设备在3g，4倍CPU下的表现，不会真正节流，只是推断页面在移动条件下加载所需的时间
	+ `Applied Fast 3G, 4x CPU Slowdown`：会真正限制CPU核网络，导致更长的页面统计过程