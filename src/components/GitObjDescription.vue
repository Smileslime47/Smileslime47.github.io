<script setup lang="ts">
defineProps<{
  data?: GitSimpleResponse
}>()
</script>

<template>
  <el-descriptions>
    <el-descriptions-item label="名称">{{ data.name }}</el-descriptions-item>
    <el-descriptions-item label="路径">{{ data.path }}</el-descriptions-item>
    <el-descriptions-item label="SHA">{{ data.sha }}</el-descriptions-item>
    <el-descriptions-item label="类型">
      <el-tag v-if="data?.type==='dir'" size="small">DIR</el-tag>
      <el-tag v-else size="small">FILE</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="URL">
      {{ data.html_url}}
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped>

</style>