import { createApp } from 'vue'
import '@/styles/global-styles.less'
import App from './App.vue'
import { router } from '@/router/router'
import { applyThemeToDocument, resolveThemePreference } from '@/utils/theme'

applyThemeToDocument(resolveThemePreference())

createApp(App).use(router).mount('#app')
