## 性能优化

### 一般的性能优化步骤

* 确认你是在production环境上验证的性能。因为dev环境有意运行变慢，极端情况下甚至存在数量级上的差异
* 不要将状态放到过高的层级上
* 运行React Devtools Profiler查看re-rendered的原因，为最消耗性能的部分加上memo和useMemo

最后一步比较繁琐，需要详细确定对应的组件，也许将来编译器会做这一步

以下介绍另外两种优化方法，值得去尝试

### 状态下沉

状态过高会导致状态更改时影响的组件范围过多

### 内容提升

将部分不希望re-rendered的content通过组件的props传进来，如此在组件重新渲染时，此部分未改变，不会生成新实例

```javascript
export default function App() {
  return (
    <ColorPicker>
      <p>Hello, world!</p>
      <ExpensiveTree />
    </ColorPicker>
  );
}

function ColorPicker({ children }) {
  let [color, setColor] = useState("red");
  return (
    <div style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      {children}
    </div>
  );
}
```

### 总结

在使用memo和useMemo之前，需要首先考虑**将组件中可变与不可变的部分拆分**

内容提升的本意是用于内容进行拆分，使得组件更衣懂，性能优化是它的一个副作用，而且其可能将来还会有别的优点，如在server component方面

如果这些的方法均不能有效优化性能的话，然后再去考虑使用profiler分析和mome