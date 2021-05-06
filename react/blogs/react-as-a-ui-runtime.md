## react运行时的逻辑

[react-as-a-ui-runtime](https://overreacted.io/react-as-a-ui-runtime/)

### batch update

[Dan的解释](https://github.com/facebook/react/issues/10231)
* 同一个React event handler中同步的多次setState会被batch，在handler退出之前执行。
    
    注意此处为react的event handler，基于react事件委托的机制，一个React event handler实质上为同一个事件所引起的所有event handler

* 异步的事件循环，如network response、setTimeout等，不会被batch
* 可以使用**ReactDOM.unstable_batchedUpdates**强制batch
* 未来react希望可以全部batch

react如此设计的一个原因是：如果一个React event handler中存在多个setState，每次set后都立即渲染，将会导致很多不必要的渲染

```
*** Entering React's browser click event handler ***
Child (onClick)
  - setState
  - re-render Child // 😞 unnecessary
Parent (onClick)
  - setState
  - re-render Parent
  - re-render Child
*** Exiting React's browser click event handler ***
```

真正的batch update流程是

```
*** Entering React's browser click event handler ***
Child (onClick)
  - setState
Parent (onClick)
  - setState
*** Processing state updates                     ***
  - re-render Parent
  - re-render Child
*** Exiting React's browser click event handler  ***
```

组件中的setState不会立即调用re-render，React会一次性执行所有的event handler，然后只触发一次re-render，批量执行所有的update

批量执行可以提高性能，但是可能会导致一些其他方面的问题，如一个同步函数中多次调用setState效果会出现问题，解决方式是想setState传入一个函数。React会将这些updater放入queue中，然后一次性执行，得出最终结果

当状态的更改逻辑更复杂时，建议使用**reducer**进行处理

问题：
* setTimeout内的任务无法被batch

    与React的更新机制有关，详见https://zhuanlan.zhihu.com/p/78516581

* vue的执行机制

	vue依赖于事件队列进行数据的批量更新，与react原理不同。因为react是不依赖于底层框架的，所以未用到事件机制