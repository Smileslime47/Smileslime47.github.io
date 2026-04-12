<template>
  <div class="home-content">
    <aside class="sidebar">
      <div class="sidebar-stack">
        <GlassCard class="personal-info">
          <img src="https://avatars.githubusercontent.com/u/77948910" alt="Smile_slime_47 Avatar" class="avatar">
          <h2>Smile_slime_47</h2>
          <p class="alias">a.k.a. 邦邦</p>
          <p class="intro">记录代码、游戏、音乐和一些生活里的碎片化知识。</p>
          <div class="summary-grid">
            <div class="summary-item">
              <strong>{{ totalTags }}</strong>
              <span>Tags</span>
            </div>
            <div class="summary-item">
              <strong>{{ totalCategories }}</strong>
              <span>Categories</span>
            </div>
            <div class="summary-item">
              <strong>{{ totalPosts }}</strong>
              <span>Posts</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard class="contact-card">
          <h3>47Saikyo</h3>
          <p>希望对你有所帮助！</p>
          <p>如果想了解更多关于我的事情，你也可以看看 About 页面。</p>
          <p>想要联系我的话，请尽量使用两个 Gmail 邮箱。</p>
          <p>Outlook 邮箱主要被我用来接收网站推送。</p>

          <div class="contact-handles">
            <p>
              <Icon icon="simple-icons:tencentqq" />
              <span>QQ</span>
              <strong>Talloran47</strong>
            </p>
            <p>
              <Icon icon="simple-icons:wechat" />
              <span>WeChat</span>
              <strong>smile_slime_47</strong>
            </p>
            <p>
              <Icon icon="simple-icons:telegram" />
              <span>Telegram</span>
              <strong>@Smile_slime_47</strong>
            </p>
          </div>

          <div class="contact-links">
            <a href="mailto:smile_slime_47@outlook.com">
              <Icon icon="simple-icons:microsoft" />
              Outlook (Email)
            </a>
            <a href="mailto:smiling.slime.47@gmail.com">
              <Icon icon="simple-icons:gmail" />
              Gmail (Email)
            </a>
            <a href="mailto:lyb.compsci@gmail.com">
              <Icon icon="simple-icons:gmail" />
              Business (Email)
            </a>
            <a href="https://steamcommunity.com/id/47saikyo/" target="_blank" rel="noreferrer">
              <Icon icon="simple-icons:steam" />
              Steam
            </a>
            <a href="https://github.com/Smileslime47" target="_blank" rel="noreferrer">
              <Icon icon="simple-icons:github" />
              Github
            </a>
          </div>
        </GlassCard>
      </div>
    </aside>

    <main class="main-content">
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
          <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>
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
import { Icon, addCollection } from '@iconify/vue'
import { icons as simpleIcons } from '@iconify-json/simple-icons'
import { icons as mdiIcons } from '@iconify-json/mdi'
import { computed, ref, watch } from 'vue'
import { postsService } from '@/service/posts'
import type { CategoryNode, FrontmatterValue, PostMeta } from '@/service/posts'

addCollection(simpleIcons)
addCollection(mdiIcons)

const PAGE_SIZE = 10

const loading = ref(true)
const posts = ref<PostMeta[]>([])
const currentPage = ref(1)
const categoryTree = postsService.getCategoryTree()

postsService
  .loadAllPostMetas()
  .then((items) => {
    posts.value = items
  })
  .finally(() => {
    loading.value = false
  })

const totalPosts = computed(() => posts.value.length)
const totalTags = computed(() => {
  const tags = new Set<string>()
  for (const post of posts.value) {
    for (const tag of normalizeTagList(post.frontmatter.tags)) {
      tags.add(tag)
    }
  }
  return tags.size
})
const totalCategories = computed(() => countCategoryNodes(categoryTree))
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

function normalizeTagList(raw: FrontmatterValue | undefined): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => item.trim()).filter(Boolean)
  }
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

function countCategoryNodes(nodes: CategoryNode[]): number {
  let total = 0
  for (const node of nodes) {
    total += 1
    total += countCategoryNodes(node.children)
  }
  return total
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

.sidebar-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.personal-info {
  padding: 22px 18px;
  color: var(--surface-title);
  text-align: center;
}

.avatar {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 14px;
  border: 1px solid var(--surface-border);
}

.personal-info h2 {
  margin: 0;
  font-size: 1.45rem;
  line-height: 1.15;
}

.personal-info p {
  margin: 8px 0 0;
  color: var(--surface-text);
}

.alias {
  font-size: 0.88rem;
  color: var(--surface-muted);
}

.intro {
  font-size: 0.86rem;
  line-height: 1.6;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 18px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.summary-item strong {
  color: var(--surface-title);
  font-size: 1.7rem;
  font-weight: 500;
  line-height: 1;
}

.summary-item span {
  color: var(--surface-muted);
  font-size: 0.82rem;
  letter-spacing: 0.04em;
}

.contact-card {
  padding: 18px 18px 20px;
  text-align: center;
  color: var(--surface-text);
}

.contact-card h3 {
  margin: 0;
  color: var(--surface-title);
  font-size: 1.3rem;
  font-weight: 500;
}

.contact-card > p {
  margin: 8px 0 0;
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--surface-text);
}

.contact-handles {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.contact-handles p {
  margin: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  color: var(--surface-text);
  font-size: 0.9rem;
  align-items: center;
}

.contact-handles span {
  color: var(--surface-muted);
}

.contact-handles strong {
  font-weight: 500;
  color: var(--surface-title);
}

.contact-handles a,
.contact-links a {
  color: var(--surface-title);
  text-decoration: none;
}

.contact-handles a:hover,
.contact-links a:hover {
  color: var(--md-link-hover);
}

.contact-links {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-links span,
.contact-links a {
  color: var(--surface-title);
  font-size: 0.94rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.contact-handles :deep(.iconify),
.contact-links :deep(.iconify) {
  width: 1.05rem;
  height: 1.05rem;
  flex-shrink: 0;
  color: var(--surface-muted);
}

.main-content {
  min-width: 0;
}

.post-card,
.state-card :deep(.glass-card) {
  margin-bottom: 10px;
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

.post-excerpt {
  margin: 10px 0 0;
  color: var(--surface-text);
  font-size: 0.92rem;
  line-height: 1.65;
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

  .personal-info h2 {
    font-size: 1.35rem;
  }
}
</style>
