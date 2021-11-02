# 分布式Git

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