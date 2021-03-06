import React, { Component } from 'react'

import { Button, message } from 'antd'
import axios from 'axios'
// 引入redux相关文件
import store from '../../../redux/store'
import {
  delUser,
} from '../../../redux/actions/login.js'
export default class User extends Component {
  logout = async () => {
    await axios.get('http://localhost:8081/logout').then(
      res => {
        store.dispatch(delUser())
      // 跳转到登录页面
      this.props.history.replace('/login');
      message.success('安全退出成功！')
      },
      err => {
        // 弹窗提示
        message.error('服务器连接失败，请稍后重试！')
      }
    );
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.logout}>退出登录</Button>
      </div>
    )
  }
}
