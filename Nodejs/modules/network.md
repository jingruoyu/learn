# 网络操作

Nodejs本来用途是实现高性能的web服务器，前端可以学习HTTP协议、Socket协议

## http模块

* 服务端使用：创建一个HTTP服务器，监听HTTP客户端请求并返回响应

    ```javascript
    http.createServer(function (request, response) {
        var body = [];

        console.log(request.method);
        console.log(request.headers);

        request.on('data', function (chunk) {
            body.push(chunk);
        });

        request.on('end', function () {
            body = Buffer.concat(body);
            console.log(body.toString());
        });
    }).listen(80);
    ```

    其中request是只读数据流，respond是只写数据流

    由于一般响应长度不确定，故nodejs自动在响应头中加入了`Transfer-Encoding: chunked`，并采用chunked传输方式。但是当响应长度固定时，可以在响应头部加上`Content-legnth`字段，避免nodejs的默认操作

* 客户端使用：发起一个HTTP客户端请求，获取服务端响应

    ```javascript
    var options = {
        hostname: 'www.example.com',
        port: 80,
        path: '/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var request = http.request(options, function (response) {});

    request.write('Hello World');
    request.end();
    ```

    其中respond是只读数据流

    GET请求的发送：`http.get(url[, options][, callback])`

## https

HTTPS与HTTP大致相同，区别在于**HTTPS模块需要额外处理SSL证书**

服务端：

```javascript
var options = {
        key: fs.readFileSync('./ssl/default.key'),
        cert: fs.readFileSync('./ssl/default.cer')
    };

var server = https.createServer(options, function (request, response) {
        // ...
    });
```

NodeJS支持SNI技术，可以根据HTTPS客户端请求使用的域名动态使用不同的证书，因此同一个HTTPS服务器可以使用多个域名提供服务，参见TLS/SSL API

```javascript
server.addContext('foo.com', options1);

server.addContext('bar.com', options2);
```

客户端：

客户端发送请求与HTTP模块相同，**但是如果目标服务器的SSL证书是自制的，默认情况下https模块会拒绝连接**。

此时需要在options中加入`rejectUnauthorized: false`禁用对证书有效性的检查，便于在开发环境下使用自制证书

## url

url 模块用于处理与解析 URL

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

* url.parse：解析 URL 字符串并返回 URL 对象，根据参数不同解析返回值不同
* url.format：将url对象转换为url字符串
* url.resolve：拼接url，具体规则类似于path.join

## Query String

querystring 模块提供用于解析和格式化 URL 查询字符串的实用工具

* querystring.unescape：对字符串中保留字符进行百分号解码

    如`!`编码为`%21`，此函数可解码回来

* querystring.escape：对字符串中保留字符进行百分号编码
* querystring.parse：将字符串解析为键值对集合
* querystring.stringify：通过迭代对象的自身属性从给定的 obj 生成字符串

其他详细参数见API

## zlib：zlib模块提供通过 Gzip 和 Deflate/Inflate 实现的压缩功能

## Net：net模块可用于创建Socket服务器或Socket客户端

## 总结

1. http模块的服务端与客户端使用
2. https模块注意ssl证书的处理，其他基本与http相同
3. request.url、url、querystring模块经常搭配使用
4. zlib压缩减少数据量