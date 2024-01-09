import { createApp } from 'vue'
import App from "~/App.vue";
import "~/assets/styles/global.css"
import "~/assets/styles/tokyo-night-dark.css";
import "element-plus/theme-chalk/src/index.scss"
import router from "~/route/router.ts";

createApp(App)
    .use(router)
    .mount('#app')
