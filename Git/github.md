# Github

## contribution

源repo更新后，GitHub并不会自动更新fork后的repo，有很多解决办法

fork仓库更新最简单办法

1. 添加源repo到fork后的仓库，称为progit
2. 将master分支设置为从progit repo抓取数据
3. 将默认push repo设置为fork后的origin repo

```
$ git remote add progit https://github.com/progit/progit2.git (1)
$ git branch --set-upstream-to=progit/master master (2)
$ git config --local remote.pushDefault origin (3)
```

设置后，更新repo只需要

```
$ git checkout master (1)
$ git pull (2)
$ git push (3)
```

## maintain

### PR

实际上，github会将PR视为一种假分支，`refs/pull`开头，默认情况下clone是不会得到他们，但还是会隐式存在

使用`git ls-remote`命令可以展示repo中所有的branch、tags和其他reference

**每个PR会有两个reference，其中以`/head`结尾的引用指向的是PR origin branch的最后一个commit**。所以可以使用`pull/<pr#>/head`直接抓取对应PR的提交。可以使用`git fetch`完成数据的拉取

也可以通过修改git config文件，达到fetch自动拉取PR数据的效果

## Scripting

GitHub中的Webhooks是GitHub与外部交互最简单的方式

github已经放弃Services，转而全面使用WebHooks

### Webhooks

WebHooks可以在repo发生某些特定事件时发送HTTP请求到指定的URL，默认行为是push事件

### GitHub API

### 基本用途

可以通过API访问一些不需要授权的信息，如用户信息，commit、issue信息等

### 用户认证

部分接口需要增加用户认证，可以使用用户名密码认证，但更推荐使用个人的access token

可以在GitHub中生成token，然后发请求时将其添加在header的Authorization中

更方便的GitHub API使用详见[Octokit](https://github.com/octokit)
