import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '@sky/pcDesign/pages/login/index.vue')
    },
    {
        path: '/register/index',
        name: 'register',
        component: () => import(/* webpackChunkName: "register" */ '@sky/pcDesign/pages/register/index.vue')
    },
    {
        path: '/401',
        name: 'error401',
        component: () => import(/* webpackChunkName: "error401" */ '@sky/pcDesign/pages/401.vue')
    }
]

export default routes;
