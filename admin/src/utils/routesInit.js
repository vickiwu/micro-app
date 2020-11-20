const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法
import { getRoutesApi } from '@/api/user'
import { getToken } from '@/utils/auth'
import Layout from '@/layout'

export const initMenu = (router, store, path) => {
  // 首先判断 store 中数据是否存在，如果存在，则说明这次跳转是正常的跳转
  // 而不是用户按F5键或者直接在地址栏输入某个地址进入的，这时直接返回，不必执行菜单初始化
  if (store.getters.permission_routes.length > 0) {
    return
  }
  // 若 store 中不存在菜单数据，则需要初始化数据
  return new Promise((resolve, reject) => {
    getRoutesApi(getToken()).then(response => {
      const { data } = response

      if (!data) {
        reject('路由信息无，请联系后台')
      }

      const { routes, menuList, menuType, permission } = data

      var getRouter = filterAsyncRouter(routes)
      // 将数据存到 store 中
      store.dispatch('user/setRoutes', getRouter)
      store.dispatch('user/setMenuType', menuType)
      store.dispatch('user/setPermission', permission)
      if (menuType === 'top') {
        store.dispatch('user/setTopMenu', menuList)
      } else if (menuType === 'left') {
        store.dispatch('user/setLeftMenu', menuList)
      }
      store.dispatch('user/changePath', path)

      resolve(getRouter)
    }).catch(error => {
      console.log(error, '错误')
      reject(error)
    })
  })
}

export function filterAsyncRouter(asyncRouterMap) {
  if (!asyncRouterMap) return []

  function _iter(before) {
    const after = Object.assign({}, before)
    if (after.component) {
      if (after.component === 'Layout') {
        after.component = Layout
      } else {
        after.component = _import(after.component)
      }
    }
    if (after.children && after.children.length) {
      after.children = filterAsyncRouter(after.children)
    }
    return after
  }

  return asyncRouterMap.map(_iter)
}
