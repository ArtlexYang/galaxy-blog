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
    this.state = {id: null, title: null, userId: null, blogContent: null}

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
          this.setState({
            id: blog.id,
            title: blog.title,
            userId: blog.userId,
            blogContent: blog.content
          })
      },
      err => {
        // 弹窗提示
        message.error('获取博客失败，请重试！');
      }
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {/* {(this.state.blogContent!==null) 
        ? <Editor
            initialValue={this.state.blogContent}
            ref={this.editorRef}
          />
        : "博文加载中......"} */}
      {(this.state.blogContent!==null) 
        ? <Viewer
            initialValue={this.state.blogContent}
            ref={this.editorRef}
          />
        : "博文加载中......"}
      </div>
    )
  }
}
