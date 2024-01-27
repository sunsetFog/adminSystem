import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/:pathMatch(.*)*', // vue3改版：'*' 在vue-router 4版本不支持了
        name: 'error404',
        component: () => import(/* webpackChunkName: "error404" */ '@sky/rafaelDesign/web/pages/404.vue'),
    },
];

export default routes;
