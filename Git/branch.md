# git 分支

使用分支意味着可以把工作从开发主线上分离开，避免影响开发主线。

在其他的版本控制系统中，可能需要完全创建一个源代码的副本，会很低效。Git与之不同，十分轻量

## 分支简介

**Git保存的不是文件的变化或差异，而是一系列不同时刻的快照**，Git使用blob对象保存快照

git在提交时，会保存一个commit object，其中包含

* 指向暂存内容快照的指针
* 作者姓名
* 邮箱
* commit message
* 指向父对象的指针

	首次提交产生的提交对象没有父对象，普通提交有一个父对象，多个分支合并时有多个父对象

### git提交流程

* 暂存操作计算每一个文件的校验和，将当前版本文件快照保存到git仓库，将校验和加入暂存区等待提交
* commit时计算每一个子目录的校验和，在Git仓库中将这些校验和保存为tree object
* 创建一个commit object，除正常内容外，还会包含指向tree object的指针

如此便可以在需要时快速重现快照

![commit-and-tree](https://git-scm.com/book/en/v2/images/commit-and-tree.png)

#### git分支本质上即为指向提交对象的可变指针，在每次提交时自动向前移动

### 分支创建

`git branch [new-branch-name]`：创建新分支，实质上为创建了一个可以移动的新指针，指向当前位置

![head-to-master](https://git-scm.com/book/en/v2/images/head-to-master.png)

Git中有一个名为`HEAD`的特殊指针，HEAD指针指向当前所在的本地分支，可以使用`git log`查看当前各个分支所指的对象

### 分支切换

`git checkout`：将HEAD指针切换到一个已存在的分支上，并且**工作区会变成该分支所指向的快照内容**

Git分支实质上仅包含所指对象校验和的文件（长度为40的SHA-1值字符串），故其创建和销毁都很高效。创建一个新分支就相当于向一个文件中写入41个字节（40个字符和1个换行符）

`git checkout -b [new-branch-name]`：基于当前分支新建并切换到该分支

## git分支合并

### git合并

`git merge`：合并分支，如果没有冲突，会自动的创建一个commit

merge的两种情况：

* Fast-forward：分支合并时，如果顺着一个分支的commit tree能够到达另一个分支，则Git在合并两者是只会简单地将指针向前推进，此时没有需要解决的冲突
* diverged：Git会使用两个分支末端所指的快照以及两个分支的公共祖先，做一个简单的三方合并

### 冲突解决

当不同的分支对同一个文件的同一部分进行了不同的修改时，Git无法干净的合并他们，合并时会产生冲突

可以在产生冲突后的任何时刻使用`git status`查看因合并冲突而处于`unmerge`状态的文件

git冲突标识：

```
<<<<<<< HEAD:index.html
<div id="footer">contact : email.support@github.com</div>
=======
<div id="footer">
 please contact us at support@github.com
</div>
>>>>>>> iss53:index.html
```

* HEAD指示的上半部分为当前分支的版本
* 下半部分为待merge分支的版本

冲突解决后，将目标文件使用`git add`暂存，Git会将其命令标记为冲突已解决。

所有冲突均解决后，可以使用commit提交

## 分支管理

`git branch`命令功能

* `git branch`：列出所有本地分支，`*`标记当前所在分支，即HEAD指针所指向的分支
* `git branch -v`：查看每个分支的最后一次提交
* `git branch --merged`：过滤出已合并到当前分支的分支
* `git branch --no-merged`：过滤出未合并到当前分支的分支
* `git branch -d [branch-name]`：删除指定分支，如果包含未完成工作，删除会失败，`-D`参数强制删除
* `git branch [new-branch-name]`：创建分支

`--merged`和`--no-merged`命令可以指定分支名

## 分支开发工作流

### 长期分支

* master：完全稳定
* dev：用于后续开发或稳定性测试，达到稳定状态即可合入master
* feature：特定功能点

![work-silos](https://git-scm.com/book/en/v2/images/lr-branches-2.png)

可以理解为流水线，经过测试的提交会被遴选到更加稳定的分支上去。**可以使用这种方式维护不同层次的稳定性**

### Topic branch

Topic branch对任何规模的项目都适用，作为一种短期分支，用于实现单一特性或其相关工作

Topic branch可以使用户快速且完整的进行context切换，工作被分散到不同的流水线中，在不同的流水线中每个分支都仅与其topic相关，便于代码review，而不必注意不同分支的建立顺序

## 远程分支
