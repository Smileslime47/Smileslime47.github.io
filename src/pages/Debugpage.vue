<script setup lang="ts">
import httpService from "~/server/http.ts";
import {ElMessage} from "element-plus";

const sendDebugRequest = () => {
  httpService.get(
      '/contents',
  ).then((response)=>{
    console.log(response)
    ElMessage({
      message:response,
      type:"primary"
    })
  }).catch((error)=>{
    ElMessage({
      message:error ,
      type:"warning"
    })
  })
}
</script>

<template>
  <el-button @click="sendDebugRequest">
    测试按钮
  </el-button>
</template>

<style scoped>

</style>