---
title: 基于Github RESTful API实现网站-数据分离的个人博客搭建实验
date: 2024/01/31
categories:
  - Article
  - Web
tags: 
  - 模拟电路
mathjax: true
---
## 概要

原先的博客是基于Vitepress加上一些现有的轮子和脚手架搭起来的，现在自己对Vite和Typescript的了解更深入了，想着是时候重构一下自己的博客了

突发奇想想到了用Github提供的[RESTful API](/images/posts/https://docs.github.com/en/rest)，将数据单独存放在一个Repo里面，网站部署在Github Page上，这样可以实现数据和网站的分离（四舍五入Github给我当Web后端）。查询资料后看到有人直接用Issue作为文章数据，直接连评论都带上了，但是考虑后感觉还是不符合本人归档分类的习惯，遂放弃。

想法是把所有markdown文章存放在一个repo里——[Metion_Archive](/images/posts/https://github.com/Smileslime47/Metion_Archive)，一方面我的网站可以通过RESTfulAPI直接查询数据，另一方面是在其他平台上可以通过支持git的第三方客户端访问文章数据（比如我在iPhone上通过Metion编辑文章，该App自带完整的Git功能），实现跨平台的数据同步和编辑。这么看的话最大的问题其实就是网站要如何实现接口了。

## 最初尝试

最初通过[repo根目录的contentsAPI](/images/posts/https://api.github.com/repos/smileslime47/Metion_Archive/contents) 直接访问了一下，得到以下结构的JSON对象的Array，实际上对Repo中的大部分资源的直接访问都会返回以下格式的JSON对象（访问File）或者数组（访问Dir），其中`url`代表访问该资源的API。

如果资源的Type属于`file`，那么还会多出`encode:string`（通常是`base64`）和`content:string,`两个字段

```Typescript
interface GithubResponse{
    _links:Object,
    download_url:string,
    git_url:string,
    html_url:string,
    name:string,
    path:string,
    sha:string,
    size:number,
    type:string,
    url:string,
}
```

很无奈地说，我们并不能通过Github的RESTful API直接获取到整个Repo的结构

- 第一次访问时，它会返回给我数个Dir和数个File
- 如果我想知道Dir里的内容，那么我还需要再对每个Dir再发送一次Http请求
- 这就导致了要**探明**整个Repo的结构，**发送Http请求的次数**等于**Repo里的目录数**
- 当然，如果要查询文章的内容，那还需要额外单独发送一次请求获取markdown的content

考虑到我本人喜欢用文件夹对文章进行归档，这无疑导致每次生成Repo的目录结构——从而进一步生成文章的分类结构，需要对Github进行几十次的请求才能完成。在查询[官方文档](/images/posts/https://docs.github.com/zh/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28)后得知

- 对于未验证的Http请求，单IP有每小时60次的请求限制
- 对于请求头的**authorization字段**中附上Github Token的Http请求，单IP有每小时5000次的请求限制
  - 例外：如果这里的Token使用的是Github Action中的**Secret_Token**，那么是每小时1000次的请求限制
  - 由于网站是通过Github Page部署的，所以我们不得不采用上述方式，如果不考虑目录结构只考虑文章访问的请求，每小时最多1000次的文章访问限制对于我个人博客的访问也算绰绰有余
- 通过OAuth登录接口登录后的Http请求，单IP有每小时5000次的请求限制
  - 但是该接口无法部署在静态网站上，和我们的目的不符

不论如何，每次访问网站时递归调用Github Api来生成目录结构是无法承载多少访问量的

---

## 缓存机制

最好的解决效果应当是获取目录结构**几乎不需要发送请求**，只有在**访问文章正文**时才会调用Github Api

为此，需要通过某种方式建立一个缓存机制，将文章仓库的目录结构序列化并缓存起来

最初有过两种设想：

- 将目录结构硬编码？
  - 显然，这么做是不可行的，这样的话每次文章仓库更新的时候，网站这边就要重新编译并推送，和本意是不符的
- 通过LocalStorage缓存
  - 解决方案的简单设想是建立一个缓存机制，每个主机**初次访问**网站时，网站仍然会通过深度递归获取一次目录结构，但是与此同时，网站会将生成的目录结构（一个嵌套的JSON对象）序列化并存储到浏览器的`localstorage`中
  - 这么做的缺点是：第一次访问时仍然需要深度遍历占用不少请求次数；当文章仓库更新时，无法建立一个有效的机制来通知本地更新缓存，Github的Webhook服务无法通知静态网站

### 通过Github Action生成目录树

Github Action的好处在于：在文章仓库设定好运行脚本后，每次对文章仓库推送时，都会触发Action，并且Action支持对原仓库内容更新，于是流程就变为：
- 更新文章并推送到仓库中
- 触发Github Action
- 运行TypeScript脚本，生成对应的目录结构对象，并将其序列化
- 将序列化字节流写入文件`archive.tree`中，并通过Github Action将其推送至仓库
- 访问网站时，网站通过Github RESTful Api访问文章仓库的`archive.tree`，获取序列化对象后将其反序列化得到目录结构对象，并生成目录

如此一来，用户无论如何访问网站，前后都只调用了一次Github Api

---

## 序列化实现

在去掉不必要的信息后，我设计了一个`GithubResponse`对象的子集，用于目录结构对象

```TypeScript
interface GitSimpleResponse{
    name:string,        //内容名
    path:string,        //路径
    sha:string,         //SHA
    type:string,        //内容类型
    url:string,         //API网址
    html_url:string,    //浏览器网址
    contents:Array<GitSimpleResponse>
}
```

其中contents用于当该节点为`dir`时，存储该节点下的子目录/文件

最开始想直接通过JS自带的`JSON.stringfy`和`JSON.parse`序列化和反序列化目录结构，但是实践过后发现序列化到本地存储的对象只有**最外层的节点**，查询后得知JS自带的序列化不支持复杂的嵌套对象，需要寻找其他可用的第三方库

最终将目光放在了**MsgPack**上，这个库有如下几个优点
- 最重要的一点，支持对复杂嵌套对象的序列化
- 该库支持将序列化后的JSON再次二进制编码，最后以**二进制流**的形式输出，进一步减少空间
- 该库是一个**开放的编码标准**，有多种实现
  - 对于网站项目，可以用Npm导入官方的实现库
  - 对于文章仓库上的脚本，我直接引入了一个**单文件的第三方实现**，从而避免了对于**单文件TypeScript脚本运行时难以引入Npm第三方依赖**的问题

接下来是编写文章仓库中，目录结构的**构建脚本**：

```TypeScript
//prebuild-tree.ts
let msgpack = require('./msgpack.min.js');
let fs = require('fs')
let token = process.argv[2]
let fileTree: Array<GitSimpleResponse> = []

interface GitSimpleResponse {
    name: string,        //内容名
    path: string,        //路径
    sha: string,         //SHA
    type: string,        //内容类型
    url: string,         //API网址
    html_url: string,    //浏览器网址
    contents: Array<GitSimpleResponse>
}

interface GithubResponse {
    _links: Object,
    download_url: string,
    git_url: string,
    html_url: string,
    name: string,
    path: string,
    sha: string,
    size: number,
    type: string,
    url: string,
    contents: Array<GithubResponse>
}

//将完整的Github相应转化为简化对象
const simplify = (response: GithubResponse) => {
    return {
        name: response.name,
        path: response.path,
        sha: response.sha,
        type: response.type,
        url: response.url,
        html_url: response.html_url,
        contents: []
    } as GitSimpleResponse
}

//以当前节点为根节点，递归生成子节点
const createSubtree = async (parent: GitSimpleResponse) => {
    if (parent.type === "file") return

    parent.contents = []
    await fetch(
        parent.url,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: token
        }
        }).then((response) => response.json()).then(async (json) => {
            let contents = json as Array<GithubResponse>
            for await (const content of contents) {
                let simplifiedContent = simplify(content)
                parent.contents.push(simplifiedContent)
                if (content.type === "dir") {
                    await createSubtree(simplifiedContent)
                }
            }
        })
}

console.log("Token:" + token)

//获取root目录信息
fetch("https://api.github.com/repos/Smileslime47/Metion_Archive/contents", {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        Authorization: token
    },
}).then((response) => {
    if (!response.ok) {
        console.log("Http Response Not Ok.")
    }
    return response.json()
}).then(async (json) => {
    let contents = json as Array<GithubResponse>
    //获取最外层节点
    contents.forEach((content: GithubResponse, _: any) => {
        fileTree.push(simplify(content))
    })

    //对最外层节点进行递归，生成子节点
    await Promise.all(fileTree.map(async (content) => {
        await createSubtree(content)
    }))

    //生成msgpack二进制流并写入文件
    console.log(msgpack.serialize(fileTree) as Uint8Array)
    fs.writeFile('./archive.tree', msgpack.serialize(fileTree) as Uint8Array, (err: any) => {
        if (err) {
            console.log("Write Failed")
        } else {
            console.log("Write Success")
        }
    })
})

```

---

## Github Action配置

在编写完构建脚本`prebuild-tree.ts`后，接下来是如何**在仓库每次推送时执行该脚本并将生成的tree文件再次推送到仓库**

编写Github Action配置文件：

```yaml
# .github/workflows/Prebuild-Tree.yaml
name: Preebuild-Tree

on:
  workflow_dispatch:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # 将仓库拉取到本地
      - name: Checkout
        uses: actions/checkout@v3

      # 安装npm
      - name: Install Node
        uses: actions/setup-node@v3

      # 安装用于执行单文件TS脚本的NPM库  
      - name: Install Ts-Node
        run: 
          npm install ts-node -g
          npm install @types/node -g

      # 执行脚本
      - name: Run
        run:
          ts-node ./prebuild-tree.ts ${{ secrets.GITHUB_TOKEN }}

      # 将构件推送至仓库
      - name: Commit
        run: |
          git config --global user.name 'Smileslime47'
          git config --global user.email 'Smile_slime_47@outlook.com'
          git add ./archive.tree
          git commit -am "Prebuild Archive Tree Commit"
          git push
```

此时我们已经可以看到Github后台在执行脚本并生成构件了：

![1705843196518](/images/posts/image/基于GithubRESTfulAPI实现网站-数据分离的个人博客搭建实验/1705843196518.png)

此时，远端仓库的根目录下已经有了`archive.tree`文件

## 编写网站逻辑

接下来，是编写代码让网站从`https://github.com/Smileslime47/Metion_Archive/blob/main/archive.tree`中获取二进制流并反序列化，生成目录结构

在网站逻辑上，只拥有目录的**层级结构**是不够的，因为我们还需要随机访问某一个节点，此时需要一个**通过节点路径快速获取到节点对象**的哈希表

比如说，当我点击Java目录下的Spring目录时，此时网站是**xxx/Java/Spring**，如果我通过Vue的props将Spring目录的节点对象传入，那么在刷新网站时该对象就会丢失，就无法获取到这个目录的信息了。所以应当让网站获取当前的URL，并通过这个路径查询哈希表，如`Java/Spring`来快速找到`Spring`这个目录节点。由于目录路径是不可重复的，所以用路径作为Key也是可行的

编写从远端仓库获取`archive.tree`并初始化目录结构对象的代码：

```TypeScript
export const fileTreeInit = async (force:boolean=false)=>{
    if (fileTree.length !== 0 && !force) {
        return
    }
    await axios.get(
        //https://raw.githubusercontent.com//Smileslime47/Metion_Archive//main/archive.tree
        Constant.RAW_URL+Constant.REPO_URL+Constant.TREE_URL,
        {
            responseType:"arraybuffer"//要求二进制流
        }
    ).then((encodedTree)=>{
        let buffer:ArrayBuffer = encodedTree.data
        let uInt8 = new Uint8Array(buffer)
        console.log(uInt8)
        //将获取到的流解码，并赋给对象
        fileTree = decode(encodedTree.data) as GitSimpleResponse[]
        console.log(fileTree)
    })
}
```

编写生成`<path:string,node:GitSimpleResponse>`哈希表的代码：

```TypeScript
export const fileMapInit = async (force: boolean = false) => {
    if (fileMap.size !== 0 && !force) {
        return
    }
    if (fileTree.length === 0) {
        await fileTreeInit()
    }
    fileMap=new Map<string, GitSimpleResponse>()
    fileTree.forEach((rootNode,_)=>{
        traverseTree(rootNode,(node )=>{
            fileMap.set(node.path,node)
        })
    })
}

const traverseTree = (treeNode:GitSimpleResponse,action:(treeNode:GitSimpleResponse)=>void) => {
    action(treeNode)
    if(treeNode.type==="file"){
        return
    }
    treeNode.contents.forEach((content,_)=>{
        traverseTree(content,action)
    })
}
```

两个目录对象的Getter方法

```TypeScript
export const getFileTree = async () => {
    if(fileTree.length===0){
        await fileTreeInit()
    }
    console.log("tree")
    console.log(fileTree)
    return fileTree
}

export const getFileMap = async () => {
    if(fileMap.size===0){
        await fileMapInit()
    }
    return fileMap
}
```

至此，必要的逻辑已经基本实现，在经过一些前端工程后，可以看到效果

![1705843917144](/images/posts/image/基于GithubRESTfulAPI实现网站-数据分离的个人博客搭建实验/1705843917144.png)

其中网络请求除获取`index.md`文章内容外，只有一次获取`archive.tree`的请求，完美符合要求

![1705843933403](/images/posts/image/基于GithubRESTfulAPI实现网站-数据分离的个人博客搭建实验/1705843933403.png)