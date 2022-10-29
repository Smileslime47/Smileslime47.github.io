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
];
</script>

<template>
  <Layout>
    <template #aside-outline-before>
      <VPTeamMembers size="small" :members="members" />
    </template>
  </Layout>
</template>