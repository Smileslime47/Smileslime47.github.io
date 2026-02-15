<script setup lang="ts">
const aboutMarkdown = `
# About

Welcome to **47-blog**. This page demonstrates a readable content layout with Markdown rendering.

## What It Supports

- Headings, paragraphs, lists
- [Links](https://47saikyo.moe)
- Inline code: \`const hello = "world"\`
- Blockquote

> You can later load markdown from local files or an API and render it here.

## Next Step

Build a post detail route and render markdown dynamically by slug.
`
</script>

<template>
  <ContentPageLayout class="about-page-layout">
    <template #hero>
      <p class="eyebrow">Content Page</p>
      <h1>About 47-blog</h1>
      <p class="subtitle">Readable article layout with Markdown support.</p>
      <div class="tags">
        <span>Vue 3</span>
        <span>Markdown</span>
        <span>Glass UI</span>
      </div>
    </template>

    <template #default>
      <MarkdownContent :content="aboutMarkdown" />
    </template>
  </ContentPageLayout>
</template>

<style scoped lang="less">
.about-page-layout {
  --content-page-hero-bg:
    radial-gradient(circle at 90% 10%, rgba(115, 166, 240, 0.18), transparent 36%),
    radial-gradient(circle at 0% 100%, rgba(255, 142, 194, 0.12), transparent 34%),
    var(--surface-bg);
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--surface-muted);
}

h1 {
  margin: 0;
  color: var(--surface-title);
  font-size: clamp(1.2rem, 2.6vw, 1.6rem);
  line-height: 1.15;
}

.subtitle {
  margin: 4px 0 0;
  color: var(--surface-text);
  font-size: 0.9rem;
}

.tags {
  margin-top: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tags span {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--tag-border);
  color: var(--tag-text);
  font-size: 0.74rem;
  background: var(--tag-bg);
}

</style>
