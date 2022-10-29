// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import components from './components.vue'

export default {
  ...DefaultTheme,
  Layout:components
}