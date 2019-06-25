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
