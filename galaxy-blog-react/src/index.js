import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import store from './redux/store'
// import {Provider} from 'react-redux'

import App from './App';
import reportWebVitals from './reportWebVitals';



// import {Provider} from 'react-redux'
// import store from './redux/store'

/**
 * webpack入口文件，也是运行的入口文件
 */

// React缓存.渲染(严格模式(检查组件中有没有过期代码), 获取容器)
ReactDOM.render(
  // <React.StrictMode>
    // 全局使用浏览器路由器进行跳转
    <BrowserRouter>
      {/* 此处需要用Provider包裹App，目的是让App所有的后代容器组件都能接收到store */}
      {/* <Provider store={store}> */}
        <App/>
      {/* </Provider> */}
    </BrowserRouter>
  // </React.StrictMode>
  ,document.getElementById('root')
)

// 监听状态的改变，实时渲染页面
store.subscribe(()=>{
  ReactDOM.render(
      <BrowserRouter>
          <App/>
      </BrowserRouter>
    ,document.getElementById('root')
  )
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// 如果你想去开始测量你应用的性能，可以使用如：reportWebVitals(console.log)接收日志结果或者发送给分析端点。更多：https://bit.ly/CRA-vitals
// reportWebVitals();
