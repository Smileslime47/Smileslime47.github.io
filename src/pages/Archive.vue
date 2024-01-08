<script setup lang="ts">
import Fresh from "~/composables/fresh.ts";
import {getFileMap} from "~/global/ArchiveCache.ts";
import {Ref} from "vue";
import {getFileContent} from "~/server/http.ts";
import mdRender from "~/composables/mdRender.ts";
import getSha from "~/composables/sha.ts";

const archive:Ref<GithubResponse> = ref({} as GithubResponse)
const readme:Ref<string> = ref("")
const htmlContent:Ref<string> = ref("")

Fresh((toRoute)=>{
  let path:string = toRoute.params.path as string
  getFileMap().then(async (map) => {
    archive.value = <GithubResponse>map.get(path)
    if (map.has(getSha(path + "/README.md"))) {
      console.log("has readme!")
      let readeMeObj = map.get(path + "/README.md") as GithubResponse
      await getFileContent(readeMeObj.url).then((content) => {
        readme.value=content as string
        htmlContent.value = mdRender(readme.value)
      })
    }
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
    <el-descriptions-item label="URL">
      {{ archive.html_url}}
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions v-if="htmlContent.length!==0" title="Readme">
    <div class="mdText" v-html="htmlContent"></div>
  </el-descriptions>
</template>

<style scoped>

</style>