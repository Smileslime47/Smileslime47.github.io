<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPostBySegments } from '@/content/posts'

const route = useRoute()

const post = computed(() => {
  const param = route.params.pathMatch
  const segments = Array.isArray(param) ? param : typeof param === 'string' ? [param] : []
  return getPostBySegments(segments.map((segment) => decodeURIComponent(segment)))
})

const title = computed(() => post.value?.title ?? '未找到文章')
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
      <MarkdownContent v-if="post" :content="post.content" />
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
