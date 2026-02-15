<script setup lang="ts">
import { computed, ref } from 'vue'
import { postsService } from '@/service/posts'
import type { FrontmatterValue, PostMeta } from '@/service/posts'

type TagGroup = {
  name: string
  posts: PostMeta[]
}

const loading = ref(true)
const groups = ref<TagGroup[]>([])

postsService
  .loadAllPostMetas()
  .then((items) => {
    const map = new Map<string, PostMeta[]>()

    for (const post of items) {
      const categories = normalizeCategories(post.frontmatter.categories)
      const effectiveCategories = categories.length > 0 ? categories : ['未分类']

      for (const category of effectiveCategories) {
        const list = map.get(category) ?? []
        list.push(post)
        map.set(category, list)
      }
    }

    groups.value = [...map.entries()]
      .map(([name, posts]) => ({ name, posts }))
      .sort((a, b) => {
        if (b.posts.length !== a.posts.length) return b.posts.length - a.posts.length
        return a.name.localeCompare(b.name, 'zh-Hans-CN')
      })
  })
  .finally(() => {
    loading.value = false
  })

const totalGroups = computed(() => groups.value.length)

function normalizeCategories(raw: FrontmatterValue | undefined): string[] {
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
</script>

<template>
  <ContentPageLayout>
    <template #hero>
      <p class="eyebrow">标签</p>
      <h1>标签分类</h1>
      <p class="subtitle">根据 frontmatter 的 `categories` 字段聚类展示。</p>
      <div class="meta">
        <span>分类组数 {{ totalGroups }}</span>
      </div>
    </template>

    <template #default>
      <div v-if="loading" class="state">正在加载标签...</div>
      <div v-else class="group-list">
        <section v-for="group in groups" :key="group.name" class="group">
          <div class="group-header">
            <h2>{{ group.name }}</h2>
            <span>{{ group.posts.length }}</span>
          </div>
          <div class="group-posts">
            <router-link
              v-for="post in group.posts"
              :key="post.id"
              :to="post.url"
              class="post-link"
            >
              {{ post.title }}
            </router-link>
          </div>
        </section>
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

.group-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group {
  border: 1px solid var(--glass-border-soft);
  border-radius: 14px;
  padding: 12px 12px 10px;
  background: color-mix(in oklab, var(--surface-bg) 92%, transparent);
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.group-header h2 {
  margin: 0;
  font-size: 1rem;
  color: var(--surface-title);
}

.group-header span {
  font-size: 0.75rem;
  color: var(--surface-muted);
  border: 1px solid var(--tag-border);
  border-radius: 999px;
  padding: 1px 8px;
}

.group-posts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.post-link {
  color: var(--surface-text);
  text-decoration: none;
  font-size: 0.86rem;
  border: 1px solid var(--tag-border);
  border-radius: 999px;
  padding: 3px 10px;
  background: var(--tag-bg);
}

.post-link:hover {
  color: var(--surface-title);
}
</style>
