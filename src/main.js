import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

// 使用Element UI
Vue.use(ElementUI)

// 配置axios
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://8.148.231.23:8081' // 修改为指定的服务器地址

// 添加响应拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      error.response = { data: { message: '网络连接异常' } };
    }
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
