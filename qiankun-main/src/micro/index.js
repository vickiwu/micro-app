import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { message } from 'ant-design-vue'

import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start
} from 'qiankun'
import apps from './app'

registerMicroApps(apps, {
  beforeLoad: (app) => {
    NProgress.start()
    console.log('开始加载前', app.name)
    return Promise.resolve()
  },
  beforeMount: [
    app => {
      console.log('[LifeCycle] 开始挂载前 %c%s', 'color: green;', app.name)
    }
  ],
  afterMount: (app) => {
    NProgress.done()
    console.log('挂载之后', app.name)
    return Promise.resolve()
  },
  afterUnmount: [
    app => {
      console.log('[LifeCycle] 卸载后 %c%s', 'color: green;', app.name)
    }
  ]
})

addGlobalUncaughtErrorHandler((event) => {
  console.error(event)
  const { message: msg } = event
  if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
    message.error('子应用加载失败，请检查应用是否可运行')
  }
})

export default start
