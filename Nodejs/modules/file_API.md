# 文件操作

文件操作是node最大的特点

## 文件读取与写入

* 直接读取与写入

	当文件较小时可以直接读取

	```
	fs.writeFileSync(dst, fs.readFileSync(src));
	```

	* 同步读取：fs.readFileSync
	* 异步读取：fs.readFile

* 流式操作

	文件较大时直接读取内存会爆掉，可以使用流式操作

	```
	fs.createReadStream(src).pipe(fs.createWriteStream(dst));
	```

## 文件API

### Buffer

nodejs在全局作用域中引入`Buffer`类，**用于提供对二进制数据的操作**，目前还可以使用TypeArray、Buffer与更优的Uint8Array

Buffer可以通过读取文件得到，也可以直接使用构造函数Buffer得到

Buffer与字符串关系：
* Buffer使用与String类似，有length、index等属性
* Buffer可以与字符串互相转化

	```
	var str = bin.toString('utf-8');
	var bin = new Buffer('hello', 'utf-8');
	```

二者区别在于
* Buffer相当于在内存中申请了一个数组，Buffer作为指针指向该数组

	故针对Buffer所做的操作都将直接修改Buffer本身，slice方法会返回指向原Buffer中间的某个位置的指针

* 字符串是只读的，并且对字符串的任何修改得到的都是一个新字符串，原字符串保持不变

	此处注意String的**String[index]操作是只读的**，写入时不会报错，但是无效

**`Buffer`将JS的数据处理能力从字符串扩展到了任意二进制数据**

### stream 数据流

当内存中无法一次装下需要处理的数据，或者一边读取一边处理更加高效时，需要用到数据流

`Stream`基于事件机制工作，所有的`Stream`都是`EventEmitter`的实例，可以通过事件监听流的当前状态

几个比较重要的事件：
* data：可读流中，当流将数据块传送给消费者后触发
* end：可读流中，当流中没有数据可供消费时触发
* drain：可写流中，当可以继续写入数据到流时会触发

### file system

Node通过内置模块`fs`提供对文件的操作，其提供API大致分为三类
* 文件属性读写：fs.stat、fs.chmod、fs.chown
* 文件内容读写：fs.readFile、fs.readdir、fs.writeFile、fs.mkdir
* 底层文件读写：fs.open、fs.read、fs.write、fs.close

nodejs中的文件操作充分体现了其异步IO模型，其会在回调函数中传递结果，基本上第一个参数为err，第二个参数为执行结果

fs的所有异步API都有其对应的同步版本，在名称后多了一个Sync，调用方式也发生变化，如下示

	try {
	    var data = fs.readFileSync(pathname);
	    // Deal with data.
	} catch (err) {
	    // Deal with error.
	}

### Path 路径

`path`模块提供用于处理文件路径和目录路径的实用工具，简化路径相关操作

常用API：

* path.normalize：将传入路径转换为标准路径。

	注意windows与linux下路径分隔符的不同，windows为`\`，linux为`/`

* path.join：使用平台特定的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径
* path.extname：返回文件扩展名

其他相关变量：
* `__dirname`：当前模块目录名
* `__filename`：当前模块文件名，当前的模块文件的绝对路径