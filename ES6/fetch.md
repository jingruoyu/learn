## fetch

### abort

fetch返回一个promise，promise通常没有中止的概念，故通过内建对象**AbortController**，中止Promise

```javascript
let controller = new AbortController()
```

控制器controller上拥有
* abort方法
* signal

当abort方法被调用时
* abort事件就会在controller.signal上触发
* controller.signal.aborted 属性变为 true
* abort可以通过signal一次取消多个异步任务

可以在signal属性上监听abort事件，利用此机制，在Promise中，当abort事件发生时执行reject，中断异步任务

fetch内部集成了AbortController，将signal赋值给fetch参数中signal属性，就可以控制fetch