import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Timeline, Descriptions } from 'antd';

import styles from './index.module.css'

export default class BlogNode extends Component {
  gotoBolgDetail = () => {
    window.open('about:blank').location.href=`/home/blog/${this.props.blogObj.id}`
  }

  render() {
    return (
        <Timeline.Item>
          {/* 向路由组件传递params参数(携带参数) */}
          <Link onClick={this.gotoBolgDetail}>
            <Descriptions className={styles.descriptions} title={this.props.blogObj.title + " [" + this.props.blogObj.createTime.split("T")[0] + "]"}>
              <Descriptions.Item className={styles.item}>
                {this.props.blogObj.content.substring(0,200)
                                            .replace("@[TOC", "")  // 替换markdown的自动标题"@[TOC]()"
                                            .replace(/](.*)/i, "")  // 替换markdown的自动标题"@[TOC]()"
                                            .replace(/#*/g, "")  // 替换markdown中的等级符"#"
                                            .replace(/<.*>/g, "")  // 替换html标签
                                            .replace(/&.*;/g, "")  // 替换"&nbsp;"、"&emsp;"等
                                            .replace(/-*/g, "")  // 替换markdown的分割线"---"等
                                            }  
              </Descriptions.Item>
            </Descriptions>
          </Link>
        </Timeline.Item>
    )
  }
}
