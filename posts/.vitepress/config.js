//从外部引入nav和sidebar设置
import myNav from './nav.js';
import myBar from './sidebar.js';

//plugin
import { withMermaid } from "vitepress-plugin-mermaid";
import mathjax3 from 'markdown-it-mathjax3';
import AutoNavPlugin from 'vitepress-auto-nav-sidebar';
const customElements = ['mjx-container'];

//自动生成侧边栏，在windows环境下会生成绝对路径导致运行后不可见，部署到github上显示正常
const { nav, sidebar } = AutoNavPlugin({
  entry:'posts',
  ignoreFolders: ["Translation","Notebooks","node_modules", "assets", "public", ".vitepress", "code", ".obsidian", "utils"], // 需要排除的一些目录
  ignoreFiles: ['index'], // 需要排除的一些文件
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
    //mathjax配置
    config: (md) => {
      md.use(mathjax3);
    },
    //启用代码块行号
    lineNumbers: true,
  },
  
  //mathjax3配置
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  },

  //config
  title: '47Saikyo',                  //网站标题
  description: 'Just playing around.',//网站描述，生成对应meta信息
  //base:'',                          //如果网站没有部署在服务器的root目录下，如https://47saikyo.moe/myblog，则应当设置base:'/myblog/'
  ignoreDeadLinks: true,              //忽视deadlink导致的构建错误

  themeConfig: {                      //Vitepress的主题设置
    siteTitle: '47‘s Blog',           //显示在导航栏左侧的网站标题
    //侧边栏和导航栏，这里我用了自动生成的插件
    nav,
    sidebar,

    //社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Smileslime47/' },
    ],

    //编辑链接
    editLink: {
      pattern: 'https://github.com/Smileslime47/Smileslime47.github.io/tree/main/posts/:path',
      text: 'Edit this page on GitHub'
    },

    //测试docsearch
    algolia: { 
      appId: '8J64VVRP8K', 
      apiKey: 'a18e2f4cc5665f6602c5631fd868adfd', 
      indexName: 'vitepress' 
    }, 
  },
})