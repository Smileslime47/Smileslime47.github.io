<template>
  <div class="home-content">
    <aside class="sidebar">
      <div class="personal-info">
        <img src="@/assets/enana.jpg" alt="Avatar" class="avatar">
        <h2>47Saikyo</h2>
        <p>A software engineer who loves coding and anime.</p>
      </div>
    </aside>
    <main class="main-content">
      <article class="post-card" v-for="post in posts" :key="post.id">
        <img :src="post.image" :alt="post.title" />
        <div class="post-info">
          <h2>{{ post.title }}</h2>
          <p>{{ post.excerpt }}</p>
          <a :href="post.url">阅读更多</a>
        </div>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const posts = ref([
  {
    id: 1,
    title: '第一篇文章',
    excerpt: '这是第一篇文章的摘要...',
    image: 'https://w.wallhaven.cc/full/7p/wallhaven-7p39gy.jpg',
    url: '#',
  },
  {
    id: 2,
    title: '第二篇文章',
    excerpt: '这是第二篇文章的摘要...',
    image: 'https://w.wallhaven.cc/full/j8/wallhaven-j8pk1w.jpg',
    url: '#',
  },
  {
    id: 3,
    title: '第三篇文章',
    excerpt: '这是第三篇文章的摘要...',
    image: 'https://w.wallhaven.cc/full/6d/wallhaven-6dowgw.jpg',
    url: '#',
  },
]);
</script>

<style scoped lang="less">
.home-content {
  display: flex;
  gap: 2rem;
  padding: 2rem 25%;
}

.sidebar {
  width: 300px;
}

.personal-info {
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  padding: 2rem;
  border-radius: var(--border-radius-md);
  text-align: center;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 1rem;
  }
}

.main-content {
  flex: 1;
}

.post-card {
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  border-radius: var(--border-radius-md);
  margin-bottom: 2rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .post-info {
    padding: 1.5rem;

    h2 {
      font-size: 1.5rem;
      margin: 0 0 0.5rem;
    }

    p {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 1rem;
    }

    a {
      text-decoration: none;
      color: #ff69b4;
      font-weight: bold;
    }
  }
}
</style>
