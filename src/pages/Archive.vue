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
  //获取当前目录的对象
  getFileMap().then(async (map) => {
    archive.value = <GitSimpleResponse>map.get(pathStr)
    if (map.has(path + "/README.md")||map.has(path + "/index.md")) {
      let readeMeObj = map.has(path + "/README.md")?
          map.get(path + "/README.md") as GitSimpleResponse:
          map.get(path + "/index.md") as GitSimpleResponse
      await getFileContent(
          readeMeObj.path
      ).then((content) => {
        //渲染markdown内容
        readme.value=content as string
        htmlContent.value = mdRender(readme.value)
      })
    } else {
      //清空readme内容，防止切换分类时保留渲染
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
      <GitObjDescription :data="archive"/>
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