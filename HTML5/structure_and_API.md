# SEMANTICS, STRUCTURE, AND APIS OF HTML DOCUMENTS

## Document

* XML和HTML文档在UA中使用Document对象进行表示
* Document对象的URL在其创建时被初始化，但是在Document对象的生命周期内可以被更改
* 当使用JavaScript代码创建一个document对象时，该对象会同时准备进行post-load和页面加载
* document对象创建时，会生成`document.referrer`，类型是字符串，如果没有被设置，其将会是一个空字符串
* 每个document对象都有一个重载标志位，当调用`document.open(type, replace)`或者`document.write()`方法时，会对该标志位进行设置

	重载标志位被设置后，document对象会拥有一个重载缓冲区，用于reload时document的源地址

* 当UA进行重载时，将会给定一个source browser context，其执行操作如下

	1. 设置source的值为浏览器上下文中当前活动的document对象的重载缓冲区
	2. 设置address为浏览器上下文中活动document对象的URL
	3. 设置HTTPS状态为活动document对象的HTTPS状态
	4. 设置`Referrer-Policy`头为当前活动document对象的相应头部
	5. 设置`Content-Security-Policy`为当前活动对象的相应头部
	6. 将浏览器上下文导航到新的body响应中，其header即为已上设置的header内容，设置相应的标志位，源浏览器上下文开始重载流程。

		新建一个document对象，设置其重载标志位，将其重载缓冲区中的内容设置为浏览器上下文的源地址。当遇到任何异常情况时，抛出错误

		当在重载过程中更改document的address时，将会对原地址进行覆盖

### document对象

* HTTPS state，HTTPS状态值，默认为none，用于标志传输document数据信道的安全属性
* referrer policy，`Referrer-Policy`默认为空字符串，标志用户来源，[Referrer-Policy与CSF介绍](https://imququ.com/post/referrer-policy.html)
* CSP列表，内容安全策略，默认为空，用于检测并削弱某些特定类型的攻击
* feature policy
* module map

### 资源管理

#### document.referrer

返回将用户导航至当前页面document的链接。如果它被隐藏或者没有相应的文档，将会返回空字符串

noreferrer类型链接可以用于阻断页面之间的引用

#### document.cookie

返回当前页面的http cookie。如果当前页面没有cookie或者cookie不能被当前的源获取，将会返回空字符串

cookie可以被设置 ，可以为页面增加新的cookie

如果对目标内容进行了sandboxed设置，例如对iframe设置sandbox属性，则其在获取或设置cookie时将会抛出安全性错误

#### document.lastModified

返回document的lastModified时间戳，如果此属性未知，则返回当前时间

#### document.readyState

返回文档的加载状态，取值为以下三种

* loading：加载，document正在加载
* interactive：互动，文档已经加载完成并且被解析，但是如图像、样式表、iframe之类的子资源仍在加载中
* complete：完成，文档和所有的子资源已经完成加载。load事件即将被触发

其他事件的触发：

* 当次状态值发生改变时，`onreadystatechange`事件将会被触发
* `DOMContentLoaded`事件将会在readyState变为interactive之后但是出于complete之前触发，事件触发时，除了异步加载的脚本之外，所有的子资源全部加载完毕

### 访问DOM树

document对象html元素即为[document elment](https://dom.spec.whatwg.org/#document-element)，其他情况将会返回null

#### document.head

返回head元素，head元素即为html元素的子元素中第一个head元素，如果存在的话将返回此元素，否则返回null

#### document.title

可读可写，返回当前文档的title，title值由HTML的title元素和SVG的SVG title元素给出

设置此值时，将会更新文档的title内容。如果当时没有合适的元素进行更新，将会忽略新的值

与head元素类似，title元素是DOM树中的第一个title元素，如果没有的话将会返回null

#### document.body

可读可写，返回当前文档的body元素。

可以进行设置，替换掉原来的body元素。当新设置的值不是一个body元素或者frameset元素（此元素已被废弃可以忽略）是，将会抛错

body元素是文档中的第一个body元素或者frameset元素，如果没有的话将会返回null

#### document.images

返回一个HTMLCollection，其中包含document中的图片元素

#### document.embeds,document.pluguns

返回一个HTMLCollection，其中包含document中的embed元素

#### document.links

返回一个HTMLCollection，其中包含document中包含链接属性的元素，如a标签和area

#### document.forms

form元素集合

#### document.scripts

script元素集合

#### collection = document.getElementsByName(name)

#### document.currentScript

返回当前正在被执行的script元素或者SVG script元素。如果当前有`reentrant script`正在被执行，则会返回最开始执行且尚未执行完的脚本

如果当前执行的代码是位于一个回调函数或者异步执行的，则该属性会返回null

## elements

### 定义

HTML标准中为元素、属性和属性值定义了其对应的语义，而不是专门的表现形式。其表现形式可能会根据设备或者设置的不同而变化

### Elements in the DOM

元素表示DOM中的HTML元素节点实现并具有对应的相应属性。

元素可以被显式或者隐式的被引用。页面内部的跳转可以通过链接对id进行引用的形式进行

	<a href="#target-point">target point</a>

**所有HTML元素的基本接口都继承自HTMLElement对象**

### 元素定义

元素定义包含以下内容

* 元素类别
* 元素使用场景
* 内容模型：必须包含哪些内容作为元素的子元素和后代的规范性描述
* 元素使用语法
* 内容属性：可以在元素上指定的属性
* DOM接口：元素必须实现的DOM接口

#### 属性值

除特殊声明外，元素属性值是一个字符串，可以为任意字符串值，包括空字符串，并且对此类属性值中可指定的文本没有限制

### 内容模型

元素的内容模型是对元素内容的预期描述。元素内容是指其DOM树中的子节点

元素之间允许存在空格，UA将这些字符作为DOM树中的Text节点，空的Text节点和仅由这些空格组成的Text节点被视为元素间的空白（inter-element whitespace）

在确定元素的内容是否与元素的内容模型匹配时，必须忽略元素间空白，注释节点和处理指令节点，并且在遵循定义文档和元素语义的算法时必须忽略它们

因此，如果A和B具有相同的父节点并且在它们之间不存在其他元素节点或文本节点（除了元素间空白），则称元素A在第二元素B之前或之后。 类似地，当一个元素除元素间空白，注释节点和处理指令节点之外只包含一个节点，则该节点是元素的唯一子节点

HTML元素可以是一个孤立节点，比如在JavaScript中可以单独的创建一个HTML元素而不进行挂载

#### The "nothing" content model

如果一个元素的内容模型是空，则其中不能包含除元素间空白外的任何文本节点和元素节点

为了方便起见，大多数元素的内容模型都是"nothing" are also，例如无效元素（HTML语法中没有结束标签的元素），但是这与nothing是两个概念

#### 内容种类

每个HTML元素都属于零个或多个类别，类别划分依据为元素的不同特征，本规范中将元素划分为以下类别，[详情参见](https://html.spec.whatwg.org/dev/dom.html#content-models)

* metadata content

	metadata content是指用于设置内容其他部分的呈现方式或行为的内容，或者用于建立文档与其他文档的关系，传递其他信息

	其中包含base、link、meta、noscript、script、style、template、title等标签

* flow content

	其中的大部分元素用于body中的文档流内容，包含元素见[文档](https://html.spec.whatwg.org/dev/dom.html#flow-content)

* sectioning content

	用于定义标题和页脚区域内容，包含article、aside、nav、section等元素

* heading content

	用于定义页面的标题部分

* phrasing content

	包含文档内的文本以及用于标记段落内文本的元素

	**部分phrasing content元素内部只能包含同一类别的元素，不能包含所有的flow content元素**

* embedded content

	embedded content用于向文档中导入其他来源的内容或者向文档中插入其他内容，如canvas、img、iframe等

	一些embedded元素可能会具有备用内容，当请求的资源失败时，会展示该内容，例如img的alt属性

* interactive content

	交互式内容特指会与用户产生交互的内容。针对一些元素，可能存在某种条件才能与用户进行交互

* Palpable content

	当该内容至少具有一个节点并且不是hidden时，那么这个内容即为可触及内容

* Script-supporting elements

	此类元素一般不会被渲染，但是可以用于插入外部脚本，提供相应功能，如script与template

#### 透明内容模型

部分元素在内容模型中被视作透明的，如del、ins等元素。

透明元素的内容模型由其父元素的内容模型派生而得，内容模型中“透明”部分所需的元素与父元素内容模型中所需的元素相同

#### 段落

段落不仅限于有p元素指定的内容，其只是段落的一种表现形式。段落一般是指一个文本块或主题分组

### 全局属性

全局属性可以在所有元素上指定，详见[文档](https://html.spec.whatwg.org/dev/dom.html#global-attributes)

class、id、slot可以为所有的HTML元素指定

* class属性值为一组以空格分隔的标记，表示该元素所属的各种类
* 使用id标记元素时，其值在整个DOM树中必须唯一，且必须至少包含一个字符，不能包含空格。id是元素的唯一标识符
* slot属性用于内容的分发，具有slot属性的元素将被分配给对应name属性值的位置

可以在元素上指定其对应的事件处理函数。

一些事件句柄在window上具有同名的事件句柄，所以当其绑定在body上时与绑定在一般元素上意义不同

所有的事件都可以绑定在全部元素上，但并不是均适用于全部元素

可以在所有元素上指定自定义数据属性，用于存放对应的自定义数据、状态等内容

#### title属性

title属性用于表示元素的其他信息或相关描述。

* 如果元素未指定该属性，则其title属性取值将会依赖其最近的具有title属性的祖先元素相应取值
* 对元素设置该属性后，将会明确表示任何祖先元素的title信息都与该元素无关
* 设置title属性值为空，表明元素没有其他描述信息

如果title属性值中包含换行符，则内容将被分为多行。

#### lang与xml:lang属性

lang属性指定元素内容中的文字与所有包含文本的元素属性使用的语言，其取值必须为有效的BCP47语言标记或空字符串。将该属性设置为空字符串时意味着文档中使用的语言是未知的

如果元素定义中省略了该属性，则元素的语言与其父元素的相同

#### translate属性

translate属性是一个枚举属性，用于规定其对应元素的属性值及子文本节点的内容，是否跟随系统语言做出对应的翻译变化

属性取值：

* 空字符串或yes，对应yes状态，元素的转换模式处于translate-enabled状态
* no对应no状态，元素的转换模式处于no-translate状态
* 缺省值或者无效值对应继承状态

任何情况下，文档元素的转换模式与其父元素处于相同状态

* 当元素处于translate-enabled状态时，元素的可翻译属性及其Text节点子元素的值将在页面本地化时进行转换
* 当元素处于no-translate状态时，元素的属性值及其Text节点子元素的值将在页面本地化时保持原样

#### dir属性

dir属性指定元素的文本方向，是一个可枚举属性，具有以下关键字和状态

* ltr，映射到LTR状态，指定元素的文本内容方向是从左到右
* rtl，映射到RTL状态，指定元素的文本内容方向是从右向左
* auto，映射到自动状态，根据编程方式确定方向，一般为根据元素内容的第一个字符种类进行判断

该属性没有默认值和缺省值。

所有元素的方向都处于ltr或者rtl状态，其方向性的确定根据以下步骤进行匹配

* 如果元素dir属性处于ltr状态
* 如果元素是一个文档元素并且first属性未处于已定义状态（包括不存在或者是无效值）
* 如果元素是一个处于telephone状态的输入元素，并且dir未处于已定义状态

以上情况下元素的方向将处于ltr状态

如果元素的dir属性处于rtl状态，则其方向属性将为rtl

* 如果元素是处于text、search、telephone、url、email状态下的输入元素，并且其dir属性为auto
* 如果元素是一个textarea元素，并且dir属性是auto
* 如果元素的内容包含双向字符类型AL或R的字符，且在它之前不存在双向字符L型的字符，则该元素的方向性是rtl

否则，如果元素的内容不是空字符串或者元素是文档元素，则元素的方向性为ltr

否则，元素的方向性与其父元素相同

等等等等。。。。

**document.dir[=value]**

该属性值可读可写，返回html元素的dir属性。

可以设置为ltr、rtl或者auto代替原来html元素的dir属性值

如果没有html元素，将会返回空字符串并且忽略新设置的值

#### style属性

所有的HTML元素都可以设置style属性

**使用style属性隐藏或显示内容，以及传递文档中未包含的其他信息，是不符合要求的**

elemnt.style返回一个元素style属性的CSSStyleDeclaration对象

#### `data-*`自定义数据属性

**HTML文档中元素的属性名会自动小写**

每个HTML元素都可以指定任意数量的自定义数据属性

`element.dataset`将元素的自定义数据属性放在一个DOMStringMap中返回

获取单个自定义数据时，将之前的命名改为驼峰式作为dataset的属性值获取

#### innerText属性

element.innerText返回元素当前渲染的文本内容

设置该属性时，将会替代元素原来的后代，并且将设置内容中的回车换为br元素

#### 与双向算法有关的需求