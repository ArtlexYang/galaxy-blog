/**
 * 本文件配置跨域代理
 */

const proxy = require('http-proxy-middleware')

module.exports = function(app){
  app.use(
    // *是需要转发的请求(所有带有*前缀的请求都会转发给8081)
    proxy('*',{
      // 配置转发目标地址(能返回数据的服务器地址)
      target:'http://localhost:8081',
      /**
       * 控制服务器收到的请求头中Host的值
       *
       * changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
       * changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
       * changeOrigin默认值为false，但我们一般将changeOrigin值设为true
       */
      changeOrigin:true,
      // 去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
      // pathRewrite:{'^/api1':''}
    }),
  )
}