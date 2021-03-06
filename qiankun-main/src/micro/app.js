import actions from '../actions'

/**
* name: 微应用名称 - 具有唯一性
* entry: 微应用入口 - 通过该地址加载微应用
* container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
* activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
*/
const apps = [
  {
    name: 'VueMicroApp',
    entry: '//localhost:8081',
    activeRule: '/vue'
  },
  // {
  //   name: 'ReactMicroApp',
  //   entry: '//localhost:8082',
  //   activeRule: '/react'
  // },
  {
    name: 'vueAdminXl',
    entry: '//localhost:9528',
    activeRule: '/xl'
  }

]
const microApps = apps.map(item => {
  return {
    ...item,
    container: '#frame', // 子应用挂载的div
    props: {
      routerBase: item.activeRule, // 下发基础路由
      getGlobalState: actions.getGlobalState // 下发getGlobalState方法
    }
  }
})
export default microApps
