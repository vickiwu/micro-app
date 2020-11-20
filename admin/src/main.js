import Vue from 'vue'
import Router from 'vue-router'

// import Cookies from 'js-cookie'
import './public-path'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
// import router from './router'
import routes from './router'
import permission from '@/directive/permission/index.js' // 权限判断指令
Vue.use(permission)

import '@/icons'
// import '@/permission'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { initMenu } from '@/utils/routesInit'
import getPageTitle from '@/utils/get-page-title'

/**
 *MockJs用于模拟api
 *MockJs将用于生产环境，
 *请先删除它，然后再上线！ ！ ！
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Vue.use(Router)

Vue.use(ElementUI)

Vue.config.productionTip = false

let instance = null
let router = null
let createRouter = null
/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render(props = {}) {
  const { container, routerBase } = props
  console.log('%c 🍚 container, routerBase: ', 'font-size:20px;background-color: #3F7CFF;color:#fff;', container, routerBase, props)
  // 在render中创建VueRouter，可以保证在卸载微应用时，移除location事件监听，防止事件污染

  createRouter = () => new Router({
    mode: 'history', // require service support
    base: window.__POWERED_BY_QIANKUN__ ? '/xl' : '/',
    scrollBehavior: () => ({ y: 0 }),
    routes
  })

  router = createRouter()

  // permission
  NProgress.configure({ showSpinner: false }) // NProgress配置

  const whiteList = ['/login', '/404'] // 没有重定向白名单

  router.beforeEach(async(to, from, next) => {
    NProgress.start()

    document.title = getPageTitle(to.meta.title)

    const hasToken = getToken()

    if (hasToken) {
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
      // 是否有路由
        const permissionRoutes = store.getters.permission_routes
        if (permissionRoutes.length > 0) {
          const { permission } = to.meta
          // 获取页面中权限控制
          store.dispatch('user/setCurrentPermission', permission)

          next()
        } else {
          try {
            await store.dispatch('user/getInfo')
            await initMenu(router, store, to.path) // 接口中放用户信息，路由，权限

            next({ ...to, replace: true })
          } catch (error) {
            console.log(error, 'error')
            // 删除token并进入登录页面重新登录
            await store.dispatch('user/resetToken')
            Message.error(error || '出现错误')
            next(`/login`)
            NProgress.done()
          }
        }
      }
    } else {
    /* 没有token*/

      if (whiteList.indexOf(to.path) !== -1) {
      //  在免登录白名单中，直接进入
        next()
      } else {
      // 其他无权访问的页面将被重定向到登录页面。
        next(`/login`)
        NProgress.done()
      }
    }
  })

  router.afterEach(() => {
    NProgress.done()
  })

  // 挂载应用
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由
}
export { router }

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  // 独立运行时，也注册一个名为global的store module
  // globalRegister(store)
  // 模拟登录后，存储用户信息到global module
  // const userInfo = { name: '我是独立运行时名字叫张三' } // 假设登录后取到的用户信息
  // store.commit('global/setGlobalState', { user: userInfo })
  render()
}

/* bootstrap只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。 */
export async function bootstrap() {
  console.log('VueMicroApp bootstraped')
}

/*
 应用每次进入都会调用mount方法
*/
export async function mount(props) {
  console.log('[VueMicroApp] mount,props from main framework', props)
  // globalRegister(store, props)
  render(props)
}

/* 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例 */
export async function unmount() {
  console.log('VueMicroApp unmount')
  instance.$destroy()
  instance = null
  router = null
}
