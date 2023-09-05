const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,// 关闭这些未使用变量/方法的警告
  configureWebpack: {
    resolve: {
      // 路径别名
      alias: {
        '@sky': path.join(__dirname, '../../')
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        // less安装需要
        lessOptions: {
          javascriptEnabled: true
        },
        // 加载全局less
        additionalData: `@import "~@sky/styles/common.less";`
      }
    }
  }
})
