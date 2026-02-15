<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'

const props = defineProps<{
  content: string
}>()

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  typographer: true,
})

const renderedHtml = computed(() => md.render(props.content))
</script>

<template>
  <article class="markdown-content" v-html="renderedHtml"></article>
</template>

<style scoped lang="less">
.markdown-content {
  color: #d5ddeb;
  line-height: 1.85;
  font-size: 1.03rem;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    color: #f3f6fc;
    line-height: 1.3;
    margin: 1.5em 0 0.6em;
    letter-spacing: -0.01em;
  }

  :deep(h1) {
    font-size: clamp(1.8rem, 3.8vw, 2.35rem);
    margin-top: 0;
  }

  :deep(h2) {
    font-size: clamp(1.3rem, 2.6vw, 1.7rem);
    padding-bottom: 0.35em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  }

  :deep(h3) {
    font-size: 1.2rem;
  }

  :deep(p) {
    margin: 0.95em 0;
    color: #d0d9e8;
  }

  :deep(ul),
  :deep(ol) {
    margin: 0.8em 0 1em;
    padding-left: 1.25em;
  }

  :deep(li) {
    margin: 0.35em 0;
  }

  :deep(a) {
    color: #9ec5ff;
    text-decoration: none;
    border-bottom: 1px dashed rgba(158, 197, 255, 0.52);
  }

  :deep(a:hover) {
    color: #c1dcff;
    border-bottom-style: solid;
  }

  :deep(code) {
    padding: 0.16rem 0.45rem;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.12);
    color: #f4f8ff;
    font-family: var(--font-family-code), monospace;
    font-size: 0.9em;
  }

  :deep(pre) {
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 12px;
    overflow: auto;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(6, 10, 16, 0.56);
  }

  :deep(pre code) {
    padding: 0;
    background: transparent;
    border-radius: 0;
  }

  :deep(blockquote) {
    margin: 1rem 0;
    padding: 0.7rem 1rem;
    border-left: 3px solid rgba(159, 196, 255, 0.8);
    background: rgba(255, 255, 255, 0.06);
    color: #dce6f7;
  }

  :deep(hr) {
    margin: 1.6rem 0;
    border: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }
}
</style>
