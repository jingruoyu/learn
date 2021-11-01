# Angular

## introduction

Angular is a development platform built on Typescript，it includes:

* A component-based on framework
* An integrated libraries，cover routing, form management, client-server communication and more
* A suite of developer tools

## Essentials

### Components

components是组成Application的基础结构，包括三个部分，一个使用@Component decorator的TypeScript Class、HTML template和styles. @Component decorator中会指定如下信息：

    * 一个CSS selector，用于定义如何在template中使用这个组件。Template中与此选择器向匹配的HTML元素将成为该组件的一个实例
    * 一个HTML template，用于指示Angular如何渲染这个组件
    * 一组可选的CSS styles，用于定义模板中HTML元素的样式
    
### Templates

每个component都有对应的template，用于声明该组件的渲染方式，可以使用内联或者文件路径定义该template

语法扩展

* 动态文本，向component中插入动态值。组件状态更新时，Angular也会自动更新相关DOM。数据来自于组件类

    ```html
    <p>{{ message }}</p>
    ```

* 属性绑定，设置HTML元素的property和attribute，也可以设置event handler。**注意二者语法不同**

    ```html
    <button
        [id]="alertMessage"
        [style.color]="fontColor"
        [disabled]="canClick"
        (click)="sayMessage">
        Trigger alert message
    </button>
    ```

* 指令

    * ngIf
    * ngFor

### 依赖注入

依赖注入用于在component class中使用对应的外部依赖，而无需对其进行手动实例化，Angular会协助我们处理这些问题

## Angular libraries

* Angular Router: 客户端导航，组件路由支持
* Angular Forms: 统一的表单填报与验证体系
* Angular HttpClient：HTTP 客户端库，支持高级的client-server通信
* Angular Animations：动画
* Angular PWA: 基于service worker和manifest构建PWA的工具
* Angular Schematics: 一些搭建脚手架、重构和升级的自动化工具。用于简化大规模应用的开发