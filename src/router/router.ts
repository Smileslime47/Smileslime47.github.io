import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
  routes: [
    { path: '/', component: HomePage },
    { path: '/posts', component: () => import('@/pages/PostsPage.vue') },
    { path: '/archive', component: () => import('@/pages/ArchivePage.vue') },
    { path: '/tags', component: () => import('@/pages/TagsPage.vue') },
    { path: '/posts/:pathMatch(.*)*', component: () => import('@/pages/PostDetailPage.vue') },
    { path: '/about', component: () => import('@/pages/AboutPage.vue') },
  ],
})
