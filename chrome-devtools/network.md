## network

network宽行高下每行size属性有两个值，上面的值是下载的资源大小，下面的值是解压后的资源大小，由此可以判断文件是否进行了压缩。

也可以通过http响应头中的`content-encoding`字段进行判断，如果资源经过压缩，此字段一般为`gzip`、`deflate`或者`br`