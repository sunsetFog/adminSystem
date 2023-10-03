// import { emit } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue'

import FirstRouter from './modules/firstRouter';

// const routes: Array<RouteRecordRaw> = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '@/views/AboutView.vue')
//   }
// ]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: FirstRouter,
});
// 转圈进度条，路由变化触发
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// 使用vue-cookies
import VueCookies from 'vue-cookies';
import store from '@/store';
// @ts-ignore
console.log('--VueCookies.get--', VueCookies.get(process.env.VUE_APP_TOKEN_KEY));
// 路由拦截
router.beforeEach((to, from, next) => {
    NProgress.start(); // 开始动画
    // 路由按钮权限
    // @ts-ignore
    if(to.permsList) {
        // @ts-ignore
        sessionStorage.setItem('permsList', JSON.stringify(to.permsList));
    }
    if (from.path == '/' && to.path != '/login') {
        // @ts-ignore
        // if (VueCookies.get(process.env.VUE_APP_TOKEN_KEY)) {
        //     store.dispatch('routerApple').then(function (value) {
        //         // console.log('--then结束--', value);
        //         for (let i = 0; i < value.length; i++) {
        //             const item = value[i];
        //             router.addRoute(item);
        //         }
        //         // console.log('--then结束-2-', router.getRoutes());
        //         next();
        //     });
        // } else {
            next({ path: '/login' });
        // }
    } else {
        next();
    }

});
// 路由结束时
router.afterEach((to, from) => {
    NProgress.done(); // 结束动画
    /*
    触发事件
    在其他vue里接收事件
    this.$router.on('ROUTE_FINISHED', to => {

    })
   */
    // emit('ROUTE_FINISHED', to);
});

export default router;
