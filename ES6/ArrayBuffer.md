## 二进制数据

### ArrayBuffer

在图像或文件的上传、下载中，经常会使用二进制数据，直接操作内存，速度快很多

JavaScript中二进制数据格式有ArrayBuffer、Uint8Array、DataView、Blob、File等

**ArrayBuffer：基本的二进制对象，对固定长度的连续内存空间的引用**

```javascript
let buffer = new ArrayBuffer(16) 
```

以上代码会分配一段16字节的连续内存空间，并以0填充

**此时buffer变量中存储的其实是该连续内存的地址，即为引用**

NOTE：
* ArrayBuffer不能读写
* 长度固定，无法增加或减少长度
* 正好占用了内存中的对应空间

操作ArrayBuffer需要使用视图对象，**视图对象以某种数据格式读取ArrayBuffer中的数据**

属性/方法：
* byteLength：返回所分配内存区域的字节长度
* slice()：将一部分的内存区域宝贝生成新的ArrayBuffer对象
* isView(buffer)：静态方法，返回布尔值，标明参数是否为ArrayBuffer的视图实例

### TypedArray

以上的所有视图都可以统称为TypedArray，共享一组方法和属性

实际上没有真正叫做TypedArray的构造器，其只是代表ArrayBuffer上的一种视图类型

#### 具体使用

五种构造方式
* new TypedArray(buffer, [byteOffset], [length]);
* new TypedArray(object);
* new TypedArray(typedArray);
* new TypedArray(length);
* new TypedArray();

属性：
* arr.buffer：引用ArrayBuffer
* arr.byteLength：ArrayBuffer的长度

方法：

具有常规的Array方法，map，slice，find，reduce，但是以下方法例外
* 没有splice：无法删除一个值，只能在该位置分配一个0值
* 没有concat

此外还新增了
* arr.set：复制目标数组到arr
* arr.subarray：创建一个新的视图，但是视图中不复制任何内容

类型化数组列表：
* Uint8Array、Uint16Array、Uint32Array：用于8、16、32位的无符号整数
* Int8Array、Int16Array、Int32Array
* Float32Array、Float64Array：用于32/64位的有符号浮点数

#### 越界行为

当尝试将越界值写入ArrayBuffer时，会将多余的位直接切除，即该数字对2^8取模后再保存

**但是对Unit8ClampedArray，大于255的任何数字会被保存为255，任何负数将保存为0，这一点在图像处理中很有用**

#### 字节序

字节序是指数值在内存中的表示方式

x86体系的计算机都是小端字节序：相对重要的字节排在后面的内存地址，相对不重要的字节排在前面的内存地址

如`0x12345678`，决定其大小最重要的字节是12，最不重要的是78，其在内存中存储时会以78563412的顺序存储，TypedArray也会以小端字节序的顺序读写数据

大部分PC上都是小端字节序，但是部分特定设备可能出现大端字节序，所以需要DataView设定字节序

### DataView

DataView是在`ArrayBuffer`上的一种特殊的超灵活“未类型化”视图。它允许以任何格式访问任何偏移量（offset）的数据

* 类型化的数组构造器决定了数据格式，整个数组都是统一的
* DataView可以使用不同的方法访问数据，达到选择数据格式的目的

构造方法

```javascript
new DataView(buffer, [byteOffset], [byteLength])
```

* buffer：引用ArrayBuffer
* byteOffset：视图的起始字节位置，默认0
* byteLength：ArrayBuffer的长度，默认至buffer的末尾

### 总结

* ArrayBufferView是对所有这些视图的总称
* BufferSource 是 ArrayBuffer 或 ArrayBufferView 的总称

### 应用

#### ajax

传统ajax发送数据只能发送文本数据，即respondType默认为text

XMLHTTPRequest第二版允许xhr请求返回二进制数
* 如果明确知道服务端返回二进制数据类型，则指定respondType为arraybuffer
* 如果不知道，则指定为blob

#### Canvas

canvas输出的二进制像素数据就是TypedArray数组

其视图类型是针对图像处理专用的Unit8ClampArray，该类型将小于0的值设为0，大于255的值设为255

#### websocket

websocket可以设置binaryType为arraybuffer，这样接受和发送的数据都是arraybuffer的二进制数据

#### fetch

fetch取回的数据，就是arraybuffer对象

#### file

如果知道一个文件的二进制数据类型，也可以将这个文件读取为ArrayBuffer对象

### SharedArrayBuffer

js通过webworker引入了多线程，主线程用于交互，worker线程用于承担计算任务，各个线程之间隔离，通过postMessage进行通信

当需要发送的数据量较大时，可以通过共享内存，主线程和worker线程进行协作，提升效率

ES2017提供了SharedArrayBuffer，允许worker线程和主线程共享一块内存，此对象其他属性和ArrayBuffer均相同

共享时，需要先在主线程或worker线程中先创建好共享内存，再将内存地址同步到另一个线程中，然后按照事先约定好的方式进行操作即可

### Atomics对象

有了共享内存之后，可能会存在多个线程同时操作一个内存地址的情况。

在实际的执行中，引擎会将js命令便以为多条机器码，在此过程中，多条互不依赖的命令的执行顺序可能会被打乱，一个线程运行期间，可能也会插入另一个线程的指令，故同时操作一个内存地址可能会导致结果不为预期值

为解决此问题，ES2017提供了Atomics对象，其提供的一系列方法可以保证一个操作所对应的的多条机器指令是作为一个整体运行的，中间不会被打断，避免在指令内部的线程竞争

## 二进制数据与字符串

### TextDecoder

TextDecoder对象在给定buffer和编码格式后，能够将值读取到实际的JavaScript字符串中

```javascript
let uint8Array = new Uint8Array([72, 101, 108, 108, 111]);

alert( new TextDecoder().decode(uint8Array) ); // Hello
```

### TextEncoder

TextEncoder将字符串转换为字节，只支持utf8编码

* encode(str)：返回一个Uint8Array
* encodeInto(str, destination)，将str编码到dest中，目标必须为Uint8Array

## [Blob](https://zh.javascript.info/blob)

ArrayBuffer和视图都是ECMA标准的一部分，是JavaScript的一部分

Blob是浏览器中更为高级的对象，其有一个可选的type（通常为MIME类型）和blobParts组成，blobParts是一系列的其他blob对象、字符串或BufferSource

![Blob结构](../img/ES6/blob_struct.img)

ArrayBuffer、Unit8Array及其他BufferSource是二进制数据，而Blob表示具有类型的二进制数据，所以Blob可以用于浏览器中常见的的下载、上传等场景，在请求方法中可以很轻松使用

### 使用

```javascript
new Blob(blobParts, options)
```

方法：

* blob.slice(start, end, type)：提取blob片段

Blob对象是不可改变的，无法直接在Blob中更改数据，但是可以通过slice获取Blob的多个部分，从这些部分创建新的Blob对象

### 用途

#### 用作URL

Blob对象可以通过动态创建链接，作为a标签或其他标签的url，来显示他们的内容

URL.createObjectURL方法可以创建一个DOMstring，其中包含参数对象的url。这个URL对象可以表示指定的File对象或者Blob对象。URL在当前文档打开的状态下有效，在unload时会被自动清除

浏览器内部为每个URL存储了一个URL -> Blob 的映射，因此可以通过URL直接访问Blob。但是Blob是保存在内存中的，由于这个映射的存在，会导致浏览器无法释放。故当不再使用这个URL时，可以手动revokeObjectURL移除引用，之后URL会不再起作用

#### Blob转换为base64

将`URL.createObjectURL`替代方法是，将Blob替换为base64编码的字符串

base64编码将二进制护具表示为一个有0到64的ASCII吗组成的字符串，十分安全且可读，可以在data-url中使用

data-url的形式为`data:[mediatype][;base64],<data>`，可以像使用常规url一样使用

这两种从 Blob 创建 URL 的方法都可以用。但通常 URL.createObjectURL(blob) 更简单快捷

#### image转化为Blob

可以通过canvas，将图像、图像的一部分或者屏幕截图创建为一个Blob，方便上传

具体过程为
* 使用canvas.drawImage在canvas上绘制图像
* 使用canvas方式toBlob创建一个blob，创建完后运行callback

    toBlob方法是异步操作，所以需要回调函数，也可以在async中调用，将其改为promise对象

对于页面截屏，操作为先扫一遍浏览器页面，并将其绘制在canvas上，然后就可以获取到一个对应的blob

#### Blob转为ArrayBuffer

Blob构造器允许从几乎所有东西创建Blob，包括任何的BufferSource

但是如果需要执行低级别操作的话，可以使用FileReader从blob获取最低级别的ArrayBuffer

## 二进制文件

### File对象

File对象继承自Blob，扩展了文件系统相关的功能

两种获取方式：
* 构造函数：

    ```javascript
    new File(fileParts, fileName, [options])
    ```

* 通过浏览器接口获取文件时，file将从操作系统上获得this信息

### FileReader

FileReader是一个对象，唯一目的是从Blob（因此也可以从File中）中读取数据

FileReader使用事件传递数据，因为从磁盘读取数据可能比较费时间

读取过程中的事件
* loadstart
* progress
* load
* abort
* error
* loadend：读取完成，无论成功还是时报

主要方法
* readAsArrayBuffer(blob)：将数据读取为二进制格式的ArrayBuffer
* readAsText(blob, [encoding = utf-8])：将数据读取为给定编码为文本字符串
* readAsDataURL(blob)：读取二进制数据，并将其编码为base64的data url
* abort()：取消操作

read\*方法的选择，取决于我们的目标格式，及如何使用数据

Web Workers中可以使用FileReaderSync，他会像常规函数那样返回一个结果。这个方法仅在web worker中可用，所以在读取文件时，同步调用会有延迟。而在web worker中，这个延迟并不会影响页面

**但是在很多情况下，我们并不需要读取文件内容，可以直接使用URL.createObjectURL(file)，再将url赋值给a或img标签，文件便可以下载或者呈现为图像，作为canvas的一部分等**