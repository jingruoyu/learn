# Git Tools

## Revision Selection

Git能够以多种方式制定单个提交、一组提交或者一定范围内的提交

### 单个提交

可以通过标准的40个字符完整SHA-1散列值来指定commit，但还有其他更方便的方式

#### 简短的SHA-1

可以使用commitId最前面不少于4个且没有歧义的SHA-1进行指定，这也是唯一的。当前数据库中不会有其他对象以这段SHA-1开头

* `git log --abbrev-commit`可以输出简短的commitId
* `git show <shortCommitId>`

通常8到10个字符已经足够在一个项目中避免SHA-1的歧义。SHA-1摘要长度为40个16进制字符，即20字节，160位，所以很难出现冲突。

如果真的出现一个对象的散列值与之前不同对象的相同，Git会发现该散列值已经存在于repo中，则会认为该对象被写入，然后直接使用该对象。之后如果想checkout出这个对象，将会得到先前对象的数据

#### branch reference

直接引用分支可以引用到该分支当前最顶端的提交

`git rev-parse <branchName>`可以探测到该分支指向哪个特定的SHA-1

#### reflog shortname

git后台会记录最近几个月HEAD和branch所指向的地址，每当HEAD或branch所指向的位置发生变化时，都会被存储到log中

* `git reflog`命令查看
* `git log -g`查看

引用日志只存在于本地repo，记录你在自己的repo中的操作，每个人的引用日志是不同的

#### ancestry reference

可以在当前引用的尾部加上`^`或者`~`表示祖先提交

* `git show HEAD^{n}`：上一个提交，数字部分代表merge代码时的第n个父commit，因为merge会产生多个parent commit，默认为你合并时所在的branch
* `git show HEAD~{n}`：数字部分可以省略，表示向上追溯层级，默认为1

### commit ranges

#### `..`语法

`branch1..branch2`，筛选出在branch2中但不在branch1中的commit，两个branch的默认值均为HEAD

#### 更多的分支对比

```
$ git log refA..refB
$ git log ^refA refB
$ git log refB --not refA
```

使用`^`或者`not`参数指明不希望被包含的分支，此时可以指定更多的参数

```
$ git log refA refB ^refC
$ git log refA refB --not refC
```

#### `...`语法

`branch1...branch2`，选择出被两个引用之一包含但又不被两者同时包含的commit

## Interactive Staging

`git add -i`或者`git add --interactive`可以进入交互式终端模式，使用不同的选项可以进行不同的操作，可以暂存部分文件或文件的特定部分

* `git add --patch`：暂存文件特定部分
* `git reset --patch`：重置部分文件
* `git checkout --patch`：checkout部分文件
* `git stash --patch`：暂存部分文件

## stashing and cleaning

`git stash`将未完成的修改保存在一个栈上，等待合适的时机再应用，方便工作时切换分支

* `git stash list`
* `git stash apply`：--index，回到暂存前的位置
* `git stash drop`：移除特定暂存

### 从stash创建一个分支

`git stash branch <new-branch-name>`

可以从stash中创建一个新分支，checkout出stash工作时所在的commit，并将stash的内容放进去，最后丢弃该stash

### 清理工作目录

`git clean`：移除所有没有忽略的untrack的文件

更安全的选项是运行`git stash --all`，将所有内容移除并保存起来

也可以使用`git clean -d -n`的-n标记，进行一次dry run，查看即将移除的内容

## Signing Your Work

如果需要对其他人的commits进行验证，Git提供了几种可以通过GPG签署和验证工作的方式

### GPG

首先需要配置GPG，安装个人密钥，之后可以使用私钥进行签署信息

### Tag使用

* `git commit -S -m [message]`
* `git tag -v [Tag]`可以验证tag上的密钥是否有效，但需要signer的公钥在钥匙链中

### commit中使用

* `git tag -s [Tag] -m [message]`
* `git merge --verify-signatures -S [branch]`：merge前会检查并拒绝没有携带GPG签名的提交，s参数可以签署即将生成的merge commit，pull也可以使用

## Searching

git提供了`git grep`与日志搜索两种功能

### GREP

从committed tree、working directory甚至是索引中查找到一个字符串或正则表达式。默认为在当前working directory中查找

`git grep`优点在于快速，而且可以直接在旧版本的code中查找

### git log中搜索

* git log -S [string]：查找包含特定字符串改动的commits
* git log -L :[function-name]:[file-name]：确定function范围，查找function的每一次变更。也可以使用正则表达式，协助确定函数范围

## Rewriting History

**不要在push后修改commit历史**

### 修改最后一次提交

`git commit --amend`

* 此命令可以修改最后一次提交的message
* 如果需要修改content，可以先将文件放入暂存区，再运行此命令
* 只修改content不修改message，可以增加--no-edit参数

修改后SHA-1校验和会更新，新的commit会将原来的commit替换掉，类似于rebase

### 修改多个commit

`git rebase -i HEAD~3`后按照提示进行

* 修改信息
* 重排序
* 压缩
* 拆分
* 等

## Reset原理

