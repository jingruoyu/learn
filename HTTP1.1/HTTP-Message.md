## 4 HTTP Message

HTTP信息包含客户端向服务端的请求和服务端向客户端的响应，一般消息格式为

    generic-message = start-line
              *(message-header CRLF)
              CRLF
              [ message-body ]

* 起始行，也称状态行
* 0或多个HTTP头部
* 标志header结束的**回车换行**，即空行
* body信息

服务端在接收请求时，会忽略起始行中的空行

* HTTP/1.0 客户端会在POST请求后跟上一个额外的空行
* HTTP/1.1 客户端不能在请求之前或之后跟上额外的空行

### 4.2 消息头

包括
* 普通头
* 请求头
* 响应头
* 实体头：包含元信息

header字段可以扩展到多行，每个字段前要加上空格或者tab

	message-header = field-name ":" [ field-value ]
	field-name     = token
    field-value    = *( field-content | LWS )

`field-content`不包含其之前或之后的连续空格，在解释语义或转发消息流时连续空格会被替换为单个空格，连续空格不会改变语义

消息头的发送顺序并无特殊语义，但是最好是依照普通头 -> 请求头/响应头 -> 实体头的顺序

相同field-name的多个消息头字段应该被合并为一个，**将后续的字段值合并到第一个，使用逗号分隔**，不改变语义，此时组合后的字段值顺序不能被更改

### 4.3 消息正文

消息正文用于承担请求或响应的实体信息`entity-body`，当使用`Transfer-Encoding`时实体信息会被编码

	message-body = entity-body | <entity-body encoded as per Transfer-Encoding>

`Transfer-Encoding`属于消息的一项属性，在请求响应链中可以被添加或移除

请求和响应的消息正文存在不同

对于请求的消息正文：
* 通过请求头中包含`Content-Length` or `Transfer-Encoding`可以表明请求中消息正文的存在
* 部分请求方法不允许发送请求的消息正文
* 服务器应该可以读取和转发任何请求的消息正文
* 当请求方法没有为消息正文定义语义时，服务器处理请求时消息正文会被忽略（与第二条相对应）

对于响应的消息正文：
* 响应消息中是否包含消息体依赖于请求方法和响应状态码
* HEAD请求的响应不能包含消息正文，即使存在对应的实体头
* 1xx消息、204不改变当前页面、304缓存可用都不允许包含消息正文
* 其他的所有响应都会包含消息正文，即使长度为0

### 4.4 消息长度

**消息的传输长度是指消息正文经过传输编码后的长度**

当消息正文位于一个消息中其传输长度按照以下规则决定（规则顺序具有优先级）：
1. 当响应被规定不能包含消息正文，无论其消息头中字段如何定义，响应会在消息头之后的第一个空行处结束
2. 当消息头中的`Transfer-Encoding`被指定为除`identity`之外的其他值时，传输长度取决于当前传输编码的分块，除非连接被关闭

	所有的HTTP/1.1发送实体信息时必须使用分块传输编码，故其消息长度不能够被提前给出

3. 当消息头中的`Content-Length`被指定，其十进制形式同时表示实体信息长度和传输长度。当这两个值不同，`Content-Length`不会被发送，如使用了`Transfer-Encoding`

	如果接收方收到的消息头中同时包含`Transfer-Encoding`和`Content-Length`，后者必须被忽略

	消息中不能同时包含`Content-Length`头与非`identity`的`Transfer-Encoding`头，如果包含，前者将被忽略

4. 如果消息使用媒体类型`multipart / byteranges`，并且未另外指定`ransfer-length`，则此自我限制媒体类型定义传输长度。除非发件人知道收件人可以处理，否则不能使用此媒体类型

5. 通过服务器关闭连接决定。关闭连接不能用于表明请求正文的结束，因为在此情况下服务器将无法返回响应

**兼容性**
* 为了兼容HTTP/1.0，除非明确知道服务端兼容HTTP/1.1，否则当请求中包含请求正文时，请求头中必须包含有效地`Content-Length`字段
* 当请求中包含请求正文，但是未给出`Content-Length`，如果苏无端无法判断消息的长度，服务端应该返回400(bad request)或411(length required)

**`Content-Length`的取值必须与消息正文相匹配**，如果UA检测到一个无效长度时必须通知用户

### 4.5 普通头信息

有一些头字段对请求和响应消息具有普遍适用性，但**仅适用于正在传输的消息，不适用于实体。**

* Cache-Control
* Connection
* Date
* Pragma
* Trailer
* Transfer-Encoding
* Upgrade
* Via
* Warning

普通头字段可以随着版本号进行扩展。但是新的或实验中的字段如果不能被识别为普通头字段，将被当做实体头字段处理

## 5 Request请求

客户端向服务端的请求信息，应该包括请求行、请求方法、资源URI与协议版本

    Request = Request-Line
              *(( general-header
                | request-header
                | entity-header ) CRLF)
              CRLF
              [ message-body ]


### 5.1 请求行

    Request-Line   = Method SP Request-URI SP HTTP-Version CRLF

#### 5.1.1 请求方法