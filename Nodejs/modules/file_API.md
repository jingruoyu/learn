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

`Buffer`将JS的数据处理能力从字符串扩展到了任意二进制数据