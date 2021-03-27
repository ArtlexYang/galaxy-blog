import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import {
  Pagination,
  message,
  List,
  Skeleton,
  Space,
  Tag,
  Tree,
  Spin
} from 'antd';
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
export default class Category extends Component {
  constructor(props) {
    super(props)
    // 初始化状态
    this.state = {
      initLoading: true,
      loading: false,
      treeData: null,
      blogList: [],
      currentPage: 1,
      categoryId: 1,
      total: null,
      pageSize: 10,
    }

    // 获取数据
    // this.getPage(1)
    this.getTreeData()
    this.getCategoryBlogList(1, 1)
  }

  // 左侧数据展示栏相关
  getTreeData = async () => {
    this.setState({
      loading: true,
    });
    await axios
      .get('http://localhost:8081/categoryListTree')
      .then(
        res => {
          // console.log(res.data.data)
          // 获取数据
          this.setState({ loading: false, treeData: JSON.parse(res.data.data) });
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
  getCategoryBlogList = async (currentPage, categoryId) => {
    this.setState({
      loading: true,
    });
    await axios
      .get('http://localhost:8081/blogList/category/' + categoryId + '?currentPage=' + currentPage)
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
  paginationChange = (page, pageSize) => { this.getCategoryBlogList(page, this.state.categoryId) }
  gotoBolgDetail = (blogId) => { window.open('about:blank').location.href=`/home/blog/${blogId}` }

  randomColor = () => {
    let r = Math.floor(Math.random()*255/2);
    let g = Math.floor(Math.random()*255/2);
    let b = Math.floor(Math.random()*255/2);
    return 'rgba('+ r +','+ g +','+ b +',0.8)'
  }

  render() {
    const { initLoading, loading, total, pageSize, currentPage, treeData, blogList } = this.state;
    return (
      <>
        {/* 防止刷新错位 */}
        {sessionStorage.setItem('homeMenuKey', '3')}
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
            分类列表
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
            { ( this.state.treeData===null || this.state.treeData===undefined)
              ? <Spin tip="分类列表加载中..." delay="100"/>
              : (
                <Space>
                  <Tree
                    style={{ marginRight: '30px' }}
                    defaultExpandParent
                    defaultExpandAll
                    defaultSelectedKeys={[this.state.treeData[0].key]}
                    treeData={treeData}
                    showLine
                    onSelect={(selectedKeys) => this.getCategoryBlogList(1, selectedKeys)}
                  />
                </Space>)
            }
          </div>
          
          { ( this.state.total===null )
            ? <Spin style={{ margin: '0px 164px' }} tip="导航栏加载中..." delay="100"/>
            : (<Pagination
                style={{ margin: '64px -16px', textAlign: 'center' }}
                onChange={this.paginationChange}
                // showSizeChanger
                showQuickJumper
                total={total}
                pageSize={pageSize}
                current={currentPage}
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
        </div>
      </>
    )
  }
}
