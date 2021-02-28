// 引入React相关组件
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import store from './redux/store'
// 引入ant-design的样式文件
import 'antd/dist/antd.css';
import axios from 'axios'

// 引入组件
import Home from "./components/Home";
import Login from "./components/Login";
import Admin from "./components/Admin";
import BlogEdit from "./components/Admin/Blog/BlogEdit"

/**
 * 根组件
 */
export default class App extends Component {
  constructor(props) {
    super(props)

    // 防止在本组件或子组件刷新后axios的header清空，进行初始化
    if (sessionStorage.getItem('userToken')!==null)
    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('userToken')
  }
  render() {
    return (
      <div>
        {/* 路由找到即返回，不再继续查找 */}
        <Switch>
          {/* 注册路由 */}
          <Route path="/home" component={Home}/>
          {/* 声明接收params参数(声明接收)，在组件内部对编辑页面单独进行路由与权限拦截 */}
          <Route exact path="/admin/blog/edit/:blogId" component={BlogEdit}/>

          {/* 如果已经登录 */}
          <Route path="/login"
                  render={()=>
                    // 使用connect同步获取需要的参数会有延迟，这里直接从store里取
                    (store.getState().login.userInfo!==null && store.getState().login.userInfo.status >= 0) ? (
                      <Admin/>
                    ) : (
                      <Login/>
                    )
                  }/>

          {/* 权限控制，函数体不能用{}括起来（不明原因），使用Cookie进行路由拦截 */}
          <Route path="/admin"
                  render={()=> 
                    // 使用connect同步获取需要的参数会有延迟，这里直接从store里取
                    (store.getState().login.userInfo!==null && store.getState().login.userInfo.status >= 0) ? (
                      <Admin/>
                    ) : (
                      <Redirect to="/login" />
                    )
                  }/>

          {/* 所有路由均不匹配，去到博客主页 */}
          <Redirect to="/home" />
        </Switch>
      </div>
    )
  }
}