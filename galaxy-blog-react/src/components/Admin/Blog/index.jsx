import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { List, Button, Skeleton, message } from 'antd';
import axios from 'axios';

import styles from './index.module.css'
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
    currentPage: -1,
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
        message.error('获取博客列表失败，请重试！');
      }
    );
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
        message.error("服务器错误，删除失败，请稍候重试！");
    })
    // 刷新一下
    window.loaction.href="/admin/blog"
  }

  // 获取指定页码的博客列表
  paginationChange = (page, pageSize) => {
    this.getPage(page)
  }

  render() {
    const { initLoading, loading, list } = this.state;

    return (
        <List
          className={styles.container}
          loading={initLoading}  // loading时的占位符
          // bordered="true"  // 显示边框
          size="large"  // 高度增加
          itemLayout="horizontal"  // 竖直展示
          header={  // 头部显示
            <Button className={styles.newBlog_button} type="primary" onClick={this.newBlog}>新建博客</Button>
          }
          dataSource={list}  // 列表数据源
          renderItem={item => (  // 渲染dataSource的方法
            <div>
              {/* <hr color="#e4e4e4"/> */}
              <List.Item
              // <div>创建时间：{this.item.createTime.replace("T", " ")}<br/>更新时间：{item.updateTime.replace("T", " ")}</div>
                actions={[
                  <Link onClick={() => this.blogEdit(item.id)}>编辑或修改文章状态</Link>,
                  // 向路由组件传递params参数(携带参数)
                  <Link onClick={() => this.gotoBolgDetail(item.id)}>浏览</Link>, 
                  <Link onClick={() => this.deleteBlog(item)}>删除</Link>,
                  <div>创建时间：{item.createTime.replace("T", " ")}</div>,
                  <div>更新时间：{item.updateTime.replace("T", " ")}</div>]}
              >
                <Skeleton loading={item.loading} active>
                  <List.Item.Meta
                    title={<a href="https://ant.design">{item.title}</a>}
                    description={item.createTime.replace("T", " ")}
                  />
                </Skeleton>
              </List.Item>
              <hr color="#e4e4e4"/>
            </div>
          )}
          pagination={{onChange: this.paginationChange}}  // 底部分页
        />
    );
  }
}
