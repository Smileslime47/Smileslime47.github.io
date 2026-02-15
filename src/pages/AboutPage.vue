<script setup lang="ts">
const aboutMarkdown = `
# 关于

欢迎来到 **47-blog**。这里是一个用于演示内容页样式与 Markdown 渲染能力的页面。

## 当前支持

- 标题、段落、列表
- [链接](https://47saikyo.moe)
- 行内代码：\`const hello = "world"\`
- 引用块

> 这个页面可以直接承载博客正文，后续可接入本地 Markdown 文件或 API。

## 下一步

你可以把每篇文章的正文内容按 Markdown 组织，再通过路由参数按文章动态渲染。
`
</script>

<template>
  <div class="about-page">
    <section class="about-hero glass-shell">
      <p class="eyebrow">Content Page</p>
      <h1>About 47-blog</h1>
      <p class="subtitle">一个简洁、可扩展、支持 Markdown 的内容实验页。</p>
      <div class="tags">
        <span>Vue 3</span>
        <span>Markdown</span>
        <span>Glass UI</span>
      </div>
    </section>

    <section class="about-card glass-shell">
      <MarkdownContent :content="aboutMarkdown" />
    </section>
  </div>
</template>

<style scoped lang="less">
.about-page {
  min-height: 100vh;
  padding: 108px 16px 56px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

.about-hero {
  width: min(920px, 100%);
  padding: clamp(18px, 3.6vw, 34px);
  --glass-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 12px 30px rgba(8, 10, 16, 0.2);
  background:
    radial-gradient(circle at 90% 10%, rgba(159, 196, 255, 0.12), transparent 36%),
    radial-gradient(circle at 0% 100%, rgba(255, 142, 194, 0.08), transparent 34%);
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(241, 245, 251, 0.62);
}

h1 {
  margin: 0;
  color: #f3f6fc;
  font-size: clamp(1.6rem, 3.4vw, 2.2rem);
  line-height: 1.2;
}

.subtitle {
  margin: 10px 0 0;
  color: #ccd6e9;
  font-size: 1rem;
}

.tags {
  margin-top: 14px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tags span {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #dfe7f5;
  font-size: 0.82rem;
  background: rgba(255, 255, 255, 0.06);
}

.about-card {
  width: min(920px, 100%);
  padding: clamp(18px, 3.6vw, 38px);
  --glass-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 14px 36px rgba(8, 10, 16, 0.24);
}

@media (max-width: 768px) {
  .about-page {
    padding-top: 96px;
    gap: 12px;
  }

  .about-card,
  .about-hero {
    --glass-radius: 16px;
  }
}
</style>
