import { createApp } from 'vue'
import '@/styles/global-styles.less'
import App from './App.vue'
import { router } from '@/router/router'

createApp(App).use(router).mount('#app')
