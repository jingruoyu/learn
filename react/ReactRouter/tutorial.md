## Tutotial

React Router是一个完备的React客户端和服务端routing library，用于构建用户UI的JavaScript library。**其可以在全场景下与React搭配，包括web、node.js server，React native**

### Connect the URL

import `BrowserRouter` and render it around your whole app

```html
<BrowserRouter>
    <App />
</BrowserRouter>
```

### Nested Routes

### Not Found Route

`*` will match only when no other routes do

### Reading URL parameters

`useParams` will get all parameters contained in the URL

### Index Route

index path 与parent path共享一个path，即它没有自己的path

* index routes在parent path下会被渲染，填充在parent route的outlet中
* index routes的匹配场景：parent route匹配，但是所有的children均未匹配
* index routes是parent route下默认route
* 当route list中所有的item均无法匹配时，会渲染index render

### Active Links

可以使用`<NavLink>`替换`<Link>`，区别在于`NavLink`知道当前的active状态，并可以将其作为参数传递给style和className的自定义函数

`<NavLink className={({ isActive }) => isActive ? "red" : "blue"} />`

### Search Params

* `setSearchParams`设置URL中的search参数
* `useSearchParams` return url search parameters，格式为[URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)对象

### Custom Behavior

可以组合使用API达到定制化的行为，如跳转时维持query不变
