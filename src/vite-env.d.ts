/// <reference types="vite/client" />
/*
 * 第一行注释用于规避在Vite中导入svg静态资源时，TSC编译报错的问题
 * 用于在*.ts中导入*.vue时报出类型声明错误的问题
 * 例如在main.ts中 import App from "./App.vue";
 */
declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<object, object, any>;
    export default component;
}