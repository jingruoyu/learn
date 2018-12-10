# 4 HTML元素

## 4.1 document元素

### 4.1.1 html元素

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

## 4.2 文档数据元素

### 4.2.1 head元素

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

### 4.2.2 title元素

类别：元数据内容

使用上下文：当前head元素中不包含其他的title元素

内容模型：不包含inter-element whitespace的文本

标签省略：不可省略

title元素用于表示一篇文档的标题，作者应该使用更具标示性的标题作为内容的概括

**每篇文档中不能有多于一个的title元素**

```
title.text [= value]
```

### 4.2.3 base元素

分类：元数据内容

使用上下文：当前head元素中不包含其他的title元素

内容模型：无

标签缺省：没有结束标签

* href属性：指定文档中所有相对URL指定基本URL，取值为可能被空格包含的有效URL。如果指定了该属性，base元素必须写在其他任何属性值是 URL 的元素之前

* target属性：超链接导航和表单提交的默认浏览上下文，指定显示结果的默认位置，即新窗口的加载位置。如果指定了该属性，base元素必须写在其他代表超链接的元素前面。取值有`_self`、`_blank`、`_parent`、`_top`

base元素仅用于为文档指定基本URL和跟随超链接的默认浏览上下文，除此之外不包含其他信息

**每个文档中不能包含一个以上的base元素**

base元素必须包含一个href属性，一个target属性，或者两者均包含

### 4.2.4 link元素

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

link元素创建的超链接和其rel属性适用于整个文档，与其相反，a元素和area元素的rel属性表示链接的类型，其链接的上下文由文档中链接的位置给出

属性使用说明

* media属性说明资源适用于哪种媒体，属性取值必须为媒体查询列表中的有效值
* integrity属性表示link元素负责的请求数据是完整的元数据，取值为文本。属性只能在rel为stylesheet的link元素上使用
* hreflang属性知名被连接资源的语言，与在其他元素上使用效果相同
* type属性指定链接资源的MIME type，仅用于说明，取值必须为合法的MIME type值

	针对外部资源链接，type属性可以帮助浏览器避免请求那些不支持的资源

* referrerpolicy：设置当获取外部资源时的referrer属性
* title
* size
* as
* color

#### 4.2.4.1 用户跟踪使用由link元素创建的超链接

UA有时候需要提供跟踪超链接的接口，其可以由以下的属性提供：

* rel属性提供本文档与该资源之间的关系
* title属性提供资源的title
* href属性提供资源的地址
* hreflang属性提供资源的语言
* media属性给定资源最适用的媒体类型

UA也可以提供其他信息，如通过type给定资源的类型

The activation behavior of link elements that create hyperlinks is to follow the hyperlink created by the link element.（link元素创建超链接的行为遵循由link元素创建的超链接）

### 4.2.5 meta标签

分类：元数据内容，指定itemprop元素可以成为flow content与phrasing comtent

使用上下文：

* 如果元素的charset属性指定，或者http-equiv属性处于编码状态，则要在head元素中使用
* 如果元素的http-equiv属性指定但不处于编码状态，则要在head元素中使用
* 如果元素的http-equiv属性指定但不处于编码状态，则要在head元素的noscript标签中使用

标签缺省：没有结束标签

标签属性：全局属性、name、http-equiv、content、charset

meta标签用于表示不同通过title、base、link、style和script等元素展示的信息

**如果标签中指定了name、http-equiv或itemprop属性，则其content属性必须被指定，否则将会忽略该属性**

charset属性指定document所使用的字符编码，是一个字符编码声明。如果该属性被指定，其取值必须为与utf-8匹配的不区分大小写的ASCII码。为了便于统一，XML中允许指定charset属性，但是其无效。

**每个文档中，不能在多个meta标签中同时指定charset属性**

meta标签中的name属性用于定义数据属性名，同一个标签中的content用于定义属性值，如果没有的content属性，则对应的属性值为空字符串

#### 4.2.5.1 标准数据名

文档规定了部分meta元素的name属性，name取值不区分大小写，并且必须符合ASCII码

* application-name

	取值必须为简短的自由格式字符串，其中包含页面所代表的web应用程序名称。如果页面不是一个web应用，则不能使用该name属性。

	**文档中，可以使用lang属性为不同语言指定其对应application-name，每种语言不能有多个application-name**

* author

	自由格式字符串，给定页面作者名称

* description

	自由格式字符串，用于描述页面，应该是对页面具有总结性的词，一个文档中最多只能出现一次

* generator

	只在页面由工具自动生成时使用，用于标识生成页面的软件

* keywords

* referrer

	设置文档默认的referrer policy，取值必须为一个合法的referrer policy

* theme-color

	取值为一个合法的颜色值，定义了建议UA需要向用户展示的页面颜色，一个文档中最多出现一次

#### 4.2.5.2 其他数据名

用户可以根据自身需求定义相关的元数据名扩展，对于这些名称没有具体的规范要求，但是一个新的元数据名称在下列情况下不应该被创建：

* name属性或其相关的value取值为url，此时将会被当做一个链接进行处理
* name属性为UA中的标准数据名

在使用自定义数据名前，可以在[WHATWG Wiki MetaExtensions page](https://wiki.whatwg.org/wiki/MetaExtensions)中查阅相关信息，避免选择已被使用的元数据名，避免再次定义一个已被实现的元数据，避免新标准中的名称与自定义名称冲突

WHATWG wiki大家都可以编辑，在其中加入新的元数据名称，但是要遵循一定的规则

#### 4.2.5.3 编译指示指令

meta元素使用http-equiv属性时，该元素即为一个编译指示指令

http-equiv取值：

* content-type：定义文档的MIME type，由其字符编码决定

	其对应的content取值为字符串'text/html; charset=utf-8'

	一个文档最多只能包含一个http-equiv属性处于字符编码状态的meta元素和一个使用charset属性的meta元素

	meta元素的http-equiv属性不能被用于XML文档

* default-style：这个属性指定了在页面上使用的首选样式表

	content属性必须包含<\link> 元素的标题, href属性链接到CSS样式表或包含CSS样式表的<\style>元素的标题

* refresh：设置定时刷新

	取值为：

	* 有效的非负整数：重新载入页面的时间间隔（单位为秒）
	* 有效非负整数，后跟一个字符串为'URL=xxx链接'：重定向到指定链接的时间间隔(单位为秒)

* X-UA-Compatible

	当meta元素的http-equiv属性处于此状态时，对应的content属性值为"IE=edge"，此举是为了让IE更关注标准，UA将会忽略这条指令

* content-security-policy

	此指令加强文档的内容安全策略。当meta元素的http-equiv属性处于此状态时，对应content属性值必须是一个合法的内容安全策略值，但是不能包含report-uri, frame-ancestors, or sandbox directives

	```
	<meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none'">
	```

	上例中指定文档中script标签的src只能为同源，同时禁止了插件的使用

#### 4.2.5.4 指定文档的字符编码

编码标准与编码标签均需使用utf-8进行编码。无论是否存在字符编码声明，用于编码文档的实际字符编码必须是UTF-8。

如果一个HTML文档不是以BOM开始，同时其编码没有被content-type明确给定，并且文档也不是以iframe的形式存在于源文档中，那么必须使用meta元素的charset属性或者http-equiv属性明确指定其编码状态

如果文档以iframe的形式存在于源文档中，则该文档中不能包含字符编码声明。在此情况下，源文档中已经进行了字符解码，其中包含了iframe

**使用非utf-8编码会在表单提交和URL编码过程中产生不可预期的结果**

### 4.2.6 style元素

分类：元数据内容

使用上下文：作为head元素的子元素

内容模型：给定内容的样式表

标签省略：标签不可省略

内容属性：title属性指定css样式表的名称

DOM接口：HTMLStyleElement

* `HTMLStyleElement/media`中media属性指定style适用的媒体种类，取值必须为合法的媒体值，当省略时，相当于对所有媒体均生效

* style元素不会继承父级元素的title属性

* 如果style元素不在DOM树上，则其title属性将会被忽略

## 4.3 章节元素

### 4.3.1 body元素

分类：章节元素根节点

内容模型：文档流

标签缺省：

* bod元素起始标签省略：

	当body元素中的第一个元素不是meta、link、script、style或template元素是，以下情况body的起始标签可以被省略

	* body元素为空
	* body元素中第一个字符不是空格或注释

* body元素结束标签省略：

	当body元素后不是紧跟注释时可以省略结束标签

DOM接口：HTMLBodyElement

body元素代表文档的内容，每个文档中只能有一个body元素，`document.body`提供了文档中body元素的使用接口

body元素将window对象上的大量事件处理函数以事件处理函数内容属性的方式暴露出来，并且镜像了事件处理函数的IDL属性，**即将部分window对象上的事件，可以在body元素上进行绑定**，如onerror，onLoad等

### 4.3.2 article元素

标签缺省：标签不可省略

DOM接口：HTMLElement

article元素用于标识文档或页面中一个完整的或者自包含的作品，原则上讲，他是独立或者可重用的。

当article元素出现互相嵌套时，原则上内层article元素所代表内容与外层article元素是有关联的。作者信息不适合与article元素相关联。

当页面除了页眉、页脚、导航栏和侧边栏之外的内容整体是一个自包含内容，这部分内容可以被标记在一个article元素中，不过这种情况在技术上是多余的，因为整个页面显然是一个单个的文档

**疑问：例子中article为什么会包含header**

### 4.3.3 section元素

标签缺省：标签不可缺省

DOM接口：HTMLElement

section元素表示文档中的一个段落，**一个section应该有一个中心主题，并且有一个代表性的标题heading**，鼓励使用article元素代替section元素，其能起到内容聚合的作用

section元素不能作为一个普适性的包含元素，当仅出于样式或者脚本需要使用元素时，建议使用div。一个通用的规则是，section元素的内容需要在文档中被明确列出。

### 4.3.4 nav元素

标签不可缺省

nav元素代表页面的导航链接部分，该元素由页面的导航块组成

`footer`元素中也包含了部分链接，但是单独的footer元素足以满足这种情况，在此情况下不必使用nav元素

UA（如屏幕阅读器）针对省略初始渲染中的导航信息受益或者立刻使用导航信息受益两种用户，可以使用nav元素作为确定这两种方式的方法，以确保在页面初始化过程中跳过或提供某些请求

`nav`元素中不仅可以包含一个列表，也可以包含一些其他种类的内容，如包含链接的文本

### 4.3.5 aside元素

标签不可缺省

`aside`元素由与页面其他内容无关的部分组成，此部分内容可以与页面其他内容分开。在印刷排版中，此部分经常被当做侧边栏

`aside`元素可用于包含长的引用块、侧边栏、广告、nav元素组，或者其他可以从页面主内容中拆分出来的内容

### 4.3.6 h标题系列元素

这些元素代表了章节标题

h1 -> h6等级逐渐降低，相同数字具有相同等级

### 4.3.7 hgroup元素

`hgroup`元素代表了章节的标题，其子元素为h1-h6元素。当章节具有多级标题时，如副标题或替代标题，需要用`hgroup`元素对标题进行分组

`hgroup`元素的等级与其后代元素h1-h6中等级最高的相同，其他的h系列元素作为副标题存在。

使用`hgroup`可以防止部分标题元素作为单独章节的标题出现，而将其作为一个标题组的次要标题

`hgroup`元素中同样等级的元素，先写的比后写的优先级高

### 4.3.8 header元素

`header`元素表示一组用于介绍或导航的工具

`header`元素不是章节型内容，它不会生成一个新章节

### 4.3.9 footer元素

`footer`元素表示其最近的祖先章节内容或章节元素的页脚，典型`footer`元素包含的信息包括作者、相关文档、版权声明等数据。一个完整的`footer`元素还应该包含附录、索引、长版本、详细许可协议和其他此类内容

当最近的祖先章节内容或章节元素是body元素时，`footer`元素用于整篇文档

`footer`元素不是章节型内容，它不会生成一个新章节

### 4.3.10 address元素

### Headings and sections
