import myNav from './nav.js';
import myBar from './sidebar.js';

//plugin
import { withMermaid } from "vitepress-plugin-mermaid";
import mathjax3 from 'markdown-it-mathjax3';
import AutoNavPlugin from 'vitepress-auto-nav-sidebar';
const customElements = ['mjx-container'];
const { nav, sidebar } = AutoNavPlugin({
  entry:'posts',
  ignoreFolders: ["node_modules", "assets", "public", ".vitepress", "code", ".obsidian", "utils"], // 需要排除的一些目录
  ignoreFiles: ['个人简历'], // 需要排除的一些文件
  dirPrefix: '目录：',
  filePrefix: '文件：',
  showNavIcon:false,
  showSideIcon:true,
  isCollapse: true,
  collapsed: true,
  singleLayerNav:true
})

export default withMermaid({
  markdown: {
    //mathjax插件
    config: (md) => {
      md.use(mathjax3);
    },
    //启用代码块行号
    lineNumbers: true,
  },
  
  vue: {
    template: {
      //mathjax3
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  },

  //metadata
  title: '47Saikyo',
  description: 'Just playing around.',
  ignoreDeadLinks: true,

  themeConfig: {
    siteTitle: '47‘s Blog',
    nav,
    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Smileslime47/' },
    ],

    editLink: {
      pattern: 'https://github.com/Smileslime47/Smileslime47.github.io/tree/main/posts/:path',
      text: 'Edit this page on GitHub'
    },

    algolia: { 
      appId: '8J64VVRP8K', 
      apiKey: 'a18e2f4cc5665f6602c5631fd868adfd', 
      indexName: 'vitepress' 
    }, 
  },
})