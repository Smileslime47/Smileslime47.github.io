<template>
  <div class="home-content">
    <aside class="sidebar">
      <GlassCard class="personal-info">
        <img src="@/assets/enana.jpg" alt="Avatar" class="avatar">
        <h2>47Saikyo</h2>
        <p>Smile_slime_47 / 邦邦</p>
        <p class="intro">记录代码、游戏、音乐和一些生活里的碎片化知识。</p>
      </GlassCard>
    </aside>

    <main class="main-content">
      <GlassCard class="list-head">
        <div>
          <p class="eyebrow">Latest Posts</p>
          <h2>最新文章</h2>
          <p class="subtitle">按发布日期倒序展示，和归档页保持一致。</p>
        </div>
        <span class="count">共 {{ totalPosts }} 篇</span>
      </GlassCard>

      <div v-if="loading" class="state-card">
        <GlassCard>正在加载文章列表...</GlassCard>
      </div>

      <div v-else-if="pagedPosts.length > 0" class="post-list">
        <GlassCard
          v-for="post in pagedPosts"
          :key="post.id"
          as="article"
          class="post-card"
        >
          <div class="post-meta">
            <span>{{ formatDate(post.publishedAt) }}</span>
            <span>{{ post.categorySegments.join(' / ') || '未分类目录' }}</span>
          </div>
          <router-link :to="post.url" class="post-title">{{ post.title }}</router-link>
          <p class="post-path">{{ post.filePath }}</p>
        </GlassCard>
      </div>

      <div v-else class="state-card">
        <GlassCard>当前还没有可展示的文章。</GlassCard>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button type="button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          上一页
        </button>
        <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button type="button" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
          下一页
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { postsService } from '@/service/posts'
import type { PostMeta } from '@/service/posts'

const PAGE_SIZE = 10

const loading = ref(true)
const posts = ref<PostMeta[]>([])
const currentPage = ref(1)

postsService
  .loadAllPostMetas()
  .then((items) => {
    posts.value = items
  })
  .finally(() => {
    loading.value = false
  })

const totalPosts = computed(() => posts.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalPosts.value / PAGE_SIZE)))
const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return posts.value.slice(start, start + PAGE_SIZE)
})

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

function formatDate(value?: string): string {
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

<style scoped lang="less">
.home-content {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 16px;
  width: min(var(--page-content-max-width, 1440px), calc(100% - var(--page-content-side-gap, 28px)));
  margin: 0 auto;
  padding: 0 0 32px;
  align-items: start;
}

.sidebar {
  position: sticky;
  top: 84px;
}

.personal-info {
  padding: 18px;
  color: var(--surface-title);
  text-align: center;
}

.avatar {
  width: 108px;
  height: 108px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
}

.personal-info h2 {
  margin: 0;
}

.personal-info p {
  margin: 8px 0 0;
  color: var(--surface-text);
}

.intro {
  font-size: 0.92rem;
}

.main-content {
  min-width: 0;
}

.list-head,
.post-card,
.state-card :deep(.glass-card) {
  margin-bottom: 10px;
}

.list-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--surface-muted);
}

.list-head h2 {
  margin: 0;
  color: var(--surface-title);
  font-size: clamp(1.15rem, 2vw, 1.45rem);
}

.subtitle {
  margin: 4px 0 0;
  color: var(--surface-text);
  font-size: 0.9rem;
}

.count {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--tag-border);
  color: var(--tag-text);
  font-size: 0.74rem;
  background: var(--tag-bg);
}

.post-list {
  display: flex;
  flex-direction: column;
}

.post-card {
  padding: 14px 18px;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-bottom: 8px;
  font-size: 0.8rem;
  color: var(--surface-muted);
}

.post-title {
  display: inline-block;
  color: var(--surface-title);
  text-decoration: none;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.35;
}

.post-title:hover {
  color: var(--md-link-hover);
}

.post-path {
  margin: 8px 0 0;
  color: var(--surface-text);
  font-size: 0.86rem;
  word-break: break-word;
}

.state-card {
  color: var(--surface-text);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px 0 0;
}

.pagination span {
  color: var(--surface-text);
  font-size: 0.9rem;
}

.pagination button {
  border: 1px solid var(--tag-border);
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 999px;
  padding: 5px 12px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .home-content {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .sidebar {
    position: static;
  }

  .list-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
