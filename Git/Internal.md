# Git内部原理

Git是一个内容寻址系统，并在此之上提供了VCS的用户交互系统

## 底层命令与上层命令

Git分为底层命令与上层命令
* 底层命令，plumbing commands，完成底层工作
* 上层命令，porcelain commands，更加友好，便于调用

`.git`目录下的典型目录结构为

* config：项目特有的配置选项
* description
* HEAD：指向目前被checkout的branch
* hooks/：客户端和服务端hooks
* info/
	* exclude：全局性的排除文件，可以放置一些不希望被记录在`.gitignore`中的忽略模式
	* refs
* objects/：存储所有数据内容
* refs/：存储指向各位置的commit指针
* index：保存暂存区的信息

## Git对象

### Blob Objects

Git的核心是一个key-value data store，键值对数据库。可以向Git repo中存入任何内容，Git会返回一个unique的key，使用key检索到对应的content

Git中key为长度为40个字符的校验和，这是一个SHA-1哈希值，由待存储数据和一个header一起做SHA-1运算而得

**这种方式下仅保存了文件内容，没有保存文件名。此种数据为Blob Object**

### Tree Objects

* Tree Objects对应Unix中的directory entries
* Blob Object对应inodes或者file contents

一个Tree Object对应一个或多个tree entry，每条entry都是一个Blob Object或者SubTree Object

![简化的数据存储模型](https://git-scm.com/book/en/v2/images/data-model-1.png)

### Commit Objects

Commit Object能够保存最顶层的Tree Object，方便随时重用历史快照

`git add`和`git commit`操作的实质即为
* 将被改写的文件保存为Blob Object，更新暂存区
* 生成对应tree Object
* 生成commit objects，指向顶层的tree object和parent commits

### Object Storage

* 增加header：不同的对象不同的类型标识
* 计算SHA-1校验和
* 压缩整体大小
* 按照校验和生成路径存储

## Git references

`.git/refs`下的文件用于保存不同用途的SHA-1的值
	* tags
	* heads：内部再分branch
	* remotes：记录最近每次push操作每个branch对应的值

### HEAD

`.git/HEAD`文件用于说明最新commit的SHA-1值，一般是一个symlink，指向其目前所在的分支，特殊情况下也会是一个SHA-1值

### Tag

标签对象Tag Object通常永远指向同一个Commit Object，也可以指向其他对象

### Remotes

remote references和local branch之间最主要的区别在于，remote references是只读的。 虽然可以 git checkout 到某个远程引用，但是 Git 并不会将 HEAD 引用指向该远程引用。因此，你永远不能通过 commit 命令来更新远程引用。 Git 将这些远程引用作为记录远程服务器上各分支最后已知位置状态的书签来管理。

## Packfiles

Git最初向磁盘中存储object使用的是松散（loose）object format。

但是Git会时不时将多个这样的Object打包为一个称为packfile的二进制文件，以节省空间和提高效率

打包时机
* repo中有太多的loose objects
* 手动执行`git gc`
* push to remote server

打包后，objects目录下新增

* `info/packs`
* `pack/`
	* pack-xxx.idx：索引文件，包含了packfile的偏移信息
	* pack-xxx.pack：packfile

节省空间的办法：Git在打包Objects时，会查找命名及大小相近的文件，并只保存文件不同版本的diff。

一般情况下会保存最新版本的完整内容，历史版本以diff的形式存在，因为大部分情况下需要快速访问文件的最新版本

## 传输协议