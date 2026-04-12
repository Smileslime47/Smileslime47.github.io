<script setup lang="ts">
withDefaults(defineProps<{
  maxWidth?: string
}>(), {
  maxWidth: 'var(--page-content-max-width, 1440px)',
})
</script>

<template>
  <div class="content-page" :style="{ '--content-page-max-width': maxWidth }">
    <GlassCard as="section" class="content-page-hero">
      <slot name="hero" />
    </GlassCard>

    <GlassCard as="section" class="content-page-card">
      <slot />
    </GlassCard>
  </div>
</template>

<style scoped lang="less">
.content-page {
  min-height: 100vh;
  padding: 86px 14px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
}

.content-page-hero,
.content-page-card {
  width: min(var(--content-page-max-width), 100%);
}

.content-page-hero {
  padding: 14px 18px;
  background: var(--content-page-hero-bg, var(--surface-bg));
}

.content-page-card {
  padding: 16px 18px;
  background: var(--content-page-card-bg, var(--surface-bg));
}

@media (max-width: 768px) {
  .content-page {
    padding: 92px 10px 20px;
    gap: 8px;
  }

  .content-page-hero,
  .content-page-card {
    padding: 12px 14px;
  }
}

@media (max-width: 640px) {
  .content-page-hero {
    padding: 12px 12px;
  }

  .content-page-card {
    padding: 14px 12px;
  }
}
</style>
