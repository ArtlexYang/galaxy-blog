const CracoLessPlugin = require('craco-less');

module.exports = {
  babel: {
    plugins: [
      ['import',  // 按需引入样式。插件名babel-plugin-import说明了在配置中的位置是babel、plugins、import
        {
          libraryName: 'antd',  // 针对antd库
          libraryDirectory: "es",  // 使用es模块化规范
          style: true  // 针对less生成的css文件进行按需引入（true比"css"用途更广一些）
        }]
    ]
  }
  // plugins: [
  //   {
  //     plugin: CracoLessPlugin,  // craco的修改.less文件的插件（修改主题颜色）
  //     options: {
  //       lessLoaderOptions: {  // .less文件操作加载器
  //         lessOptions: {  // 操作.less文件
  //           modifyVars: {'@primary-color': '#00f'},
  //           javascriptEnabled: true,  // 允许使用js修改.less文件
  //         }
  //       }
  //     }
  //   }]
};