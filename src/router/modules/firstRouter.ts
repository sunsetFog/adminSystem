import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '@sky/pcDesign/pages/login/index.vue'),
        meta: { noRefresh: true }
    },
    {
        path: '/register/index',
        name: 'register',
        component: () => import(/* webpackChunkName: "register" */ '@sky/pcDesign/pages/register/index.vue'),
        meta: { noRefresh: true }
    },
    {
        path: '/loadingUnit/index',
        name: 'loadingUnit',
        component: () => import(/* webpackChunkName: "loadingUnit" */ '@sky/pcDesign/pages/loadingUnit/index.vue'),
        meta: { noRefresh: true }
    },
    {
        path: '/401',
        name: 'error401',
        component: () => import(/* webpackChunkName: "error401" */ '@sky/pcDesign/pages/401.vue'),
        meta: { noRefresh: true }
    }
]

export default routes;
