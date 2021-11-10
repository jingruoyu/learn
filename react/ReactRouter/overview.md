## overview

### 匹配方式

router的匹配方式按照精确度进行，与code中各route顺序无关

`teams/new`is a more specific match than `/teams/:teamId`, so React will render related components.

### Navigaton

#### Link

`<Link to="about">About</Link>`

#### useNavigate

```javascript
let navigate = useNavigate();
navigate(`/invoices/${newInvoice.id}`);
```

**`useParams`可以获取路径中的参数**

### Nested Routes

`Route`可以互相嵌套，其path参数也会继承自父元素

```javascript
function App() {
  return (
    <Routes>
      <Route path="invoices" element={<Invoices />}>
        <Route path=":invoiceId" element={<Invoice />} />
        <Route path="sent" element={<SentInvoices />} />
      </Route>
    </Routes>
  );
}
```

外层component需要在其内部渲染child route匹配到的component，使用`<Outlet />`占位符进行相关匹配

```javascript
function Invoices() {
  return (
    <div>
      <h1>Invoices</h1>
      <Outlet />
    </div>
  );
}
```

嵌套的URL会映射到嵌套的component tree，当URL改变时，其对应内容也会发生改变。

### Index Routes

可以看做default child routes，当child route中没有匹配到任何东西时，会被渲染

```javascript
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Activity />}>
        <Route path="invoices" element={<Invoices />} />
        <Route path="activity" element={<Activity />} />
      </Route>
    </Routes>
  );
}
```

可以在任何层级上增加index route，当其parent被匹配但是child没有被匹配到时，会使用该route

### 相对路径

相对路径是指Link中不使用`/`开头的路径，其相对的路径为渲染他们的位置

### Not Found Route

`path="*"`可以匹配任意路径，但是优先级最低，可以用于渲染任何路径都无法匹配的404页面

### Routes

每个SPA中只能有一个`Router`，但是**可以有多个`Routes`**，不同区域的`Routes`相互独立，会根据当前path分别渲染

### Routes嵌套

`Routes`之间可以嵌套使用，但是当在内层`Routes`中定义新路径时，需要在外层`Routes`对应的路径上加`*`进行匹配，否则parent route无法匹配到新增的路径
