<template>
  <div class="homepage-container">
    <div class="hero">
      <div class="hero-content">
        <h1>47Saikyo</h1>
        <p>{{ displayedText }}<span class="cursor" :class="{ 'cursor-hidden': !showCursor }"></span></p>
      </div>
    </div>
    <AsyncHomeContent />
    <div class="background-container" :class="{ blurred: isScrolled }">
      <img
        class="background-image-layer"
        :src="backgroundImage"
        alt="site background"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import bgDark from '@/assets/bg-dark.jpg';
import bgLight from '@/assets/bg-light.jpg';
import { computed, defineAsyncComponent, ref, onMounted, onUnmounted } from 'vue';

const AsyncHomeContent = defineAsyncComponent(() => import('@/component/area/homepage/HomeContent.vue'))

const isScrolled = ref(false);
const currentTheme = ref<'dark' | 'light'>('dark');
const fullText = "and in that light, I find deliverance.";
const displayedText = ref("");
const showCursor = ref(true);
let charIndex = 0;
let themeObserver: MutationObserver | null = null;

// 直接通过计算属性拿到当前的图片源，交给 img 标签自己去下载和展现渐进式
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
  background-color: var(--theme-bg);
  background-image:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 48%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.04));
  z-index: -1;
  overflow: hidden;
  transition: filter 0.3s ease;
  transform: scale(1.05); /* Slightly scale up to hide edges */
}

/* 重新定义的图片层，用 object-fit 完美替代 background-size: cover */
.background-image-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; 
  object-position: center;
  z-index: -1;
  /* 去掉了之前的 opacity 控制，让它从第一字节就开始渲染，展现真正的渐进式加载！ */
}

.background-container.blurred {
  filter: blur(10px);
}

.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  padding: 96px 18px 32px;
  color: var(--surface-title);
  text-align: center;
}

.hero-content {
  max-width: min(600px, 100%);

  h1 {
    font-size: clamp(2.2rem, 8vw, 4.5rem);
    line-height: 1.05;
  }

  p {
    color: var(--surface-text);
    font-size: clamp(0.98rem, 2.5vw, 1.18rem);
    line-height: 1.7;
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

@media (max-width: 640px) {
  .hero {
    padding-top: 112px;
    align-items: flex-start;
  }

  .hero-content {
    max-width: 100%;
  }
}
</style>