import React, { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, Form, Modal, Input, message } from 'antd';
import axios from 'axios';
// 引入redux相关文件
import store from '../../../redux/store'
import {
  delUser,
} from '../../../redux/actions/login.js'

// 文本域，用来输入摘要
const { TextArea } = Input;
// 选择器的选项
// 修改用户信息的弹出表单
const EditUserForm = ({ editUserModalVisible, onCancel }) => {
  const [isPostEdit , setIsPostEdit] = useState(false);
  const [category, setCategory] = useState(null);
  const [form] = Form.useForm();

  const onOk = () => {
    form.submit();
    // onCancel()
  };

  const onFinish = async (value) => {
    await axios.post('http://localhost:8081/user/edit', value).then(
      res => {
        if(res.data.statusCode===200) {
          message.success('保存成功');
          let newUserInfo = {
            ...JSON.parse(sessionStorage.getItem('userInfo')),
            nickname: value.nickname,
            avatar: value.avatar,
            email: value.email,
            welcomingSpeech: value.welcomingSpeech,
          }
          sessionStorage.setItem('userInfo', JSON.stringify(newUserInfo));
          // 关闭对话框
          onCancel()
        } else {
          message.error(res.data.message)
        }
      },
      err => {
        message.error(err.response.data.message);
      }
    )
  };

  // 关闭后重置内容，保证不提交重新打开时数据还原
  const afterClose = () => {
    form.setFieldsValue({
      nickname: JSON.parse(sessionStorage.getItem('userInfo')).nickname,
      avatar: JSON.parse(sessionStorage.getItem('userInfo')).avatar,
      email: JSON.parse(sessionStorage.getItem('userInfo')).email,
      welcomingSpeech: JSON.parse(sessionStorage.getItem('userInfo')).welcomingSpeech
    })
  }

  return (
    <Modal
      title="修改分类"
      visible={editUserModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      afterClose={afterClose}
    >
      <Form 
        form={form} 
        layout="vertical" 
        name="descriptionForm"
        initialValues={{
          nickname: JSON.parse(sessionStorage.getItem('userInfo')).nickname,
          avatar: JSON.parse(sessionStorage.getItem('userInfo')).avatar,
          email: JSON.parse(sessionStorage.getItem('userInfo')).email,
          welcomingSpeech: JSON.parse(sessionStorage.getItem('userInfo')).welcomingSpeech
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="用户昵称"
          name="nickname"
          rules={[
            {
              message: '用户昵称过长',
              max: 20
            },
            {
              message: '存在非法字符!',
              pattern: new RegExp(/^[\w\u4e00-\u9fa5]+$/gi),  // 匹配中文 数字 字母 下划线
            },
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="用户昵称（允许为空）"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={20}  // 限制最大字数
          />
        </Form.Item>

        <Form.Item
          label="头像url"
          name="avatar"
          rules={[
            {
              message: '头像url过长',
              max: 100
            }
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="头像url（允许为空）"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={100}  // 限制最大字数
          />
        </Form.Item>

        <Form.Item
          label="用户邮箱"
          name="email"
          rules={[
            {
              type: 'email',
              message: '此输入不是合法的邮箱',
            },
          ]}
        >
          <Input placeholder="用户邮箱（允许为空）"/>
        </Form.Item>

        <Form.Item
          label="登录欢迎词"
          name="welcomingSpeech"
          rules={[
            {
              message: '欢迎词过长',
              max: 50
            }
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="欢迎词内容（允许为空）"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={50}  // 限制最大字数
          />
        </Form.Item>

      </Form>
    </Modal>
  );
};
// 修改用户密码的弹出表单
const EditUserPasswordForm = ({ editUserPasswordModalVisible, onCancel }) => {
  const [form] = Form.useForm();
  const history = useHistory();

  const onOk = () => {
    form.submit();
  };

  const onFinish = async (value) => {
    console.log(value)
    await axios.post('http://localhost:8081/user/edit/password', {oldPassword: value.oldPassword, newPassword: value.newPassword}).then(
      res => {
        if(res.data.statusCode===200) {
          message.success(res.data.message + "请重新登录");
          // 重新登录
          store.dispatch(delUser());
          history.replace('/login');
          // 关闭对话框
          onCancel()
        } else {
          message.error(res.data.message)
        }
      },
      err => {
        message.error(err.response.data.message);
      }
    )
  };

  // 关闭后重置内容，保证不提交重新打开时数据还原
  const afterClose = () => {
    form.setFieldsValue({
      oldPassword: "",
      newPassword: "",
      newPasswordAgain: ""
    })
  }

  return (
    <Modal
      title="修改分类"
      visible={editUserPasswordModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      afterClose={afterClose}
    >
      <Form 
        form={form} 
        layout="vertical" 
        name="descriptionForm"
        onFinish={onFinish}
      >
        <Form.Item
          label="请输入旧密码"
          name="oldPassword"
          rules={[
            {
              required: true,
              message: '旧密码过短',
            },
            {
              min: 6,
              message: '旧密码过短',
            },
            {
              max: 100,
              message: '旧密码过长',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="请输入新密码（6~100位）"
          name="newPassword"
          rules={[
            {
              required: true,
              message: '新密码不能为空',
            },
            {
              min: 6,
              message: '新密码过短',
            },
            {
              max: 100,
              message: '新密码过长',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="请确认新密码（6~100位）"
          name="newPasswordAgain"
          dependencies={['newPassword']}
          rules={[
            {
              required: true,
              message: '新密码不能为空',
            },
            {
              min: 6,
              message: '新密码过短',
            },
            {
              max: 100,
              message: '新密码过长',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的新密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

      </Form>
    </Modal>
  );
};
export default class User extends Component {
  state = {
    editUserModalVisible: false,
    editUserPasswordModalVisible: false,
  }

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
        message.error(err.response.data.message);
        // token失效了退出登录
        if (err.response.data.message==="token已失效，请重新登录") {
          store.dispatch(delUser())
        }
      }
    );
  }

    // 打开修改用户信息对话框
    showEditUserModal = () => { this.setState({editUserModalVisible: true})  }
    // 关闭修改用户信息对话框
    hideEditUserModal = () => { this.setState({editUserModalVisible: false}) }
    // 打开修改用户密码对话框
    showEditUserPasswordModal = () => { this.setState({editUserPasswordModalVisible: true})  }
    // 关闭修改用户密码对话框
    hideEditUserPasswordModal = () => { this.setState({editUserPasswordModalVisible: false}) }

  render() {
    return (
      <>
        <Button type="primary" onClick={this.showEditUserModal}>修改个人信息</Button> &nbsp;
        <Button type="primary" onClick={this.showEditUserPasswordModal}>修改密码</Button> &nbsp;
        <Button type="primary" onClick={this.logout}>退出登录</Button>
        <EditUserForm 
          editUserModalVisible={this.state.editUserModalVisible}  // 是否弹出对话框
          onCancel={this.hideEditUserModal}  // 对话框中点击取消的操作
        />
        <EditUserPasswordForm 
          editUserPasswordModalVisible={this.state.editUserPasswordModalVisible}  // 是否弹出对话框
          onCancel={this.hideEditUserPasswordModal}  // 对话框中点击取消的操作
          // openLogin={this.props.history}
        />
      </>
    )
  }
}