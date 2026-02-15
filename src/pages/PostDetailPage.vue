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
      <div class="breadcrumbs" v-if="post && post.categorySegments.length > 0">
        <span v-for="segment in post.categorySegments" :key="segment">{{ segment }}</span>
      </div>
    </template>

    <template #default>
      <p v-if="loading" class="empty">正在加载文章内容...</p>
      <p v-else-if="loadError" class="empty">文章加载失败：{{ loadError }}</p>
      <MarkdownContent v-else-if="post" :content="post.content" />
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

.breadcrumbs {
  margin-top: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.breadcrumbs span {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--tag-border);
  color: var(--tag-text);
  font-size: 0.72rem;
  background: var(--tag-bg);
}

.empty {
  color: var(--surface-text);
}
</style>
