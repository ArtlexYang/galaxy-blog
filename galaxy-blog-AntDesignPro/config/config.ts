// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: {
    // *是需要转发的请求(所有带有*前缀的请求都会转发给8081)
    '*': {
      target: 'http://localhost:8081',  // 配置转发目标地址(能返回数据的服务器地址)
      /**
       * 控制服务器收到的请求头中Host的值
       *
       * changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
       * changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
       * changeOrigin默认值为false，但我们一般将changeOrigin值设为true
       */
      changeOrigin: true,
      // 去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
      // pathRewrite: { '^/server': '' },
    },
  },
  manifest: {
    basePath: '/',
  },
  openAPI: {
    requestLibPath: "import { request } from 'umi'",
    // 或者使用在线的版本
    // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
    schemaPath: join(__dirname, 'oneapi.json'),
    mock: false,
  },
});
