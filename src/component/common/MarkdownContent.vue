<script setup lang="ts">
import hljs from 'highlight.js/lib/common'
import MarkdownIt from 'markdown-it'
import markdownItMathjax3 from 'markdown-it-mathjax3'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { resolvePostAssetUrls } from '@/service/posts/asset-resolver'

const props = withDefaults(defineProps<{
  content: string
  enableMath?: boolean
  postId?: string
}>(), {
  enableMath: false,
  postId: undefined,
})

const articleRef = ref<HTMLElement | null>(null)
const renderedHtml = ref('')
let renderVersion = 0

watch(
  () => [props.content, props.enableMath, props.postId],
  () => {
    void renderMarkdown()
  },
  { immediate: true }
)

watch(renderedHtml, async () => {
  await nextTick()
})

onMounted(() => {
  articleRef.value?.addEventListener('click', onArticleClick)
})

onBeforeUnmount(() => {
  articleRef.value?.removeEventListener('click', onArticleClick)
})

async function renderMarkdown(): Promise<void> {
  const currentVersion = ++renderVersion
  const resolvedImageSrcByRaw = await collectResolvedImageSrcMap(props.content, props.enableMath, props.postId)
  const html = createMarkdownRenderer(props.enableMath, resolvedImageSrcByRaw).render(props.content)
  if (currentVersion !== renderVersion) return
  renderedHtml.value = html
}

async function collectResolvedImageSrcMap(
  content: string,
  _enableMath: boolean,
  postId?: string
): Promise<Map<string, string>> {
  if (!postId || content.trim() === '') return new Map()
  const rawSrcList = extractMarkdownImageUrls(content)
  return resolvePostAssetUrls(postId, rawSrcList)
}

function extractMarkdownImageUrls(content: string): string[] {
  const matches = content.matchAll(/!\[[^\]]*]\(([^)\n]+)\)/g)
  const urls: string[] = []
  for (const match of matches) {
    const url = match[1]?.trim()
    if (!url) continue
    urls.push(url.replace(/^<|>$/g, ''))
  }
  return urls
}

function createMarkdownParser(enableMath: boolean): MarkdownIt {
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: true,
    typographer: true,
  })

  if (enableMath) {
    md.use(markdownItMathjax3)
  }

  return md
}

function createMarkdownRenderer(enableMath: boolean, resolvedImageSrcByRaw: Map<string, string>): MarkdownIt {
  const md = createMarkdownParser(enableMath)

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]
    if (!token) return ''

    const info = (token.info ?? '').trim()
    const language = info.split(/\s+/)[0] ?? ''
    const displayLanguage = language || 'text'
    const code = token.content.replace(/\r\n/g, '\n')
    const highlighted = highlightCode(code, language)
    const codeLines = buildCodeLines(highlighted)

    return `<div class="code-block"><div class="code-block__toolbar"><span class="code-block__language">${escapeHtml(displayLanguage)}</span><button class="code-block__copy" type="button" data-copy-code="${encodeURIComponent(code)}">复制</button></div><pre class="code-block__pre hljs"><code>${codeLines}</code></pre></div>`
  }

  const defaultImageRenderer = md.renderer.rules.image ?? ((tokens, idx, options, _env, self) => {
    return self.renderToken(tokens, idx, options)
  })

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const rawSrc = token?.attrGet('src')
    if (token && rawSrc) {
      const resolved = resolvedImageSrcByRaw.get(rawSrc)
      if (resolved) {
        token.attrSet('src', resolved)
      }
    }
    return defaultImageRenderer(tokens, idx, options, env, self)
  }

  return md
}

function highlightCode(code: string, language: string): string {
  if (language && hljs.getLanguage(language)) {
    return hljs.highlight(code, {
      language,
      ignoreIllegals: true,
    }).value
  }

  return escapeHtml(code)
}

function buildCodeLines(highlightedCode: string): string {
  const normalized = highlightedCode.replace(/\n$/, '')
  const lines = normalized.split('\n')

  return lines
    .map((line, index) => {
      const safeLine = line.length > 0 ? line : ' '
      return `<span class="code-line"><span class="code-line__number">${index + 1}</span><span class="code-line__content">${safeLine}</span></span>`
    })
    .join('')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function onArticleClick(event: Event): Promise<void> {
  const target = event.target
  if (!(target instanceof HTMLElement)) return

  const copyButton = target.closest<HTMLButtonElement>('[data-copy-code]')
  if (!copyButton) return

  const raw = copyButton.dataset.copyCode
  if (!raw) return

  try {
    await navigator.clipboard.writeText(decodeURIComponent(raw))
    const originalText = copyButton.textContent ?? '复制'
    copyButton.textContent = '已复制'
    window.setTimeout(() => {
      copyButton.textContent = originalText
    }, 1600)
  } catch {
    copyButton.textContent = '复制失败'
    window.setTimeout(() => {
      copyButton.textContent = '复制'
    }, 1600)
  }
}
</script>

<template>
  <article ref="articleRef" class="markdown-content" v-html="renderedHtml"></article>
</template>

<style scoped lang="less">
.markdown-content {
  color: var(--md-text);
  line-height: 1.7;
  font-size: 0.96rem;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    color: var(--md-heading);
    line-height: 1.2;
    margin: 1.15em 0 0.4em;
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
    margin: 0.65em 0;
    color: var(--md-text);
  }

  :deep(ul),
  :deep(ol) {
    margin: 0.55em 0 0.8em;
    padding-left: 1.25em;
  }

  :deep(li) {
    margin: 0.22em 0;
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
    padding: 0.1rem 0.36rem;
    border-radius: 6px;
    background: var(--md-inline-code-bg);
    color: var(--md-inline-code-text);
    font-family: var(--font-family-code), monospace;
    font-size: 0.9em;
  }

  :deep(img) {
    display: block;
    max-width: 100%;
    width: auto;
    height: auto;
    margin: 0.9rem auto;
    border-radius: 12px;
    object-fit: contain;
  }

  :deep(.code-block) {
    margin: 0.9rem 0;
    border-radius: 14px;
    border: 1px solid color-mix(in oklab, var(--md-divider), transparent 15%);
    background: linear-gradient(180deg, color-mix(in oklab, var(--md-code-bg), white 5%) 0%, var(--md-code-bg) 100%);
    overflow: hidden;
    box-shadow: 0 12px 30px color-mix(in oklab, var(--surface-shadow), transparent 35%);
  }

  :deep(.code-block__toolbar) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0.55rem 0.85rem;
    border-bottom: 1px solid color-mix(in oklab, var(--md-divider), transparent 25%);
    background: color-mix(in oklab, var(--md-code-bg), white 4%);
  }

  :deep(.code-block__language) {
    color: var(--surface-muted);
    font-size: 0.76rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  :deep(.code-block__copy) {
    border: 1px solid color-mix(in oklab, var(--md-divider), transparent 10%);
    border-radius: 999px;
    background: transparent;
    color: var(--surface-title);
    padding: 0.24rem 0.7rem;
    font-size: 0.78rem;
    line-height: 1.2;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }

  :deep(.code-block__copy:hover) {
    transform: translateY(-1px);
    color: var(--md-link-hover);
    border-color: color-mix(in oklab, var(--md-link-hover), transparent 35%);
  }

  :deep(.code-block__pre) {
    margin: 0;
    overflow: auto;
    padding: 0.12rem 0;
    background: transparent;
    color: var(--md-code-text);
  }

  :deep(.code-block__pre code) {
    display: block;
    min-width: max-content;
    padding: 0;
    background: transparent;
    color: inherit;
    border-radius: 0;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  :deep(.code-line) {
    display: grid;
    grid-template-columns: 2.8rem minmax(0, 1fr);
    align-items: baseline;
  }

  :deep(.code-line:hover) {
    background: color-mix(in oklab, var(--md-link-hover), transparent 93%);
  }

  :deep(.code-line__number) {
    user-select: none;
    text-align: right;
    padding: 0.12rem 0.75rem 0.12rem 0.4rem;
    color: color-mix(in oklab, var(--surface-muted), transparent 10%);
    border-right: 1px solid color-mix(in oklab, var(--md-divider), transparent 35%);
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
  }

  :deep(.code-line__content) {
    display: block;
    padding: 0.12rem 1rem;
    white-space: pre;
    line-height: 1.5;
  }

  :deep(.hljs-comment),
  :deep(.hljs-quote) {
    color: #7c879c;
    font-style: italic;
  }

  :deep(.hljs-keyword),
  :deep(.hljs-selector-tag),
  :deep(.hljs-subst) {
    color: #ff8c6a;
  }

  :deep(.hljs-string),
  :deep(.hljs-attr),
  :deep(.hljs-symbol),
  :deep(.hljs-bullet) {
    color: #8ddc97;
  }

  :deep(.hljs-number),
  :deep(.hljs-literal) {
    color: #f7c76d;
  }

  :deep(.hljs-title),
  :deep(.hljs-section),
  :deep(.hljs-built_in),
  :deep(.hljs-type) {
    color: #73b7ff;
  }

  :deep(.hljs-variable),
  :deep(.hljs-template-variable),
  :deep(.hljs-selector-class),
  :deep(.hljs-selector-id) {
    color: #d9a9ff;
  }

  :deep(blockquote) {
    margin: 0.75rem 0;
    padding: 0.65rem 0.9rem;
    border-left: 3px solid var(--md-quote-border);
    background: var(--md-quote-bg);
    color: var(--md-text);
    border-radius: 0 10px 10px 0;
  }

  :deep(hr) {
    margin: 1rem 0;
    border: 0;
    border-top: 1px solid var(--md-divider);
  }

  :deep(.MathJax),
  :deep(mjx-container) {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .markdown-content {
    :deep(.code-block__toolbar) {
      padding-inline: 0.75rem;
    }

    :deep(.code-line) {
      grid-template-columns: 2.45rem minmax(0, 1fr);
    }

    :deep(.code-line__content) {
      padding-right: 0.8rem;
    }
  }
}
</style>
