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

#### document.referrer

返回将用户导航至当前页面document的链接。如果它被隐藏或者没有相应的文档，将会返回空字符串

noreferrer类型链接可以用于阻断页面之间的引用

#### document.cookie

返回当前页面的http cookie。如果当前页面没有cookie或者cookie不能被当前的源获取，将会返回空字符串

cookie可以被设置 ，可以为页面增加新的cookie

如果对目标内容进行了sandboxed设置，例如对iframe设置sandbox属性，则其在获取或设置cookie时将会抛出安全性错误

#### document.lastModified

返回document的lastModified时间戳，如果此属性未知，则返回当前时间

#### document.readyState

返回文档的加载状态，取值为以下三种

* loading：加载，document正在加载
* interactive：互动，文档已经加载完成并且被解析，但是如图像、样式表、iframe之类的子资源仍在加载中
* complete：完成，文档和所有的子资源已经完成加载。load事件即将被触发

其他事件的触发：

* 当次状态值发生改变时，`onreadystatechange`事件将会被触发
* `DOMContentLoaded`事件将会在readyState变为interactive之后但是出于complete之前触发，事件触发时，除了异步加载的脚本之外，所有的子资源全部加载完毕

### 访问DOM树

document对象html元素即为[document elment](https://dom.spec.whatwg.org/#document-element)，其他情况将会返回null

#### document.head

返回head元素，head元素即为html元素的子元素中第一个head元素，如果存在的话将返回此元素，否则返回null

#### document.title

可读可写，返回当前文档的title，title值由HTML的title元素和SVG的SVG title元素给出

设置此值时，将会更新文档的title内容。如果当时没有合适的元素进行更新，将会忽略新的值

与head元素类似，title元素是DOM树中的第一个title元素，如果没有的话将会返回null

#### document.body

可读可写，返回当前文档的body元素。

可以进行设置，替换掉原来的body元素。当新设置的值不是一个body元素或者frameset元素（此元素已被废弃可以忽略）是，将会抛错

body元素是文档中的第一个body元素或者frameset元素，如果没有的话将会返回null

#### document.images

返回一个HTMLCollection，其中包含document中的图片元素

#### document.embeds,document.pluguns

返回一个HTMLCollection，其中包含document中的embed元素

#### document.links

返回一个HTMLCollection，其中包含document中包含链接属性的元素，如a标签和area

#### document.forms

form元素集合

#### document.scripts

script元素集合

#### collection = document.getElementsByName(name)

#### document.currentScript

返回当前正在被执行的script元素或者SVG script元素。如果当前有`reentrant script`正在被执行，则会返回最开始执行且尚未执行完的脚本

如果当前执行的代码是位于一个回调函数或者异步执行的，则该属性会返回null

## elements

### 定义

HTML标准中为元素、属性和属性值定义了其对应的语义，而不是专门的表现形式。其表现形式可能会根据设备或者设置的不同而变化

### Elements in the DOM

元素表示DOM中的HTML元素节点实现并具有对应的相应属性。

元素可以被显式或者隐式的被引用。页面内部的跳转可以通过链接对id进行引用的形式进行

	<a href="#target-point">target point</a>

**所有HTML元素的基本接口都继承自HTMLElement对象**

### 元素定义

元素定义包含以下内容

* 元素类别
* 元素使用场景
* 内容模型：必须包含哪些内容作为元素的子元素和后代的规范性描述
* 元素使用语法
* 内容属性：可以在元素上指定的属性
* DOM接口：元素必须实现的DOM接口

#### 属性值

除特殊声明外，元素属性值是一个字符串，可以为任意字符串值，包括空字符串，并且对此类属性值中可指定的文本没有限制

### 内容模型



