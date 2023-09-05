import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'



import means from '../../../means/index.js'

const rainbow = createApp(App)

rainbow.config.globalProperties.$means = means


rainbow.use(store).use(router).mount('#app')
