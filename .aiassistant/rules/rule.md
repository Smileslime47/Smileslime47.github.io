---
apply: 始终
---

## 通用

- 使用TypeScript、Vue和Less开发
- @是`/src`的别名，优先使用@作为路径的前缀
- 永远使用中文注释

## 样式

优先复用`@/styles`下面的less样式，如果没有你希望用的样式，考虑是否有复用性，如果有，则完善`styles`，否则在组件的`style`下面单独添加

## Vue

Style标签永远使用`<style scoped lang="less">`,但是当你要覆写全局样式时，可以不使用scoped

Script标签永远使用`<script setup lang="ts">`