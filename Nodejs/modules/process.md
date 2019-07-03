# 进程管理

NodeJS可以感知和控制自身进程的运行环境和状态，也可以创建子进程并与其协同工作，故NodeJS可以把多个程序组合在一起共同完成某项工作

## API了解

### process

`process`对象是一个全局变量，它提供有关当前`Node.js`进程的信息并对其进行控制，全局变量，无需require

process对象上有一系列的属性、方法、事件监听，可以获取到启动进程时使用的命令行参数，标准输入标准输出，运行权限，运行环境和运行状态等数据，可以在任何地方直接使用

* `process.argv`
* `process.exit(code)`：退出状态码
* `process.on(signal)`：监听父进程信号

### child_process

`child_process`模块提供了衍生子进程的能力，核心为`child_process.spawn()`函数，其他函数为其衍生品

常用方法：
* `child_process.spawn()`：异步衍生子进程，且不阻塞Nodejs事件循环
* `child_process.spawnSync()`：同步衍生子进程，但是会阻塞Nodejs时间循环直到衍生的进程退出或终止
* `child_process.exec()`： 衍生一个 shell 并在该 shell 中运行命令，当完成时则将 stdout 和 stderr 传给回调函数
* `subprocess.kill([signal])`：向子进程发送一个信号

### Cluster

`cluster`模块是对`child_process`模块的进一步封装，专用于解决单进程`NodeJS` Web服务器无法充分利用多核CPU的问题。

使用该模块可以简化多进程服务器程序的开发，让每个核上运行一个工作进程，并统一通过主进程监听端口和分发请求

## 简单应用

### 进程间通信方式

* process.on + subprocess.kill：父进程发送信号，子进程监听信号
* IPC进程间通信

    如果父子进程都是Nodejs进程，可以使用IPC（进程间通讯）**双向传递数据**

    ```javascript
    // 父进程
    const cp = require('child_process');
    const n = cp.fork(`${__dirname}/sub.js`);

    n.on('message', (m) => {
      console.log('父进程收到消息', m);
    });

    // 使子进程打印: 子进程收到消息 { hello: 'world' }
    n.send({ hello: 'world' });

    // 子进程
    process.on('message', (m) => {
      console.log('子进程收到消息', m);
    });

    // 使父进程输出: 父进程收到消息 { foo: 'bar', baz: null }
    process.send({ foo: 'bar', baz: NaN });
    ```

### 进程守护

即为监听子进程exit + 回调重启

```javascript
var worker = child_process.spawn('node', [ mainModule ]);

worker.on('exit', function (code) {
    if (code !== 0) {
        spawn(mainModule);
    }
});
```

## 小结

* process全局对象使用，获取命令行参数、环境变量、事件监听等
* child_process模块创建子进程，**子进程通信**，进程守护
* cluster集群使用