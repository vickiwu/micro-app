import Vue from 'vue'
import VueRouter from 'vue-router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './public-path'
import App from './App.vue'
import routes from './router'
import store from './store'
import globalRegister from './store/global-register'

Vue.use(VueRouter)
Vue.use(Antd)
Vue.config.productionTip = false

let instance = null
let router = null

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render (props = {}) {
  const { container, routerBase } = props
  console.log('%c 🍚 container, routerBase: ', 'font-size:20px;background-color: #3F7CFF;color:#fff;', container, routerBase, props)
  // 在render中创建VueRouter，可以保证在卸载微应用时，移除location事件监听，防止事件污染
  router = new VueRouter({
    //
    base: window.__POWERED_BY_QIANKUN__ ? '/vue' : '/',
    mode: 'history',
    routes
  })
  // 挂载应用
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  // 独立运行时，也注册一个名为global的store module
  globalRegister(store)
  // 模拟登录后，存储用户信息到global module
  const userInfo = { name: '我是独立运行时名字叫张三' } // 假设登录后取到的用户信息
  store.commit('global/setGlobalState', { user: userInfo })
  render()
}

/* bootstrap只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。 */
export async function bootstrap () {
  console.log('VueMicroApp bootstraped')
}

/*
 应用每次进入都会调用mount方法
*/
export async function mount (props) {
  console.log('[VueMicroApp] mount,props from main framework', props)
  globalRegister(store, props)
  render(props)
}

/* 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例 */
export async function unmount () {
  console.log('VueMicroApp unmount')
  instance.$destroy()
  instance = null
  router = null
}
