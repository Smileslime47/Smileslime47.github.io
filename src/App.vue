<script setup lang="ts">
import httpService from "~/server/http.ts";
import {fileMapInit, fileTreeInit} from "~/constant/ArchiveCache.ts";

//初始化加载时请求一次根据PushAt字段，判断缓存是否过期
onMounted(async ()=>{
  await httpService.get(
      "https://api.github.com/repos/Smileslime47/Metion_Archive"
  ).then((response) => {
    let githubResponse = response.data as GitRepoResponse
    if(
        localStorage.getItem("Push Date")==null||
        localStorage.getItem("Push Date")!==githubResponse.pushed_at
    ){
      fileTreeInit(true)
      fileMapInit(true)
      localStorage.setItem("Push Date",githubResponse.pushed_at)
    }
  })
})
</script>

<template>
    <el-container>
      <el-header>
        <TopNavBar />
      </el-header>

      <el-main>
        <div style="height:60px"/>
        <router-view/>
      </el-main>

      <el-footer>
        <Footer/>
      </el-footer>
    </el-container>
</template>

<style>
.el-header{
  height: 60px;
  width: 100%;
  position: fixed;
  padding:0;
  top: 0;
  left: 0;
  z-index: 1;
}

.el-footer{
  padding:0 !important;
}
</style>