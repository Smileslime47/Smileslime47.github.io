import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
    {path: '/', redirect: 'Home'},
    {path: '/home', name: 'Home', component: () => import('~/pages/Homepage.vue')},
    {path: "/archive/:path+", name: "Archive", component: () => import('~/pages/Archive.vue')},
]

export default routes