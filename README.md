# 47-blog

一个以 Markdown 为核心内容来源的个人博客项目。

它的目标很简单：

- 写文章时尽量接近“写文件”本身
- 不依赖额外 CMS
- 用目录结构管理分类
- 保持页面风格、主题和内容组织的一致性

## 项目特点

- 文章直接放在 `src/posts` 目录中维护
- 分类主要由目录结构自动生成
- 支持标签聚合与归档浏览
- 支持浅色 / 深色主题切换
- 文章详情按需加载，日常维护更轻量

## 快速开始

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

## 内容维护

### 新增文章

把 Markdown 文件放进 `src/posts` 下合适的目录即可，例如：

```text
src/posts/Article/Web/我的第一篇文章.md
```

这会同时影响：

- 文章访问路径
- 分类层级
- 列表页里的默认标题与位置

### 常用 frontmatter

文章头部通常可以写这些字段：

```md
---
title: 我的第一篇文章
date: 2026-04-12
tags:
  - Vue
  - Vite
---
```

常用含义：

- `title`：文章标题
- `date` / `publishedAt` / `publishDate` / `createdAt`：用于排序和归档
- `tags`：用于标签页聚合

## 目录说明

```text
src/
  component/      # 通用组件、布局组件、内容组件
  pages/          # 路由页面
  posts/          # Markdown 文章
  router/         # 路由配置
  service/posts/  # 文章加载、索引、解析与查询
  styles/         # 全局样式与主题变量
```

## 协作说明

- 项目长期协作规则在 [AGENTS.md](d:\Projekt\47-blog\AGENTS.md)
- 如果你是新的协作者或新的 AI 会话，建议先读 `AGENTS.md` 再动手
- `README` 保持简洁，偏向说明项目用途和使用方式；更细的实现规则放在 `AGENTS.md`
