<script setup lang="ts">
import githubIcon from "~/assets/icons/github.svg"
import webIcon from "~/assets/icons/web-icon.svg"
import setIcon from "~/assets/icons/settings.svg"
import routeTo from "~/route/routeTo.ts";
import fresh from "~/composables/fresh.ts";
import {getFileTree} from "~/constant/ArchiveCache.ts";
import httpService from "~/server/http.ts";
import {ElMessage} from "element-plus";

const categoryList = ref([] as GithubResponse[])

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const goToGithub = () => {
  window.open("https://github.com/Smileslime47/Smileslime47.github.io")
}

const sendDebugRequest = () => {
  httpService.get(
      'https://api.github.com/repos/Smileslime47/Metion_Archive',
  ).then((response)=>{
    console.log(response)
    ElMessage({
      message:response.data,
      type:"success"
    })
  }).catch((error)=>{
    ElMessage({
      message:error.message ,
      type:"warning"
    })
  })
}

const clearCache = () => {
  localStorage.clear()
  ElMessage({
    message:"清除完毕，下一次刷新界面会重新请求Archive。",
    type:"success"
  })
}

fresh(async (_) => {
  let githubArchiveTree = await getFileTree()
  githubArchiveTree.forEach((content,_)=>{
    if(content.type=="dir"){
      categoryList.value.push(content as GithubResponse)
    }
  })
})
</script>

<template>
  <el-menu
      mode="horizontal"
      :ellipsis=false
      @select="handleSelect"
  >
    <el-menu-item index="0" @click="routeTo.home()">
      <el-space>
        <img
            style="width: 40px"
            :src=webIcon
            alt="webIcon"
        />
        <el-text size="large" class="mx-1">47 Saikyo</el-text>
      </el-space>
    </el-menu-item>
    <div class="flex-grow"/>

    <el-menu-item v-for="parent in categoryList as GithubResponse[]" @click="routeTo.archive(parent)">
      <el-text> {{ parent.name }} </el-text>
    </el-menu-item>

    <el-divider direction="vertical" border-style="solid"/>
    <el-menu-item index="3" @click="goToGithub">
      <img
          style="width: 20px"
          :src=githubIcon
          alt="githubIcon"
      />
    </el-menu-item>
    <el-sub-menu index="4">
      <template #title>
        <img
            style="width: 20px"
            :src=setIcon
            alt="setIcon"
        />
      </template>
      <el-menu-item index="4-1" @click="sendDebugRequest">
        <el-text>调试按钮</el-text>
      </el-menu-item>
      <el-menu-item index="4-2" @click="clearCache">
        <el-text>清除缓存</el-text>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
.el-menu {
  padding-left: 50px;
  padding-right: 50px;
}

.el-divider {
  height: 100%
}

.flex-grow {
  flex-grow: 1;
}
</style>
