## server components

核心：在react中请求数据&渲染组件

server components 允许用于在后台加载组件，组件在后台已经被渲染，可以无缝集成到正在运行的应用中

所以server components有点类似于SSR，但是其工作原理不同

### SSR区别

有点类似于Next.js中的getInitialProps，`server components`能够请求数据然后传递给前端组件

但是与经典的SSR不同，**`server components`更加动态**，我们可以在一个应用执行期间请求其server tree，客户端状态不会改变

他们在技术上的实现方式也有所不同
* SSR：JavaScript代码会在服务器上渲染为HTML，他将在页面上创建一个可见的HTML模板。然后将其发送到客户端，加上用于交互的js代码。通过SSR，我们可以更早的看到页面，但是交互操作会被延迟
* Server Components：动态包含在应用中，并以特殊的形式进行传递。所有的JS都被执行了，组件都是静态的不能交互

相较于SSR，Server Components只能用于传递可见部分，缺少交互性

### 优势

js中有很多体积巨大的包，比如moment.js，但是我们只需要使用其中少量的几个函数。

从App性能及用户的角度考虑，发送所有的代码到前端是非常糟糕的。Tree-shaking能够用于去除我们不需要的代码，但是剩下的代码体积依然很大，有的函数只是用了一次但还是会被传输

通过server component可以进一步减少前端代码

#### 适用场景

* 依赖包巨大
* 没有客户端交互

直接将渲染结果传递给客户端，避免依赖包的传输。其不影响前端项目依赖包的大小，代码在后端运行，对用户不可见

### server components拥有所有的后端权限

与Next.js类似，我们可以访问后端，虽然在Next中也是绕道访问数据库、文件系统和相关数据

Server components使这种访问变得更加容易，React生态系统中通过一系列的库进行了扩展，以便进行访问

如 react-pg and react-fetch, react-fs

### 参考资料

https://javascript.plainenglish.io/react-server-components-2cf9f8e82c1f