# Hypertext Transfer Protocol -- HTTP/1.1

[HTTP/1.1](https://tools.ietf.org/html/rfc2616#section-5.1.1)

HTTP是应用层协议，分布式协作

## 标准目的

* HTTP协议第一个版本是HTTP/0.9
* HTTP/1.0进行改进，允许消息采用类似MIME的格式，包含有关传输数据的元信息和对请求或响应语义上的修饰。

	但是HTTP/1.0未充分考虑分层代理、缓存、长连接和虚拟主机等方面的需求

* HTTP/1.1拥有更严格的要求，用于保证功能的可靠实施

	HTTP需要更多的功能项已完成`search`、`front-end update`与注释等功能，故采用了**开放式方法和头部**对请求进行描述。HTTP协议建立在URI基础上，其数据传输格式由MIME进行定义

HTTP同时也被用作UA和代理或网关到其他网络系统之间的通用通信协议，如SMTP、FTP、NNTP等。通过这种方式，HTTP允许基本的超媒体访问各种应用程序提供的资源

["MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT","SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL"等名词说明](https://tools.ietf.org/html/rfc2119)
* 无条件遵从：满足所有MUST或REQUIRED级别和所有SHOULD级别要求
* 有条件遵从：满足所有MUST或REQUIRED级别，但不满足所有SHOULD级别要求

## 整体运行

HTTP协议是关于请求与响应的协议。

客户端向服务端发送一个请求，报文中包含
* 请求方法、URI、HTTP协议版本号
* 紧接着是类似于MIME信息的请求描述信息，客户端信息
* 最后可能会有body内容

客户端响应中包含
* 状态栏，包含协议版本号与响应状态码
* 紧接着是类似于MIME信息的服务端描述信息，元信息
* 最后可能会有body内容

UA向`Origin Server`请求并得到响应过程中，整个请求响应链可能会有多个中介响应或请求，其中可能会存在代理、网关或隧道。**缓存**可以起到缩短请求响应链的作用，HTTP中可以使用描述符对缓存进行特殊要求。

HTTP/1.1的目标是支持已部署的各种配置，同时引入协议构造，以满足构建需要高可靠性的Web应用程序的需求，并且当失败时，至少有可靠的失败提示

HTTP一般建立在TCP/IP的基础上，但是也可以使用以太网的其他协议，或者其他数据链路。

HTTP依赖于可靠的数据通信，故可以提供可靠数据通信的协议都可以使用HTTP。

* `HTTP/1.0`中大部分情况需要为每个请求或相应新建一个连接
* `HTTP/1.1`中一个连接可以被用于一个或多个请求或响应的数据交换

## 符号惯例

* `"literal"`：文字被双引号包围，无特殊说明大小写不敏感
* `<n>*<m>rule`：最少n个最多m个，当n为0或m为正无穷时可省略
* `(rule)`：括号中元素被当做一个简单元素
* `[rule]`：`[foo bar]`等价于`*1(foo bar)`

## 基础规则

* CR：carriage return，回车
* LF：linefeed，换行
* SP：space，空格
* HT：horizontal-tab，横向tab
* CTL：control character and DEL，控制字符和DEL
* LWS：linear white space，连续空格