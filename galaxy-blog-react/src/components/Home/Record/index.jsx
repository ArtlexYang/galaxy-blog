import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { Timeline, message, List, Space, Button } from 'antd';
// axios进行后端请求
import axios from 'axios'

export default class Record extends Component {
  constructor(props) {
    super(props)
    // 初始化状态
    this.state = {
      blogTimeList: null,
      blogList: null,
      selectedTimePeriod: null,
    }

    // 获取数据
    this.getBlogTimeList()
  }

  // 左侧数据展示栏相关
  getBlogTimeList = async () => {
    this.setState({
      loading: true,
    });
    await axios
      .get('http://localhost:8081/blogList/time')
      .then(
        res => {
          // 防止多次读取减慢效率
          const tempList = JSON.parse(res.data.data)
          // 获取数据
          if (tempList.length!==0 && tempList[0]!==null) {
            this.setState({ loading: false, blogTimeList: tempList , selectedTimePeriod: tempList[0].time});
            // 读取默认展示的博客列表
            this.getBlogList(tempList[0].time);

          } else {
            // 弹窗提示
            message.error('无博客归档可加载');
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
  getBlogList = async (selectedTimePeriod) => {
    await axios
      .get('http://localhost:8081/blogList/time/' + selectedTimePeriod)
      .then(
        res => {
          // 防止多次读取减慢效率
          const tempList = JSON.parse(res.data.data)
          if (tempList.length!==0 && tempList[0]!==null) {
            // 获取数据
            this.setState({ blogList: tempList, selectedTimePeriod });
          } else {
            // 弹窗提示
            message.error('此时间段内无博客可加载');
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
        }
    );
  }
  gotoBolgDetail = (blogId) => { window.open('about:blank').location.href=`/home/blog/${blogId}` }

  changeTimeFormat = (time) => {
    var date = new Date(time);
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return date.getFullYear() + "-" + month + "-" + currentDate+" "+hh + ":" + mm;
    //返回格式：yyyy-MM-dd hh:mm
  }

  render() {
    const {blogList, blogTimeList, selectedTimePeriod } = this.state
    return (
      <>
        {/* 防止刷新错位 */}
        {sessionStorage.setItem('homeMenuKey', '5')}
        <div
          style={{
            display: 'inline-block',
            width: '20%',
            minWidth: '300px',
            position: 'fixed',
            top: '52px',
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
              fontWeight: 'bold',
            }}
          >
              归档列表
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
            当前展示博客时间段：{selectedTimePeriod}
          </div>
          <div
            style={{
              margin:'32px 0px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '20px',
              minWidth:'350px',
              textAlign: 'center',
            }}
          >
            {(blogTimeList===null || blogTimeList===undefined || blogTimeList.length===0)
            ? '博客归档列表加载中...'
            : (
                <Space align='center' direction='vertical'>
                  <List
                    style={{ textAlign: 'center', borderRadius: '20px', }}
                    dataSource={blogTimeList}
                    renderItem={
                      item => {
                        return (
                          <List.Item>
                            <Button
                              style={{
                                minWidth: '250px',
                                borderRadius: '20px'
                              }}
                              onClick={(event) => this.getBlogList(event.currentTarget.innerText.split(" ")[0])}
                            >
                              {item.time + " [" + item.total + "篇]"}
                            </Button>
                          </List.Item>
                        )
                      }
                    }
                    split={false}
                  >
                  </List>
                </Space>
              )
            }
          </div>
        </div>


        <div style={{ margin:'20px 0px', float: 'right', width: '76%', height: 'auto', borderRadius: '5px', backgroundColor: 'white' }}>
          {(blogList===null || blogList===undefined || blogList.length===0)
            ? '时间段博客列表加载中...'
            : (
                <Timeline style={{ margin:'32px 0px', paddingRight: '30%', paddingTop: '50px'}} mode={'left'}>
                  {
                    blogList.map(
                      (blogObj) => {
                        return (
                          <Timeline.Item label={this.changeTimeFormat(blogObj.createTime).split(" ")[0]}>
                            <Link onClick={() => this.gotoBolgDetail(blogObj.id)}>
                              {blogObj.title}
                            </Link>
                          </Timeline.Item>
                        )
                      }
                    )
                  }
                </Timeline>
              )
          }
        </div>
      </>
    )
  }
}
