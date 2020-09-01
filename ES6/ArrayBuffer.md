## 二进制数据

### ArrayBuffer

在图像或文件的上传、下载中，经常会使用二进制数据

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

* Uint8Array：每个字节视为8位无符号整数
* Uint16Array：每两个字节视为16位无符号整数
* Uint32Array：每四个字节视为32位无符号整数
* Float64Array：每八个字节视为64位浮点数，范围5.0x10-324 到 1.8x10308

### TypedArray

所有的视图