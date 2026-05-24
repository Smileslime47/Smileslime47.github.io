<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { postsService, type PostEntry } from '@/service/posts'

const route = useRoute()
const post = ref<PostEntry | null>(null)
const loading = ref(false)
const notFound = ref(false)
const loadError = ref('')
const tocItems = ref<MarkdownTocItem[]>([])

interface MarkdownTocItem {
  id: string
  text: string
  level: 2 | 3
}

const title = computed(() => {
  if (loading.value) return '加载中...'
  if (notFound.value) return '未找到文章'
  return post.value?.title ?? '文章'
})

const categoryTrail = computed(() => post.value?.categorySegments ?? [])
const enableMath = computed(() => post.value?.frontmatter.mathjax !== 'false')
const hasToc = computed(() => tocItems.value.length > 0)

const loadCurrentPost = async () => {
  const param = route.params.pathMatch
  const segments = Array.isArray(param) ? param : typeof param === 'string' ? [param] : []
  const decoded = segments.map((segment) => decodeURIComponent(segment))

  loading.value = true
  notFound.value = false
  loadError.value = ''
  tocItems.value = []

  try {
    const result = await postsService.loadPostBySegments(decoded)
    post.value = result ?? null
    notFound.value = !result
  } catch (error) {
    post.value = null
    notFound.value = false
    loadError.value = error instanceof Error ? error.message : String(error)
  } finally {
    loading.value = false
  }
}

const onTocReady = (items: MarkdownTocItem[]) => {
  tocItems.value = items
}

watch(
  () => route.fullPath,
  () => {
    void loadCurrentPost()
  },
  { immediate: true }
)
</script>

<template>
  <ContentPageLayout>
    <template #hero>
      <p class="eyebrow">Post</p>
      <h1>{{ title }}</h1>
      <p v-if="post" class="subtitle">{{ post.filePath }}</p>
      <div v-if="categoryTrail.length > 0" class="category-panel">
        <span class="category-panel__label">分类路径</span>
        <div class="category-panel__trail">
          <span class="category-panel__root">posts</span>
          <template v-for="(segment, index) in categoryTrail" :key="`${segment}-${index}`">
            <span class="category-panel__separator">/</span>
            <span class="category-panel__item">{{ segment }}</span>
          </template>
        </div>
      </div>
    </template>

    <template #default>
      <p v-if="loading" class="empty">正在加载文章内容...</p>
      <p v-else-if="loadError" class="empty">文章加载失败：{{ loadError }}</p>
      <div v-else-if="post" class="post-layout" :class="{ 'post-layout--with-toc': hasToc }">
        <aside v-if="hasToc" class="post-toc" aria-label="文章目录">
          <p class="post-toc__title">目录</p>
          <nav class="post-toc__nav">
            <a
              v-for="item in tocItems"
              :key="item.id"
              class="post-toc__link"
              :class="`post-toc__link--level-${item.level}`"
              :href="`#${item.id}`"
            >
              {{ item.text }}
            </a>
          </nav>
        </aside>
        <MarkdownContent
          class="post-layout__content"
          :content="post.content"
          :enable-math="enableMath"
          :post-id="post.id"
          @toc-ready="onTocReady"
        />
      </div>
      <p v-else class="empty">未找到对应文章，请返回文章目录检查路径。</p>
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
  font-size: 0.88rem;
}

.category-panel {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid color-mix(in oklab, var(--surface-border), transparent 10%);
  background: color-mix(in oklab, var(--surface-bg), white 3%);
}

.category-panel__label {
  color: var(--surface-muted);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.category-panel__trail {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  line-height: 1.45;
}

.category-panel__root,
.category-panel__item {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--tag-border), transparent 10%);
  background: color-mix(in oklab, var(--tag-bg), white 4%);
  color: var(--surface-title);
  font-size: 0.78rem;
}

.category-panel__root {
  color: var(--surface-muted);
}

.category-panel__separator {
  color: var(--surface-muted);
  font-size: 0.78rem;
}

.empty {
  color: var(--surface-text);
}

.post-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
}

.post-layout--with-toc {
  grid-template-columns: minmax(0, 1fr) 230px;
  align-items: start;
}

.post-layout__content {
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
}

.post-toc {
  --post-toc-sticky-offset: 92px;

  grid-column: 2;
  grid-row: 1;
  position: sticky;
  top: var(--post-toc-sticky-offset);
  max-height: calc(100vh - var(--post-toc-sticky-offset) - 24px);
  overflow: auto;
  padding: 12px 12px 12px 14px;
  border-left: 1px solid color-mix(in oklab, var(--surface-border), transparent 8%);
  color: var(--surface-text);
}

.post-toc__title {
  margin: 0 0 8px;
  color: var(--surface-muted);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.post-toc__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.post-toc__link {
  display: block;
  padding: 5px 8px;
  border-radius: 8px;
  color: var(--surface-text);
  font-size: 0.82rem;
  line-height: 1.35;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.post-toc__link:hover {
  background: color-mix(in oklab, var(--tag-bg), white 5%);
  color: var(--surface-title);
}

.post-toc__link--level-3 {
  padding-left: 20px;
  color: var(--surface-muted);
  font-size: 0.78rem;
}

@media (max-width: 1080px) {
  .post-layout--with-toc {
    grid-template-columns: minmax(0, 1fr);
  }

  .post-toc {
    grid-column: auto;
    grid-row: auto;
    position: static;
    max-height: none;
    order: -1;
    padding: 12px;
    border: 1px solid color-mix(in oklab, var(--surface-border), transparent 8%);
    border-radius: 12px;
    background: color-mix(in oklab, var(--surface-bg), white 3%);
  }

  .post-layout__content {
    grid-column: auto;
    grid-row: auto;
  }

  .post-toc__nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 640px) {
  .post-toc__nav {
    grid-template-columns: minmax(0, 1fr);
  }

  .post-toc__link {
    padding-inline: 6px;
  }
}
</style>
