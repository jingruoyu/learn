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

远程引用是对远程仓库的引用，包括分支、标签等

* `git ls-remote <remote>`：获取远程应用的完整列表
* `git remote show <remote>`：获取远程分支的更多信息

远程跟踪分支是对远程分支状态的引用，用户无法操作。当进行**网络通信**时，Git会为你移动它们以精确反映远程仓库的状态。

远程分支以`<remote>/<branch>`的方式命名，可以适配多个远程库的情况

如果要与给定的远程仓库同步数据，可以使用`git fetch <remote>`命令，该命令会查找对应的远程服务器，并从中抓取本地没有的数据，更新本地数据库，移动`<origin>/<branch>`指针到更新后的位置

在fetch之后可以运行`git merge <remote>/<branch>`，将远程分支合并到本地，此处`@{u}`或者`@{upstream}`均可以引用远程分支

### 推送

push功能需要对远程库具有写入权限，本地分支不会自动与远程仓库同步

`git push <remote> <local-branch>:<remote-branch>`：此处远程分支与本地分支名可以不相同

当其他用户从服务器抓取数据时，会在本地生成一个对应的远程分支，指向服务器分支的引用。**但是其本地不会自动生成一个本地分支**，只有一个不可修改的远程分支

`git checkout -b <new-branch> <remote-branch>`：在远程分支的基础上创建新的本地分支，名称可以不同

### 跟踪分支

从一个远程跟踪分支检出一个本地分支会自动创建所谓的“跟踪分支”。 跟踪分支是与远程分支有直接关系的本地分支

继在远程分支基础上创建本地分支后，git提供了其快捷方式

`git checkout --track <remote-branch>`

针对此快捷方式，满足以下条件
* 尝试切换的分支不存在
* 刚好只有一个与之匹配的远程分支

可以使用`git checkout <branch>`，Git就会创建一个与之匹配的跟踪分支

* `git branch -u <remote-branch>`：更改当前分支跟踪的远程分支，`--set-upstream-to选项效果相同`
* `git branch -vv`：查看所有跟踪分支，数据情况取决于最后一次fetch拉取的数据

### 拉取

`git pull`大多数情况下等于`git fetch` + `git merge`

### 删除远程分支

`git push origin --delete <branch-name>`：从服务器上移出指针

## rebasing

在git中整合来自不同分支的修改主要由两种方法：merge和rebase

### merge

会将两个分支的最新快照以及二者最近的公共祖先进行三方合并，结果为生成一个新的快照，效果如下图

![merge效果图](https://git-scm.com/book/en/v2/images/basic-rebase-2.png)

### rebase

`git rebase [branch]`

rebase可以将当前分支上的所有修改都移至目标分支。具体过程为

1. 找到这两个分支的最近共同祖先
2. 对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件
3. 将当前分支指向目标基底
4. 最后以此将之前另存为临时文件的修改依序应用

![rebase效果图](https://git-scm.com/book/en/v2/images/basic-rebase-3.png)

rebase和merge的效果没有任何区别，但是rebase使得提交历史显得更整洁。经过rebase处理的分支，尽管实际开发工作是并行的，但是在提交记录中是串行的，commit是一条直线

这样的好处是保持历史记录的整洁，尤其是在多人维护的项目中，使用rebase后最终项目维护者只需要在主分支上进行快速合并（即指针快进）即可

**无论是通过rebase，还是通过merge，整合的最终结果所指向的快照始终是一样的，只不过提交历史不同**。 

* rebase是将一系列提交按照原有次序依次应用到另一分支上
* merge是把最终结果合在一起