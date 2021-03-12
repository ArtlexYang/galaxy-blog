import React, { Component } from 'react'

export default class About extends Component {
  render() {
    return (
      <>
        {/* 防止刷新错位 */}
        {sessionStorage.setItem('homeMenuKey', '6')}
        关于页面内容...正在施工中...
      </>
    )
  }
}
