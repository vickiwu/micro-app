
const path = require("path");

module.exports = {
  webpack: function override(config, env) {
    // 解决主应用接入后会挂掉的问题：https://github.com/umijs/qiankun/issues/340
    // config.entry = config.entry.filter(
    //   (e) => !e.includes('webpackHotDevClient')
    // );
    
    config.output.library = 'ReactMicroApp';
    config.output.libraryTarget = 'umd';
    config.output.jsonpFunction = `webpackJsonp_ReactMicroApp`;
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  devServer: (configFunction) => {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
       // 关闭主机检查，使微应用可以被 fetch
      config.disableHostCheck = true;
      // config.open = false;
      // config.hot = false;

      config.headers = {
        'Access-Control-Allow-Origin': '*'
      };
      // 配置 history 模式
      config.historyApiFallback = true;
      return config;
    };
  },
};
