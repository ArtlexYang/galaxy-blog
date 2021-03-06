import React, { Component, useRef, useEffect } from 'react'

import axios from 'axios'
import { Form, Input, Button, Modal, message } from 'antd'
import store from '../../../../redux/store'

import Editor from '../Editor'

/**
 * 本组件获取Blog信息交由Editor进行渲染
 */

// 文本域，用来输入摘要
const { TextArea } = Input;
/**
 * 对话框表单，用来填写博客摘要
 */
const ModalForm = ({ visible, onCancel, description }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.submit();
  };
  
  return (
    <Modal title="摘要" visible={visible} onOk={onOk} onCancel={onCancel}>
      <Form 
        form={form} 
        layout="vertical" 
        name="descriptionForm"
        initialValues={{
          description: description
        }}
      >
        <Form.Item
          name="description"
          rules={[
            {
              message: '描述字数过多!',
              max: 500
            },
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="请输入文章摘要"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={500}  // 限制最大字数
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

/**
 * BlogEdit组件主体
 */
// 枚举常量
const BLOGSTATUS = {Draft:0, Private:1, Public:2};
export default class BlogEdit extends Component {
  constructor(props) {
    super(props)

    // 看看有没有编辑的权限
    if (store.getState().login.userInfo!==null && store.getState().login.userInfo.status >= 0) {
      // 初始化，防止setState失效
      this.state = {
        blog: {
          id: null,
          userId: null, 
          title: "", 
          description: "", 
          content: "", 
          status: 0}, 
        visible: false,  // 摘要会话框是否弹出
        editor: null,  // 编辑器实例
        isNew: (props.match.params.blogId >= 0) ? false : true  // 是否是新建博客
      }
      // 获取编辑器组件的引用（此时还没有绑定组件，所以是null）
      this.editorRef = React.createRef()

      // 不会引起页面修改且需要及时保存的数据，不建议放在state中
      this.blog = {
        id: null,
        userId: null, 
        title: "", 
        description: "", 
        content: "", 
        status: 0}

    } else {  // 没有权限跳到登陆页面
      message.error('没有权限编辑此博客！请登录');
      this.props.history.push('/login');
    }
  }
  
  componentDidMount() {
    // 是合法博客id才去请求；否则是新建博客（什么都不用做，使用初始化的值，userId发送的时候一起给）
    if (this.props.match.params.blogId >= 0) {
      this.getBlogDetail(this.props.match.params.blogId)
    } else {
      // 获取编辑器实例，对未存在的博客需要在组件装载完才能获取
      this.setState({editor: this.editorRef.current.getInstance()})
    }
  }

  getBlogDetail = async (blogId) => {
    await axios
      .get('http://localhost:8081/blog/' + blogId)
      .then(
        res => {
          // this.blog = res.data.data
          const blogData = res.data.data
          this.setState({
            blog: {
              id: blogData.id,
              title: blogData.title,
              userId: blogData.userId,
              description: blogData.description,
              content: blogData.content,
              status: blogData.status
            }
          })

          // description初始化（新建博客不用走这步）
          if (this.state.blog.description===null || this.state.blog.description==="") {
            if (this.state.blog.content!==null) {
              // this.state.blog.description = this.state.blog.content.substring(0,200)
              //                                               .replace("@[TOC", "")  // 替换markdown的自动标题"@[TOC]()"
              //                                               .replace(/](.*)/i, "")  // 替换markdown的自动标题"@[TOC]()"
              //                                               .replace(/#*/g, "")  // 替换markdown中的等级符"#"
              //                                               .replace(/<.*>/g, "")  // 替换html标签
              //                                               .replace(/&.*;/g, "")  // 替换"&nbsp;"、"&emsp;"等
              //                                               .replace(/-*/g, "")  // 替换markdown的分割线"---"等
              this.setState({
                blog: {
                  ...this.state.blog,
                  description: this.state.blog.content.substring(0,200)
                    .replace("@[TOC", "")  // 替换markdown的自动标题"@[TOC]()"
                    .replace(/](.*)/i, "")  // 替换markdown的自动标题"@[TOC]()"
                    .replace(/#*/g, "")  // 替换markdown中的等级符"#"
                    .replace(/<.*>/g, "")  // 替换html标签
                    .replace(/&.*;/g, "")  // 替换"&nbsp;"、"&emsp;"等
                    .replace(/-*/g, "")  // 替换markdown的分割线"---"等
              }})
            }
          }
          // console.log(this.state)
          // 获取编辑器实例，对已存在的博客需要在数据获取到后的第一次渲染完，组件绑定了引用才可以
          this.setState({editor: this.editorRef.current.getInstance()})
          },
          err => {
            // 弹窗提示
            message.error('获取博客失败，请重试！');
        }
    );
  }

  // 打开描述填写对话框
  showDescriptionModal = () => { this.setState({visible: true})  }
  // 关闭描述填写对话框
  hideDescriptionModal = () => { this.setState({visible: false}) }

  // 保存博客（根据传入的status设置blog状态）
  saveBlog = async (status) => {
    // 使用变量避免setState延迟
    this.blog = this.state.blog
    this.blog.status = status
    this.setState({blog: {...this.state.blog, status}})

    if (this.props.match.params.blogId < 0) {  // 如果是新建的博客，要设置博客所属的用户id
      this.blog.userId = JSON.parse(sessionStorage.getItem('userInfo')).id
      this.setState({
        blog: {
          ...this.state.blog, 
          userId: JSON.parse(sessionStorage.getItem('userInfo')).id,
        }})
    }
    // 保存markdown资源
    const markdown = this.state.editor.getMarkdown()
    this.blog.content = markdown
    this.setState({
      blog: {
        ...this.state.blog,
        content: markdown,},
      })
    console.log(this.state)
    await axios.post('http://localhost:8081/blog/edit', this.blog).then(
      res => {
        // console.log(res.data.data.id)
        this.setState({blog: {...this.state.blog, id: res.data.data.id, userId: res.data.data.userId}})
        message.success("保存成功！");
      },
      err => {
        message.error("未知错误，可能是：保存错误、标题未填错误、无权限错误、服务器错误！");
      }
    ).catch(
      err => {
        message.error("服务器错误，保存失败，请稍候重试！");
      })
  }

  render() {
    return (
      <div>
        {/* 判断博客内容有没有加载完成，完成了显示内容，未完成显示加载动画 */}
        {(this.props.match.params.blogId < 0 || this.state.blog.title!=="")
        ? <>
            <Form.Provider
              // 子表单提交时触发（name:子表单名; values:子表单属性的keys:values; forms:子表单的form对象,包含对象的一些操作）
              onFormFinish={(name, { values, forms }) => {
                // console.log(values)
                // console.log(forms)
                // 直接把子表单的值给state
                if (name === 'descriptionForm') {
                  this.setState({blog: {...this.state.blog, description: values.description}, visible: false});
                }
              }}
            >
              <Form
                    layout="vertical"
                    colon="false"
                    name="basic"
                    initialValues={{
                      title: 
                        this.state.blog.title!==null
                        ? this.state.blog.title
                        : ""
                    }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
              >
                {console.log(this.state)}
                <Form.Item
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: '需要输入标题!',
                    },
                    {
                      message: '标题字数过多!',
                      max: 50
                    },
                  ]}
                >
                  <Input 
                    // className={styles.inputText} 
                    style={{width: "100%"}}
                    placeholder="请输入标题"
                    onChange={  // 输入框每次更新都执行此方法（保证标题可以正确修改）
                      (event) => {
                        this.setState({blog: {...this.state.blog, title: event.target.value}})
                      }
                    }
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" onClick={this.showDescriptionModal}>
                    编辑摘要
                  </Button> &nbsp;
                  <Button type="primary" htmlType="submit" onClick={() => this.saveBlog(this.state.blog.status)}>
                    保存
                  </Button> &nbsp;
                  <Button type="primary" htmlType="submit" onClick={() => this.saveBlog(BLOGSTATUS.Draft)}>
                    保存为草稿
                  </Button> &nbsp;
                  <Button type="primary" htmlType="submit" onClick={() => this.saveBlog(BLOGSTATUS.Private)}>
                    保存并私有发布
                  </Button> &nbsp;
                  <Button type="primary" htmlType="submit" onClick={() => this.saveBlog(BLOGSTATUS.Public)}>
                    保存并公开发布
                  </Button>
                  <font> &nbsp; 当前博客状态为：
                    {(this.state.blog.status===1  ? "私有发布" 
                                                  : (this.state.blog.status===2
                                                    ? "公开发布"
                                                    : "未发布草稿")
                    )}
                  </font>
                </Form.Item>

                <Form.Item>
                  <Editor
                      initialValue={this.state.blog.content}
                      ref={this.editorRef}
                    />
                </Form.Item>
              </Form>

              <ModalForm 
                visible={this.state.visible}  // 是否弹出对话框
                onCancel={this.hideDescriptionModal}  // 对话框中点击取消的操作
                description={this.state.blog.description}
              />
            </Form.Provider>
          </>
          : "博文加载中......"
        }
      </div>
    )
  }
}
