import { createApp } from 'vue'
import App from "~/App.vue";
import "~/assets/styles/global.css"
import "element-plus/theme-chalk/src/index.scss"
import router from "~/route/router.ts";
import createHandler from "github-webhook-handler";
import {fileTreeInit} from "~/constant/ArchiveCache.ts";

const handler=createHandler({
    path:"/webhook",
    secret:"fmmomo0108"
})

handler.on("push",(event)=>{
    fileTreeInit()
    console.log("push updated")
})

createApp(App)
    .use(router)
    .mount('#app')
