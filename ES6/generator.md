## generator

generator函数是一个状态机，封装了多个内部状态，**执行generator函数会返回一个遍历器对象**，通过该对象可以依次遍历函数内部的每个状态

与普通函数不同点
* 函数名前要加\*
* 函数内部使用yield定义不同的内部状态

### 函数调用

* generator调用后会返回一个遍历器对象，并不会直接执行
* 每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，**直到遇到下一个yield表达式（或return语句）为止**

	即Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行

	每次执行可以获得对应的value和done

	注意此处只会将yield表达式执行完，yield表达式所在的语句不会被执行，该语句会在下一个next时执行

yield调用返回的done为false，而return返回的done为true，故在使用generator的遍历操作中，**return返回的数据不会出现在遍历数据项中**

### yield表达式

yield为暂停标志

* 遇到yield，暂停执行后面操作，将紧跟在yield后面的表达式的值，作为返回对象的value值
* 如果没有遇到新的yield，则一直运行到函数结束，将return语句后面表达式的值，作为value值

	如果没有return语句，则value值为undefined

**yield后面表达式为惰性求值**，只有当调用next方法，内部指针指向该语句时才会求值

NOTE：
* yield表达式只能用在generator函数中
* yield表达式用在另一个表达式中，必须加圆括号
* yield表达式用作函数参数或放在赋值表达式的右边，可以不加括号

### 与Iterator接口的关系

部署了Iterator接口的对象会具有`Symbol.iterator`方法，就可以进行遍历操作，得到每个next执行的返回值

```javascript
interface Iterable {
  [Symbol.iterator]: () => {
		return {
	  	next() {},
	  	return() {},
	  	throw() {},
  	}
  },
}
```

#### 将generator赋值给遍历器接口

可以将generator函数赋值给对象的`Symbol.iterator`属性，这样可以直接遍历对象，获取generator中的历次返回结果

#### 直接遍历generator函数返回的遍历器对象

generator函数的执行结果为一个遍历器对象，遍历器对象自身也有遍历器接口`Symbol.iterator`方法，其执行结果指向自己

**故可以直接使用`for...of`遍历这个对象，调用其遍历器接口，获取内部数据**

```javascript
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

这个方法更为简单，利用了遍历器对象的内部属性

### next方法的参数

* yield指令默认返回值为undefined
* next方法可以指定参数，参数作为上一个yield指令的返回值

故可以使用next函数的参数，当generator函数开始运行后，继续向函数内部注入数据

第一次使用next方法是启动遍历器对象，传递参数是无效的，V8引擎会直接忽略第一次使用next方法的参数

### 使用yield遍历对象

```javascript
let obj = {
    name: 'name',
    address: 'address',
    [Symbol.iterator]: function*() {
        const props = Oeject.keys(this)
        for(let prop of props){
            yield this[prop]
        }
    }
}
```

此处需注意遍历时不要将Iterator属性也遍历出来，故使用了Object.keys方法

### generator.prototype.throw

generator函数返回的遍历器对象具有throw方法，可以在函数外部报错，函数内部使用try...catch捕获，不影响下一次next

此捕获仅支持捕获一次，当第二次调用时，不会被再次捕获，直接抛出函数体

使用时注意`generator.throw`与`throw`的区别

* generator.throw被捕获的前提是执行过一次next方法

	执行过next相当于generator函数被启动过

* throw方法被捕获后会附带执行一次next

在generator函数内部抛出的throw也会被外部的错误处理机制捕获，一旦generator抛出错误，JavaScript引擎会认为generator已经执行结束，再调用next方法将返回{value: undefined, done: true}

### generator.prototype.return

终结generator函数，将参数作为value值

如果generator内部有try...finally代码块，且正在执行try中的代码，则执行return后，
1. 立刻进入finally中执行
2. finally执行完后，再返回return指定的返回值

next、throw、return共同点
* next将yield表达式替换为一个值
* throw将yield替换为一个throw语句
* return将yield替换为一个return

### yield*

yield* Iterator

#### 用法

当generator函数形成嵌套时，如果需要获取内部generator，可以选择
* 对该generator执行后进行遍历，对每个输出都进行yield
* 使用**yield\***语法，在一个generator中执行另一个generator，等同于在generator中部署了一个`for...of`

实质上，yield* 后面也可以跟其他部署了遍历器接口的数据结构，其本质是在调用Symbol.iterator方法

#### 不同情况下yield\*的使用

* 当内部的generator没有return时，可以直接使用yield*
* 当内部的generator**有return时**，需要获取每次yield\*的返回值，以获取return语句的值

	因为return返回的数据不会出现在遍历项中

可以使用yield\*方便的遍历数组等数据结构

### generator的其他使用

#### 对象属性

```javascript
let obj = {
	* generator1(){
		// ...
	}

	generator2: function* (){
		// ...
	}
}
```

#### this

generator函数执行返回的遍历器对象实质上是generator的一个实例，继承了generator.prototype，但是generator函数本身不能直接作为构造函数使用

可以通过封装、原型链等方式，包装为构造函数，并且在实例中可以访问到this

### 含义

#### 状态机

generator可以作为状态机使用，因为其本身包含了一个状态：暂停态

* 无需保存状态的外部变量
* 状态不会被非法篡改
* 符合函数式编程的思想

#### 协程

协程与传统的堆栈式执行方式不同，协程是多个线程（在单线程下为多个函数）并行执行，但同时只有一个处于执行状态，其他都是暂停态

generator是js对协程的初步实现，目前仅是半协程，即只能有generator的调用者将执行权还给generator，真正的协程应该是任何函数都能让暂停的generator继续执行

generator中的yield可以视为是在多个需要协作的任务直接交换控制权

#### 执行上下文

js代码执行时，UI产生一个全局的上下文环境context，包含所有的变量和对象。然后在执行函数或块级代码是，又会产生一个新的上下文，作为当前环境，由此产生一个context的堆栈。这个堆栈后进先出，直到所有代码执行完成，堆栈清空

当generator遇到yield命令时，会将其执行产生的环境上下文**退出堆栈**，但是并不会消失，而是冻结里面的变量和对象。等到执行next命令时，再将上下文入栈，冻结的变量和对象**恢复执行**

### 应用

#### 异步操作的同步写法

需要在每个异步操作的回调中调用下个next，并且传入数据

#### 控制流管理

对于多个需要顺序的同步操作，可以使用generator进行控制

#### 部署Iterator接口

可以用于部署对象的Iterator接口，generator的yield语法在此处比自己写next更为方便

#### 用作数据结构

generator可以模拟数组的数据结构

## generator的异步应用

异步任务是指多个任务无法连续完成，部分任务要等待其他任务完成后才能继续执行的情况

异步任务的实现形式：
* 回调函数：大量嵌套会导致出现回调地狱
* promise：优化了写法，避免回调地狱的出现，但是也在调用中间插入了promise语法

    promise只是回调函数的改进，不是新的语法，只是一种新的写法，将回调函数的嵌套改为链式调用，但是会导致代码冗余，语义上变得不清晰

* generator函数

故generator的异步操作本质上还是利用回调函数和promise进行实现

### 协程

协程重点在于执行控制权在不同的函数之间交换，generator正好可以实现这一点，而异步应用的实现中，控制权就是在不同的函数之间先后交换

generator封装异步任务的优势
* 暂停执行与恢复执行（根本原因）
* 函数体内外的数据交换：可以通过next的执行与传参进行数据交换
* 错误处理机制：函数内部可以捕获外部抛出的错误

#### Thunk函数

当函数参数是一个表达式时，有两种实现机制
* call by name：将表达式传入函数体，在用到的地方执行
* call by value：在键入函数体前，先执行表达式，再将执行结果传入函数体

Thunk函数是编译器call by name的实现，即将参数放到一个临时函数中去，再将临时函数传入函数体

此处需要依赖thunkify的包，这个包将待执行函数、函数参数、函数回调分三次传入，只有传入函数回调函数后才会执行。

与generator函数结合后，generator每次均返回等待传入函数回调的value。利用thunk函数可以实现在generator函数的外部向其注入回调函数，在回调函数中执行next方法，从而进行generator的流程控制

但是这一系列的前提是generator内部的函数本身支持callback

#### co模块

可以像co模块传入generator函数，即可自动执行，且返回promise对象，可以使用then方法添加回调

使用co的前提是yield命令后面都是thunk函数promise对象

在使用promise对象后，每次yield命令返回的都是一个promise对象，故可以直接为这个promise增加then方法，在其中调用next，交回执行权

co实质上即为将每次的yield返回转变为promise对象，增加then方法，在其中调用next方法，以及出错时抛错，改变Promise状态