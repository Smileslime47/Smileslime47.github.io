<script setup lang="ts">
import "~/assets/fonts/font.css"
const myAvatarUrl=ref("https://avatars.githubusercontent.com/u/77948910?v=4")
const mdUrl = ref("https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/96px-Markdown-mark.svg.png")
const viteUrl = ref("https://camo.githubusercontent.com/2e1efd50b61f26c56e82929d735dce115937350e280abac98641c79d765da27c/68747470733a2f2f766974656a732e6465762f6c6f676f2e737667")
const msgPackUrl = ref("https://avatars.githubusercontent.com/u/198264?s=200&v=4")
</script>

<template>
  <div class="hero">
      <span class="tagline-title text-blue">
        Smile_slime_47
      </span>
      <br/>
      <span class="tagline-subtitle text-black" style="margin-top: 20px">
        我的个人博客
      </span>
      <br/>
      <el-button-group style="margin-top:20px">
        <el-button
            size="large"
            text
            bg
            plain>关于-></el-button>
      </el-button-group>
  </div>

  <el-divider />

  <div style="text-align: center">
    <div class="card-container">
        <el-card class="tagcard divider">
          <template #header>
            <span class="card-info text-blue">Web Developer</span>
          </template>
          <span class="card-info text-black">Web-App开发工程师</span>
        </el-card>
        <el-card class="tagcard divider">
          <template #header>
            <span class="card-info text-blue">Java & Kotlin</span>
          </template>
          <span class="card-info text-black">Java 和 Kotlin 开发者</span>
        </el-card>
        <el-card class="tagcard divider">
          <template #header>
            <span class="card-info text-blue">Anime</span>
          </template>
          <span class="card-info text-black">我才不是二次元！</span>
        </el-card>
      <el-card class="tagcard divider">
        <template #header>
          <span class="card-info text-blue">Distributed system</span>
        </template>
        <span class="card-info text-black">分布式 & 区块链在学</span>
      </el-card>
    </div>
  </div>

  <el-divider />

  <div style="text-align: center">
    <span style="font-size: 20px">Powered By:</span>
    <div class="card-container">
        <el-card class="powercard divider" :body-style="{ padding: '0px' }" >
          <div class="align-center" style="height: 200px;width: 100%">
            <el-image
                :src=myAvatarUrl
                style="width: 200px"
            />
          </div>
          <div style="padding: 14px">
            <span>Smile_slime_47</span>
            <div class="bottom">
              <el-text>我本人</el-text>
            </div>
          </div>
        </el-card>
      <el-card class="powercard divider" :body-style="{ padding: '0px' }" >
        <div class="align-center" style="height: 200px;width: 100%">
          <el-image
              :src=viteUrl
              style="width: 150px"
          />
        </div>
        <div style="padding: 14px">
          <span>Vite</span>
          <div class="bottom">
            <el-text>基于Vite & TypeScript开发</el-text>
          </div>
        </div>
      </el-card>
      <el-card class="powercard divider" :body-style="{ padding: '0px' }" >
        <div class="align-center" style="height: 200px;width: 100%">
          <el-image
              :src=mdUrl
          />
        </div>
        <div style="padding: 14px">
          <span>Markdown</span>
          <div class="bottom">
            <el-text>文章基于Markdown及相关依赖渲染</el-text>
          </div>
        </div>
      </el-card>
      <el-card class="powercard divider" :body-style="{ padding: '0px' }" >
        <div class="align-center" style="height: 200px;width: 100%">
          <el-image
              :src=msgPackUrl
              style="width: 100px"
          />
        </div>
        <div style="padding: 14px">
          <span>Message Pack</span>
          <div class="bottom">
            <el-text>基于MsgPack和Github Actions实现的目录结构缓存</el-text>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.divider{
  margin:0 10px
}
.text-blue{
  color:#409EFF
}
.text-black{
  color:#323232
}
.card-container{
  margin:20px;
  display: flex;
  justify-content: center;
}
.hero{
  width: 100%;
  text-align:center;
  padding:96px 0;
}
.tagline-title{
  font-weight: bold;
  font-size:76px;
}
.tagline-subtitle{
  font-size:50px;
}
.card-info{
  font-size:20px;
  width: 200px;
}
.tagcard{
  width: 300px;
}
.powercard{
  width: 200px;
}

.el-space{
  width:60%
}
.el-button{
  width:150px;
  font-size:20px
}
</style>