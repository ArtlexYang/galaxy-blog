import React, { Component } from 'react'

import axios from 'axios'
import { message } from 'antd'

import Viewer from '../Viewer'
import styles from './index.module.css'

/**
 * 本组件获取Blog信息交由Viewer进行渲染
 */
export default class GetBolgDetail extends Component {
  constructor(props) {
    super(props)

    // 初始化，防止setState失效
    this.state = { blog: null }

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

  render() {
    return (
      <div style={{ margin: '50px 150px', backgroundColor: 'white' }}>
        {/* {(this.state.blogContent!==null) 
        ? <Editor
            initialValue={this.state.blogContent}
            ref={this.editorRef}
          />
        : "博文加载中......"} */}
      
        {/* 直接显示翻译好的html文件 */}
        { ( this.state.blog!==null) 
          ? <div dangerouslySetInnerHTML={{__html:this.state.blog.contentHtml}}></div>
          : "博文加载中......"
        }
      </div>
    )
  }
}
