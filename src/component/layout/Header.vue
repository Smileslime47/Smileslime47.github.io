<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})
import { computed, nextTick, onMounted, onUnmounted, ref, useAttrs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue/offline'
import { postsService } from '@/service/posts'
import { iconMoon, iconSearch, iconSun } from '@/component/iconify/icons'
import type { PostMeta } from '@/service/posts'

const HEADER_MAX_PROGRESS_SCROLL = 160
const THEME_STORAGE_KEY = '47-blog-theme'

const attrs = useAttrs()
const route = useRoute()
const router = useRouter()
const headerProgress = ref(0)
const theme = ref<'dark' | 'light'>('dark')
const searchOpen = ref(false)
const searchKeyword = ref('')
const searchablePosts = ref<PostMeta[]>([])

const menuItems = [
  { name: '首页', path: '/' },
  { name: '文章', path: '/posts' },
  { name: '归档', path: '/archive' },
  { name: '标签', path: '/tags' },
  { name: '关于', path: '/about' },
]

const updateHeaderProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const normalizationBase = Math.max(1, Math.min(HEADER_MAX_PROGRESS_SCROLL, scrollable))
  headerProgress.value = Math.min(window.scrollY / normalizationBase, 1)
}

const applyTheme = (nextTheme: 'dark' | 'light') => {
  theme.value = nextTheme
  document.documentElement.setAttribute('data-theme', nextTheme)
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
}

const toggleTheme = () => {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
}

const normalizedKeyword = computed(() => searchKeyword.value.trim().toLowerCase())
const filteredPosts = computed(() => {
  const keyword = normalizedKeyword.value
  if (!keyword) return searchablePosts.value.slice(0, 12)

  return searchablePosts.value
    .filter((post) => {
      const haystacks = [
        post.title,
        post.filePath,
        post.categorySegments.join(' '),
        post.excerpt,
        post.publishedAt ?? '',
      ]
      return haystacks.some((value) => value.toLowerCase().includes(keyword))
    })
    .slice(0, 12)
})

const themeToggleLabel = computed(() => (theme.value === 'dark' ? '切换浅色模式' : '切换深色模式'))

const headerStyle = computed(() => ({
  '--header-progress': String(headerProgress.value),
}))

function openSearch() {
  searchOpen.value = true
}

function closeSearch() {
  searchOpen.value = false
  searchKeyword.value = ''
}

async function jumpToPost(url: string) {
  await router.push(url)
  closeSearch()
}

onMounted(() => {
  const persisted = localStorage.getItem(THEME_STORAGE_KEY)
  if (persisted === 'dark' || persisted === 'light') {
    applyTheme(persisted)
  } else {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(systemPrefersDark ? 'dark' : 'light')
  }

  updateHeaderProgress()
  window.addEventListener('scroll', updateHeaderProgress, { passive: true })
  void postsService.loadAllPostMetas().then((items) => {
    searchablePosts.value = items
  })
})

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    updateHeaderProgress()
    searchOpen.value = false
  }
)

onUnmounted(() => {
  window.removeEventListener('scroll', updateHeaderProgress)
})
</script>

<template>
  <header v-bind="attrs" class="navigation" :style="headerStyle">
    <div class="nav-inner">
      <router-link to="/" class="brand">
        47Saikyo
      </router-link>
      <nav class="nav-links">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
        >
          {{ item.name }}
        </router-link>
      </nav>
      <div class="actions">
        <button class="action-btn icon-btn" type="button" aria-label="搜索" @click="openSearch">
          <Icon class="action-icon" :icon="iconSearch" />
        </button>
        <button class="theme-toggle icon-btn" type="button" :aria-label="themeToggleLabel" @click="toggleTheme">
          <Icon class="action-icon" :icon="theme === 'dark' ? iconSun : iconMoon" />
        </button>
      </div>
    </div>
  </header>

  <teleport to="body">
    <div v-if="searchOpen" class="search-overlay" @click.self="closeSearch">
      <div class="search-modal glass-shell">
        <div class="search-head">
          <h2>搜索文章</h2>
          <button class="close-btn" type="button" @click="closeSearch">关闭</button>
        </div>
        <input
          v-model="searchKeyword"
          class="search-input"
          type="text"
          placeholder="搜索标题、路径、摘要..."
          autofocus
        >
        <div class="search-results">
          <button
            v-for="post in filteredPosts"
            :key="post.id"
            class="search-item"
            type="button"
            @click="jumpToPost(post.url)"
          >
            <span class="search-title">{{ post.title }}</span>
            <span class="search-meta">{{ post.publishedAt || '未标注日期' }} · {{ post.filePath }}</span>
            <span v-if="post.excerpt" class="search-excerpt">{{ post.excerpt }}</span>
          </button>
          <p v-if="filteredPosts.length === 0" class="search-empty">没有找到匹配的文章。</p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="less" scoped>
.navigation {
  height: 60px;
  padding: 0 8px;

  .center();

  .nav-inner {
    width: min(var(--page-content-max-width, 1440px), calc(100% - var(--page-content-side-gap, 28px)));
    min-width: 0;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: clamp(16px, 3vw, 36px);
  }

  .brand {
    font-size: 1.7rem;
    font-weight: bold;
    color: var(--header-text);
    cursor: pointer;
  }

  .nav-links {
    display: flex;
    gap: clamp(12px, 2vw, 20px);

    .nav-item {
      color: var(--header-text-muted);
      text-decoration: none;
      font-size: 1rem;
      cursor: pointer;

      &:hover {
        color: var(--header-text);
      }

      &.router-link-active {
        color: var(--header-text);
        font-weight: bold;
      }
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .action-btn,
  .theme-toggle {
    border: 1px solid rgba(var(--glass-border-rgb), 0.3);
    background: rgba(var(--glass-bg-start-rgb), 0.42);
    color: var(--header-text);
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 0.82rem;
    line-height: 1;
    cursor: pointer;
    transition: background 180ms ease;
  }

  .icon-btn {
    width: 34px;
    height: 30px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .action-icon {
    width: 17px;
    height: 17px;
  }

  .action-btn:hover,
  .theme-toggle:hover {
    background: rgba(var(--glass-bg-start-rgb), 0.66);
  }
}

.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 84px 16px 24px;
  background: rgba(7, 10, 16, 0.34);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.search-modal {
  width: min(760px, 100%);
  padding: 16px;
  border-radius: 22px;
  border: 1px solid var(--surface-border);
  background: var(--surface-bg);
  box-shadow: 0 18px 44px var(--surface-shadow);
}

.search-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.search-head h2 {
  margin: 0;
  color: var(--surface-title);
  font-size: 1.1rem;
}

.close-btn {
  border: 1px solid var(--tag-border);
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 999px;
  padding: 4px 10px;
  cursor: pointer;
}

.search-input {
  width: 100%;
  margin-top: 12px;
  border: 1px solid var(--surface-border);
  border-radius: 14px;
  padding: 12px 14px;
  background: color-mix(in oklab, var(--surface-bg) 88%, transparent);
  color: var(--surface-title);
  outline: none;
}

.search-results {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: min(60vh, 560px);
  overflow: auto;
}

.search-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  border: 1px solid var(--surface-border);
  border-radius: 14px;
  padding: 12px 14px;
  text-align: left;
  background: color-mix(in oklab, var(--surface-bg) 92%, transparent);
  cursor: pointer;
}

.search-item:hover {
  background: color-mix(in oklab, var(--tag-bg) 70%, var(--surface-bg));
}

.search-title {
  color: var(--surface-title);
  font-size: 0.98rem;
  font-weight: 600;
}

.search-meta,
.search-excerpt,
.search-empty {
  color: var(--surface-text);
  font-size: 0.86rem;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .navigation {
    height: auto;
    padding-top: 8px;
    padding-bottom: 6px;
  }

  .navigation .nav-inner {
    flex-wrap: wrap;
    gap: 16px;
    padding: 0 14px;
  }

  .navigation .brand {
    font-size: 1.4rem;
    flex: 1 1 auto;
  }

  .navigation .nav-links {
    order: 3;
    width: 100%;
    gap: 12px;
    overflow: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
  }

  .navigation .nav-links::-webkit-scrollbar {
    display: none;
  }

  .navigation .nav-item {
    white-space: nowrap;
  }

  .navigation .actions {
    margin-left: auto;
  }
}

@media (max-width: 640px) {
  .navigation {
    padding-inline: 4px;
  }

  .navigation .nav-inner {
    gap: 12px;
    padding: 0 10px;
  }

  .navigation .brand {
    font-size: 1.18rem;
  }

  .navigation .nav-links {
    gap: 10px;
  }

  .navigation .nav-item {
    font-size: 0.92rem;
  }

  .navigation .actions {
    gap: 8px;
  }

  .navigation .action-btn,
  .navigation .theme-toggle {
    width: 32px;
    height: 28px;
    font-size: 0.76rem;
  }

  .navigation .action-icon {
    width: 16px;
    height: 16px;
  }

  .search-overlay {
    align-items: flex-start;
    padding: 72px 10px 16px;
  }

  .search-modal {
    padding: 14px;
    border-radius: 18px;
  }

  .search-head h2 {
    font-size: 1rem;
  }

  .search-input {
    padding: 10px 12px;
    font-size: 0.95rem;
  }

  .search-item {
    padding: 10px 12px;
  }

  .search-title {
    font-size: 0.92rem;
  }

  .search-meta,
  .search-excerpt,
  .search-empty {
    font-size: 0.8rem;
    line-height: 1.5;
  }
}
</style>

