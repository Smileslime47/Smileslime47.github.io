<template>
  <div class="homepage-container">
    <div class="hero">
      <div class="hero-content">
        <h1>47Saikyo</h1>
        <p>{{ displayedText }}<span class="cursor" :class="{ 'cursor-hidden': !showCursor }"></span></p>
      </div>
    </div>
    <HomeContent />
    <div
      class="background-container"
      :class="{ blurred: isScrolled }"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import bgDark from '@/assets/bg-dark.jpg';
import bgLight from '@/assets/bg-light.jpg';
import { computed, ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const currentTheme = ref<'dark' | 'light'>('dark');
const fullText = "and in that light, I find deliverance.";
const displayedText = ref("");
const showCursor = ref(true);
let charIndex = 0;
let themeObserver: MutationObserver | null = null;

const backgroundImage = computed(() => (currentTheme.value === 'light' ? bgLight : bgDark));

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
  const syncTheme = () => {
    currentTheme.value = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  };
  syncTheme();
  themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  window.addEventListener('scroll', handleScroll);
  typeText();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  themeObserver?.disconnect();
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
  color: var(--surface-title);
  text-align: center;
}

.hero-content {
  max-width: 600px;

  p {
    color: var(--surface-text);
  }

  p { display: inline; }
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: var(--surface-title);
  margin-left: 2px;
  transition: opacity 0.1s;
}

.cursor-hidden {
  opacity: 0;
}
</style>
