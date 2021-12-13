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

可以将Git的管理模式想象为三棵树

* HEAD：上一次提交的快照，下一次提交的父节点
* Index：预期的下一次提交的快照
* working directory：sandbox

### HEAD

HEAD指向当前分支引用的指针，总是指向该分支的最后一次提交

### Index

Index是预期的下一次提交，也会将这个概念引用为git的暂存区，也就是运行git commit时Git的状态

### working directory

工作区。其他两棵树将他们的内容存储在.git文件夹中，高效但不直观，而working directory则会将他们unpack为实际的文件以便编辑。

[工作流程](https://git-scm.com/book/en/v2/images/reset-workflow.png)

**当checkout到一个分支时，会修改HEAD使其指向新分支的引用，将Index填充为该次commit的快照，然后将Index的内容复制到working directory**

### reset作用

#### 移动HEAD

如：`git reset --soft HEAD~`

在当前分支上移动HEAD指向，将会更改当前分支的指向

#### 更新Index

`git reset [--mixed] HEAD~`

指定mixed选项后，Index将会取消暂存的所有东西

#### 更新working directory

`git reset --hard HEAD~`

使用hard参数后，工作目录将会和Index一起更新到HEAD所指位置

**hard参数是reset命令中唯一的危险用法，会真正销毁数据，且不可以撤销**

### 指定路径的reset

指定路径的reset将会把作用范围限定在指定的文件或文件合集。这样就会跳过第一步，因为HEAD指针无法同时指向两个提交中各自的一部分，但是Index和working directory可以进行部分更新，所以第二、三步还是会执行

`git reset file`与`git add file`的作用正好相反，所以该命令可以用于**取消暂存文件**

`git reset [commitId] file-name`

### checkout

checkout也会操作HEAD、Index和Working directory三棵树，但是区别在于是否向其传递一个文件路径

#### 不带路径

`git checkout [branch]`与`git reset --hard [branch]`很像，区别在于

* checkout对于工作目录是安全的，不会将已更改的文件弄丢。而reset会全面替换所有文件
* checkout只会移动HEAD自身指向另一个分支，而reset会移动**HEAD分支**的指向

#### 带路径

带文件路径的checkout会想reset一样不移动HEAD，使用目标branch中的file来更新Index和工作目录，对于working directory同样不安全

## Advance Merging

Git不会尝试解决冲突，需要自行解决

### merge conflicts

#### 中断一次merge

`git merge --abort`

遇到冲突时退出合并，恢复到运行merge之前的状态。但是其不能完美之前工作区处理未提交的内容。此时也可以使用`git reset --hard HEAD`回到上次commit的状态，但是所有未提交的工作都会丢失

#### checkouting out conflicts

git checkout的部分选项在merge中可以帮助合并冲突

* conflict选项可以用于替换合并标记
* --[branch]可以用于留下一方的修改，直接丢弃另一方

#### 合并日志

使用git log的`...`语法可以帮助我们查看可能产生冲突的分支

`git log --oneline --left-right HEAD...MERGE_HEAD`

使用merge参数会进一步得到任何一边接触了冲突文件的commit

### 撤销合并

#### 修复引用

**如果merge commit只存在于本地repo**，最简单的方法为将HEAD分支移动到目标位置。

`git reset --hard HEAD~`

但是此方法只能用于merge commit还没有push的阶段，否则推荐使用revert commit

#### revert commit

Git将会生成一个新的commit，该commit会撤销之前commit的所有修改

`git revert -m 1 HEAD`

但是这样会产生一个问题：之前revert掉的内容无法再merge到当前分支，因为这些内容都存在于Git中。如果在其上发生改动，只有改动的内容会被merge进来。

解决办法为再次revert到之前回滚的版本上去，原理图如下

[revert原理图](https://git-scm.com/book/en/v2/images/undomerge-revert3.png)

### 其他的一些合并方式

#### 假合并

#### 子树合并

## Rerere

Git的隐藏功能，全称为reuse recorded resolution，即让Git记住解决一处conflict的方法，当下次遇到相同的冲突时，Git会自动解决它

使用场景：

* 在一个长期分支上merge外部的topic branch，不用解决相同的冲突
* rebase情况同上
* 在解决了一堆冲突后，但是想撤销此次修改，不过解决冲突的方式希望记录下来

`git config --global rerere.enable true`：开启rerere功能

## Debugging with Git

### file annotation

`git blame`：查看文件每行最后一次修改的提交记录

`git blame -C`：找出文件中code的原始出处，对于复制过来的代码片段很有用

### Binary Search

假设发现线上版本有问题，当无法确定引入问题的commitId时，可以使用二分查找在正常的commit与当前commit之间迅速确定出错的版本

1. `git bisect bad`
2. `git bisect good <commitId>`
3. `git bisect <status>`
4. ...
5. `git bisect reset`：重置HEAD指针回到最开始的位置

此过程也可以通过脚本进行，`git bisect run test.sh`

## Submodules

工作过程中有时需要将A项目嵌入到B项目中，如之前common库嵌入到全搜项目中

Git可以使用子模块解决这个问题，将一个Git repo作为另一个Git repo的子目录。这能够将另一个项目clone到自己的项目中，同时还能保证提交的独立性。

### 子模块

`git submodule add [remote-url] [directory]`：在项目中添加子模块

此时在项目根目录下会生成一个`.gitmodules`文件，用于记录submodule相关信息，此文件也受到版本控制

文件夹中针对子模块的commit信息也会不同，其本质上意味着试讲一次提交记录作为目录提交的，而非将其记录为一个子目录或文件

### Cloning a Project with Submodules

clone一个项目后并不会自动pull子模块的数据,需要运行两个命令才可以拉取到数据

* git submodule init：初始化本地配置文件
* git submodule update：拉取所有数据并checkout出合适的commit

还有一些其他的简便命令

* git clone --recurse-submodules：递归操作init + update
* git submodule update --init
* git submodule update --init --recurse

### Working on a Project with Submodules

#### 子模块数据拉取

`git submodule update --remote`：Git会进入子模块然后抓取数据并合并

默认跟踪master分支，可以进行设置

* 在`.gitsubmodules`文件中进行设置，对所有项目成员生效，推荐
* 在`.git/config`文件中进行设置，只对自己生效

项目成员需要使用git pull --recurse-submodules更新自己的submodule，或者手动运行命名更新

**当submodules的remote-url发生变化时，无法通过以上命令自动更新**，需要使用

```shell
# 将新的URL复制到本地配置中
git submodule sync --recurse
# 使用新的URL更新submodule
git submodule update --init --recursive
```

#### working on a submodule

```
git commit -am [message]
// back to host directory
git submodule update --remote --[rebase/merge]
git push --recurse-submodules=check
```

此操作能够

* 开发本地submodule
* 将本地submodule与远程分支同步，merge或rebase
* 同时push host project和submodule

## bundling

* `git bundle create [bundle-name] [bundle range]`
* `git bundle verify [bundle-name]`
* `git fetch/pull [bundle-name]`：导入数据

## Replace

Git对象具有不可改变的特性，replace命令用于在Git中将一个对象伪造成另一个对象

也可以用于截断commit tree

## Credentials Storage

* SSH连接：可以不提供口令
* HTTP连接：每次均需提供用户名密码

Git提供了一个credentials system解决token存储问题

## Summary

* commitId原理
* HEAD、Index、working directory三棵树
* reset原理与使用，与checkout区别
* `..`语法，`...`语法，`~`语法，`^`语法
* revert使用
* merge使用，merge中断
* 二分法搜索commit
* 子模块
