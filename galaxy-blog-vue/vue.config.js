module.exports = {
  publicPath: '/',
  devServer: {
    // 项目运行时候的端口号
    port: 8082,
    // 后端服务器的端口号
    proxy: 'http://localhost:8081'
  }
}
