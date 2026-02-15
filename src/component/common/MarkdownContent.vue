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
  color: var(--md-text);
  line-height: 1.55;
  font-size: 0.95rem;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    color: var(--md-heading);
    line-height: 1.2;
    margin: 1em 0 0.35em;
    letter-spacing: -0.01em;
  }

  :deep(h1) {
    font-size: clamp(1.35rem, 2.8vw, 1.85rem);
    margin-top: 0;
  }

  :deep(h2) {
    font-size: clamp(1.08rem, 2vw, 1.32rem);
    padding-bottom: 0.22em;
    border-bottom: 1px solid var(--md-divider);
  }

  :deep(h3) {
    font-size: 1rem;
  }

  :deep(p) {
    margin: 0.5em 0;
    color: var(--md-text);
  }

  :deep(ul),
  :deep(ol) {
    margin: 0.45em 0 0.6em;
    padding-left: 1.1em;
  }

  :deep(li) {
    margin: 0.16em 0;
  }

  :deep(a) {
    color: var(--md-link);
    text-decoration: none;
    border-bottom: 1px dashed color-mix(in oklab, var(--md-link), transparent 52%);
  }

  :deep(a:hover) {
    color: var(--md-link-hover);
    border-bottom-style: solid;
  }

  :deep(code) {
    padding: 0.08rem 0.34rem;
    border-radius: 4px;
    background: var(--md-inline-code-bg);
    color: var(--md-inline-code-text);
    font-family: var(--font-family-code), monospace;
    font-size: 0.9em;
  }

  :deep(pre) {
    margin: 0.6rem 0;
    padding: 0.7rem 0.8rem;
    border-radius: 8px;
    overflow: auto;
    border: 1px solid var(--md-divider);
    background: var(--md-code-bg);
    color: var(--md-code-text);
  }

  :deep(pre code) {
    padding: 0;
    background: transparent;
    color: inherit;
    border-radius: 0;
  }

  :deep(blockquote) {
    margin: 0.55rem 0;
    padding: 0.45rem 0.7rem;
    border-left: 3px solid var(--md-quote-border);
    background: var(--md-quote-bg);
    color: var(--md-text);
  }

  :deep(hr) {
    margin: 0.8rem 0;
    border: 0;
    border-top: 1px solid var(--md-divider);
  }
}
</style>
