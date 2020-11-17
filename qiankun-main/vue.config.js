const path = require('path')

module.exports = {
  devServer: {
    // port: 8081,
    port: process.env.PORT // 在.env中VUE_APP_PORT=7788，与父应用的配置一致
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
}
