# HTML元素

## document元素

### html元素

使用上下文：

* 文档的document元素中
* Wherever a subdocument fragment is allowed in a compound document

内容模型：

* 一个head元素后跟着一个body元素

标记省略规则：

* 如果html元素中第一项内容不是注释的话则可以省略开始标记
* 如果html元素后不是紧跟着注释的话，则可以省略结束标记

**html元素是整个HTML文档的根节点，使用HTMLHtmlElement对象接口**

一般鼓励开发人员在html元素上指定lang属性，有助于文档解析是确定所要使用的语言规则

manifest属性给出文档的应用程序缓存清单，如果属性存在，属性值必须为可能由空格包围的有效非空URL。但是manifest所属的离线引用缓存缓存正在从标准中移除，推荐使用**service workers**替代

manifest仅在文档加载的初期阶段起作用，所以动态更改manifest属性不会起作用，因此manifest属性没有DOM API。但是window.applicationcache提功力访问离线应用缓存的接口

## 文档内容

### head元素

使用上下文：

* html元素的第一个子元素







### title元素

### the base element

### 链接元素

#### Providing users with a means to follow hyperlinks created using the link element

### the meta data

#### 标准数据名

#### 其他数据名

#### pragma directives

#### 指定文档的字符编码

### style元素