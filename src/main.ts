import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// 加载全局样式
import '@root/global.css';
import '@root/global.less';
import '@root/global.scss';



// mock
import '@sky/database/index';

// font-awesome图标
import 'font-awesome/css/font-awesome.min.css';




const rainbow = createApp(App);

// 全局注册自定义指令
import * as directives from '@sky/directive';
Object.keys(directives).forEach(key => {
    rainbow.directive(key, directives[key]);
});

// 全局注册组件
import LineTextLine from '@sky/pcDesign/components/lineTextLine/index.vue';
rainbow.component('LineTextLine', LineTextLine);
import previewPictures from '@sky/pcDesign/components/previewPictures.vue';
rainbow.component('previewPictures', previewPictures);
import upload1 from '@sky/pcDesign/components/upload1.vue';
rainbow.component('upload1', upload1);
import pagination from '@sky/pcDesign/components/pagination.vue';
rainbow.component('pagination', pagination);
// 全局注册图标组件
import * as Icons from '@element-plus/icons-vue'
Object.keys(Icons).forEach(key => {
  rainbow.component(key, Icons[key]) 
})

// --- 原型 ---

import means from '@sky/means/index.js';
rainbow.config.globalProperties.$means = means;

// study: 全局注册过滤器
import filters from '@sky/filters';
rainbow.config.globalProperties.$filters = filters;
// axios
import apiHttp from '@sky/axios/request2/http.js';
rainbow.config.globalProperties.$apihttp = apiHttp;

// study: indexDb缓存(本地数据库)
let storeName  = { index: ['ex_table_name'], name: 'ex_table_name', key: 'id' }; //index:索引、name:表名、key:主键
// 打开数据库
means.openDB('ex_dbname', 1, storeName, function(db){
  // 全局保存数据库
  rainbow.config.globalProperties.$database = db;
});

// --- 加载 ---
import i18n from '@sky/i18n';

/*
vue3 引入element-ui
element-plus官方文档：https://element-plus.gitee.io/zh-CN/guide/design.html
*/
import ElementUI from 'element-plus';
import 'element-plus/dist/index.css';

import VueCookies from 'vue-cookies';

// 图片预览组件的库 --- 加载失败，单独引用吧
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';



rainbow.use(store)
.use(router)
.use(ElementUI, { size: 'small', zIndex: 3000, locale: i18n.locale }) // 配置 Element Plus 的语言
.use(VueCookies)
.use(i18n)
// .use(Viewer)
.mount('#app')


export default rainbow;
