# 5 microdata

## 5.1 introducton

microdata期望使用**机器可读的标签注释内容**，使用该注释提供一些页面的定制化服务或使用统一的脚本处理来自多个来源的内容

microdata使用name-value组的形式嵌套进文档，其与文档内容本身保持平行

### 5.1.2 基础语法

元数据由一组`name-value`对组成。

在元素上使用`itemscope`属性创建一个项目，在该元素的后代上使用`itemprop`属性指定name，子元素本身的value属性或其他属性指定value，所形成的所有`name-value`对均为父元素的元数据

属于父级元素itemscope中的元素，也可以有自身的itemscope，不属于其他scope的元素，称为顶级元数据项。

