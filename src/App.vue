<script setup lang="ts">
import HomePage from '@/pages/HomePage.vue'
import Header from "@/component/layout/Header.vue";
import Footer from "@/component/layout/Footer.vue";
</script>

<template>
  <header>
    <Header/>
  </header>
  <main>
    <HomePage/>
  </main>
  <footer>
    <Footer/>
  </footer>
</template>

<style scoped>
footer {
  text-align: center;
  padding: 2rem 0;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.footer-content a {
  color: #ff69b4;
  text-decoration: none;
}
</style>
