<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const HEADER_CONTENT_WIDTH = 920
const HEADER_SHELL_PADDING = 28
const HEADER_MAX_PROGRESS_SCROLL = 160
const THEME_STORAGE_KEY = '47-blog-theme'

const route = useRoute()
const headerProgress = ref(0)
const theme = ref<'dark' | 'light'>('dark')

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

const headerStyle = computed(() => ({
  '--header-progress': String(headerProgress.value),
  '--header-content-width': `${HEADER_CONTENT_WIDTH}px`,
  '--header-shell-width': `${HEADER_CONTENT_WIDTH + HEADER_SHELL_PADDING}px`,
}))

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
})

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    updateHeaderProgress()
  }
)

onUnmounted(() => {
  window.removeEventListener('scroll', updateHeaderProgress)
})
</script>

<template>
  <header class="navigation" :style="headerStyle">
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
        <button class="theme-toggle" type="button" @click="toggleTheme">
          {{ theme === 'dark' ? 'Light' : 'Dark' }}
        </button>
      </div>
    </div>
  </header>
</template>

<style lang="less" scoped>
.navigation {
  height: 60px;
  padding: 0 8px;

  .center();

  .nav-inner {
    width: min(100%, var(--header-content-width, 920px));
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
    flex-shrink: 0;
  }

  .theme-toggle {
    border: 1px solid rgba(var(--glass-border-rgb), 0.3);
    background: rgba(var(--glass-bg-start-rgb), 0.42);
    color: var(--header-text);
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 0.82rem;
    cursor: pointer;
    transition: background 180ms ease;
  }

  .theme-toggle:hover {
    background: rgba(var(--glass-bg-start-rgb), 0.66);
  }
}
</style>
