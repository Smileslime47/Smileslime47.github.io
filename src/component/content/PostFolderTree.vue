<script setup lang="ts">
import type { CategoryNode } from '@/service/posts'

defineProps<{
  node: CategoryNode
}>()
</script>

<template>
  <details class="folder-node" open>
    <summary>
      <span class="folder-name">{{ node.name }}</span>
      <span class="folder-count">{{ node.posts.length }}</span>
    </summary>

    <ul v-if="node.posts.length > 0" class="post-list">
      <li v-for="post in node.posts" :key="post.id">
        <router-link :to="post.url">{{ post.title }}</router-link>
      </li>
    </ul>

    <div v-if="node.children.length > 0" class="children">
      <PostFolderTree v-for="child in node.children" :key="child.pathSegments.join('/')" :node="child" />
    </div>
  </details>
</template>

<style scoped lang="less">
.folder-node {
  border: 1px solid var(--surface-border);
  border-radius: 10px;
  background: color-mix(in oklab, var(--surface-bg), transparent 15%);
  padding: 8px 10px;
}

.folder-node + .folder-node {
  margin-top: 8px;
}

summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: var(--surface-title);
  font-weight: 600;
}

summary::-webkit-details-marker {
  display: none;
}

.folder-count {
  font-size: 0.75rem;
  color: var(--surface-muted);
}

.post-list {
  margin: 8px 0 0;
  padding-left: 12px;
}

.post-list li + li {
  margin-top: 6px;
}

.post-list a {
  color: var(--md-link);
  text-decoration: none;
  font-size: 0.9rem;
}

.post-list a:hover {
  color: var(--md-link-hover);
}

.children {
  margin-top: 8px;
  padding-left: 10px;
}
</style>
