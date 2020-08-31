## 二进制数组

ArrayBuffer对象、TypedArray视图和dataView视图是JavaScript操作二进制数据的接口
* ArrayBuffer代表内存中的一段二进制数据
* TypeArray用于读写简单类型的二进制数据
* dateView用于读写复杂类型的二进制数据

二进制数据诞生背景

webGLobal诞生后，JavaScript需要和显卡之间进行大量、实时的数据交换，如果采用传统文本格式，两方都需要转换数据，浪费性能，故直接采用二进制数据

二进制数组允许开发者以数据下标的形式直接操作内存，大大增强了JavaScript处理二进制数据的能力，开发者可以使用js和操作系统的原生接口进行二进制通信

### ArrayBuffer

ArrayBuffer代表存储二进制数据的一段内存，不能直接读写，只能通过视图来读写，视图作用为以指定格式解读二进制数据

