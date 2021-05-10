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

## 记录每次更新到repo