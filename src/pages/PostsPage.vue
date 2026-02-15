<script setup lang="ts">
import { computed } from 'vue'
import { getAllPosts, getCategoryTree } from '@/content/posts'

const posts = getAllPosts()
const categoryTree = getCategoryTree()

const totalPosts = computed(() => posts.length)
</script>

<template>
  <ContentPageLayout>
    <template #hero>
      <p class="eyebrow">Posts</p>
      <h1>文章目录</h1>
      <p class="subtitle">自动读取 `src/posts` 并按文件夹层级生成分类结构。</p>
      <div class="meta">
        <span>总文章数 {{ totalPosts }}</span>
      </div>
    </template>

    <template #default>
      <div class="tree-wrap">
        <PostFolderTree
          v-for="node in categoryTree"
          :key="node.pathSegments.join('/')"
          :node="node"
        />
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

.tree-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
