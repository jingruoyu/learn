## Linux history

### 1969

所有现代操作系统都起源于1969年，当时Dennis Ritchie和Ken Thompson在`AT&T`贝尔实验室开发了C语言和Unix操作系统，他们开源了操作系统的代码。 到1975年，当`AT&T`开始商业销售Unix时，大约一半的源代码是由其他人编写的。 嬉皮士对一家商业公司出售他们编写的软件并不满意； 最终的（合法的）战斗以Unix的两个版本结束：正式的AT&T Unix和免费的BSD Unix

BSD的后代，如FreeBSD、OpenBSD、NetBSD、DragonFly BSD和PC-BSD的开发至今仍然活跃

### 1980s

80年代很多公司都开始开发自己的Unix操作系统，最终的结果是有很多Unix分支，并且以不同的方法去做同样的事情

这是Linux第一个真正的根，当时Richard Stallman旨在结束Unix分离的时代，每个人都重新发明轮子，开始GNU项目(GNU不是Unix)。他的目标是创造一个人人都可以免费使用的操作系统，并且人人都可以一起工作(就像70年代那样)。今天在Linux上使用的许多命令行工具都是GNU工具。

### 1990s

90年代，一个讲瑞典语的芬兰学生Linus Torvalds买了一台386电脑，编写了一个全新的兼容POSIX的内核。他把源代码放到网上，以为它只支持386台硬件。许多人接受了这个内核与GNU工具的结合，其余的，如他们所说，已经成为历史。

## 贡献

### Red Hat

Red Hat公司提供Red Hat Enterprise Linux 和 Fedora两款产品

### Ubuntu

Canonical从2004年开始使用Ubuntu Linux分发免费光盘，并迅速在家庭用户中流行起来(许多用户从微软Windows切换过来)。Canonical希望Ubuntu成为一个易于使用的图形化Linux桌面，而不需要看到命令行。当然，他们也想通过销售对Ubuntu的支持来获利

### Debian

Debian背后没有公司。取而代之的是，有成千上万组织良好的开发人员每两年选举一次Debian项目负责人。Debian被视为最稳定的Linux发行版之一。 它也是每个Ubuntu版本的基础。Debian有三种版本：稳定版，测试版和不稳定版。每个Debian版本都以电影《玩具总动员》中的角色命名

### others

像CentOS、Oracle Enterprise Linux和Scientific Linux这样的发行版都是基于Red Hat Enterprise Linux的，它们共享许多相同的原则、目录和系统管理技术。Linux Mint、Edubuntu和许多其他buntu命名的发行版都是基于Ubuntu的，因此与Debian有很多共享。还有数百个其他的Linux发行版

## 使用引导

主要命令：
* man
	* man $command：查看命令说明
	* man $configfile：查看配置文件说明
	* man $daemon：查看守护进程说明
	* man -k string：查看包含指定字符串的说明list
	* man man：man指令的说明，其中description展示章节序号及其表示内容
* whereis：展示手册页位置，该位置的文件是直接可读的
* whatis
	* whatis string：查看string的描述
* mandb

