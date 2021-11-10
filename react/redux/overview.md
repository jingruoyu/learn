## Redux

`Redux`是针对`JavaScript app`的可预测状态容器

可以将其与`React`或其他类似的工具库一起使用，Redux本身很小，但是在其生态系统中有大量的插件可以使用

### Redux basics

* store：整个App中的所有state都以object tree的形式存储在单个store中
* action：唯一改变state tree的方式是触发action，action是一个描述具体行为的对象
* reducers：指定action如何改变state tree，是一个纯函数
* dispatch
