---
apply: 始终
---

## 通用

- 使用 TypeScript、Vue 和 Less 开发
- `@` 是 `@/src` 的别名，优先使用 `@` 作为路径前缀
- 永远使用中文注释
- 在 Windows PowerShell 下写回含中文的源码文件时，必须显式指定 UTF-8 编码；不要使用未声明编码的 `Set-Content` / `Out-File`
- 如果需要批量回写文本，优先使用 `apply_patch`；必须用 PowerShell 写文件时，使用 `[System.IO.File]::WriteAllText(path, content, [System.Text.UTF8Encoding]::new($false))`

## 样式

优先复用 `@/styles` 下面的 less 样式，如果没有你希望用的样式，先考虑是否有复用价值；如果有，就补充到 `styles`，否则再在组件自己的 `style` 里添加

## Vue

- `style` 标签默认使用 `<style scoped lang="less">`
- 只有在确实需要覆盖全局样式时，才去掉 `scoped`
- `script` 标签默认使用 `<script setup lang="ts">`
