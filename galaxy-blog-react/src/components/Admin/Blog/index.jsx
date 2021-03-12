import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { List, Button, Skeleton, message, Popconfirm } from 'antd';
import axios from 'axios';
// 引入redux相关文件
import store from '../../../redux/store'
import {
  delUser,
} from '../../../redux/actions/login.js'

/**
 * 本组件用于管理博客（增删改查等）
 * 
 * 按钮逻辑参考 csdn 的博客管理页面
 */
export default class Blog extends Component {
  state = {
    initLoading: true,
    loading: false,
    list: [],
    currentPage: 1,
    total: -1,
    pageSize: -1
  };

  componentDidMount() {
    this.getPage(1)
  }

  getPage = async (currentPage) => {
    this.setState({loading: true})
    await axios
      .get('http://localhost:8081/blogs?currentPage=' + currentPage + '&isAdmin=true')
      .then(
        res => {
          // 获取数据
          this.setState({
            initLoading: false,
            loading: false,
            list: res.data.data.records,
            currentPage: currentPage,
            total: res.data.data.total,
            pageSize: res.data.data.size
          });
        },
        err => {
          // 弹窗提示
          message.error(err.response.data.message);
          // token失效了退出登录
          if (err.response.data.message==="token已失效，请重新登录") {
            store.dispatch(delUser())
          }
        });
  }

  // 新建博客
  newBlog = () => {
    // <0表示是新建模式，>=0都是编辑正常博客
    window.open('about:blank').location.href=`/admin/blog/edit/-1`
  }
  // 编辑博客
  blogEdit = (blogId) => {
    window.open('about:blank').location.href=`/admin/blog/edit/${blogId}`
  }
  // 浏览博客
  gotoBolgDetail = (blogId) => {
    window.open('about:blank').location.href=`/home/blog/${blogId}`
  }
  // 删除博客（只需要id）
  deleteBlog = async (blog) => {
    await axios.post('http://localhost:8081/blog/delete', blog).then(
      res => {
        message.success("删除成功！");
      },
      err => {
        message.error("无权限删除！");
      }
    ).catch(
      err => {
        message.error(err.response.data.message);
    })
    // 刷新一下（重新获取一下数据就好）
    this.getPage(this.state.currentPage)
  }

  // 获取指定页码的博客列表
  paginationChange = (page, pageSize) => {
    // 更新当前页面
    this.setState({currentPage: page})
    this.getPage(page)
  }

  render() {
    const { initLoading, loading, list, total, pageSize } = this.state;

    return (
        <List
          style={{ margin: '-25px 0px' }}
          loading={initLoading}  // loading时的占位符
          size="large"  // 高度增加
          itemLayout="horizontal"  // 竖直展示
          header={  // 头部显示
            <Button 
              style={{
                position: 'fixed',
                marginTop: '-75px',
                marginLeft: '-25px',
                height: '63px',
                zIndex: 10,
              }} 
              type="primary"
              onClick={this.newBlog}
              >
                新建博客
            </Button>
          }
          dataSource={list}  // 列表数据源
          renderItem={item => (  // 渲染dataSource的方法
            <div>
              <List.Item
                actions={[
                  <Link onClick={() => this.blogEdit(item.id)}>编辑或修改文章状态</Link>,
                  // 向路由组件传递params参数(携带参数)
                  <Link onClick={() => this.gotoBolgDetail(item.id)}>浏览</Link>, 
                  <Popconfirm
                    title="你确定要删除本博文吗"
                    onConfirm={() => this.deleteBlog(item)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Link>删除</Link>
                  </Popconfirm>,
                  <div>创建时间：{item.createTime.replace("T", " ")}</div>,
                  <div>更新时间：{item.updateTime.replace("T", " ")}</div>]}
              >
                <Skeleton loading={item.loading} active>
                  <List.Item.Meta
                    title={<Link onClick={() => this.gotoBolgDetail(item.id)}>{item.title}</Link>}
                    description={
                      <font>
                        {(item.status===1 ? "公开发布" : "未发布草稿")}
                      </font>}
                  />
                </Skeleton>
              </List.Item>
              <hr color="#e4e4e4"/>
            </div>
          )}
          pagination={{  // 底部分页
            onChange: this.paginationChange,
            pageSize: pageSize,
            total: total,
            style: { marginTop: '50px', textAlign: 'center'}
            }}
        />
    );
  }
}
