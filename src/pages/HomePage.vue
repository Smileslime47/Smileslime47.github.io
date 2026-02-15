<template>
  <div class="homepage-container">
    <div class="hero">
      <div class="hero-content">
        <h1>47Saikyo</h1>
        <p>{{ displayedText }}<span class="cursor" :class="{ 'cursor-hidden': !showCursor }"></span></p>
      </div>
    </div>
    <HomeContent />
    <div class="background-container" :class="{ blurred: isScrolled }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const fullText = "and in that light, I find deliverance.";
const displayedText = ref("");
const showCursor = ref(true);
let charIndex = 0;

const typeText = () => {
  if (charIndex < fullText.length) {
    displayedText.value += fullText.charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 100); // Adjust typing speed here
  } else {
    // Blinking cursor after typing is finished
    setInterval(() => {
      showCursor.value = !showCursor.value;
    }, 500);
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  typeText();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="less">
.homepage-container {
  position: relative;
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/bg-dark.jpg');
  background-size: cover;
  background-position: center;
  z-index: -1;
  transition: filter 0.3s ease;
  transform: scale(1.05); /* Slightly scale up to hide edges */
}

.background-container.blurred {
  filter: blur(10px);
}

.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
  text-align: center;
}

.hero-content {
  max-width: 600px;

  p {
    display: inline;
  }
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: white;
  margin-left: 2px;
  transition: opacity 0.1s;
}

.cursor-hidden {
  opacity: 0;
}
</style>
