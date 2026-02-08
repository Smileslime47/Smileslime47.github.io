import {createMemoryHistory, createRouter} from "vue-router";
import {routes} from "vue-router/auto-routes";

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})