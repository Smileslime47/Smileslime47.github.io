<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { postsService, type PostEntry } from '@/service/posts'

const route = useRoute()
const post = ref<PostEntry | null>(null)
const loading = ref(false)
const notFound = ref(false)
const loadError = ref('')

const title = computed(() => {
  if (loading.value) return '加载中...'
  if (notFound.value) return '未找到文章'
  return post.value?.title ?? '文章'
})

const categoryTrail = computed(() => post.value?.categorySegments ?? [])
const enableMath = computed(() => post.value?.frontmatter.mathjax !== 'false')

const loadCurrentPost = async () => {
  const param = route.params.pathMatch
  const segments = Array.isArray(param) ? param : typeof param === 'string' ? [param] : []
  const decoded = segments.map((segment) => decodeURIComponent(segment))

  loading.value = true
  notFound.value = false
  loadError.value = ''

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
      <MarkdownContent v-else-if="post" :content="post.content" :enable-math="enableMath" :post-id="post.id" />
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
</style>
