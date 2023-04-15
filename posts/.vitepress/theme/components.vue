<script setup>
import DefaultTheme from 'vitepress/theme'
import { VPTeamMembers } from 'vitepress/theme'
import { useData } from 'vitepress'

import { onMounted } from 'vue'
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

const { frontmatter } = useData()
const { Layout } = DefaultTheme
const members = [
  {
    avatar: 'https://www.github.com/Smileslime47.png',
    name: 'Smile_slime_47',
    title: 'Myself',
    links: [
      { icon: 'github', link: 'https://github.com/Smileslime47' },
      { icon: 'leetcode', link: 'https://leetcode.cn/u/smile_slime_47/' },
    ]
  },
]

onMounted(() => {
  if(typeof window !==undefined){
    var s_div = document.createElement('div');  
    s_div.setAttribute("id", "gitalk-page-container");   
    document.querySelector('.content-container').appendChild(s_div);
    const gitalk = new Gitalk({
    id: location.pathname, 
    owner: 'Smileslime47', 
    repo: 'Smileslime47.github.io', 
    clientID: '308b0c7a6bcdc200a34d', 
    clientSecret: 'd28ca59ffc98a45310830bad5d48c382a29d7667',
    admin: ['Smileslime47'], 
    labels: ['Gitalk'], 
    createIssueManually: false, 
    })
    gitment.render('gitalk-page-container')
  }
})
</script>

<template>
  <Layout>
    <template #doc-before>
      <span style="color:#323232">{{ frontmatter.date }}</span>
      <span>
        <span class="tags" v-for="item in frontmatter.tags" :key="item">{{ item }}</span>
      </span>
    </template>

    <template #doc-after>
      <div id="gitalk-page-container"></div>
    </template>

    <template #aside-outline-before>
      <VPTeamMembers size="small" :members="members" />
    </template>
  </Layout>
</template>

<style>
  .tags{
    border: 2px solid #dde;
    padding-left: 5px;
    padding-right: 5px;
    margin-left: 5px;
    background: #dde;
    border-radius: 5px;
  }
</style>
