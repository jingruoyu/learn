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

分类：section content

标签缺省：标签不可省略

DOM接口：HTMLElement

article元素用于标识文档或页面中一个完整的或者自包含的作品，原则上讲，他是独立或者可重用的。

当article元素出现互相嵌套时，原则上内层article元素所代表内容与外层article元素是有关联的。作者信息不适合与article元素相关联。

当页面除了页眉、页脚、导航栏和侧边栏之外的内容整体是一个自包含内容，这部分内容可以被标记在一个article元素中，不过这种情况在技术上是多余的，因为整个页面显然是一个单个的文档

### 4.3.3 section元素

分类：section content

标签缺省：标签不可缺省

DOM接口：HTMLElement

section元素表示文档中的一个段落，**一个section应该有一个中心主题，并且有一个代表性的标题heading**，鼓励使用article元素代替section元素，其能起到内容聚合的作用

section元素不能作为一个普适性的包含元素，当仅出于样式或者脚本需要使用元素时，建议使用div。一个通用的规则是，section元素的内容需要在文档中被明确列出。

**section与article区别**

section用于表示一篇文章中的一个章节，article用于表示一片独立的文章。

特别的，书评不是文章的一部分，故其也需要使用article元素

### 4.3.4 nav元素

分类：section content

标签不可缺省

nav元素代表页面的导航链接部分，该元素由页面的导航块组成

`footer`元素中也包含了部分链接，但是单独的footer元素足以满足这种情况，在此情况下不必使用nav元素

UA（如屏幕阅读器）针对省略初始渲染中的导航信息受益或者立刻使用导航信息受益两种用户，可以使用nav元素作为确定这两种方式的方法，以确保在页面初始化过程中跳过或提供某些请求

`nav`元素中不仅可以包含一个列表，也可以包含一些其他种类的内容，如包含链接的文本

### 4.3.5 aside元素

分类：section content

标签不可缺省

`aside`元素由与页面其他内容无关的部分组成，此部分内容可以与页面其他内容分开。在印刷排版中，此部分经常被当做侧边栏

`aside`元素可用于包含长的引用块、侧边栏、广告、nav元素组，或者其他可以从页面主内容中拆分出来的内容

### 4.3.6 h标题系列元素

分类：heading content

这些元素代表了章节标题

h1 -> h6等级逐渐降低，相同数字具有相同等级
### 4.3.7 hgroup元素

分类：heading content

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

`address`元素表示距离其最近的祖先元素中`article`或者`body`元素的联系信息，当其指代body时，联系信息同时适用于整个文档

* `address`元素不能被用于表示任何形式的地址信息（如邮政地址），除非这些地址与联系信息有关

	此种情况下使用p元素表示邮政地址更为合适

* `address`元素不能包含任何非联系信息的内容

**一般address元素与其他信息一起放在footer元素中**

### Headings and sections

`section content`元素集合中的第一个`heading content`元素将会是这个段落的标题，之后同等级或更高等级的标题元素将会开启新的段落（或隐含的段落），而低等级的标题所属段落将属于之前高等级段落的一部分

`sectioning roots`元素，如`blockquote`与`body`等，其自身具有概述，所以其内部的标题元素不会影响到他们自身的概述内容

* **鼓励显式使用`section content`中的元素**，避免因为`heading content`元素的使用生成隐含的`section content`
* 鼓励仅使用`h1`元素或者使用与当前层级相符的heading元素。

	但是仅使用`h1`时需要使用明确的样式规则确定相应样式，否则浏览器默认按照最高等级标题绘制

#### creating an outline

`section content`元素或`sectioning roots`元素的概述outline由一个列表组成，其中包括一个或多个段落，可以进行嵌套

页面outline中包含了各级section的heading，包括显式与隐式的section，各级之间可以进行嵌套

![outline](../img/html-outline.png)

相邻的标题元素如果位于同一个section元素中，则后面的标题元素将创造一个隐含的section，将该标题与本级别的内容包含进去。该section与之前同级别的section在outline中互为兄弟

#### Sample outlines

标题的定义不能提升，如果未对页面指定标题就开始使用`section content`元素，则这个页面在outline中没有标题。（此处与title元素无关）

#### Exposing outlines to users

可以将页面outline展现给用户，当做页面导航使用

## 4.4 grouping content

### 4.4.1 `p`元素

`p`元素代表一个段落

段落通常以文本块的形式在视觉媒体中呈现，相邻的段落通过空行相分隔，不过使用css或UA以不同方式呈现段落时同样是合理的。

`p`元素中不能包含列表，但可以用div包含列表，使整体结构更紧凑

### 4.4.2 hr元素

**没有结束标签**

`hr`元素代表一个段落级别的主题转变，例如，一个故事中的场景的改变，或一个章节的主题的改变

`hr`元素表现为一条水平线，但是在语义上也有重要作用

`hr`元素不影响文档的概述outline

### 4.4.3 pre元素

标签不可省略

`pre`元素代表一块预格式化的文本，其结构由印刷约定，与元素本身无关

**NOTE**：HTML语法中，将会删除`pre`开始标签后紧跟的换行符

`pre`元素可以被用于以下场景：
* 展示email等场景，其中段落之间使用空行间隔，列表开头使用特殊符号，
* 展示代码片段，将会按照该语言的结构进行展示，可以搭配`code`标签
* 展示电脑输出，可以搭配`samp`标签
* 展示ASCII码

### 4.4.4 blockquote元素

标签不可省略

cite属性：链接到引用来源或标出有关编辑的更多信息，格式需要为由空格包围的链接

`blockquote`元素代表引用自其他来源的一段内容。块引用的内容可以缩写，或者可以以常规方式为文本语言添加上下文

如果要标出引用的归属，则该部分需要在`blockquote`元素外部

### 4.4.5 ol元素

其内容模型是0个或多个li元素

标签不可省略

内部属性：
* reverse：boolean，表示列表是正序还是倒序，true为倒序
* start：int值，列表的起始值
* type：列表标号的类型，可以使用css更改其样式

`ol`元素代表一个有序列表，改变其中元素的顺序将会改变文档的含义

### 4.4.6 ul元素

其内容模型是0个或多个li元素

标签不可省略

`ul`元素代表一个无序列表，改变顺序不会改变文档含义

### 4.4.7 menu元素

其内容模型是0个或多个li元素

`menu`元素代表一个工具栏，其内容是使用`li`元素表示的无序项目列表

### 4.4.8 li元素

可以被用于`ol、ul、menu`元素中

当前`li`元素后紧接着开始新一个`li`或者当前`li`元素的父元素上没有更多内容时，其结束标签可以省略

内部属性：
* value：合法int值，作为`ol`元素子元素时，可以使用value属性指定其序列数

`li`元素代表一个列表项，当其父元素是ol、ul或menu时，元素代表父元素列表中一项。否则，**该元素与其他`li`元素没有任何列表关系**

在`li`元素中使用标题元素不会引发语法问题，但是可能语义存在问题。标题元素会将li元素分割为多个段落

### 4.4.9 dl、dt、dd系列元素

标签省略：
* `dl`元素元素标签不可省略
* `dt`元素当其后立刻跟着`dt`或`dd`元素时可以省略结束标签
* `dd`元素当其后立刻跟着`dd`元素或父元素没有更多内容时可以省略结束标签

此系列元素用于术语定义以及描述
* `dl`元素包含属于定义及描述部分，其内部可以包含多组术语
* `dt`元素与`dd` 元素为一组，`dt`元素代表术语定义，`dd` 元素代表术语描述

可以在`dt`元素与`dd`元素组外部包装一层`div`元素，不影响`dl`元素语义

`dt`与`dd` 元素形成一个Name-value组，可以为一个name指定多个value，也可以为一个value指定多个name

`dl`元素中各项的顺序需要注意，有时候这个顺序是有意义的

### 4.4.12 figure、figcaption元素

`figure`元素代表一段独立的内容，是自包含的，通常作为文档中的独立单元

**自包含**不是指文本必须要独立，一个完整的句子也可以自包含的，只要是完整的即可

`figure`元素经常用在主文中引用的图片，插图，表格，代码段等等，当这部分转移到附录中或者其他页面时不会影响到主体。

`figcaption`元素作为`figure`元素的标题使用

### 4.4.14 main元素

`main`元素表示文档的主要内容，**文档不得包含多个未指定hidden属性的`main`元素**。

层次结构正确的`main`元素是其祖先元素仅限于html，body，div，没有可访问名称的form以及自主自定义元素的元素。 每个`main`元素必须是分层正确的`main`元素。

hidden属性为全局属性，表明将某一个模块从DOM树中移除

注意`display:none`与`visibility:hidden`区别,`display:none`将元素在DOM树中不显示，`visibility:hidden`仅将元素隐藏，但是元素原本所占空间保留

### 4.4.15 div元素

`div`元素无特殊含义，建议先选用其他合适的元素，最后再选择div，便于语义化与可维护性

## 4.5 文本级别的语义化元素

### 4.5.1 a元素

标签不可以省略

元素属性：

* href：包含超链接指向的 URL 或 URL 片段
* target：指定在何处显示链接的资源，取值有`tab`、`window`、`iframe`等浏览器上下文名称或`_self`、`_blank`、`_top`等关键字
* download：指定浏览器是否下载URL资源而不是导航到它，取值为下载资源的文件名
* ping：包含一个以空格分隔的url列表，当跟随超链接时，将由浏览器(在后台)发送带有正文 PING 的 POST 请求。通常用于跟踪
* rel：该属性指定了目标对象到链接对象的关系
* hreflang：指定链接文档的语言
* type：指定目标对象的MIME type类型
* referrerpolicy：指定获取超链接资源时的referrer头取值

如果`a`元素具有`href`属性，则其代表由其内容标记的超链接。如果在元素上指定了itemprop属性，则必须指定href属性。

如果`a`元素没有`href`属性，则其代表了一个占位符，用于放置相关链接，a标签仅代表了元素的文本内容。当href属性未指定时，a标签上的其他自身属性全部会被忽略

**`a`元素中可以包含除了交互式内容之外的其他任何内容，交互式内容如按钮或其他链接**，即`a`元素中不能嵌套`a`元素和按钮`button`

### 4.5.2 em元素

没有标签可以省略

`em`元素表示对其重点内容的强调，强调的等级由其祖先中em元素的数量决定

**`em`元素会改变句子本身的语义，其具体的使用依赖于语言。**

* `em`元素一般不用于表示斜体。当文本更倾向于以区别于段落其他部分的形式展示时，可以使用`i`标签斜体展示
* `em`元素也不用于传递文本的重要性，出于此目的时，使用`strong`标签更为合理。`strong`是文档级别的强调，`em`是句子中的强调，强调个别单词

### 4.5.3 strong元素

标签不可省略

`strong`元素代表其内容强烈的重要性、严重性或紧急性

* 重要性：`strong`元素在标题或段落中使用时，在真正重要的元素与其他的细节或样板部分之间产生区分
* 严重性：`strong`元素可以被用于标记警告通知
* 紧急性：`strong`元素可以被用于相对页面其它部分需要被用户更先看到的内容

内容的重要性由其祖先元素中`strong`元素的数目决定，每个`strong`元素都会增加其内容的重要性

**使用`strong`元素改变文本的重要性不会改变其语义**

### 4.5.4 small元素

暂停元素部分

#### 4.12.3 template element

内容模型：nothing

template元素用于声明可以被脚本插入或克隆到文档其他位置的HTML片段。在渲染过程中，template元素代表空

**template元素的内容并不是template的后代元素**，其内容存储在与不同Document相关联的`DocumentFragment`中，而不是浏览器上下文，从而避免template中的内容影响主文档。**其内部元素是通过template元素的content属性返回的`DocumentFragment`对象的子节点**

	template.content //返回template元素内容，即一个DocumentFragment

template元素中可以包含文本节点和元素节点，但是由于其内容模型为nothing，故元素中包含任何内容都会违反template的内容模型

每个template元素都有一个与之相关联的`DocumentFragment`对象，其中存储着template的内容，对于内容没有一致性要求。当template元素创建时，UA必须执行如下操作
* 将doc设置为template元素模板中节点文档的所有者
* 创建一个`DocumentFragment`对象，其节点文档是doc，其所有者为template元素
* 设置template元素的模板内容是最新创建的`DocumentFragment`对象

clone template元素中节点的步骤：
* 如果没有指定深度clone标志位，则直接返回
* 让复制的内容是克隆节点模板内容的所有子节点的结果，文档设置为复制模板内容的节点文档，并且克隆子元素标志集
* 将复制的内容附加到副本的模板内容中

#### 4.12.4 slot element

slot元素定义一个slot插槽，通常用于`shadow DOM`树。slot元素代表其分配的节点，如果未被分配到节点，则代表其内容

**name属性**代表slot的name，其中可以包含任何字符串。

name属性用于将slot插槽分配给其他元素，具有name属性的slot元素创建一个命名槽，如果其他元素的slot属性值与该slot元素name属性的值相匹配，则对应元素将分配给slot插槽

* slot.name：可以被用于设置或获取name属性
* slot.assignNodes()：返回slot被分配到的节点
* slot.assignNode({flatten: true})：返回插槽的已分配节点（如果有），否则返回插槽的子节点，并对其中遇到的任何插槽元素执行相同的操作，直到没有剩余插槽元素为止。
* slot.assignElements()：返回slot被分配到的节点，仅限于元素节点
* slot.assignElements({flatten: true})：与assignNodes操作相同，仅限于元素节点

#### 4.13 custom element

