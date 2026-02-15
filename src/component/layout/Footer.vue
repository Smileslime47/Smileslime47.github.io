<script setup lang="ts">
</script>

<template>
  <div class="footer-shell">
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
    <p class="footer-powered">POWERED BY Smile_slime_47, CodeX</p>
  </div>
</template>

<style scoped lang="less">
.footer-shell {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
}

.footer-content {
  grid-column: 2;
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

.footer-powered {
  grid-column: 3;
  justify-self: end;
  margin: 0;
  color: var(--footer-text-muted);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  padding: 4px 10px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--glass-surface) 60%, transparent);
  border: 1px solid color-mix(in oklab, var(--glass-border) 80%, transparent);
  opacity: 0.8;
}

@media (max-width: 900px) {
  .footer-shell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .footer-powered {
    justify-self: auto;
  }
}
</style>
