# 2 基础概念

## 2.1 术语

* 属性是指JavaScript对象属性和CSS属性
* 文档用于引用document对象及其后代DOM树

### 2.1.1 resources

### 2.1.3 DOM trees

* 只有当属性的新值与旧值不同时，才称属性值发生变化。为属性赋值是如果没有发生变化，则没有改变属性值
* empty用于描述内容长度为0的属性值、文本节点或者字符串
* A node A is inserted into a node B 与 a node A is removed from a node B
* A node is inserted into a document 与 a node is removed from a document
* 节点的connected与disconnected

## 2.6 公共DOM接口

### 2.6.1 在IDL属性中反映内容属性

一些IDL属性用于描述特殊的内容属性，在getting阶段可以获取内容属性，在setting阶段可以通过通过IDL属性对内容属性进行设置

IDL：Interface description language，接口描述语言

### 2.6.2 集合

`HTMLFormControlsCollection`和`HTMLOptionsCollection`接口都是派生自`HTMLCollection`接口的集合，`HTMLAllCollection`也是一个集合，但不是派生自`HTMLCollection`接口

#### 2.6.2.1 HTMLAllCollection接口

`HTMLAllCollection`接口用于`document.all`属性的使用，其使用类似于`HTMLCollection`，最大区别在于其拥有更多样化的调用方法，既可以通过函数调用，也可以通过属性获取

所有的`HTMLAllCollection`接口都根植于Document对象，并且会筛选过滤出文档中所有的元素，所以`HTMLAllCollection`接口中包含Document根节点所有的后代元素

collection使用：

* collection.length

	返回集合中元素数量

* element = collection.item(index) || element = collection(index) || element = collection[index]

	返回集合中第index个元素，其具体顺序由DOM树决定

* element = collection . item(name)

	```
	element = collection . item(name)
	collection = collection . item(name)
	element = collection . namedItem(name)
	collection = collection . namedItem(name)
	element = collection(name)
	collection = collection(name)
	element = collection[name]
	collection = collection[name]
	```

	根据元素ID或者name返回collection中的元素

**当匹配到多个元素时，会返回一个HTMLCollection对象包含所有元素**

仅button、form、iframe、input、map、meta、object、select和textarea元素可以拥有name属性

#### 2.6.2.1 HTMLFormControlsCollection接口u


