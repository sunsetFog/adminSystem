import { createStore } from 'vuex'

import tabs from './modular/tabs.js'
import login from './modular/login.js'
import theme from './modular/theme'


export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    tabs,
    login,
    theme
  }
})
