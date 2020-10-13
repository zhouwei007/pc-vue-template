'use strict'
const path = require('path')
const { execSync } = require('child_process')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')

const resolve = dir => path.join(__dirname, dir)
const version = execSync('git rev-list HEAD --count').toString().replace('\n', '')
// const proxyIps = ['/proxy', '/oauthcenter', '/gateway/saas-harbour'];
const proxyIps = ['/oauthcenter'];
module.exports = {
  publicPath: '/harbour/static',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  runtimeCompiler: true,
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        'common': resolve('src/common'),
        'fonts': resolve('src/assets/fonts'),
        'images': resolve('src/assets/images'),
        'styles': resolve('src/assets/styles')
      }
    },
    plugins: [
      new GenerateJsonPlugin('version.json', { version })
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~styles/theme.scss";`
      }
    }
  },
  devServer: {
    port: 8080,
    open: true,
    proxy: [
      '/gateway/saas-harbour',
      '/oauthcenter',
      '/ufile',
      '/proxy'
    ].reduce((result, item) => {
      // if (item === '/oauthcenter' || item === '/proxy') {
      result[item] = {
        target: 'http://webapi.soydai.cn:3499/apitest',
        changeOrigin: true,
        ws: true,
        secure: true
      }
      // } else {
        // result[item] = {
        //   // target: 'http://172.16.37.156:8080',
        //   target: 'http://192.168.101.10:8080',
        //   pathRewrite: {'^/gateway' : ''},
        //   changeOrigin: true,
        //   ws: true,
        //   secure: true
        // }
      // }
      return result
    }, {})
  }
}
