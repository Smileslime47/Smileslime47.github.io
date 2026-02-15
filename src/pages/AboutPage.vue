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
  <div class="about-page">
    <section class="about-hero glass-shell">
      <p class="eyebrow">Content Page</p>
      <h1>About 47-blog</h1>
      <p class="subtitle">Readable article layout with Markdown support.</p>
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
  border: 1px solid var(--surface-border);
  box-shadow: 0 12px 30px var(--surface-shadow);
  background:
    radial-gradient(circle at 90% 10%, rgba(115, 166, 240, 0.18), transparent 36%),
    radial-gradient(circle at 0% 100%, rgba(255, 142, 194, 0.12), transparent 34%),
    var(--surface-bg);
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--surface-muted);
}

h1 {
  margin: 0;
  color: var(--surface-title);
  font-size: clamp(1.6rem, 3.4vw, 2.2rem);
  line-height: 1.2;
}

.subtitle {
  margin: 10px 0 0;
  color: var(--surface-text);
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
  border: 1px solid var(--tag-border);
  color: var(--tag-text);
  font-size: 0.82rem;
  background: var(--tag-bg);
}

.about-card {
  width: min(920px, 100%);
  padding: clamp(18px, 3.6vw, 38px);
  --glass-radius: 20px;
  border: 1px solid var(--surface-border);
  box-shadow: 0 14px 36px var(--surface-shadow);
  background: var(--surface-bg);
}

.about-hero::before,
.about-card::before {
  opacity: 0.22;
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
