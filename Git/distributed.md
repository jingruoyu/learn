# 分布式Git

[引用规范](https://git-scm.com/book/zh/v2/Git-%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86-%E5%BC%95%E7%94%A8%E8%A7%84%E8%8C%83#_refspec)

## 分布式工作流程

### Centralized Workflow

集中式工作流：所有人将自己的工作与中心仓库进行同步。

当前面的developer push代码后，后面的developer必须将之前开发者的工作合并进来，才能不会覆盖别人修改。此种模式即为常见的`non-fast-forward`

### Integration-Manager Workflow

集成管理者工作流：

1. contributor **fork主仓库**，并在其中做出修改
2. 通知主仓库maintainer ，请求拉取自己的更新
3. maintainer在自己的本地仓库中，将contributor的仓库加为远程库并merge对应commit
4. maintainer将修改push到主仓库

这是GitHub上开源库最常见的开发方式，优点在于
* maintainer可以随时拉取contributor的修改
* contributor不必等待maintainer处理完提交的更新

![集成管理者工作流](https://git-scm.com/book/en/v2/images/benevolent-dictator.png)

### Dictator and Lieutenants Workflow

多仓库工作流的变种，多级管理，分块整合，超大型项目使用的工作流

* 普通开发者在自己的分支上进行工作，并最终`rebase`到`master`分支上。这个`master`分支基于dictator仓库中维护的master分支
* lieutenants将普通开发者的工作合并到自己repo的master分支上
* dictator将所有lieutenant的master分支merge到自己的master分支中

![Dictator and Lieutenants Workflow](https://git-scm.com/book/en/v2/images/benevolent-dictator.png)

## 向一个项目做贡献

### git提交准则

[git commit Guidelines](https://git-scm.com/docs/SubmittingPatches)

修改建议

* 不要在代码中增加无意义空白，可以使用`git diff --check`找到可能的空白错误
* 尝试让每个提交成为一个独立的逻辑块
	* 交互式暂存：`git add --patch`
	* 重写历史：将工作发送给其他人前生成一个干净又易懂的历史。
* 简单易懂的提交信息

日志过滤器：`git log --no-merges branch1..branch2`，只显示所有在branch2，不在branch1的commit列表

### 不同的项目合作方式

* 私有的小型项目：一个branch，提交前merge最新changes
* 私有管理团队：通过不同的topic branch进行分工合作
* fork的公开项目：通过PR merge change，可以使用`git request-pull origin/master fork-repo`提交PR

	此处需注意，fork repo后，需要create一个新的topic branch进行工作，好处

	* 可以随时丢弃被reject的changes
	* 多个topic同时开发，不会互相干涉
	* 可以随时拉取主仓库最新code

* 通过邮件公开的项目：通过邮件发送待merge信息，较少

## maintain project

### topic branch

新功能一般在一个topic branch中进行开发，开发完成后，在考虑merge到master中

### Applying Patchs from Email

#### 使用`git apply`命令

如果对方使用`git diff`或其他命令生成patch文件，可以使用`git apply`命令

使用`git apply`命令应用patchs，效果与`git patch -pl`大致相同，区别在于

* 能接受的模糊匹配更少
* 能够处理`git diff`输出的文件添加，删除，重命名等操作
* 模式为全部应用或全部撤销，更为安全。patch命令存在部分应用情况，使得workspace状态别的很奇怪

相对来说，`git apply`比`git patch`要谨慎一些

可以在apply命令前使用`git apply --check`检查patchs能否被顺利应用

#### 使用`git am`命令

am: apply a series of patchs from a mailbox

如果对方使用`git format-patch`生成最终的patch文件，可以使用`git am`命令（encourage）

### fork repo

* maintainer将对方fork的repo添加为自己的remote repo
* fetch对方最新的code
* 基于对方的repo和branch create一个本地的branch，并进行验证

### 查看更改

真实意图为查看本次的所有修改内容

`git diff master`会造成当前分支直接与master上最新提交进行对比，master很可能会向前移动，获取的结果会有偏差

可以先找到当前分支与master的公共祖先，然后与公共祖先进行diff操作

```
$ git merge-base contrib master
36c7dba2c95e6bbb78dfa822519ecfec6e1ca649
$ git diff 36c7db

// 简洁版
git diff $(git merge-base contrib master)
```

极简版：`git diff branch1...branch2`，输出branch2相对于两者共同祖先的diff

### Integrating contributed work

#### Merging workflows

1. 直接merge到master
2. 分阶段merge循环。即master + dev双分支

#### Rebasing and Cherry-Picking Workflows

* rebase：目标为得到一个线性的提交历史
* cherry-pick：只有部分commit想要提交时使用

### 为项目发布打标签

创建标签后，可以在之后的任何一个提交点使用该tag重新创建发布
