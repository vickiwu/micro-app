import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './router'
import startQiankun from './micro'
import 'ant-design-vue/dist/antd.css'
import './assets/styles/locale.antd.css'

Vue.use(VueRouter)
Vue.use(Antd)
Vue.config.productionTip = false
startQiankun()

// 注册路由实例，即将开始监听 location 变化，触发路由规则
const router = new VueRouter({
  mode: 'history',
  routes
})
// 创建 Vue 实例
// 该实例将挂载/渲染在 id 为 main-app 的节点上
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
