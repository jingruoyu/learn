# SEMANTICS, STRUCTURE, AND APIS OF HTML DOCUMENTS

## Document

* XML和HTML文档在UA中使用Document对象进行表示
* Document对象的URL在其创建时被初始化，但是在Document对象的生命周期内可以被更改
* 当使用JavaScript代码创建一个document对象时，该对象会同时准备进行post-load和页面加载
* document对象创建时，会生成`document.referrer`，类型是字符串，如果没有被设置，其将会是一个空字符串
* 每个document对象都有一个重载标志位，当调用`document.open(type, replace)`或者`document.write()`方法时，会对该标志位进行设置

	重载标志位被设置后，document对象会拥有一个重载缓冲区，用于reload时document的源地址

* 当UA进行重载时，将会给定一个source browser context，其执行操作如下

	1. 设置source的值为浏览器上下文中当前活动的document对象的重载缓冲区
	2. 设置address为浏览器上下文中活动document对象的URL
	3. 设置HTTPS状态为活动document对象的HTTPS状态
	4. 设置`Referrer-Policy`头为当前活动document对象的相应头部
	5. 设置`Content-Security-Policy`为当前活动对象的相应头部
	6. 将浏览器上下文导航到新的body响应中，其header即为已上设置的header内容，设置相应的标志位，源浏览器上下文开始重载流程。

		新建一个document对象，设置其重载标志位，将其重载缓冲区中的内容设置为浏览器上下文的源地址。当遇到任何异常情况时，抛出错误

		当在重载过程中更改document的address时，将会对原地址进行覆盖

### document对象

* HTTPS state，HTTPS状态值，默认为none，用于标志传输document数据信道的安全属性
* referrer policy，`Referrer-Policy`默认为空字符串，标志用户来源，[Referrer-Policy与CSF介绍](https://imququ.com/post/referrer-policy.html)
* CSP列表，内容安全策略，默认为空，用于检测并削弱某些特定类型的攻击
* feature policy
* module map

### 资源管理

* document.referrer
* document.cookie
* document.lastModified
* document.readyState