const path = require('path')
module.exports = {
  devServer: {
    port: 8999,
    open: true
  },
  //这里可以配置地址简写
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src')
      }
    }
  },
}