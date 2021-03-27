import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

// 引入redux相关文件
import store from '../../../redux/store'
import {
  delUser,
} from '../../../redux/actions/login.js'

import {
  Pagination,
  message,
  List,
  Button,
  Skeleton,
  Space,
  Statistic,
  Tag
} from 'antd';
import {
  EyeOutlined,
  FileTextOutlined,
  BarsOutlined,
  DeploymentUnitOutlined,
  LikeOutlined,
  StarOutlined,
  MessageOutlined
} from '@ant-design/icons';
// axios进行后端请求
import axios from 'axios'

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
export default class Data extends Component {
  constructor(props) {
    super(props)
    // 初始化状态
    this.state = {
      initLoading: true,
      loading: false,
      statistics: null,
      statisticsAll: null,
      clickCount: 0,
      likeCount: 0,
      collectCount: 0,
      commentCount: 0,
      blogList: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
    }

    // 获取数据
    this.getPage(1)
    this.getMyselfStatistics()
    if (JSON.parse(sessionStorage.getItem('userInfo')).status===127) {
      this.getAllStatistics()
    }
  }

  getAllStatistics = async () => {
    this.setState({
      loading: true,
    });
    await axios
      .get('http://localhost:8081/statistics?isAdmin=true&isGlobal=true')
      .then(
        res => {
          // 获取数据
          this.setState({ loading: false, statisticsAll: JSON.parse(res.data.data) });
        },
        err => {
          // 网络错误
          if (err.response===undefined) {
            message.error('连接服务器失败，请稍候重试');
          } else {
            // 弹窗提示
            message.error(err.response.data.message);
          }
        });
  }

  getMyselfStatistics = async () => {
    this.setState({
      loading: true,
    });
    await axios
      .get('http://localhost:8081/statistics?isAdmin=true')
      .then(
        res => {
          // 获取数据
          this.setState({ loading: false, statistics: JSON.parse(res.data.data) });
        },
        err => {
          // 网络错误
          if (err.response===undefined) {
            message.error('连接服务器失败，请稍候重试');
          } else {
            // 弹窗提示
            message.error(err.response.data.message);
          }
        });
  }

  getPage = async currentPage => {
    this.setState({
      loading: true,
    });
    await axios
      .get('http://localhost:8081/blogList?currentPage=' + currentPage)
      .then(
        res => {
          // 获取数据
          this.setState({
            initLoading: false,
            loading: false,
            blogList: res.data.data.records,
            currentPage: currentPage,
            total: res.data.data.total,
            pageSize: res.data.data.size
          });
        },
        err => {
          // 网络错误
          if (err.response===undefined) {
            message.error('连接服务器失败，请稍候重试');
          } else {
            // 弹窗提示
            message.error(err.response.data.message);
            // token失效了退出登录
            if (err.response.data.message==="token已失效，请重新登录") {
              store.dispatch(delUser())
            }
          }
        });
  }

  render() {
    const { total, statistics, statisticsAll } = this.state;
    return (
      <div>
        <div
          style={{
            position: 'fixed',
            top: '10px',
            marginLeft: '20px',
            textAlign: 'center',
            fontSize: '2em',
            fontWeight: 'bold',
            zIndex: '11'
          }}
        >
          {JSON.parse(sessionStorage.getItem('userInfo')).welcomingSpeech}
        </div>
        <div
          style={{
            margin:'32px',
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '20px',
            minHeight: '500px',
            minWidth: '350px',
            textAlign: 'center'
          }}
        >
          { ( statisticsAll===null || statisticsAll===undefined)
            ? '统计列表加载中...'
            : (<>
                <Space style={{ marginTop: '2%', marginLeft: '-5%' }} align='center' direction='vertical'>
                  <div
                    style={{
                      fontSize: '1.5em',
                      fontWeight: 'bold',
                    }}
                  >
                    所有用户的数据统计（管理员）
                  </div>
                  <Space style={{ margin: '32px' }} align='center' direction='horizontal'>
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="总博客数"
                      value={total}
                      prefix={<FileTextOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="总分类数"
                      value={this.state.statisticsAll.categoryList.length}
                      prefix={<BarsOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="总标签数"
                      value={this.state.statisticsAll.tagList.length}
                      prefix={<DeploymentUnitOutlined />}
                    />
                  </Space>
                  <Space style={{ margin: '32px' }} align='center' direction='horizontal' size='large'>
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="公开博客点击数"
                      value={statisticsAll.blogStatisticsPublic[0].clickCount}
                      prefix={<EyeOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="公开博客点赞数"
                      value={statisticsAll.blogStatisticsPublic[0].likeCount}
                      prefix={<LikeOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="公开博客收藏数"
                      value={statisticsAll.blogStatisticsPublic[0].collectCount}
                      prefix={<StarOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="公开博客评论数"
                      value={statisticsAll.blogStatisticsPublic[0].commentCount}
                      prefix={<MessageOutlined />}
                    />
                  </Space>
                </Space>
                <br/>
              </>
            )}
          { ( statistics===null || statistics===undefined)
            ? '统计列表加载中...'
            : (<>
                <Space style={{ marginTop: '1%', marginLeft: '-5%' }} align='center' direction='vertical'>
                  <div
                    style={{
                      fontSize: '1.5em',
                      fontWeight: 'bold',
                    }}
                  >
                    当前用户的数据统计
                  </div>
                  <Space style={{ margin: '32px' }} align='center' direction='horizontal'>
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="当前用户总博客数"
                      value={total}
                      prefix={<FileTextOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="当前用户总分类数"
                      value={this.state.statistics.categoryList.length}
                      prefix={<BarsOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="当前用户总标签数"
                      value={this.state.statistics.tagList.length}
                      prefix={<DeploymentUnitOutlined />}
                    />
                  </Space>
                  <Space style={{ margin: '32px' }} align='center' direction='horizontal' size='large'>
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="当前用户公开博客点击数"
                      value={statistics.blogStatisticsPublic[0].clickCount}
                      prefix={<EyeOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="当前用户公开博客点赞数"
                      value={statistics.blogStatisticsPublic[0].likeCount}
                      prefix={<LikeOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="当前用户公开博客收藏数"
                      value={statistics.blogStatisticsPublic[0].collectCount}
                      prefix={<StarOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="当前用户公开博客评论数"
                      value={statistics.blogStatisticsPublic[0].commentCount}
                      prefix={<MessageOutlined />}
                    />
                  </Space>
                </Space>
              </>
            )}
        </div>
      </div>
    )
  }
}
