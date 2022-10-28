import { withMermaid } from "vitepress-plugin-mermaid";
import mathjax3 from 'markdown-it-mathjax3';
const customElements = ['mjx-container'];

export default withMermaid({
  markdown: {
    config: (md) => {
      md.use(mathjax3);
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  },

  title: '47Saikyo',
  description: 'Just playing around.',

  themeConfig: {
    siteTitle: '47‘s Blog',
    nav: [
      { text: 'Home', link: '/index.md' },
      { text: 'MyNotebooks', link: '/Notebooks/Assembly Language Design/汇编语言设计' },
    ],
    sidebar: {
        '/Notebooks/': [
        {
          text: 'Notebook',
          items: [
            { text: 'Assembly Language Design', link: '/Notebooks/Assembly Language Design/汇编语言设计.md' },
            { text: 'Operating System Principle', link: '/Notebooks/Operating System Principle/操作系统原理.md' },
          ]
        },
      ],
    }
  }
})