import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import {
  Pagination,
  message,
  List,
  Skeleton,
  Space,
} from 'antd';
// 因为Tag重名了，所以要改变引入方式
import * as antd from 'antd';
import {
  EyeOutlined,
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
export default class Tag extends Component {
  constructor(props) {
    super(props)
    // 初始化状态
    this.state = {
      initLoading: true,
      loading: false,
      treeData: null,
      blogList: [],
      currentPage: 1,
      tagContent: null,
      total: null,
      pageSize: 10,
    }

    // 获取数据
    // this.getPage(1)
    this.getTreeData()
    // this.getTagBlogList(1, 1)
  }

  // 左侧数据展示栏相关
  getTreeData = async () => {
    this.setState({
      loading: true,
    });
    await axios
      .get('http://localhost:8081/tagList')
      .then(
        res => {
          // console.log(res.data.data)
          // 获取数据
          if (JSON.parse(res.data.data)[0] !== null || JSON.parse(res.data.data)[0] !== undefined || JSON.parse(res.data.data)[0] !== "") {
            this.setState({ loading: false, treeData: JSON.parse(res.data.data), tagContent: JSON.parse(res.data.data)[0].title.split(" ")[0] });
            this.getTagBlogList(1, JSON.parse(res.data.data)[0].title.split(" ")[0]);
          } else {
            // 弹窗提示
            message.error('无标签可加载');
          }
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
  getTagBlogList = async (currentPage, tagContent) => {
    this.setState({
      loading: true,
    });
    await axios
      .get('http://localhost:8081/blogList/tag/' + tagContent + '?currentPage=' + currentPage)
      .then(
        res => {
          // 获取数据
          this.setState({
            initLoading: false,
            loading: false,
            tagContent,
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
  paginationChange = (page, pageSize) => { this.getTagBlogList(page, this.state.tagContent) }
  gotoBolgDetail = (blogId) => { window.open('about:blank').location.href=`/home/blog/${blogId}` }

  randomColor = () => {
    let r = Math.floor(Math.random()*255/2);
    let g = Math.floor(Math.random()*255/2);
    let b = Math.floor(Math.random()*255/2);
    return 'rgba('+ r +','+ g +','+ b +',0.8)'
  }

  render() {
    const { initLoading, loading, total, currentPage, treeData, tagContent, blogList, pageSize } = this.state;
    return (
      <>
        {console.log(tagContent)}
        {/* 防止刷新错位 */}
        {sessionStorage.setItem('homeMenuKey', '4')}
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
              textAlign: 'center',
              fontSize: '2em',
              fontWeight: 'bold'
            }}
          >
            标签列表
          </div>
          <div
            style={{
              margin:'32px 0px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '20px',
              minWidth:'350px',
              textAlign: 'center',
              fontSize: '1em',
            }}
          >
            当前标签：{tagContent}
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
            <Space wrap>
              {( treeData===null || treeData===undefined)
              ? '标签列表加载中...'
              : treeData.map((tagObj, index) => {
                  return (
                    <antd.Tag
                      style={{ borderRadius: '20px' }}
                      onClick={() => this.getTagBlogList(1, tagObj.title.split(" ")[0])}
                      key={tagObj.title}
                      color={this.randomColor()}
                    >
                      {/* <a>标签添加点击动画 */}
                      <a>{tagObj.title}</a>
                      <br/>
                    </antd.Tag>
                  )
                })
              }
            </Space>
          </div>
          
          { ( this.state.total===null )
            ? '导航栏加载中...'
            : (<Pagination
                style={{ margin: '64px -16px', textAlign: 'center' }}
                onChange={this.paginationChange}
                // showSizeChanger
                showQuickJumper
                total={total}
                pageSize={pageSize}
              />)
          }
          
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
                          <antd.Tag>
                              无
                          </antd.Tag>
                        </>
                      )
                    : (
                        <>
                          <>分类：</>
                          <antd.Tag color="blue">
                            <a>
                              {item.categoryContent}
                            </a>
                          </antd.Tag>
                        </>
                      )
                    }

                    {/* whiteSpace:'pre' 不对空格进行压缩，显示所有空格 */}
                    <span style={{whiteSpace:'pre'}}>      </span>
                    <>标签：</>
                    { (item.tag===null || item.tag===undefined || item.tag==="")
                    ? (
                        <>
                          <antd.Tag style={{ borderRadius: '20px' }}>
                              无
                          </antd.Tag>
                        </>
                      )
                    : (item.tag.split(",").map(
                        (tag) => {
                          return (
                            <antd.Tag style={{ borderRadius: '20px' }} key={tag} color={this.randomColor()}>
                              <a>
                                {tag}
                              </a>
                            </antd.Tag>
                          )
                        }
                      )) 
                    }
                    
                  </Skeleton>
                </List.Item>
              </div>
            )}
          />
        </div>
      </>
    )
  }
}
