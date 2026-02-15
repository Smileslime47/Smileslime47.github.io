<script setup lang="ts">
const menuItems = [
    {name: '首页', path: '/'},
    {name: '归档', path: '/archives'},
    {name: '关于', path: '/about'},
]
</script>

<template>
    <div class="navigation">
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
    </div>
</template>

<style lang="less" scoped>
.navigation {
    position: fixed;
    width: 100%;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    height: 60px;

    .center();

    .nav-inner {
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 20px;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .brand {
        font-size: 1.7rem;
        font-weight: bold;
        color: white;
        cursor: pointer;
    }

    .nav-links {
        display: flex;
        gap: 20px; // 链接之间的间距

        .nav-item {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            font-size: 1rem;
            cursor: pointer;

            &:hover {
                color: white;
            }

            // Vue Router 会自动给当前激活的链接加上这个类
            &.router-link-active {
                color: white;
                font-weight: bold;
            }
        }
    }
}
</style>