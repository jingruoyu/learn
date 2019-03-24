## service worker 

[service workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers)

### 特点

* install之后会一直运行，且会自动更新
* 只能在HTTPS中运行，可以进行资源缓存
* 可以通过postMessage传递消息
* 不能操作DOM
* 单独线程运行，不会被阻塞，也不阻塞其他js，适用于复杂计算

### 过程

![生命周期](../img/HTML5/service-worker.png)

1. 注册

	此过程一般在主函数中进行，需要进行属性检测。注册时需要指定service worker文件位置，可以同时指定此worker的管理范围

2. 安装

	注册后，浏览器会尝试安装并激活，故install事件会在安装完成后触发，此事件可以被监听

	`install`事件一般是被用来填充你的浏览器的离线缓存能力，此处需要使用`cachestorage`的API `caches`，根据指定的key存储网络请求资源。此缓存会一直持久存在，直至手动删除

	* **整个缓存过程需要在安装完成之前完成**，所以用到waitUtil方法。可以在第一个fetch事件之前完成所有缓存
	* `localStorage`是同步存储，不允许在service worker中使用
	* 可以使用**`IndexDB`**做数据存储

3. 激活

	安装完成后service worker会被激活，`activate`事件可以被监听

	激活一般用户删除旧缓存。当需要缓存更新时，通过key的白名单，删除旧缓存。

	此过程也使用`waitUtil`，可以在第一个fetch事件前完成清理操作

4. fetch事件

	通过捕捉控制scope范围内的fetch事件，service worker可以实现对所有请求的控制

	捕获fetch事件后，使用`event.respondWith`可以劫持HTTP响应，完成各种操作，详见[service workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Worker#自定义请求的响应)

5. 更新

	如果你的 service worker 已经被安装，但是刷新页面时有一个新版本的可用，新版的 service worker 会在后台安装，但是还没激活。当不再有任何已加载的页面在使用旧版的 service worker 的时候，新版本才会激活。

	**新旧版之间通过key区分cache**

## Q&A

1. 不同路径下注册

	Q：`/a`路径下能否注册根路径下的`service worker`

	A：可以，注册之后访问根路径时该`service worker`也会使用，此时资源来源为`from disk cache`。**不过要注意对不同路径所需资源的支持**，此处需要缓存文件列表与fetch请求监听的共同支持，尤其是在单页面应用上，vuerouter的history模式下不同路径会访问同一份资源

2. 断网`unregister`后不同路径下的不同表现

	Q：断网情况下，`unregister`掉`/a`路径注册在根路径下的`service worker`，此时再刷新页面a的确无法访问。但是转而访问根路径页面可以访问，观察到一个新的worker被重新注册并获取资源，何处注册，何处拿到资源？

	A：在devtools的network中可以发现，断网`unregister`后页面来源为`from disk cache`，故页面资源从硬盘缓存中获取，并在其中注册