# Hypertext Transfer Protocol -- HTTP/1.1

HTTP是应用层协议，分布式协作

* HTTP协议第一个版本是HTTP/0.9
* HTTP/1.0进行改进，允许消息采用类似MIME的格式，包含有关传输数据的元信息和对请求或响应语义上的修饰。

	但是HTTP/1.0未充分考虑分层代理、缓存、长连接和虚拟主机等方面的需求

* HTTP/1.1拥有更严格的要求，用于保证功能的可靠实施

	HTTP需要更多的功能项已完成`search`、`front-end update`与注释等功能，故采用了**开放式方法和头部**对请求进行描述。HTTP协议建立在URI基础上，其数据传输格式由MIME进行定义

HTTP同时也被用作UA和代理或网关到其他网络系统之间的通用通信协议，如SMTP、FTP、NNTP等。通过这种方式，HTTP允许基本的超媒体访问各种应用程序提供的资源

["MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT","SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL"等名词说明](https://tools.ietf.org/html/rfc2119)
* 无条件遵从：满足所有MUST或REQUIRED级别和所有SHOULD级别要求
* 有条件遵从：满足所有MUST或REQUIRED级别，但不满足所有SHOULD级别要求