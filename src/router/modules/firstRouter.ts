import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '@sky/rafaelDesign/web/pages/login/index.vue'),
        meta: { noRefresh: true }
    },
    {
        path: '/register/index',
        name: 'register',
        component: () => import(/* webpackChunkName: "register" */ '@sky/rafaelDesign/web/pages/register/index.vue'),
        meta: { noRefresh: true }
    },
    {
        path: '/loadingUnit/index',
        name: 'loadingUnit',
        component: () => import(/* webpackChunkName: "loadingUnit" */ '@sky/rafaelDesign/web/pages/loadingUnit/index.vue'),
        meta: { noRefresh: true }
    },
    {
        path: '/401',
        name: 'error401',
        component: () => import(/* webpackChunkName: "error401" */ '@sky/rafaelDesign/web/pages/401.vue'),
        meta: { noRefresh: true }
    }
]

export default routes;
