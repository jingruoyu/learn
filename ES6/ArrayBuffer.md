## 二进制数据

### ArrayBuffer

在图像或文件的上传、下载中，经常会使用二进制数据，直接操作内存，速度快很多

JavaScript中二进制数据格式有ArrayBuffer、Uint8Array、DataView、Blob、File等

**ArrayBuffer：基本的二进制对象，对固定长度的连续内存空间的引用**

```javascript
let buffer = new ArrayBuffer(16) 
```

以上代码会分配一段16字节的连续内存空间，并以0填充

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

## 总结

* ArrayBufferView是对所有这些视图的总称

* BufferSource 是 ArrayBuffer 或 ArrayBufferView 的总称

## 应用