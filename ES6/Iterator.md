## Iterator

### 作用

Iterator遍历器用于给不同的数据结构提供统一的访问机制，部署了Iterator接口后，即可完成遍历操作

* 为各种数据结构提供一个统一的访问接口
* 使得数据结构的成员能够按某种次序排列
* **创造了一种新的遍历命令`for...of`循环**

#### 遍历过程

1. 创造一个指针对象，指向当前数据结构的起始位置
2. 第一次调用指针对象的next方法，指向数据结构的第一个成员
3. 不断调用指针对象的next方法，直到指向数据结构的结束位置

每次调用next方法，都会返回数据结构的当前成员信息，即一个包含value和done两个属性的对象
* value：当前成员的值
* done：布尔值，表示遍历是否结束

#### 遍历器的实现

遍历器的本身是和数据结构相分离的，**Iterator只是将接口规格加到了数据结构之上**

一个对象的`Symbol.iterator`方法，指向了它的默认遍历器方法

```javascript
//typescript
interface Iterable {
  [Symbol.iterator]() : Iterator,
}
```

### 默认Iterator接口

当使用`for...of`循环遍历某种数据结构时，会自动寻找Iterator接口

ES6规定，默认的Iterator接口部署在数据结构的`Symbol.iterator`属性上，即具有了这个属性，就认为是可遍历的

**执行`Symbol.iterator`属性，会返回一个遍历器对象。其本质特征就是具有next方法，执行后会返回value和done**

遍历器对象自身也具有`Symbol.iterator`方法，其执行结果指向自己。故当获取到一个遍历器对象后，也是可以直接通过for...of循环直接获取到内部的数据

原生具备Iterator接口的数据格式如下
* Array
* Map
* Set
* String
* TypedArray
* 函数的arguments对象
* Nodelist对象

```javascript
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

其他数据结构需要自己在`Symbol.iterator`属性上部署接口，才能被for...of循环遍历，也可在原型对象上添加此方法

**遍历器是一种线性处理，对于任何非线性的数据结构，都需要手动部署遍历器接口，完成线性转换**，所以对象没有原生的遍历器接口，因为其不能确定那些属性先遍历

可以手动为对象添加遍历器方法，该方法中的this是指向所在对象的

```javascript
let obj = {
    name: 'name',
    address: 'address',
    [Symbol.iterator]: function() {
        const props = Reflect.ownKeys(this)
        let nextIndex = 0
        return {
        	next: () => {
        		if (nextIndex < props.length) {
        			return {value: this[props[nextIndex++]]}
        		} else {
        			return {done: true}
        		}
        	}
        }
    }
}
```

Object.keys和手动遍历for...in的顺序一致，而for...in的顺序依赖浏览器的实现，并没有固定的保证[参考链接](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)

对于类数组结构，在部署接口时，也可以直接复制数组的遍历器方法

```javascript
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
```

### 调用场合

* 解构赋值

	对数组和set结构的解构赋值会用到iterator

* 扩展运算符

	扩展运算符或调用默认的Iterator接口，也即可以使用扩展运算符将数据结构转化为数组

* yeild*

	yeild\*后面跟的是一个可遍历的结构，会调用该结构的遍历器接口，逐次返回

* 其他场合

	数组的遍历会调用遍历器接口，任何接受数组作为参数的场合，其实都调用了遍历器接口

### 遍历器方法

* next：每次循环调用，返回value和done
* return：如果`for...of`循环提前退出，通常是因为出错或者break，就会调用。主要用于清理或释放资源
* throw：配合generator函数使用

### 使用

对于数组for...in方法只能获取key，for...of可以直接获取value

并不是所有的类数组对象都具有Iterator接口，可以先将其使用Array.from转换为数组后在使用遍历器

### 遍历语法比较

* for循环：比较原始
* Array.prototype.forEach：问题在于无法中途跳出forEach循环，必须遍历完所有数据才结束

	如果需要强行退出，可以通过抛出错误，然后外层try...catch实现

* for...in：可以用于遍历数据结构的key
	* 数据的key为数字，但是`for...in`遍历时会将其变为字符串
	* 不仅会遍历数字key，还会遍历手动添加的其他key，甚至包括原型对象上的key
	* 有时会以任意顺序遍历key

	故for...in主要用于遍历对象，不宜用于数组

* for..of
	* 与for...in语法相同，但没有其缺点
	* 遍历时可以使用break、continue、return等
	* 提供了所有数据结构的统一操作接口