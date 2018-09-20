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

DOM接口：HTMLHtmlElement

**html元素是整个HTML文档的根节点，使用HTMLHtmlElement对象接口**

一般鼓励开发人员在html元素上指定lang属性，有助于文档解析时确定所要使用的语言规则

manifest属性给出文档的应用程序缓存清单，如果属性存在，属性值必须为可能由空格包围的有效非空URL。但是manifest所属的离线引用缓存缓存正在从标准中移除，推荐使用**service workers**替代

manifest仅在文档加载的初期阶段起作用，所以动态更改manifest属性不会起作用，因此manifest属性没有DOM API。但是window.applicationcache提功力访问离线应用缓存的接口

## 文档内容

### head元素

使用上下文：html元素的第一个子元素

内容模型：

* 如果文档是iframe文档或者其title信息可以从更高等级的协议中获取，则head元素中可以有0个或者更多的metadata内容，但是其中最多只能有一个title元素和一个base元素（base元素用于指定一个文档中包含的所有相对URL的基本URL）

* 其他情况下，只能有一个或者更多的metadata内容，其中只能有一个title元素和不多于一个的base元素

标记省略规则：

* 如果head元素内容为空，或者head元素中第一项内容是一个元素，则可以省略开始标记
* 如果head元素之后不是紧跟ASCII空格或注释，则可以省略结束标记

内容属性：全局属性

DOM接口：HTMLHeadElement

**head元素代表Document中的元数据集合**

title元素在大部分情况下都是需要的，但是当有更高等级的协议提供此信息时，title元素可以被省略，例如当HTML用于email时

### title元素

类别：元数据内容

使用上下文：当前head元素中不包含其他的title元素

内容模型：不包含inter-element whitespace的文本

标签省略：不可省略

title元素用于表示一篇文档的标题，作者应该使用更具标示性的标题作为内容的概括

**每篇文档中不能有多于一个的title元素**

```
title.text [= value]
```

### base元素

分类：元数据内容

使用上下文：当前head元素中不包含其他的title元素

内容模型：无

标签缺省：没有结束标签

* href属性：指定文档中所有相对URL指定基本URL，取值为可能被空格包含的有效URL。如果指定了该属性，base元素必须写在其他任何属性值是 URL 的元素之前

* target属性：超链接导航和表单提交的默认浏览上下文，指定显示结果的默认位置，即新窗口的加载位置。如果指定了该属性，base元素必须写在其他代表超链接的元素前面

base元素仅用于为文档指定基本URL和跟随超链接的默认浏览上下文，除此之外不包含其他信息

**每个文档中不能包含一个以上的base元素**

base元素必须包含一个href属性，一个target属性，或者两者均包含

### link元素

分类：元数据内容，当元素用于body中时，其同时是flow content和phrasing content

使用上下文：可以使用元数据的地方。

内容模型：无

标签缺省：没有结束标签

相应属性：as、crossorigin、href等，title属性在此元素上具有特殊意义可以作为链接的标题和css样式表的名称

link元素允许在文档中链接其他来源的数据，链接的目标由href属性给定，[crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_Enabled_Image)属性用于指定在加载相关图片时是否必须使用 CORS以防止图片被污染，属性中的rel指定link目标的类型

**link元素必须有一个rel属性或者一个itemprop属性，但是不能同时两者都有，且其属性值必须为允许值**

* 当使用rel属性，link元素有时只能在body中使用
* 当使用itemprop属性，link元素在body和head中均可以使用，受microdata模型限制

link元素可以创建外部资源链接和超链接两种类型链接，可以通过链接的类型指定。一个link元素可以创建多个链接，具体的链接种类和数量由rel属性给定。**用户代理对每个链接单独处理，而不是针对每个元素**

一个link元素创建两个超链接：

    <link rel="author license" href="/about">

link元素创建的超链接和其rel属性适用于整个文档，与其相反，a元素和area元素的rel属性

#### Providing users with a means to follow hyperlinks created using the link element

### the meta data

#### 标准数据名

#### 其他数据名

#### pragma directives

#### 指定文档的字符编码

### style元素