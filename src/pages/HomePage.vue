<template>
  <div class="homepage-container">
    <div class="hero">
      <div class="hero-content">
        <h1>47Saikyo</h1>
        <p>{{ heroText }}</p>
      </div>
    </div>

    <AsyncHomeContent v-if="shouldRenderHomeContent" />

    <div class="background-container">
      <div class="background-glow" :class="{ 'is-active': isScrolled }"></div>
      <img
        class="background-image-layer"
        :class="{ 'is-loaded': isHighResLoaded }"
        :src="backgroundImage"
        alt="site background"
        width="1600"
        height="914"
        decoding="async"
        fetchpriority="high"
        @load="onHighResLoad"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import bgDark from '@/assets/bg-dark.jpg'
import bgLight from '@/assets/bg-light.jpg'
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { runWhenIdle } from '@/utils/scheduling'

const HERO_TEXT = 'and in that light, I find deliverance.'
const SCROLL_BLUR_TRIGGER = 50

const AsyncHomeContent = defineAsyncComponent(() => import('@/component/area/homepage/HomeContent.vue'))

const shouldRenderHomeContent = ref(false)
const isScrolled = ref(false)
const isHighResLoaded = ref(false)
const currentTheme = ref<'dark' | 'light'>('dark')
const heroText = HERO_TEXT

let themeObserver: MutationObserver | null = null
let scrollFrame = 0

const backgroundImage = computed(() => (currentTheme.value === 'light' ? bgLight : bgDark))

function queueHomeContentRender() {
  runWhenIdle(() => {
    shouldRenderHomeContent.value = true
  })
}

function onHighResLoad() {
  isHighResLoaded.value = true
}

function syncTheme() {
  currentTheme.value = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

function updateScrollState() {
  scrollFrame = 0
  const nextValue = window.scrollY > SCROLL_BLUR_TRIGGER
  if (nextValue !== isScrolled.value) {
    isScrolled.value = nextValue
  }
}

function handleScroll() {
  if (scrollFrame !== 0) return
  scrollFrame = window.requestAnimationFrame(updateScrollState)
}

onMounted(() => {
  syncTheme()
  queueHomeContentRender()

  themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  updateScrollState()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  if (scrollFrame !== 0) {
    window.cancelAnimationFrame(scrollFrame)
  }
  window.removeEventListener('scroll', handleScroll)
  themeObserver?.disconnect()
})
</script>

<style scoped lang="less">
.homepage-container {
  position: relative;
}

.background-container {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.16), transparent 42%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.12)),
    var(--theme-bg);
}

.background-glow {
  position: absolute;
  inset: -8%;
  background:
    radial-gradient(circle at 18% 18%, rgba(126, 199, 255, 0.18), transparent 34%),
    radial-gradient(circle at 82% 24%, rgba(255, 142, 173, 0.14), transparent 30%),
    radial-gradient(circle at 50% 80%, rgba(111, 255, 208, 0.1), transparent 38%);
  opacity: 0.72;
  transition: opacity 220ms ease;
}

.background-glow.is-active {
  opacity: 0.46;
}

.background-image-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 420ms ease-out;
  will-change: opacity;
}

.background-image-layer.is-loaded {
  opacity: 0.94;
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
