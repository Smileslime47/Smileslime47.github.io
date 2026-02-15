import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import PostsPage from '@/pages/PostsPage.vue'
import PostDetailPage from '@/pages/PostDetailPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
  routes: [
    { path: '/', component: HomePage },
    { path: '/posts', component: PostsPage },
    { path: '/posts/:pathMatch(.*)*', component: PostDetailPage },
    { path: '/about', component: AboutPage },
  ],
})
