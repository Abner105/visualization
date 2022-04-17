import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state:{
    theme:'chalk'
  },
  mutations:{
    changeTheme(state){
      if(state.theme =='vintage'){
        state.theme='chalk'
      }else{
        state.theme='vintage'
      }
      // 将主题存到缓存里面，避免刷新就变回原来的主题
      sessionStorage.setItem('theme',state.theme)
    }
  }
})