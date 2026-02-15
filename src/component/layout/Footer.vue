<script setup lang="ts">
</script>

<template>
  <div class="footer-content">
    <p>
      本博客所有内容均采用 CC BY-NC-SA 4.0 许可协议
      <a
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans"
        target="_blank"
        rel="noopener noreferrer"
        class="cc-link"
      >
        <img
          src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.svg"
          alt="CC BY-NC-SA 4.0"
        >
      </a>
    </p>
    <p>Copyright © 2026 Smile_slime_47 All rights reserved. || 47saikyo.moe</p>
  </div>
</template>

<style scoped lang="less">
.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--footer-text);
}

.footer-content p {
  margin: 0;
  color: var(--footer-text-muted);
}

.cc-link {
  display: inline-flex;
  vertical-align: middle;
  margin-left: 8px;
}

.cc-link img {
  width: 88px;
  height: 31px;
}
</style>
