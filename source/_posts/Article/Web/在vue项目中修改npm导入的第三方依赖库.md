---
title: 在vue项目中修改npm导入的第三方依赖库
date: 2023/4/15
categories:
  - Article
  - Web
tags: 
  - Vitepress
  - Vue
  - npm
---
在我使用Vitepress部署我的静态博客的过程中，Vitepress难免有一些组件是我想要修改或者补充的。总而言之，在vue开发过程中难免遇到一些第三方库无法满足需求而需要改动的情况。

这时我的第一反应是修改`node_modules`下的代码，但是git一般会忽视掉node_modules，改动无法同步到git上，而且在github上部署也是根据'package.json'来重新下载依赖库部署的，往往在本地部署是正常的，部署到github上就不行了

在互联网上搜索后发现可以用**patch-package**这个库来实现需求

## 使用步骤
### 安装
在项目目录下执行`npm i patch-package --save-dev`安装对应库

### 添加脚本
在项目目录下的`package.json`中添加`"scripts": { "postinstall": "patch-package" }`

### 修改代码
直接修改node_modules内对应库的代码即可

### 打包
执行`npx patch-package <package-name>`，然后会在项目目录的/patches目录下生成库的包文件

### 同步
在项目目录下执行`yarn postinstall`，会自动将`package.json`内对应库的版本号同步为本地打包文件的版本