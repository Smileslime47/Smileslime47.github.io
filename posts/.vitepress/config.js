import myNav from './nav.js';
import myBar from './sidebar.js';

//plugin
import { withMermaid } from "vitepress-plugin-mermaid";
import mathjax3 from 'markdown-it-mathjax3';
const customElements = ['mjx-container'];

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
    nav: myNav,
    sidebar: myBar,

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