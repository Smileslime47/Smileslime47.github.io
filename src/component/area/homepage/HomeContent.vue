<template>
  <div class="home-content">
    <aside class="sidebar">
      <GlassCard class="personal-info">
        <img src="@/assets/enana.jpg" alt="Avatar" class="avatar">
        <h2>47Saikyo</h2>
        <p>A software engineer who loves coding and anime.</p>
      </GlassCard>
    </aside>

    <main class="main-content">
      <GlassCard
        v-for="post in posts"
        :key="post.id"
        as="article"
        class="post-card"
      >
        <img :src="post.image" :alt="post.title" />
        <div class="post-info">
          <h2>{{ post.title }}</h2>
          <p>{{ post.excerpt }}</p>
          <a :href="post.url">Read more</a>
        </div>
      </GlassCard>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const posts = ref([
  {
    id: 1,
    title: 'First post',
    excerpt: 'This is a short excerpt from the first post...',
    image: 'https://w.wallhaven.cc/full/7p/wallhaven-7p39gy.jpg',
    url: '#',
  },
  {
    id: 2,
    title: 'Second post',
    excerpt: 'This is a short excerpt from the second post...',
    image: 'https://w.wallhaven.cc/full/j8/wallhaven-j8pk1w.jpg',
    url: '#',
  },
  {
    id: 3,
    title: 'Third post',
    excerpt: 'This is a short excerpt from the third post...',
    image: 'https://w.wallhaven.cc/full/6d/wallhaven-6dowgw.jpg',
    url: '#',
  },
])
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
  padding: 2rem;
  color: var(--surface-title);
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
  padding: 0;
  color: var(--surface-title);
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
      color: var(--surface-text);
      margin: 0 0 1rem;
    }

    a {
      text-decoration: none;
      color: var(--md-link);
      font-weight: bold;
    }
  }
}
</style>
