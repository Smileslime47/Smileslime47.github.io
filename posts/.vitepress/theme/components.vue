<script setup>
import DefaultTheme from 'vitepress/theme'
import { VPTeamMembers } from 'vitepress/theme'

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

var gitalk = new Gitalk({
  clientID: '308b0c7a6bcdc200a34d',
  clientSecret: ' 3d5e34747af1afb0ff17b13f5836362b264c8cdd ',
  repo: 'https://github.com/Smileslime47/Smileslime47.github.io',
  owner: 'Smileslime47',
  admin: ['Smileslime47'],
  id: location.pathname,      // Ensure uniqueness and length less than 50
  distractionFreeMode: false  // Facebook-like distraction free mode
})
</script>

<template>
  <Layout>
    <template #aside-outline-before>
      <VPTeamMembers size="small" :members="members" />
    </template>

    <template #doc-footer-before>
      <div id="gitalk-container"></div>
    </template>
  </Layout>
</template>