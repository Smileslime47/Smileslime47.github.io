<script setup lang="ts">
import Fresh from "~/composables/fresh.ts";
import {getFileMap} from "~/constant/ArchiveCache.ts";
import {Ref} from "vue";

const archive:Ref<GithubResponse> = ref({})

Fresh(()=>{
  let path:string = useRoute().params.path as string
  getFileMap().then((map)=>{
    console.log(map)
    archive.value=<GithubResponse>map.get(path)
  })
})
</script>

<template>
  <h1>Archive 归档</h1>
  <el-descriptions title="节点信息">
    <el-descriptions-item label="名称">{{ archive.name }}</el-descriptions-item>
    <el-descriptions-item label="路径">{{ archive.path }}</el-descriptions-item>
    <el-descriptions-item label="SHA">{{ archive.sha }}</el-descriptions-item>
    <el-descriptions-item label="类型">
      <el-tag v-if="archive.type==='dir'" size="small">DIR</el-tag>
      <el-tag v-else size="small">FILE</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="API URL">
      {{ archive.url}}
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped>

</style>