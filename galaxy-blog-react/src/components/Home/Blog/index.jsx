import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import { Timeline, Pagination, message } from 'antd';
// axios进行后端请求
import axios from 'axios'

import SubTimeline from './SubTimeline'
import styles from './index.module.css'

export default class Blog extends Component {

  constructor(props) {
    super(props)
    // 初始化状态
    this.state = {blogs: [],
                  currentPage: 1,
                  total: 0,
                  pageSize: 5,}

    // 获取数据（暂时不存入redux）
    // this.getPage = this.getPage.bind(this)
    this.getPage(1)
  }

  componentDidMount() {
    // this.getPage(1)
  }

  getPage = async (currentPage) => {
    await axios
      .get('http://localhost:8081/blogs?currentPage=' + currentPage)
      .then(
        res => {
        // 获取数据
        this.setState({blogs: res.data.data.records,
                        currentPage: currentPage,
                        total: res.data.data.total,
                        pageSize: res.data.data.size});
      },
      err => {
        // 弹窗提示
        message.error('获取博客失败，请重试！');
      }
    );
  }

  paginationChange = (page, pageSize) => {
    this.getPage(page)
  }

  render() {
    const {blogs, htmlBlogs, currentPage, total, pageSize, blog_markdown} = this.state
    return (
      <div className={styles.container}>
        <Timeline>
          {/* 遍历本页博客 */}
          <SubTimeline blogs={blogs}/>
        </Timeline>

        <Pagination
          className={styles.pagination}
          onChange={this.paginationChange}
          // showSizeChanger
          showQuickJumper
          total={total}
          showTotal={total => `总共 ${total} 篇博文`}
        />
      </div>
    )
  }
}
