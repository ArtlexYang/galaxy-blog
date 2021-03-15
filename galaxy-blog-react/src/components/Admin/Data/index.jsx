import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

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
          this.setState({ loading: false, statistics: JSON.parse(res.data.data) });
        },
        err => {
          // 弹窗提示
          message.error(err.response.data.message);
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
          // 弹窗提示
          message.error(err.response.data.message);
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
          // 弹窗提示
          message.error(err.response.data.message);
        });
  }

  render() {
    const { total, statistics } = this.state;
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
          { ( statistics===null || statistics===undefined)
            ? '统计列表加载中...'
            : (<>
                <Space style={{ marginTop: '5%', marginLeft: '-5%' }} align='center' direction='vertical'>
                  <div
                    style={{
                      fontSize: '1.5em',
                      fontWeight: 'bold',
                    }}
                  >
                    当前用户的资料统计
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
                      value={this.state.statistics.categoryList.length}
                      prefix={<BarsOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="总标签数"
                      value={this.state.statistics.tagList.length}
                      prefix={<DeploymentUnitOutlined />}
                    />
                  </Space>
                  <Space style={{ margin: '32px' }} align='center' direction='horizontal' size='large'>
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="全部公开博客的点击数"
                      value={statistics.blogStatisticsPublic[0].clickCount}
                      prefix={<EyeOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="全部公开博客的点赞数"
                      value={statistics.blogStatisticsPublic[0].likeCount}
                      prefix={<LikeOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="全部公开博客的收藏数"
                      value={statistics.blogStatisticsPublic[0].collectCount}
                      prefix={<StarOutlined />}
                    />
                    <Statistic
                      style={{ display: 'inline-block', minWidth:'150px', maxWidth:'200px' }}
                      title="全部公开博客的评论数"
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
