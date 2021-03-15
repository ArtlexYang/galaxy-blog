import React, { Component } from 'react'

import axios from 'axios'
import {
  message,
  Spin,
  Tag,
  Button,
  Space,
  Statistic
} from 'antd'
import {
  EyeOutlined,
  LikeOutlined,
  StarOutlined
} from '@ant-design/icons';

import Viewer from '../Viewer'

/**
 * 本组件获取Blog信息交由Viewer进行渲染
 */
export default class GetBolgDetail extends Component {
  constructor(props) {
    super(props)

    // 初始化，防止setState失效
    this.state = {
      blog: null,
      isLike: false,
      isCollect: false
    }

    // 获取编辑器组件的引用
    this.editorRef = React.createRef()
  }
  
  componentDidMount() {
    this.getBlogDetail(this.props.match.params.blogId)
  }

  getBlogDetail = async (blogId) => {
    await axios
      .get('http://localhost:8081/blog/' + blogId)
      .then(
        res => {
          const blog = res.data.data
          this.setState({ blog })
      },
      err => {
        // 弹窗提示
        message.error(err.response.data.message);
      }
    );
  }

  incrementLike = async () => {
    axios.put('http://localhost:8081/blog/like/' + this.props.match.params.blogId)
    this.setState({ blog: {...this.state.blog, likeCount: this.state.blog.likeCount+1}, isLike: true })
  }

  incrementCollect = async () => {
    axios.put('http://localhost:8081/blog/collect/' + this.props.match.params.blogId)
    // {window.external.AddFavorite(window.location.href, document.title)}
    this.setState({ blog: {...this.state.blog, collectCount: this.state.blog.collectCount+1}, isCollect: true })
  }

  randomColor = () => {
    let r = Math.floor(Math.random()*255/2);
    let g = Math.floor(Math.random()*255/2);
    let b = Math.floor(Math.random()*255/2);
    return 'rgba('+ r +','+ g +','+ b +',0.8)'
  }

  render() {
    const { blog, isLike, isCollect } = this.state
    return (
      // <div style={{ margin: '50px 150px', minHeight: '969px', backgroundColor: 'white' }}>
      //   {/* {(this.state.blogContent!==null) 
      //   ? <Editor
      //       initialValue={this.state.blogContent}
      //       ref={this.editorRef}
      //     />
      //   : "博文加载中......"} */}
      
      //   {/* 直接显示翻译好的html文件 */}
      //   { ( this.state.blog!==null) 
      //     ? <div dangerouslySetInnerHTML={{__html:this.state.blog.contentHtml}}></div>
      //     : "博文加载中......"
      //   }
      // </div>

      <>
        {( this.state.blog===null )
          ? <Spin tip="博文加载中..."/>
          : (
            <>
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
                  }}
                >
                  <div style={{fontSize: '1.5em', fontWeight: 'bold',}}>
                    {blog.title}
                  </div>
                  <br/>
                  <Space style={{ maxWidth:'320px' }} align='center' direction='vertical'>
                    
                    <Statistic
                      style={{ display: 'inline-block', width:'auto' }}
                      title="点击数"
                      value={blog.clickCount}
                      prefix={<EyeOutlined />}
                    />
                    <Space align='center' direction='horizontal'>
                      <Statistic
                        style={{ display: 'inline-block', minWidth:'100px', maxWidth:'160px' }}
                        title="点赞数"
                        value={blog.likeCount}
                        prefix={<LikeOutlined />}
                      />
                      <Statistic
                        style={{ display: 'inline-block', minWidth:'100px', maxWidth:'160px' }}
                        title="收藏数"
                        value={blog.collectCount}
                        prefix={<StarOutlined />}
                      />
                    </Space>
                  </Space>
                  <br/><br/>
                  <div style={{fontSize: '1em', fontWeight: 'bold',}}>
                    {blog.flag===0 
                      ? '原创 '
                      : blog.flag===1
                        ? '转载 '
                        : '翻译 ' 
                    }
                    By {blog.nickname}
                  </div>
                  <br/>
                    创建时间：{blog.createTime.replace("T", " ")}
                  <br/>
                    最近更新时间：{blog.updateTime.replace("T", " ")}
                  <br/><br/>
                  <Button onClick={this.incrementLike} shape="round" icon={<LikeOutlined />} disabled={isLike}>点赞</Button>&emsp;
                  <Button onClick={this.incrementCollect} shape="round" icon={<StarOutlined />} disabled={isCollect}>收藏</Button>
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
                  分类<br/><br/>
                  {console.log(blog)}
                  { ( blog.categoryContent==="" )
                    ? (
                        <Tag style={{ margin: '0px', borderRadius: '20px', minWidth: '150px' }}>
                          <Button type="text" shape="round" ghost disabled> 
                            <a>
                              无
                            </a>
                          </Button>
                        </Tag>
                      )
                    : (
                        <Tag style={{ margin: '0px', borderRadius: '20px', minWidth: '150px' }} color={this.randomColor()}>
                          <Button type="text" shape="round" ghost> 
                            <a>
                              {blog.categoryContent}
                            </a>
                            <br/>
                          </Button>
                        </Tag>
                      )
                  }
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
                  标签<br/><br/>
                  { ( blog.tag===null || blog.tag===undefined || blog.tag==="" )
                    ? (
                        <Tag style={{ margin: '0px', borderRadius: '20px', minWidth: '150px' }}>
                            <a>
                              无
                            </a>
                        </Tag>
                      )
                    : (
                        <Tag style={{ margin: '0px', borderRadius: '20px' }} color={this.randomColor()}>
                            <a>
                              {blog.tag}
                            </a>
                        </Tag>
                      )
                  }
                </div>
              </div>
      
      
              <div style={{ margin:'20px 0px', float: 'right', width: '76%', minHeight: '850px', borderRadius: '5px', backgroundColor: 'white' }}>
                {/* 直接显示翻译好的html文件 */}
                <div style={{ margin: '48px' }} dangerouslySetInnerHTML={{__html:this.state.blog.contentHtml}}></div>
              </div>
            </>
          )
        }
      </>
    )
  }
}
