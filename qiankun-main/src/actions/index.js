import { initGlobalState } from 'qiankun'
import Vue from 'vue'

// 父应用的初始state
// Vue.observable是为了让initialState变成可响应：https://cn.vuejs.org/v2/api/#Vue-observable。
const userInfo = { name: '微服务李四' }
const initialState = Vue.observable({
  user: userInfo
})

// const initialState = {}
const actions = initGlobalState(initialState)
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log('%c 🦑 state, prev: ', 'font-size:20px;background-color: #FFDD4D;color:#fff;', state, prev)
  for (const key in state) {
    initialState[key] = state[key]
  }
})
// 定义一个获取state的方法下发到子应用
actions.getGlobalState = (key) => {
  // 有key，表示取globalState下的某个子级对象
  // 无key，表示取全部
  return key ? initialState[key] : initialState
}
// actions.offGlobalStateChange(); // 移除当前应用的状态监听，微应用 umount 时会默认调用
export default actions
