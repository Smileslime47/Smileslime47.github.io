<script setup lang="ts">
withDefaults(defineProps<{
  as?: string
}>(), {
  as: 'div',
})
</script>

<template>
  <component :is="as" class="glass-card glass-shell">
    <slot />
  </component>
</template>

<style scoped lang="less">
.glass-card {
  --glass-radius: 20px;
  padding: 1.5rem;
  border-radius: var(--glass-radius);
  border: 1px solid var(--surface-border);
  box-shadow: 0 14px 36px var(--surface-shadow);
  background: var(--surface-bg);
}

.glass-card::before {
  opacity: 0.22;
}
</style>
