import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, { MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

// 使用Element UI
Vue.use(ElementUI)

// 配置axios
// 添加axios全局配置
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 200) {
      // 统一处理未授权逻辑（业务code层面）
      if (res.code === 401) {
        MessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          router.push('/login');
          localStorage.removeItem('authToken');
        });
      }
      
      // 优先使用后端返回的错误信息
      const errorMsg = res.msg || `请求错误（CODE: ${res.code}）`;
      Vue.prototype.$message.error(errorMsg);
      return Promise.reject();
    }
    return res;
  },
  error => {
    if (error.response) {
      // HTTP 错误状态处理（状态码非2xx）
      const { status, data } = error.response;

      // 优先使用响应数据中的 msg 字段
      const serverMsg = data?.msg;
      
      // 状态码默认提示映射
      const statusMap = {
        400: '请求参数错误',
        403: '拒绝访问',
        404: () => `请求地址不存在: ${error.config.url}`,
        500: '服务器内部错误'
      };

      // 组合最终提示信息
      const getStatusMessage = () => {
        const mapping = statusMap[status];
        return typeof mapping === 'function' ? mapping() : mapping;
      };

      const finalMsg = serverMsg 
        || getStatusMessage()
        || error.message
        || `请求失败（STATUS: ${status}）`;

      Vue.prototype.$message.error(finalMsg);

      // 特殊处理HTTP 401状态（网络层面未授权）
      if (status === 401) {
        MessageBox.confirm('登录已过期，请重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          router.push('/login');
          localStorage.removeItem('authToken');
        });
      }

    } else if (error.request) {
      Vue.prototype.$message.error('网络连接异常，请检查网络');
    } else {
      Vue.prototype.$message.error('请求配置错误: ' + error.message);
    }
    return Promise.reject(error);
  }
);

// 挂载到Vue原型
Vue.prototype.$http = instance

// 设置基础URL
instance.defaults.baseURL = 'http://8.148.231.23:8081'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
