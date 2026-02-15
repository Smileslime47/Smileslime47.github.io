---
title: Vitepress Gitalk评论插件
date: 2022/10/31
categories:
  - Article
  - Web
tags: 
  - Vitepress
  - 记录 
---
在Vitepress上配置Gitalk需要自己动手调整，本人在Gitalk后续的配置中参考了参考[这篇文章](https://juejin.cn/post/7146037234527895560)

---
## 安装
Gitalk提供了两个安装的方式：
- 通过链接直接引入
```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css">
  <script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>

  <!-- or -->

  <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
  <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
```
- 通过npm安装
```
npm i --save gitalk
```
```js
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
```

这里我采用的是通过npm安装的方法。

---
## 创建Github Application
Gitalk需要一个repo和app来正常工作，由于Gitalk只是依赖于repo的issue功能进行评论区的数据操作，repo可以自己**单独建一个repo**也可以**直接沿用部署静态网站的repo**

在[这里](https://github.com/settings/applications/new)申请一个Github OAuth Application
|||
|---|---|
|Application Name|随意|
|Homepage URL|网站部署域名|
|Application description|随意|
|Authorization callback URL|一般直接设置为与Homepage URL相同|

创建完毕后通过`Generate a new client secret`获取一个密钥，将其和Client ID记下来以便后续配置

---
## 调用
在安装完成后，同样有两种调用组件的方式：
### 在页面中调用块元素（div）
```html
<div id="gitalk-container"></div>
```
然后在`config.js`中添加如下配置信息
```js
const gitalk = new Gitalk({
  clientID: 'GitHub Application Client ID',
  clientSecret: 'GitHub Application Client Secret',
  repo: 'GitHub repo',      // The repository of store comments,
  owner: 'GitHub repo owner',
  admin: ['GitHub repo owner and collaborators, only these guys can initialize github issues'],
  id: location.pathname,      // Ensure uniqueness and length less than 50
  distractionFreeMode: false  // Facebook-like distraction free mode
})

gitalk.render('gitalk-container')
```
这里放出我的配置供参考
```js
const gitalk = new Gitalk({
    id: location.pathname, 
    owner: 'Smileslime47', 
    repo: 'Smileslime47.github.io', 
    clientID: '********', 
    clientSecret: '********',
    admin: ['Smileslime47'], 
    labels: ['Gitalk'], 
    createIssueManually: false, 
})
```
在参考[这篇文章](https://juejin.cn/post/7146037234527895560)后得知gitalk需要在判断`onMounted()`后再加载，需要将配置信息改为
```js
<script setup>
import { onMounted } from 'vue'
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

onMounted(() => {
  if(typeof window !==undefined){
    var s_div = document.createElement('div');  
    s_div.setAttribute("id", "gitalk-page-container");   
    document.querySelector('.content-container').appendChild(s_div);
    const gitalk = new Gitalk({
        clientID: "...",
        // ...
        // options below
    })
    gitment.render('gitalk-page-container')
  }
})
</script>
```
### 通过React调用
先在项目中安装react
```
yarn add -D react
yarn add -D react-dom
```
在vue中引入插件
```js
import GitalkComponent from "gitalk/dist/gitalk-component";
```
然后就可以直接在内容部分调用Gitalk插件了
```html
<GitalkComponent options={{
  clientID: "...",
  // ...
  // options below
}} />
```

---
## 在组件中引入
关于自定义组件的引入可以参考[官方文档](https://vitepress.vuejs.org/guide/theme-introduction#extending-the-default-theme)

这里我采用的是第一种通过块元素引入的方式
```html
// .vitepress/theme/components.js
<script setup>
    import 'gitalk/dist/gitalk.css'
    import Gitalk from 'gitalk'
    ...
</script>

<template>
  <Layout>
    <template #doc-after>
      <div id="gitalk-page-container"></div>
    </template>
    ...
  </Layout>
</template>
```

---
## 关于Network Error
由于Gitalk是基于Github的issue功能运作的，需要调用Github的开放API，而Gitalk走了亚马逊的代理服务器，导致需要通过**科学上网**来正常加载Gitalk组件，这一点的解决方案在[这篇文章](https://prohibitorum.top/7cc2c97a15b4.html)中有所提及