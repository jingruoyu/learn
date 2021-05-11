# git基础

## 获取repo

### 初始化repo

* `git init`：创建一个名为`.git`的目录，git仓库的核心
* `git add`：实现对指定文件的暂存
* `git commit`：提交

### clone repo

git克隆的是该git仓库服务器桑的几乎所有数据，**默认配置下远程Git仓库中的每一个文件的每一个版本都将会被拉取下来**，而不是仅复制完成工作所需的文件。如果服务器上磁盘坏掉了，也可以通过任何一个用户端重建服务器上的仓库

`git clone [url]`

git支持多种数据传输协议，包括
* `https`协议
* `git://`协议
* `SSH`传输协议

详见[在服务器上搭建git](https://www.progit.cn/#_git_on_the_server)

## 文件的生命周期

![git中文件的生命周期](https://www.progit.cn/images/lifecycle.png)

### `git status`

检查当前文件状态，该命令会列出当前目录下
* 已跟踪但被修改的文件
* 未跟踪状态的新文件
* 当前所在的分支
* 当前分支与远程分支是否存在偏离

`git status`命令的输出比较详细，使用`git status -s | --short`命令输出较为简短

### `git add`

git add [filename | .]

该命令会跟踪新文件或者暂存已修改的文件

### `.gitignore`

配置需要git忽略的文件，支持正则匹配

### `git diff`

可以详细查看已暂存和未暂存的修改

* git diff：默认只显示工作区修改
* git diff --cached | --staged：显示暂存区修改

### `git commit`

将已暂存的文件提交更新

为防止有遗漏的文件，建议每次提交前，先用git status查看文件是不是都已经暂存，然后再进行commit

**提交时的记录是放在暂存区域的快照**。每一次提交操作，都是对项目做一次快照，以后可以回到这个状态，或者进行比较