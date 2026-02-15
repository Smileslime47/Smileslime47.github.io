import { createApp } from 'vue'
import '@/styles/global-styles.less'
import App from './App.vue'
import { router } from '@/router/router'

const THEME_STORAGE_KEY = '47-blog-theme'
const persistedTheme = localStorage.getItem(THEME_STORAGE_KEY)
if (persistedTheme === 'dark' || persistedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', persistedTheme)
} else {
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light')
}

createApp(App).use(router).mount('#app')
