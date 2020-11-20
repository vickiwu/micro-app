import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { initMenu } from '@/utils/routesInit'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress配置

const whiteList = ['/login'] // 没有重定向白名单

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
          next(`/login?redirect=${to.path}`)
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
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
