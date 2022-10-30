<script setup>
import DefaultTheme from 'vitepress/theme'
import { VPTeamMembers } from 'vitepress/theme'

import { onMounted } from 'vue'
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'


const { Layout } = DefaultTheme
const members = [
  {
    avatar: 'https://www.github.com/Smileslime47.png',
    name: 'Smile_slime_47',
    title: 'Myself',
    links: [
      { icon: 'github', link: 'https://github.com/Smileslime47' },
    ]
  },
]

onMounted(() => {
  if(typeof window !==undefined){
    var s_div = document.createElement('div');   // 创建节点
    s_div.setAttribute("id", "gitalk-page-container");   // 设置id
    document.querySelector('.content-container').appendChild(s_div);   // querySelector的节点可自己根据自己想加载的地方设置
    var gitment = new Gitalk({
      id: location.pathname, // 可选。默认为 location.href
      owner: 'Smileslime47', // GitHub repository 所有者
      repo: 'Smileslime47.github.io', // GitHub repository
      clientID: '308b0c7a6bcdc200a34d', // 自己的clientID
      clientSecret: 'd28ca59ffc98a45310830bad5d48c382a29d7667',// 自己的clientSecret
      admin: ['Smileslime47'], // GitHub repository 所有者
      labels: ['Gitalk'], // GitHub issue 的标签
      createIssueManually: false, //如果当前页面没有相应的 isssue 且登录的用户属于 admin，则会自动创建 issue。如果设置为 true，则显示一个初始化页面，创建 issue 需要点击 init 按钮。
    })
    gitment.render('gitalk-page-container')
  }
})
</script>

<template>
  <Layout>
    <template #doc-after>
      <div id="gitalk-page-container"></div>
    </template>

    <template #aside-outline-before>
      <VPTeamMembers size="small" :members="members" />
    </template>
  </Layout>
</template>
