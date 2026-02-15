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
  line-height: 1.82;
  font-size: 1.03rem;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    color: var(--md-heading);
    line-height: 1.3;
    margin: 1.4em 0 0.6em;
    letter-spacing: -0.01em;
  }

  :deep(h1) {
    font-size: clamp(1.8rem, 3.8vw, 2.35rem);
    margin-top: 0;
  }

  :deep(h2) {
    font-size: clamp(1.3rem, 2.6vw, 1.7rem);
    padding-bottom: 0.35em;
    border-bottom: 1px solid var(--md-divider);
  }

  :deep(h3) {
    font-size: 1.2rem;
  }

  :deep(p) {
    margin: 0.92em 0;
    color: var(--md-text);
  }

  :deep(ul),
  :deep(ol) {
    margin: 0.8em 0 1em;
    padding-left: 1.25em;
  }

  :deep(li) {
    margin: 0.3em 0;
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
    padding: 0.16rem 0.45rem;
    border-radius: 6px;
    background: var(--md-inline-code-bg);
    color: var(--md-inline-code-text);
    font-family: var(--font-family-code), monospace;
    font-size: 0.9em;
  }

  :deep(pre) {
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 12px;
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
    margin: 1rem 0;
    padding: 0.7rem 1rem;
    border-left: 3px solid var(--md-quote-border);
    background: var(--md-quote-bg);
    color: var(--md-text);
  }

  :deep(hr) {
    margin: 1.6rem 0;
    border: 0;
    border-top: 1px solid var(--md-divider);
  }
}
</style>
