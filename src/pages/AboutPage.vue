<script setup lang="ts">
const aboutMarkdown = `
> 本博客仅用于归档我日常生活中总结的碎片化知识，不建议初学者用于进行系统性的学习。

Smile_slime_47 a.k.a. 邦邦

JNU / Computer Science

没有其他社交媒体平台账号。

平时博客写得比较少，大部分文章都是上学时期写的了，现在偶尔还会忙里偷闲写两篇。

## 开发

### Language
- Kotlin
- Java
- TypeScript
- Python

### Paradigm

- Functional Programming
- Reactive Programming



## 爱好

### Gaming

SteamID: Smile slime 47

不怎么玩电子竞技类多人游戏，更偏向单机、动作、角色扮演或者能自己慢慢研究系统的游戏

### Anime

广泛的动漫爱好者，很久没有追新番了，但是还是会对各种二次元游戏感兴趣

### Music

- J-Pop
- Vocaloid
- Hard Rock
- Hifi

### Photography

- 索尼爱好者
- 什么都拍，除了人像
`
</script>

<template>
  <ContentPageLayout class="about-page-layout">
    <template #hero>
      <p class="eyebrow">About</p>
      <h1>关于我</h1>
      <p class="subtitle">一个写代码、写博客，也写一点生活碎片的人。</p>
      <div class="tags">
        <span>全栈开发</span>
        <span>Kotlin/函数式编程</span>
        <span>动漫 / 游戏 / 音乐 / 摄影</span>
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
    radial-gradient(circle at 85% 12%, rgba(112, 173, 255, 0.16), transparent 34%),
    radial-gradient(circle at 0% 100%, rgba(255, 184, 120, 0.14), transparent 32%),
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
