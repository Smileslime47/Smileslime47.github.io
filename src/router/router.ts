import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
  routes: [
    { path: '/', component: () => import('@/pages/HomePage.vue') },
    { path: '/posts', component: () => import('@/pages/PostsPage.vue') },
    { path: '/archive', component: () => import('@/pages/ArchivePage.vue') },
    { path: '/tags', component: () => import('@/pages/TagsPage.vue') },
    { path: '/posts/:pathMatch(.*)*', component: () => import('@/pages/PostDetailPage.vue') },
    { path: '/about', component: () => import('@/pages/AboutPage.vue') },
  ],
})
