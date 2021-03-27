import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
// 引入redux相关文件
import store from '../../redux/store'
import {
  addUserToken,
  addUserInfo,
} from '../../redux/actions/login.js'

// axios进行后端请求
import axios from 'axios'
// 使用antd的样式
import { Form, Input, Button, Checkbox, message } from 'antd';

// 使用类类读取样式，防止不同组件的重名样式冲突
import styles from './index.module.css';

/**
 * 本组件用于后台登录
 *
 * 静态页面参考来源（不是最初的作者）：https://www.bilibili.com/video/BV1Yk4y1d7NE
 * 本页面完全基于antd重构
 */
class Login extends Component {
  /* 使用Cookie进行路由拦截，获取Cookie：document.cookie.includes('login=true') */
  // addLoginCookie = (authorization) => {
  //   let expires = 0.5 * 86400 * 1000  // Cookie有效期：0.5天（0.5天*一天86400分钟*1000ms）
  //   let date = new Date( + new Date() + expires)  // 当前时间加上要存储的时间
  //   /* path要设置成'/'，secure需要在https下才可以访问，HttpOnly=true */
  // import cookie from 'react-cookies'
  //   cookie.save('login', true, {path: '/', expires: date, HttpOnly:true})
  //   console.log(cookie.load('login'))
  //   // document.cookie = `login=true;expires=${date.toUTCString()};path='/';secure=true;HttpOnly=true`
  //   // document.cookie = `authorization=${authorization};expires=${date.toUTCString()};secure=true;HttpOnly=true`
  // }

  /* React-Redux进行绑定的操作 */
  addUserToken = (token)=>{
    store.dispatch(addUserToken(token))
  }
  addUserInfo = (info)=>{
    store.dispatch(addUserInfo(info))
  }

  onFinish = async (values) => {
    /* {username: "artlex", password: "123456", remember: true} */

    /* 保存密码 */
    if (values.remember===true) {
      // ！！！多用户下注意xss攻击！！！
      localStorage.setItem('username', values.username);
      localStorage.setItem('password', values.password);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      values.username = ""
      values.password = ""
    }
    
    axios.post('http://localhost:8081/login', values).then(
      res => {
        // console.log(res.data)
        // console.log(res.data.statusCode)

        if (res.data.statusCode === 200) {  // 服务器通信正常，返回登录成功
          // axios绑定Authorization，Cookie记录Authorization（Token）
          if (res.headers.authorization)  
            axios.defaults.headers.common['Authorization'] = res.headers['authorization']

          // 获取数据
          const userToken = res.headers['authorization']
          const userInfo = res.data.data

          // redux把数据共享出去
          this.addUserToken(userToken)
          this.addUserInfo(userInfo)

          // 弹窗提示
          message.success('登录成功！')
          // 跳转到管理页面
          this.props.history.replace('/admin');

        } else {  // 服务器通信正常，但是返回登录失败
          // 弹窗提示
          message.error('账号或密码错误，请重试！')
        }
      },
    err => {
      // 弹窗提示
      message.error('连接服务器失败，请稍候重试')
    }
    );
  };

  onFinishFailed = (errorInfo) => {
    // 弹窗提示
    message.error('账号或密码错误，请重试！')
    // console.log('Failed:', errorInfo);
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.bigBox}>
          <h1 className={styles.h1}>Galaxy-Blog</h1>
          <Form className={styles.inputBox}
            layout="horizontal"
            colon="false"
            name="basic"
            initialValues={{
              username: 
                localStorage.getItem('username')!==null
                ? localStorage.getItem('username')
                : "",
              password: 
                localStorage.getItem('password')!==null
                ? localStorage.getItem('password')
                : "",
              remember: true,
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '需要输入用户名!',
                },
                {
                  message: '用户名格式不正确!',
                  min: 1,
                  max: 20
                },
              ]}
            >
              <Input 
                className={styles.inputText} 
                placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '需要输入密码!',
                },
                {
                  message: '密码格式不正确!',
                  min: 6,
                  max: 64
                },
              ]}
            >
              <Input
                className={styles.inputText}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox className={styles.remember}>记住账号密码</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.loginButton}>
                <font className={styles.text}>登录</font>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default withRouter(Login)