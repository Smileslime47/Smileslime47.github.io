<script setup lang="ts">
import { computed, ref } from 'vue'
import { postsService } from '@/service/posts'
import type { PostMeta } from '@/service/posts'

const loading = ref(true)
const posts = ref<PostMeta[]>([])

postsService
  .loadAllPostMetas()
  .then((items) => {
    posts.value = items
  })
  .finally(() => {
    loading.value = false
  })

const total = computed(() => posts.value.length)

const formatDate = (value?: string) => {
  if (!value) return '未标注日期'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<template>
  <ContentPageLayout>
    <template #hero>
      <p class="eyebrow">归档</p>
      <h1>文章归档</h1>
      <p class="subtitle">按发布日期倒序展示全部文章。</p>
      <div class="meta">
        <span>文章总数 {{ total }}</span>
      </div>
    </template>

    <template #default>
      <div v-if="loading" class="state">正在加载归档...</div>
      <div v-else class="archive-list">
        <router-link
          v-for="post in posts"
          :key="post.id"
          :to="post.url"
          class="archive-item"
        >
          <span class="archive-date">{{ formatDate(post.publishedAt) }}</span>
          <span class="archive-title">{{ post.title }}</span>
        </router-link>
      </div>
    </template>
  </ContentPageLayout>
</template>

<style scoped lang="less">
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

.meta {
  margin-top: 8px;
}

.meta span {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--tag-border);
  color: var(--tag-text);
  font-size: 0.74rem;
  background: var(--tag-bg);
}

.state {
  color: var(--surface-text);
}

.archive-list {
  display: flex;
  flex-direction: column;
}

.archive-item {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 10px;
  padding: 10px 2px;
  border-bottom: 1px solid var(--glass-border-soft);
  color: var(--surface-text);
  text-decoration: none;
}

.archive-item:hover {
  color: var(--surface-title);
}

.archive-date {
  color: var(--surface-muted);
  font-size: 0.84rem;
}

.archive-title {
  min-width: 0;
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .archive-item {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
