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
export default class Blog extends Component {
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
    this.getStatistics()
  }

  // 左侧数据展示栏相关
  getStatistics = async () => {
    this.setState({
      loading: true,
    });
    await axios
      .get('http://localhost:8081/statistics')
      .then(
        res => {
          // console.log(res.data.data)
          // 获取数据
          this.setState({ loading: false, statistics: JSON.parse(res.data.data) });
        },
        err => {
          // 后端服务错误
          if (err.response===undefined) {
            message.error('连接服务器失败，请稍候重试');
          } else {
            // 弹窗提示
            message.error(err.response.data.message);
          }
        });
  }

  // 右侧博客列表相关
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
          // 后端服务错误
          if (err.response===undefined) {
            message.error('连接服务器失败，请稍候重试');
          } else {
            // 弹窗提示
            message.error(err.response.data.message);
          }
        });
  }
  paginationChange = (page, pageSize) => { this.getPage(page) }
  gotoBolgDetail = (blogId) => { window.open('about:blank').location.href=`/home/blog/${blogId}` }

  randomColor = () => {
    let r = Math.floor(Math.random()*255/2);
    let g = Math.floor(Math.random()*255/2);
    let b = Math.floor(Math.random()*255/2);
    return 'rgba('+ r +','+ g +','+ b +',0.8)'
  }

  render() {
    const { initLoading, loading, total, statistics, blogList, currentPage, pageSize } = this.state;
    return (
      <>
        {/* 防止刷新错位 */}
        {sessionStorage.setItem('homeMenuKey', '1')}
        <div
          style={{
            display: 'inline-block',
            width: '20%',
            minWidth: '300px',
            position: 'fixed',
            top: '52px'
          }}
        >
          <div
            style={{
              margin:'32px 0px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '20px',
              minWidth:'350px',
              textAlign: 'center'
            }}
          >
            {( statistics===null || statistics===undefined)
              ? '统计列表加载中...'
              : (<>
                  <Space style={{ maxWidth:'320px' }} align='center' direction='vertical'>
                    <Statistic
                      style={{ display: 'inline-block', width:'auto' }}
                      title="总点击数"
                      value={statistics.blogStatisticsPublic[0].clickCount}
                      prefix={<EyeOutlined />}
                    />
                    <Space>
                      <Statistic
                        style={{ display: 'inline-block', minWidth:'100px', maxWidth:'160px' }}
                        title="总博客数"
                        value={total}
                        prefix={<FileTextOutlined />}
                      />
                      {/* <Statistic
                        style={{ display: 'inline-block', minWidth:'100px', maxWidth:'160px' }}
                        title="总点赞数"
                        value={statistics.blogStatisticsPublic[0].likeCount}
                        prefix={<LikeOutlined />}
                      /> */}
                    </Space>
                    <Space>
                      <Statistic
                        style={{ display: 'inline-block', minWidth:'100px', maxWidth:'160px' }}
                        title="总点赞数"
                        value={statistics.blogStatisticsPublic[0].likeCount}
                        prefix={<LikeOutlined />}
                      />
                      <Statistic
                        style={{ display: 'inline-block', minWidth:'100px', maxWidth:'160px' }}
                        title="总收藏数"
                        value={statistics.blogStatisticsPublic[0].collectCount}
                        prefix={<StarOutlined />}
                      />
                      {/* <Statistic
                        style={{ display: 'inline-block', minWidth:'100px', maxWidth:'160px' }}
                        title="总评论数"
                        value={statistics.blogStatisticsPublic[0].commentCount}
                        prefix={<MessageOutlined />}
                      /> */}
                    </Space>
                    <Space>
                      <Statistic
                        style={{ display: 'inline-block', minWidth:'100px', maxWidth:'160px' }}
                        title="总分类数"
                        value={this.state.statistics.categoryList.length}
                        prefix={<BarsOutlined />}
                      />
                      <Statistic
                        style={{ display: 'inline-block', minWidth:'100px', maxWidth:'160px' }}
                        title="总标签数"
                        value={this.state.statistics.tagList.length}
                        prefix={<DeploymentUnitOutlined />}
                      />
                    </Space>
                  </Space>
                </>
            )}
          </div>

          <div
            style={{
              margin:'32px 0px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '20px',
              minWidth:'350px',
              textAlign: 'center'
            }}
          >
            热门分类<br/><br/>
            <Space wrap>
              {( statistics===null || statistics===undefined)
              ? '分类列表加载中...'
              : statistics.categoryList.map((categoryObj, index) => {
                  if (index>=10) {
                    return null
                  }
                  return (
                    <Tag style={{ borderRadius: '20px' }} key={categoryObj.content} color={this.randomColor()}>
                      <Button type="text" shape="round" ghost> 
                        <a>
                          {categoryObj.content + " [" + categoryObj.total + "篇]"}
                        </a>
                        <br/>
                      </Button>
                    </Tag>
                  )
                })
              }
            </Space>
          </div>

          <div
            style={{
              margin:'32px 0px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '20px',
              minWidth:'350px',
              textAlign: 'center'
            }}
          >
          热门标签<br/><br/>
            <Space wrap>
              {( statistics===null || statistics===undefined)
              ? '标签列表加载中...'
              : statistics.tagList.map((tagObj, index) => {
                  if (index>=10) {
                    return null
                  }
                  return (
                    <Tag style={{ borderRadius: '20px' }} key={tagObj.content} color={this.randomColor()}>
                      <a>
                        {tagObj.content + " [" + tagObj.total + "篇]"}
                      </a>
                      <br/>
                    </Tag>
                  )
                })
              }
            </Space>
          </div>
          
        </div>


        <div style={{ margin:'10px 0px', float: 'right', width: '76%'  }}>
          <List
            loading={initLoading}  // loading时的占位符
            size="large"  // 高度增加
            itemLayout="vertical"  // 竖直展示
            dataSource={blogList}  // 列表数据源
            renderItem={item => (  // 渲染dataSource的方法
              <div style={{ border: '0px', padding: '0px'  }}>
                <List.Item
                  style={{ margin: '10px 0px', border: '0px', padding: '16px 26px', borderRadius: '5px', backgroundColor: 'white' }}
                  actions={[
                    <IconText icon={EyeOutlined} text={item.clickCount + "点击"} />,
                    <IconText icon={LikeOutlined} text={item.likeCount + "点赞"} />,
                    <IconText icon={StarOutlined} text={item.collectCount + "收藏"} />,
                    // <IconText icon={MessageOutlined} text={item.commentCount + "评论"} />,
                    <>{item.createTime.replace("T", " ")}</>,
                  ]}
                >
                  <Skeleton loading={item.loading} active>
                    <List.Item.Meta
                      title={
                        <Link onClick={() => this.gotoBolgDetail(item.id)}>{item.title}</Link>
                      }
                      description={
                        ( item.description === "" )
                        ? item.contentMarkdown
                          .substring(0,200)
                          .replace("@[TOC", "")  // 替换markdown的自动标题"@[TOC]()"
                          .replace(/](.*)/i, "")  // 替换markdown的自动标题"@[TOC]()"
                          .replace(/#*/g, "")  // 替换markdown中的等级符"#"
                          .replace(/<.*>/g, "")  // 替换html标签
                          .replace(/&.*;/g, "")  // 替换"&nbsp;"、"&emsp;"等
                          .replace(/-*/g, "")  // 替换markdown的分割线"---"等
                          .replace("*", "")  // 替换markdown的"*"
                        : item.description
                    }
                    />
                    
                    {(item.categoryContent===null || item.categoryContent===undefined || item.categoryContent==="")
                    ? ( <>
                          <>分类：</>
                          <Tag>
                              无
                          </Tag>
                        </>
                      )
                    : (
                        <>
                          <>分类：</>
                          <Tag color="blue">
                            <a>
                              {item.categoryContent}
                            </a>
                          </Tag>
                        </>
                      )
                    }

                    {/* whiteSpace:'pre' 不对空格进行压缩，显示所有空格 */}
                    <span style={{whiteSpace:'pre'}}>      </span>
                    <>标签：</>
                    { (item.tag===null || item.tag===undefined || item.tag==="")
                    ? (
                        <>
                          <Tag style={{ borderRadius: '20px' }}>
                              无
                          </Tag>
                        </>
                      )
                    : (item.tag.split(",").map(
                        (tag) => {
                          return (
                            <Tag style={{ borderRadius: '20px' }} key={tag} color={this.randomColor()}>
                              <a>
                                {tag}
                              </a>
                            </Tag>
                          )
                        }
                      )) 
                    }
                  </Skeleton>
                </List.Item>
              </div>
            )}
            
          />
          <Pagination
            style={{ margin: '64px -16px', textAlign: 'center' }}
            onChange={this.paginationChange}
            // showSizeChanger
            showQuickJumper
            total={total}
            current={currentPage}
          />
        </div>
      </>
    )
  }
}