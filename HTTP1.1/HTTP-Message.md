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
* 响应消息中是否包含消息正文依赖于请求方法和响应状态码
* HEAD请求的响应不能包含消息正文，即使存在对应的实体头
* 1xx消息、204不改变当前页面、304缓存可用都不允许包含消息正文
* 其他的所有响应都会包含消息正文，即使长度为0

### 4.4 消息长度

**消息的传输长度是指消息正文经过传输编码后的长度**

当消息正文位于一个消息中，其传输长度按照以下规则决定（规则顺序具有优先级）：
1. 当响应被规定不能包含消息正文，无论其消息头中字段如何定义，响应会在消息头之后的第一个空行处结束
2. 当消息头中的`Transfer-Encoding`被指定为除`identity`之外的其他值时，传输长度取决于当前传输编码的分块，除非连接被关闭

    所有的HTTP/1.1发送实体信息时必须使用分块传输编码，故其消息长度不能够被提前给出

3. 当消息头中的`Content-Length`被指定，其十进制形式同时表示实体信息长度和传输长度。当这两个值不同，`Content-Length`不会被发送，如使用了`Transfer-Encoding`

    如果接收方收到的消息头中同时包含`Transfer-Encoding`和`Content-Length`，后者必须被忽略

    消息中不能同时包含`Content-Length`头与非`identity`的`Transfer-Encoding`头，如果包含，前者将被忽略

4. 如果消息使用媒体类型`multipart / byteranges`，并且未另外指定`Transfer-length`，则此自我限制媒体类型定义传输长度。除非发件人知道收件人可以处理，否则不能使用此媒体类型

5. 通过服务器关闭连接决定。关闭连接不能用于表明请求正文的结束，因为在此情况下服务器将无法返回响应

**兼容性**
* 为了兼容HTTP/1.0，除非明确知道服务端兼容HTTP/1.1，否则当请求中包含请求正文时，请求头中必须包含有效地`Content-Length`字段
* 当请求中包含请求正文，但是未给出`Content-Length`，如果服务端无法判断消息的长度，服务端应该返回400(`bad request`)或411(`length required`)

**`Content-Length`的取值必须与消息正文相匹配**，如果UA检测到一个无效长度时必须通知用户

### 4.5 普通头信息

有一些头字段对请求和响应消息具有普遍适用性，但**仅适用于正在传输的消息，不适用于实体**。

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

* OPTIONS：预检请求
* GET
* HEAD：类似于GET，但服务器不返回消息体，相应头中的元信息。常用于获取请求的元信息
* POST
* PUT
* DELETE
* TRACE
* CONNECT
* 其他扩展方法

[各请求方法介绍](https://itbilu.com/other/relate/EkwKysXIl.html)

请求方法使用

* 可以在`ALLOW`头中列举出本资源可以使用的请求方法
* 当使用远程服务器已知但是不允许的方法请求资源时，服务器应该返回405`Method Not Allowed`
* 当使用远程服务器不能识别的方式请求资源，服务器应该返回501`Not Implemented`
* 所有的多用途服务器都必须支持GET与HEAD方法，其他方法为可选项，如果使用必须按照标准进行实现

#### 5.1.2 Request-URI

**注意请求URI与http_URL的不同**

    Request-URI    = "*" | absoluteURI | abs_path | authority

请求URI的取值取决于请求的性质

* `*`：请求并不依赖于特定的资源，只是针对服务端的请求，该URI只能在请求方法不一定针对资源时使用，如

        OPTIONS * HTTP/1.1

    预检请求在跨域时用于判断服务器是否接受当前域名下的请求方法

* 绝对路径URI：一个请求链中可能经过网络代理，网络代理会根据请求的绝对路径对请求进行转发。为了避免请求循环，代理必须能够识别其所有服务器名称，包括任何别名，本地变体和数字IP地址

    所有使用HTTP/1.1的服务器都必须支持绝对路径

* authority：仅用于CONNECT请求

* 绝对路径：绝对路径可以作为`Request-URI`，但**同时需要在请求头中包含Host域名**

    此时绝对路径不能为空，如果未指定，则应该置为`\`

如果`Request-URI`使用十六进制编码，则服务端必须进行解码以获取正确的请求。服务器针对错误的请求URI应该返回对应的相应值

**禁止重写规则**：网关代理在转发请求时严禁重写`Request-URI`中的绝对路径，使用`\`代替空的绝对路径除外

禁止重写规则旨在当远程服务器错误地将非保留URI用于保留目的时，阻止代理更改请求的含义。但是一些HTTP/1.1之前的代理仍会更改请求URI

### 5.2 请求的资源

请求的资源由`Request-URI`和`Host`头共同决定

对HTTP/1.1请求

* 如果源服务器不允许根据请求host的不同返回不同资源时，其可以忽略请求头中Host头

* 如果源服务器需要根据请求host（有时也被称为虚拟host）的不同返回不同资源，其必须基于以下规则：

    1. 如果请求URI使用绝对路径URI，此时Host已经是请求URI中的一部分，请求的任何host头取值都必须被忽略
    2. 如果非绝对路径URI，同时请求头中包含Host头，则其取值将会决定请求host
    3. 如果前两条规则获取的host是无效值，服务端将会返回400`Bad Request`错误信息

`HTTP/1.1`请求的接收方缺失`Host`头时会尝试采用启发式的方法以便确定请求的资源，如根据URI路径寻找特定的host

### 5.3 请求头字段

请求头允许客户端向服务端传输请求与客户端的额外信息，作为一些语义化的参数

* `Accept`
* `Accept-Charset`
* `Accept-Encoding`
* `Accept-Language`
* `Authorization`
* `Expect`
* `From`
* `Host`
* `If-Match`
* `If-Modified-Since`
* `If-None-Match`
* `If-Range`
* `If-Unmodified-Since`
* `Max-Forwards`：最大可转发次数
* `Proxy-Authorization`
* `Range`
* `Referer`
* `TE`
* `User-Agent`

请求头的name只有在协议升级时才能被可靠地扩展，但如果通信中的各部分均能识别一些新的或者实验性的请求头字段，也可以进行对应扩展。不能识别的头字段将被当做实体头对待

## 6 响应

接收和解析请求信息之后，服务器将会返回一个HTTP响应信息

    Response      = Status-Line
                    *(( general-header
                     | response-header
                     | entity-header ) CRLF)
                    CRLF
                    [ message-body ]

### 6.1 状态行

响应信息的第一行为状态行，包括HTTP版本、状态码与描述文本，使用空格相连，最后为回车换行

    Status-Line = HTTP-Version SP Status-Code SP Reason-Phrase CRLF

#### 6.1.1 状态码与描述短语

状态码为三位整数，描述短语用于给状态码一个简短的描述

状态码是机器可读的，原因短语是人可读的，状态码的描述短语可能会被替换，客户端并不需要检测或展示原因短语

状态码的第一位代表响应的分类
* 1xx：信息响应，请求收到，客户端继续发送请求
* 2xx：成功响应，请求成功接收与解析
* 3xx：重定向，需要采取进一步操作以完成请求
* 4xx：客户端错误，请求包含错误的语法或无法实现
* 5xx：服务端错误，服务端无法处理一个有效请求

HTTP的状态码是可扩展的，HTTP应用并不需要理解所有的状态码，但是其必须能够明根据状态码的第一位进行分类，任何不识别的状态码等价于`X00`，同时此响应不能被缓存。在这种情况下，UA应当向用户呈现随响应返回的实体，其中可能会包含解析该异常的信息

### 6.2 响应头

服务端可以在响应头中传输不能在状态行中传递的额外信息，这些头字段提供关于服务端与进一步访问`Request-URI`所需的信息

* `Accept-Ranges`
* `Age`
* `ETag`：对应请求头中的`If-None-Match`
* `Location`
* `Proxy-Authenticate`
* `Retry-After`
* `Server`
* `Vary`
* `WWW-Authenticate`

扩展规则与请求头相同

## 7 实体

请求和响应消息如果没有请求方法或响应状态代码的限制，可以传递**实体消息**。**实体消息包括实体头字段与实体正文**，有时部分响应会仅包含实体头

实体消息在请求和响应中均可以发送，其发送方和接收方不固定

### 7.1 实体头字段

实体头字段定义实体正文的元信息，当没有实体正文时，其定义所请求资源的元信息

这些元信息中部分是可选的，另一部分是必须的

    entity-header  = Allow
                   | Content-Encoding
                   | Content-Language
                   | Content-Length
                   | Content-Location
                   | Content-MD5
                   | Content-Range
                   | Content-Type
                   | Expires
                   | Last-Modified
                   | extension-header

    extension-header = message-header

扩展头机制允许在不改变协议的情况下增加额外的实体头字段，但是接收方可能不识别这些字段。接收方应该忽略其不能识别的字段，传输代理应该对这些字段透明转发。

### 7.2 实体正文

实体正文伴随着HTTP请求或响应发出，其格式与编码方式在实体头字段中定义，最终采用二进制形式传输

仅当信息中出现消息正文时，实体正文才会出现，如同4.3节所讲。为确保安全和正确的传输消息，从消息正文中通过解码获取实体正文

#### 7.2.1 数据类型

当消息中包含实体正文时，消息头字段中的`Content-Type`和`Content-Encoding`决定了其中的数据类型，其内容模型如下：

    entity-body := Content-Encoding( Content-Type( data ) )

* `Content-Type`特指实体正文数据的媒体类型
* `Content-Encoding`指应用于数据的附加内容编码，通常用于数据压缩。没有默认的编码方式

HTTP/1.1消息中，任何包含实体正文的消息，都应该包含`Content-Type`头字段用于指定正文中的媒体类型。当且仅当`Content-Type`未给定时，接收方会尝试通过检查其内容或资源URI扩展名来识别资源，如果媒体类型依然未知，该资源将会被当做`application/octet-stream`类型对待

#### 7.2.2 实体长度

**消息的实体长度即为传输编码前消息正文的长度**

消息正文的传输长度在4.4节给出