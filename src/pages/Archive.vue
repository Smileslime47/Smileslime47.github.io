<script setup lang="ts">
import Fresh from "~/composables/fresh.ts";
import {getFileMap} from "~/global/ArchiveCache.ts";
import {Ref} from "vue";
import {getFileContent} from "~/server/http.ts";
import mdRender from "~/composables/mdRender.ts";
import {RouteParamValue} from "vue-router";

const archive:Ref<GitSimpleResponse> = ref({} as GitSimpleResponse)
const readme:Ref<string> = ref("")
const htmlContent:Ref<string> = ref("")
const treeConfig = {
  label : 'name',
  children : 'contents'
}

Fresh((toRoute)=>{
  let path :string | RouteParamValue[] = toRoute.params.path
  let pathStr:string=""
  //生成路径地址
  if(path instanceof Array){
    path.forEach((node,index)=>{
      pathStr=pathStr.concat(index!==0?"/"+node:node)
    })
  }else if(path instanceof String){
    pathStr=path
  }
  console.log(pathStr)
  //获取当前目录的对象
  getFileMap().then(async (map) => {
    archive.value = <GitSimpleResponse>map.get(pathStr)
    if (map.has(path + "/README.md")||map.has(path + "/index.md")) {
      let readeMeObj = map.has(path + "/README.md")?map.get(path + "/README.md") as GitSimpleResponse:map.get(path + "/index.md") as GitSimpleResponse
      await getFileContent(
          readeMeObj.path
      ).then((content) => {
        readme.value=content as string
        htmlContent.value = mdRender(readme.value)
      })
    } else {
      readme.value = ""
      htmlContent.value=""
    }
  })
})
</script>

<template>

  <el-space direction="vertical" fill class="full-width">
    <el-card>
      <template #header>
        <h1>Archive 归档</h1>
      </template>
      <el-descriptions>
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
    </el-card>
    <el-card>
      <el-tree :data="archive.contents" :props="treeConfig"/>
    </el-card>
    <el-card v-if="readme.length!==0">
      <div class="mdText" v-html="htmlContent"></div>
    </el-card>
  </el-space>
</template>

<style scoped>

</style>