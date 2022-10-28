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

  themeConfig: {
    siteTitle: '47‘s Blog',
    nav: myNav,
    sidebar: myBar,

    editLink: {
      pattern: 'https://github.com/Smileslime47/Smileslime47.github.io/tree/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})