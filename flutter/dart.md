# dart

## flutter与dart

外部因素：java在Oracle的版权问题

dart优秀：
* AOT：ahead of time，提前编译，即在程序运行之前自行编译，编译为快速、可预测的本地代码，使flutter更快
* JIT：just in time，实时编译，可以实现亚秒级有状态热重载
* 动画流畅，轻松实现60fps
* 对象分配、垃圾回收、内存管理等更像JavaScript，没有锁
* 布局简单

计算机语言划分为静态语言和动态语言，静态语言如C、C++变量类型编译时即可确定，动态语言如JavaScript变量类型运行时才可以确定。故静态语言通常编译成目标机器的机器码，由硬件直接执行，动态语言由解释器执行，不产生机器语言代码

在此基础上，产生了AOT提前编译与JIT实时编译
* 静态语言提前已知类型，在运行前可以编译，适用AOT。AOT编译速度慢，编译完后执行速度快
* 动态语言数据类型提前不可知，需要解释器执行或适用JIT。JIT开发时编译速度快，但执行速度不稳定，启动时间长

**dart结合二者优点，开发过程适用JIT编译，编译速度快，准备发布时使用AOT编译，执行速度快，启动时间短**

dart还可以编译为其他语言，如JavaScript，实现在其他领域的应用
