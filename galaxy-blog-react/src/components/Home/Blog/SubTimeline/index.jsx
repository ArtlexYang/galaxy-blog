import React, { Component } from 'react'
import BlogNode from './BlogNode'

export default class SubTimeline extends Component {
  render() {
    return (
      this.props.blogs.map((blogObj) => {
          return <BlogNode key={blogObj.id} blogObj={blogObj} />
        })
    )
  }
}
