import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// 引入全局样式
import './assets/css/global.css'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api'
Vue.config.productionTip = false
Vue.prototype.$echarts = window.echarts
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
