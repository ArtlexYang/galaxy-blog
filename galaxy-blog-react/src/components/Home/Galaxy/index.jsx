import React, { Component } from 'react'
import backgroundJS from './backgroundJS'
export default class Galaxy extends Component {
  render() {
    return (
      <>
        {/* 防止刷新错位 */}
        {sessionStorage.setItem('homeMenuKey', '2')}
        {/* aaaaaaaaaaa */}
      </>
    )
  }
}
