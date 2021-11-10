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
* index routes是parent route下默认的child route
* Index routes render when the user hasn't clicked one of the items in a navigation list yet.