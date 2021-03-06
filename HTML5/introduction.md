[HTML5](https://html.spec.whatwg.org/dev/)

# 简介

## WHATWG与W3C的纠葛

* W3C原来希望发展XML，Apple、Mozilla与Opera决定成立新的WHATWG发展HTML5
* W3C参与HTML5开发，二者共同更新HTML5
* W3C希望发布HTML5的完成版，WHATWG希望继续不断维护
* 之后W3C将WHATWG做的修复复制到自身的HTML5标准中

## 跨站点通信

* postMEssage
* iframe
* 使用具有服务器已知的唯一标识符的跨站点映像请求来启动服务器端数据交换
* 使用用户区分技术可以用于站点唯一的识别访问者，从而在服务器端交换信息

DOM树包含的节点：

* DocumentType节点
* Element节点
* Text节点
* Comment节点
* ProcessingInstructtion节点

**NOTE**

* 源码中多余的空间会被转化为TextDom文本节点
* head开始标签前的所有空白会被默认丢弃
* body结束标签之后的所有空白会被放置在结尾body

## 安全问题

* 用户输入验证
* XSS攻击：cross-site-scripting，跨站脚本攻击
* SQL注入

	用户输入验证与转义

* CSRF：cross-site-request-forgery，跨站请求伪造

	使用隐藏令牌机制或者检查所有请求上的origin头防止攻击

* 点击劫持

	诱拐用户，当用户即将点击鼠标时，将恶意站点的iframe放置在用户鼠标下

	解决办法：不期望在框架中使用的网站只在检测到它们不在框架中时才启用它们的接口

## HTML元素常见问题

* 事件绑定与触发时机

避免事件触发后才进行绑定事件处理程序

* [使用事件处理程序内容属性](https://html.spec.whatwg.org/dev/webappapis.html#event-handler-content-attributes)
* 在创建元素的同一脚本中添加事件处理程序，避免阻塞

