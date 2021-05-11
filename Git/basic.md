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

* git commit：基础命令
* git commit -m [message]：将message放在命令行中
* git commit -a -m [message]：跳过暂存区域，自动将所有已跟踪的文件暂存并提交，**注意未跟踪文件，如新建的文件不会被暂存和提交**

### `git rm`

从git中移除文件，必须要从暂存区移除，然后提交，此处可以用到`git rm`命令完成，并且可以顺带从工作目录中删除指定文件

如果需要删除已经修改过且添加到暂存区的文件，需要增加`-f`参数，强制删除

`rm`与`git rm`区别
* `rm`：从工作区删除文件，但并未从暂存区移除，如果想要恢复，需要将工作区该文件的修改丢弃`git checkout -- filename`
* `git rm`：工作区+暂存区删除文件，恢复需要丢弃暂存区该文件修改，即将该文件从暂存区恢复到工作区 + 丢弃工作区修改

### `git mv`

进行文件的重命名，相当于
* mv file1 file2
* git rm file1
* git add file2

## 查看提交历史

git log可以查看提交历史

options
* -p：展示每次提交的内容差异
* --stat：展示简略的统计信息
* --pretty=[option]：指定使用不同的格式展示提交历史，其中format可以自定义格式
* --graph：使用图形象展示commit之间关系，与pretty搭配使用
* -[num]：限制显示条数
* 其他一些筛选条件
* -- filePath：指定文件路径

## 撤销操作