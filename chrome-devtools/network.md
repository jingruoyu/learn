## network

用于展示页面请求资源情况

### 工具使用

[工具使用文档](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference)

底栏统计了请求数、下载资源大小、总耗时、DOMContentLoaded事件用时与load事件用时

network宽行高下每行size属性有两个值，上面的值是下载的资源大小，下面的值是解压后的资源大小，由此可以判断文件是否进行了压缩。

也可以通过http响应头中的`content-encoding`字段进行判断，如果资源经过压缩，此字段一般为`gzip`、`deflate`或者`br`

### 常见问题

* 过多请求排队

	原因在于HTTP/1.0和HTTP/1.1下，chrome在每个host下最多只允许同时建立6个TCP连接

	解决方法可以有：
	+ 必须使用HTTP/1.0和HTTP/1.1时，可以对域名进行分片
	+ 使用HTTP/2
	+ 将不必要的请求移除或者延后，以保障重要的请求可以较早发出

* 接受第一字节时间过长（wait时间过长）

	TTFB：Time To First Byte，原因可能是服务端相应过慢或客户端与服务端之间的连接太慢

	解决办法：
	+ 如果是连接太慢，可以使用CDN或者改变服务提供者
	+ 如果是服务器太慢，考虑优化服务器

* 内容下载过慢

	原因可能是连接不稳定或者需要下载的内容过大

	解决办法为使用CDN或者压缩接收的内容