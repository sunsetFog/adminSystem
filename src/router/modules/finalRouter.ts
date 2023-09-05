import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '*',
        name: 'error404',
        component: () => import(/* webpackChunkName: "error404" */ '@sky/pcDesign/pages/404.vue')
    }
]

export default routes;