import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入全局样式
import './assets/css/global.css'
// 引入字体的文件
import './assets/font/iconfont.css'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api'
Vue.config.productionTip = false
Vue.prototype.$echarts = window.echarts
Vue.prototype.$http = axios
// 引入socket
import SocketServer from "./utils/SocketServer"
SocketServer.Instance.connect()
console.log(SocketServer.Instance)
Vue.prototype.$socket = SocketServer.Instance

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
