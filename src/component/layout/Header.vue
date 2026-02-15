<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const HEADER_CONTENT_WIDTH = 920
const HEADER_SHELL_PADDING = 28
const HEADER_MAX_PROGRESS_SCROLL = 160

const route = useRoute()
const headerProgress = ref(0)

const menuItems = [
    {name: '首页', path: '/'},
    {name: '归档', path: '/archives'},
    {name: '关于', path: '/about'},
]

const updateHeaderProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    const normalizationBase = Math.max(1, Math.min(HEADER_MAX_PROGRESS_SCROLL, scrollable))
    headerProgress.value = Math.min(window.scrollY / normalizationBase, 1)
}

const headerStyle = computed(() => ({
    '--header-progress': String(headerProgress.value),
    '--header-content-width': `${HEADER_CONTENT_WIDTH}px`,
    '--header-shell-width': `${HEADER_CONTENT_WIDTH + HEADER_SHELL_PADDING}px`,
}))

onMounted(() => {
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
                <span>🌙</span>
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
        color: white;
        cursor: pointer;
    }

    .nav-links {
        display: flex;
        gap: clamp(12px, 2vw, 20px);

        .nav-item {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            font-size: 1rem;
            cursor: pointer;

            &:hover {
                color: white;
            }

            &.router-link-active {
                color: white;
                font-weight: bold;
            }
        }
    }

    .actions {
        flex-shrink: 0;
    }
}
</style>
