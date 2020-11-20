import Vue from 'vue'
// import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import permission from '@/directive/permission/index.js' // 权限判断指令
Vue.use(permission)

import '@/icons'
import '@/permission'

/**
 *MockJs用于模拟api
 *MockJs将用于生产环境，
 *请先删除它，然后再上线！ ！ ！
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
