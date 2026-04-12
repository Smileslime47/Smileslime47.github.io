# 47-blog

一个基于 `Vite + Vue 3 + TypeScript` 的静态博客项目。

这个博客框架的特点是：

- 文章直接写在 `src/posts` 目录下的 Markdown 文件里
- 分类目录自动根据文件夹结构生成
- 文章详情按需加载，不会在首屏一次性打包全部正文
- 标签页根据 frontmatter 的 `tags` 字段聚合
- 归档页根据 frontmatter 的日期字段自动排序和分组
- 支持浅色 / 深色主题切换

## 技术栈

- `Vite`
- `Vue 3`
- `TypeScript`
- `Vue Router`
- `markdown-it`
- `YAML`
- `Less`

## 项目结构

```text
.
├─ public/                    # 静态资源
│  └─ images/posts/           # 文章引用图片
├─ src/
│  ├─ assets/                 # 页面背景等打包资源
│  ├─ component/              # 通用组件、布局组件、内容组件
│  ├─ pages/                  # 路由页面
│  ├─ posts/                  # 博客文章 Markdown
│  ├─ router/                 # 路由配置
│  ├─ service/posts/          # 文章索引、frontmatter 解析、加载逻辑
│  ├─ styles/                 # 全局样式、主题变量
│  ├─ App.vue                 # 应用壳
│  └─ main.ts                 # 应用入口
├─ index.html
├─ package.json
└─ vite.config.ts
```

## 本地开发

先安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认会由 Vite 启动本地开发环境，通常访问地址类似：

```text
http://localhost:5173
```

## 构建与预览

生产构建：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

构建产物输出到：

```text
dist/
```

## 这个博客框架怎么用

### 1. 新增文章

把 Markdown 文件放进 `src/posts` 下任意子目录即可，例如：

```text
src/posts/Article/Web/我的第一篇文章.md
```

这个路径会自动决定：

- 分类层级：`Article / Web`
- 文章默认标题：`我的第一篇文章`
- 访问路径：`/posts/Article/Web/我的第一篇文章`

如果文件名或目录名里有空格、中文或特殊字符，路由层会自动做编码处理。

### 2. 使用 frontmatter

文章顶部可以写 YAML frontmatter，例如：

```md
---
title: 我的第一篇文章
date: 2026-04-12
tags:
  - Vue
  - Vite
---

# 正文标题

这里开始写正文。
```

当前项目里 frontmatter 的实际作用如下：

- `title`
  文章展示标题。若不写，默认使用文件名。
- `date` / `publishedAt` / `publishDate` / `createdAt`
  用于归档页排序和分组。
- `categories`
  当前可以不再使用。文章分类已经由 `src/posts` 的文件夹层级承担。
- `tags`
  用于标签页聚合展示。支持字符串数组，也支持逗号分隔字符串。

注意：

- frontmatter 解析器目前只支持“字符串”与“字符串数组”这两类值
- 复杂对象、嵌套结构、布尔对象等不会作为完整结构保留下来
- YAML 解析失败时，正文仍会显示，但 frontmatter 会被忽略

### 3. 文章图片怎么放

文章里需要引用图片时，建议放到：

```text
src/posts/Article/Web/image/搭建 vitepress 静态网站/
```

然后在 Markdown 中使用类似路径引用：

```md
![示例图片](image/搭建 vitepress 静态网站/example.png)
```

`public` 下的资源会按站点根路径直接提供访问。

### 4. 分类和目录是怎么生成的

文章页 `/posts` 不是手写目录，而是自动读取 `src/posts/**/*.md` 生成的。

实现方式大致是：

- 使用 `import.meta.glob('/src/posts/**/*.md', { query: '?raw' })` 收集全部 Markdown 文件
- 根据相对路径生成文章摘要
- 根据文件夹层级构建分类树
- 详情页再按需加载单篇 Markdown 正文

这意味着你平时维护博客时，主要只需要关心：

- Markdown 文件位置
- frontmatter 是否正确
- 图片路径是否正确

### 5. 页面对应关系

当前主要页面有：

- `/`
  首页
- `/posts`
  文章目录页，按文件夹层级展示
- `/posts/:pathMatch(.*)*`
  文章详情页
- `/archive`
  归档页，按年月和日期分组
- `/tags`
  标签页，按 `tags` 聚合，只展示写了标签的文章
- `/about`
  关于页

## 内容系统说明

文章系统的核心代码在 `src/service/posts/` 下：

- `loaders.ts`
  使用 `import.meta.glob` 建立 Markdown 懒加载映射
- `index-builder.ts`
  根据文件路径生成摘要列表和分类树
- `frontmatter-parser.ts`
  提取并解析 Markdown 顶部的 YAML frontmatter
- `repository.ts`
  对外提供统一的文章查询、归档元信息读取和详情按需加载能力
- `types.ts`
  定义文章摘要、文章详情、分类树等类型

可以把它理解成一个前端内置的小型内容仓储层。

## 开发者视角

### 页面骨架约定

除了首页 `HomePage.vue` 之外，当前大多数内容页都基于 `ContentPageLayout` 这个通用模板来写。

位置：

```text
src/component/common/ContentPageLayout.vue
```

它内部固定提供两个区域：

- `hero`
  页面顶部的信息区，通常放标题、副标题、统计信息、标签或面包屑
- `default`
  页面主体内容区，通常放正文、列表、树结构、归档、标签组等

它本质上是两张上下排列的 `GlassCard`：

- 第一张卡片承载 `hero`
- 第二张卡片承载主体 `section`

典型写法如下：

```vue
<template>
  <ContentPageLayout>
    <template #hero>
      <p class="eyebrow">页面类型</p>
      <h1>页面标题</h1>
      <p class="subtitle">这里放一句页面说明。</p>
    </template>

    <template #default>
      <div>这里放页面主体内容</div>
    </template>
  </ContentPageLayout>
</template>
```

当前可以参考的页面有：

- `src/pages/PostsPage.vue`
- `src/pages/ArchivePage.vue`
- `src/pages/TagsPage.vue`
- `src/pages/PostDetailPage.vue`
- `src/pages/AboutPage.vue`

其中：

- `PostsPage` 展示分类树
- `ArchivePage` 展示归档时间轴
- `TagsPage` 展示标签聚合
- `PostDetailPage` 展示 Markdown 正文
- `AboutPage` 是一个最接近“页面模板示例”的简单页

### 首页是特殊页

首页 `src/pages/HomePage.vue` 没有使用 `ContentPageLayout`，而是单独实现了一套全屏 Hero 和背景模糊效果。

所以如果你要新增的是普通内容页，优先沿用 `ContentPageLayout`；如果你要做强视觉化落地页，再考虑像首页一样单独写结构。

### 应用壳结构

整个站点的最外层结构很简单：

- `src/App.vue`
  只负责挂载全局 `Header`、`RouterView` 和 `Footer`
- `src/component/layout/Header.vue`
  顶部导航、主题切换、滚动进度效果
- `src/component/layout/Footer.vue`
  页脚版权信息

也就是说，新增页面时一般不需要动 `App.vue`，而是：

- 新建页面组件
- 注册路由
- 视情况把入口加到顶部导航

### 新增一个普通页面要做哪些事情

如果要新增一个类似“友链页”“项目页”“阅读页”的普通内容页，通常按下面流程做：

1. 在 `src/pages/` 下新建一个页面组件，例如 `FriendsPage.vue`
2. 用 `ContentPageLayout` 搭好页面骨架
3. 在 `hero` 插槽里写页面标题、副标题和辅助信息
4. 在默认插槽里写主体内容
5. 到 `src/router/router.ts` 注册新路由
6. 如果需要在导航栏展示入口，到 `src/component/layout/Header.vue` 的 `menuItems` 里追加菜单项
7. 如果页面需要复用复杂展示块，再把那部分拆到 `src/component/` 下的新组件里

例如新增一个 `/friends` 页面，至少需要改这两个位置：

- `src/pages/FriendsPage.vue`
- `src/router/router.ts`

如果还要出现在导航栏，再额外修改：

- `src/component/layout/Header.vue`

### 新增一个文章相关页面要怎么判断实现方式

这个项目里“文章能力”已经集中封装在 `src/service/posts/`，所以新增页面时可以先判断你需要哪一层数据：

- 只需要文章路径、标题、分类
  用 `postsService.getAllPosts()` 或 `postsService.getCategoryTree()`
- 需要 frontmatter，但不需要正文
  用 `postsService.loadAllPostMetas()`
- 需要完整 Markdown 正文
  用 `postsService.loadPostBySegments()`

可以简单理解为：

- 列表页 / 分类树页：用摘要数据
- 标签页 / 归档页：用元数据
- 详情页：用完整文章数据

### 新增文章功能时的代码落点

如果后续要扩展文章系统，通常会落在这些位置：

- `src/service/posts/loaders.ts`
  控制 Markdown 文件的收集方式
- `src/service/posts/frontmatter-parser.ts`
  扩展 frontmatter 支持的字段和类型
- `src/service/posts/index-builder.ts`
  修改摘要生成和分类树构建规则
- `src/service/posts/repository.ts`
  新增统一查询接口、缓存策略或聚合逻辑
- `src/service/posts/types.ts`
  补充类型定义

比如：

- 想扩展 tags 页面能力
  主要会改 `frontmatter-parser.ts`、`types.ts`、`repository.ts` 和对应页面
- 想支持草稿字段 `draft`
  主要会改 `repository.ts` 的索引和过滤逻辑
- 想支持文章封面 `cover`
  主要会改类型定义、frontmatter 解析和列表页展示

### 样式组织方式

样式主要分成三层：

- `src/styles/variables*.less`
  设计变量，包括排版、布局、玻璃态、主题色
- `src/styles/themes/`
  明暗主题变量
- 各页面 / 各组件自己的 `scoped less`
  页面本地样式

此外，`vite.config.ts` 里给 Less 注入了全局变量文件，所以页面样式里可以直接使用项目变量，不需要每个文件手动导入。

### 组件自动注册约定

项目启用了 `unplugin-vue-components`，并扫描：

- `src/component`
- `src/pages`

这意味着多数 Vue 组件不需要手写 import 注册，模板里可以直接使用。

不过在阅读代码时也要注意这一点，因为有些组件“看起来没 import”，其实是自动注册的。

## 维护建议

- 新文章优先放到合适的目录层级里，保持分类清晰
- 想让归档页正确排序，最好始终填写日期字段
- 想让标签页正常聚合，最好始终填写 `tags`
- 图片尽量统一放到 `src/posts/Article/Web/image/搭建 vitepress 静态网站/`，避免资源路径分散
- `categories` 现在更适合作为历史字段保留，后续新文章可以不再填写

## 常用命令

```bash
npm run dev
npm run build
npm run preview
```

## 适合的使用方式

这个框架比较适合：

- 以 Markdown 为主要写作方式的个人博客
- 希望按文件夹管理文章分类的知识库型博客
- 不想接 CMS，只想靠 Git 管理内容的静态站点

如果后续你想继续扩展，这个项目也很适合加上：

- RSS
- 搜索
- 更丰富的 tags 页面
- 文章封面图
- 草稿机制
- sitemap
- Markdown 代码高亮增强
