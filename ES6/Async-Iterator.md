## 异步遍历器

目前，Iterator协议中的next方法只能包含同步操作，**一旦执行next方法，必须同步的得到value和done两个结果**

一个变通的方法是将value的返回值变为Promise对象或者Thunk函数，等待以后返回真正的数据

ES2018引入了异步遍历器，value和done两个属性都可以异步产生

### 异步遍历的接口

异步遍历器接口部署在`Symbol.asyncIterator`属性上

异步遍历器最大的语法特点是调用遍历器的next方法后，返回的是一个promise对象，该对象变为resolve后回调函数的参数，是一个具有value和done两个属性的对象，和同步遍历器相同

异步遍历器的next方法，调用方式包括
* 在promise的回调函数中逐步调用
* 使用async函数，将next调用放在await后面
* 连续调用，不必等到上一步resolve后在调用

	此情况下，next方法会累积起来，自动按照每一步的顺序运行下去

### for await...of遍历

使用for await...of可以对异步遍历器进行遍历

如果next方法返回的promise对象被reject，for await...of就会报错，要用try...catch捕捉

for await...of循环也可以用于遍历同步遍历器

### 异步generator函数

generator函数会返回一个同步遍历器，异步generator函数返回一个异步遍历器

语法上，异步generator函数时async函数和generator函数的结合

在执行时，异步generator函数先执行generator函数，返回一个包含next方法的对象，该next方法执行后，返回的是后面await命令的执行结果Promise对象

```javascript
async function* gen() {
  yield await 'hello';
}
const genObj = gen();
genObj.next().then(x => console.log(x));
// { value: 'hello', done: false }
```

故异步generator函数想要得到真正的结果，需要结合async函数使用

```javascript
(async function () {
  for await (const a of gen()) {
    console.log(a);
  }
})()
```

异步遍历器设计的目的之一，就是使generator函数处理同步操作和异步操作时，能够使用同一套接口

异步generator中，yield命令后的变量会被自动包装为一个Promise对象

### yield*

也可以使用yield* 进行异步遍历，作用于上面相同