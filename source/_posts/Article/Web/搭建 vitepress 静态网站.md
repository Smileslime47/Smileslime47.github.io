---
title: 搭建 vitepress 静态网站
date: 2022/10/30
categories:
  - Article
  - Web
tags: 
  - Vitepress
  - 记录 
---
**[Github Repo地址](/images/posts/https://github.com/Smileslime47/Smileslime47.github.io)**

最初在github上部署静态网站是考虑到本人归档笔记的需求：

**线下markdown**：
- 所见即所得，丰富的插件支持（vsc、metion、typora等都有很强大的功能支持/插件社区）
- 无法多设备同步，编辑多了会出现内容冲突

**同步到github**：
- 实现了同步，repo上的md文件即为同步版本
- 失去了线下编辑器强大的功能支持，例如虽然github的markdown预览还支持mermaid流程图渲染，但是却无法正常预览latex公式

在双重需求下，在github上部署一个基于vue的静态网站便成为了低成本下的最优解

## 与vuepress相比
vitepress相比vuepress有着轻量化，结构简洁，配置简单，采用vue3和vite的优势，但是相比之下社区和插件远没有vuepress庞大（文档中提到过不打算将其做成“另一个vue press”）

---
## 搭建
[Vitepress官方文档](/images/posts/https://vitepress.vuejs.org/guide/what-is-vitepress)中已经很详细地说明了搭建流程，此外也可以参照这篇[中文文档](/images/posts/https://process1024.github.io/vitepress/guide/what-is-vitepress)


这里仅为官方文档的再总结

### 初始化
```
//1.初始化项目
yarn init

//2.添加依赖项
yarn add --dev vitepress vue

//3.在项目文件夹的'package.js'中添加调试命令脚本
{
  ...
  "scripts": {
    //这里的docs对应网站根目录，这里我修改为了post
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs"
  },
  ...
}

//4.本地运行
yarn docs:dev
```

运行完`yarn docs:dev`后会在本地的5173端口（`http://localhost:5173/`）开启一个本地调试服务器

### 配置
在你的根目录下（./docs）创建一个`.vitepress`文件夹用于存放Vitepress特定位件

在`.vitepress`下创建一个`config.js`用于配置站点

此时的项目结构应当为：
```
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js  //配置文件
│  ├─ index.md      //首页
│  └─ ...           //你的文件夹/文件
└─ package.json     //项目的依赖项，
```

写这篇文章时我的config.js配置：
```js
//plugin
import { withMermaid } from "vitepress-plugin-mermaid";
import mathjax3 from 'markdown-it-mathjax3';
import AutoNavPlugin from 'vitepress-auto-nav-sidebar';
const customElements = ['mjx-container'];

//自动生成侧边栏，在windows环境下会生成绝对路径导致运行后不可见，部署到github上显示正常
const { nav, sidebar } = AutoNavPlugin({
  entry:'posts',
  ignoreFolders: ["node_modules", "assets", "public", ".vitepress", "code", ".obsidian", "utils"], 
  ignoreFiles: ['index'], 
  dirPrefix: '目录：',
  filePrefix: '文件：',
  showNavIcon:false,
  showSideIcon:true,
  isCollapse: true,
  collapsed: true,
  singleLayerNav:true
})

export default withMermaid({
  markdown: {
    //mathjax配置
    config: (md) => {
      md.use(mathjax3);
    },
    //启用代码块行号
    lineNumbers: true,
  },
  
  //mathjax3配置
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  },

  //config
  title: '47Saikyo',                  //网站标题
  description: 'Just playing around.',//网站描述，生成对应meta信息
  //base:'',                          //如果网站没有部署在服务器的root目录下，如https://47saikyo.moe/myblog，则应当设置base:'/myblog/'
  ignoreDeadLinks: true,              //忽视deadlink导致的构建错误

  themeConfig: {                      //Vitepress的主题设置
    siteTitle: '47‘s Blog',           //显示在导航栏左侧的网站标题
    //侧边栏和导航栏，这里我用了自动生成的插件
    nav,
    sidebar,

    //社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Smileslime47/' },
    ],

    //编辑链接
    editLink: {
      pattern: 'https://github.com/Smileslime47/Smileslime47.github.io/tree/main/posts/:path',
      text: 'Edit this page on GitHub'
    },

    //测试docsearch
    algolia: { 
      appId: '8J64VVRP8K', 
      apiKey: 'a18e2f4cc5665f6602c5631fd868adfd', 
      indexName: 'vitepress' 
    }, 
  },
})
```


---
## 自定义主题
类似config.js，在`.vitepress`下创建一个`.theme`文件夹用于存放Vitepress的自定义样式

在`theme`下创建一个`index.js`用于配置站点样式

此时的项目结构应当为：
```
.
├─ docs
│  ├─ .vitepress
│  │  ├─ config.js      //配置文件
│  │  └─ theme          //主题文件夹
│  │     └─ index.js    //主题配置文件
│  ├─ index.md          //首页
│  └─ ...               //你的文件夹/文件
└─ package.json         //项目的依赖项，
```

### 应用全局自定义主题
官方文档中应用自定义主题的方法
1. 在theme里编写你的自定义layout布局`Layout.vue`
```
.
├─ docs
│  ├─ .vitepress
│  │  ├─ config.js      //配置文件
│  │  └─ theme          //主题文件夹
│  │     ├─ index.js    //主题配置文件
│  │     └─ Layout.vue  //自定义layout
│  ├─ index.md          //首页
│  └─ ...               //你的文件夹/文件
└─ package.json         //项目的依赖项，
```
2. 在index.js里添加
```js
// .vitepress/theme/index.js
import Layout from './Layout.vue'

export default {
  // root component to wrap each page
  Layout,

  // this is a Vue 3 functional component
  NotFound: () => 'custom 404',

  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`.
    // router is VitePress' custom router. `siteData` is
    // a `ref` of current site-level metadata.
  }

  setup() {
    // this function will be executed inside VitePressApp's
    // setup hook. all composition APIs are available here.
  }
}
```
来应用你的自定义主题，即上文提到的Layout.vue，但是这种方式实际上是将你的Layout覆盖全局样式，即vitepress自带的组件都不会被应用，相当于在你的Layout里完全从头实现所有的组件

看了几个vitepress theme的repo，也基本上都是在theme里自行重新实现了一遍nav、button、sidebar等组件，目前还没有找到具有可行性的在默认主题的基础上轻微修改的办法，如果有知道的大佬欢迎指导

理论上来讲，将`node_module/vitepress/dist/client/default theme`内的组件和样式复制至自己的theme并配置layout和index是可行的，但是这样会将自己的工作文件夹变得臃肿，也违背了vitepress轻量化的初衷

### 自定义首页
vitepress有三个预设的layout可以选择：home page和doc，如果想要用自定义主页请将index.md如下编写
```js
---
layout: page
---

<script setup>
import home from './.vitepress/theme/home.vue'//这里是你实际主页的vue文件路径
</script>

<home />

```
这里设置为page的原因是page的样式是空白页，VPContent、VPPage等div的padding和margin都是0px，除了顶部保留导航栏外给予完全的自定义空间

一开始我随手选择了home，而VPHome有一个自带的padding-bottom，调整了半天主页最下面总有一处内边距的留白，后来才发现是这里的问题，将layout设置为page后完美解决

### 应用自定义组件（component）
vitepress支持自行编写vue组件并引入layout预设好的插槽（slot）中（前提是你没有像上文那样更换全局主题），详见[官方文档](/images/posts/https://vitepress.vuejs.org/guide/theme-introduction#extending-the-default-theme)

这里我用的方法是
1. 编写自己的组件compoent.vue
```html
<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
...
</script>

<template>
    <Layout>//应用于默认Layout块内
        <template #aside-outline-before>
            ...
        </template>
    </Layout>
<template>
```
2. 在`index.js`中继承默认主题（default_theme）并引入组件
```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import components from './components.vue'

export default {
  ...DefaultTheme,
  Layout:components
}
```

此外可以在component中引入useData等APi（详见文档）来在组件中调用应用程序数据，如
```ts
import { useData } from 'vitepress'
```
其定义为
```ts
interface VitePressData {
  site: Ref<SiteData>
  page: Ref<PageData>
  theme: Ref<any> // themeConfig from .vitepress/config.js
  frontmatter: Ref<PageData['frontmatter']>
  lang: Ref<string>
  title: Ref<string>
  description: Ref<string>
  localePath: Ref<string>
}
```


---
## 插件配置
### mermaid
1. 通过yarn或者npm安装插件
```
npm i vitepress-plugin-mermaid -s
```
2. 在`config.js`中配置
```js
// .vitepress/config.js
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid({

  // your existing vitepress config...

});
```

### mathjax3
1. 通过yarn或者npm安装插件
```
yarn add markdown-it-mathjax3
```
2. 在`config.js`中配置
```js
import mathjax3 from 'markdown-it-mathjax3';

const customElements = ['mjx-container'];

export default {
  markdown: {
    config: (md) => {
      md.use(mathjax3);
    },
    ...
  },

  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  },
  ...
};
```

### Gitalk
碍于篇幅限制，Gitalk相关内容写在另一篇文章中
