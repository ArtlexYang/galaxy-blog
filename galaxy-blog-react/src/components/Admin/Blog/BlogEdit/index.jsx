import React, { Component, useState, useRef, useEffect } from 'react'

import axios from 'axios'
import { Form, Input, Button, Modal, message, Spin, Tag, Space } from 'antd'
import store from '../../../../redux/store'
import {
  delUser,
} from '../../../../redux/actions/login.js'

import Editor from '../Editor'

/**
 * 本组件获取Blog信息交由Editor进行渲染
 */

// 文本域，用来输入摘要
const { TextArea } = Input;
/**
 * 对话框表单，用来填写博客摘要
 */
const DescriptionModalForm = ({ descriptionModalVisible, onCancel, description }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.submit();
  };
  
  return (
    <Modal title="摘要" visible={descriptionModalVisible} onOk={onOk} onCancel={onCancel}>
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
            {
              message: '存在非法字符!',
              pattern: new RegExp(/^[\w\u4e00-\u9fa5]+$/gi),  // 匹配中文 数字 字母 下划线
            },
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="此文章无摘要，请输入文章摘要"  // 无输入下的提示
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

const CategoryModalForm = ({ categoryModalVisible, onCancel, categoryContent, categoryList }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.submit();
  };

  // 关闭后重置内容，保证不提交重新打开时数据还原
  const afterClose = () => {
    form.setFieldsValue({ categoryContent })
  }

  const selectCategory = (event) => {
    form.setFieldsValue({ categoryContent: event.currentTarget.innerText.split(" ")[0]})
    // console.log(event.currentTarget.innerText.split(" ")[0])
  }
  
  return (
    <Modal title="分类（最多一个）" visible={categoryModalVisible} onOk={onOk} onCancel={onCancel} afterClose={afterClose}>
      <Form 
        form={form} 
        layout="vertical" 
        name="categoryForm"
        initialValues={{
          categoryContent: categoryContent
        }}
      >
        <Form.Item
          name="categoryContent"
          rules={[
            {
              message: '分类字数过多!',
              max: 30
            },
            {
              message: '存在非法字符!',
              pattern: new RegExp(/^[\w\u4e00-\u9fa5]+$/gi),  // 匹配中文 数字 字母 下划线
            },
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="请输入文章分类（可以为空）"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={30}  // 限制最大字数
          />
        </Form.Item>
        <br/>分类仓库：<br/><br/>
        <Form.Item>
          <Space wrap>
            { ( categoryList===null || categoryList==="")
              ? (
                    <Button shape="round" disabled> 
                        无
                    </Button>
                )
              : (
                  categoryList.map((categoryObj) => {
                    return (
                        <Button shape="round" onClick={(event) => {selectCategory(event)}}> 
                            {categoryObj.title}
                        </Button>
                    )
                  })
                ) 
            }
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const { CheckableTag } = Tag;
const TagModalForm = ({ tagModalVisible, onCancel, tag, tagList }) => {
  const [selectedTags, setSelectedTags] = useState([])
  const [form] = Form.useForm();

  const onOk = () => {
    (selectedTags.toString().split(",").length > 5)
    ? message.error("不能选择超过五个标签，请重新选择再提交")
    : form.submit();
  };

  // 关闭后重置内容，保证不提交重新打开时数据还原
  const afterClose = () => {
    setSelectedTags([])
    form.setFieldsValue({ tag })
  }

  const handleChange = (tagContent, checked) => {
    const nextSelectedTags =
      checked
      ? [...selectedTags, tagContent]
      : selectedTags.filter(t => t !== tagContent);
    setSelectedTags(nextSelectedTags);

    // 遍历拼接
    const tagFormItem = (nextSelectedTags.map(tagObj => {return tagObj.split(" ")[0]})).toString()
    
    // 同步到输入框
    form.setFieldsValue({ tagFormItem: tagFormItem })
  }
  
  return (
    <Modal title="标签（最多五个）" visible={tagModalVisible} onOk={onOk} onCancel={onCancel} afterClose={afterClose}>
      <Form 
        form={form} 
        layout="vertical" 
        name="tagForm"
        initialValues={{
          tagFormItem: tag
        }}
      >
        <Form.Item
          name="tagFormItem"
          rules={[
            {
              message: '存在非法字符!',
              pattern: new RegExp(/^[\w\u4e00-\u9fa5 +| ,]+$/gi),  // 匹配中文 数字 字母 下划线 英文逗号
            },
          ]}
        >
          <TextArea
            placeholder="请输入文章标签（可以为空）"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={300}  // 限制最大字数
          />
        </Form.Item>
        <br/>标签仓库：<br/><br/>
        <Form.Item>
          <Space wrap>
            { ( tagList===null || tagList==="")
              ? (
                    <Button shape="round" disabled> 
                        无
                    </Button>
                )
              : (
                tagList.map((tagObj) => {
                    return (
                      // <Button shape="round" onClick={(event) => {selectTag(event)}}> 
                      //     {tagObj.title}
                      // </Button>
                      <CheckableTag
                        key={tagObj.title}
                        checked={selectedTags.indexOf(tagObj.title) > -1}
                        onChange={checked => handleChange(tagObj.title, checked)}
                      >
                        {tagObj.title}
                      </CheckableTag>
                    )
                  })  
                  
                ) 
            }
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

/**
 * BlogEdit组件主体
 */
// 枚举常量
const BLOGSTATUS = { Draft: 0, Public: 1 };
export default class BlogEdit extends Component {
  constructor(props) {
    super(props)

    // 看看有没有编辑的权限
    if (store.getState().login.userInfo!==null && store.getState().login.userInfo.status >= 0) {
      // 初始化，防止setState失效
      this.state = {
        blog: null,  // 不能初始化为{}，因为会自动包含其他属性，导致加载顺序错误
        descriptionModalVisible: false,  // 摘要会话框是否弹出
        categoryModalVisible: false,  // 分类会话框是否弹出
        tagModalVisible: false,  // 标签会话框是否弹出
        categoryList: null,  // 当前用户所有的category
        tagList: null,  // 当前用户所有的tag
        editor: null,  // 编辑器实例
        isNew: (props.match.params.blogId >= 0) ? false : true,  // 是否是新建博客
        loadingWords: '博文加载中...'
      }
      // 获取编辑器组件的引用（此时还没有绑定组件，所以是null）
      this.editorRef = React.createRef()
      this.getCategoryList()
      this.getTagList()

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
          this.setState({ blog: res.data.data })

          // description初始化（新建博客不用走这步）
          if (this.state.blog.description===null || this.state.blog.description==="") {
            if (this.state.blog.contentMarkdown!==null) {
              this.setState({
                blog: {
                  ...this.state.blog,
                  description: 
                    this.state.blog.contentMarkdown
                      .substring(0,200)
                      .replace("@[TOC", "")  // 替换markdown的自动标题"@[TOC]()"
                      .replace(/](.*)/i, "")  // 替换markdown的自动标题"@[TOC]()"
                      .replace(/#*/g, "")  // 替换markdown中的等级符"#"
                      .replace(/<.*>/g, "")  // 替换html标签
                      .replace(/&.*;/g, "")  // 替换"&nbsp;"、"&emsp;"等
                      .replace(/-*/g, "")  // 替换markdown的分割线"---"等
                      .replace("*", "")  // 替换markdown的"*"
              }})
            }
          }
          // 获取编辑器实例，对已存在的博客需要在数据获取到后的第一次渲染完，组件绑定了引用才可以
          this.setState({editor: this.editorRef.current.getInstance()})
        },
        err => {
            // 弹窗提示
            message.error('获取博客失败，请刷新重试！');
            this.setState({ loadingWords: '获取博客失败，请刷新重试！' })
            // token失效了退出登录
            if (err.response.data.message==="token已失效，请重新登录") {
              store.dispatch(delUser())
            }
        }
    );
  }

  getCategoryList = async () => {
    await axios
      .get('http://localhost:8081/categoryList?isAdmin=true')
      .then(
        res => {
          this.setState({ categoryList: JSON.parse(res.data.data) })
          // console.log('CategoryList')
          // console.log(res.data.data)
        },
        err => {
            // 弹窗提示
            message.error('获取分类列表失败，请刷新重试！');
            // token失效了退出登录
            if (err.response.data.message==="token已失效，请重新登录") {
              store.dispatch(delUser())
            }
        }
    );
  }

  getTagList = async () => {
    await axios
      .get('http://localhost:8081/tagList?isAdmin=true')
      .then(
        res => {
          this.setState({ tagList: JSON.parse(res.data.data) })
          // console.log('TagList')
          // console.log(res.data.data)
        },
        err => {
            // 弹窗提示
            message.error('获取标签列表失败，请刷新重试！');
            // token失效了退出登录
            if (err.response.data.message==="token已失效，请重新登录") {
              store.dispatch(delUser())
            }
        }
    );
  }

  // 打开描述填写对话框
  showDescriptionModal = () => { this.setState({descriptionModalVisible: true})  }
  // 关闭描述填写对话框
  hideDescriptionModal = () => { this.setState({descriptionModalVisible: false}) }
  // 打开分类填写对话框
  showCategoryModal = () => { this.setState({categoryModalVisible: true})  }
  // 关闭分类填写对话框
  hideCategoryModal = () => { this.setState({categoryModalVisible: false}) }
  // 打开标签填写对话框
  showTagModal = () => { this.setState({tagModalVisible: true})  }
  // 关闭标签填写对话框
  hideTagModal = () => { this.setState({tagModalVisible: false}) }

  // 保存博客（根据传入的status设置blog状态）
  saveBlog = async (status) => {
    // 使用变量避免setState延迟
    this.blog = this.state.blog
    this.blog.status = status
    this.setState({
      blog: {
        ...this.state.blog,
        status
      }
    })

    console.log(JSON.parse(sessionStorage.getItem('userInfo')).nickname)

    // 如果是新建的博客，要设置博客所属的用户id和用户昵称
    if (this.props.match.params.blogId < 0) {
      this.blog.userId = JSON.parse(sessionStorage.getItem('userInfo')).id
      this.blog.nickname = JSON.parse(sessionStorage.getItem('userInfo')).nickname
      this.setState({
        blog: {
          ...this.state.blog, 
          uid: JSON.parse(sessionStorage.getItem('userInfo')).id,
          nickname: JSON.parse(sessionStorage.getItem('userInfo')).nickname
        }})
    }

    // 保存markdown资源和html资源
    const markdown = this.state.editor.getMarkdown()
    const html = this.state.editor.getHtml()
    this.blog.contentMarkdown = markdown
    this.blog.contentHtml = html
    this.setState({
      blog: {
        ...this.state.blog,
        contentMarkdown: markdown,
        contentHtml: html
      },
    })

    // 保存请求
    await axios.post('http://localhost:8081/blog/edit', this.blog).then(
      res => {
        this.setState({blog: {...this.state.blog, id: res.data.data.id, uid: res.data.data.uid}})
        message.success("保存成功！");
        // 保存后更新下数据
        this.getBlogDetail(this.state.blog.id);
        this.getCategoryList()
        this.getTagList()
      },
      err => {
        message.error(err.response.data.message);
      }
    )
  }

  render() {
    return (
      <>
        {/* 判断博客内容有没有加载完成，完成了显示内容，未完成显示加载动画 */}
        {(this.props.match.params.blogId < 0 || this.state.blog!==null)
        ? <div style={{ backgroundColor: 'white' }}>
            <Form.Provider
              // 子表单提交时触发（name:子表单名; values:子表单属性的keys:values; forms:子表单的form对象,包含对象的一些操作）
              onFormFinish={(name, { values, forms }) => {
                // 直接把子表单的值给state
                if (name === 'descriptionForm') {
                  this.setState({blog: {...this.state.blog, description: values.description}, descriptionModalVisible: false});
                } else if (name === 'categoryForm') {
                  this.setState({blog: {...this.state.blog, categoryContent: values.categoryContent}, categoryModalVisible: false});
                } else if (name === 'tagForm') {
                  this.setState({blog: {...this.state.blog, tag: values.tagFormItem}, tagModalVisible: false});
                  console.log(values)
                }
              }}
            >
              <Form
                    layout="vertical"
                    colon="false"
                    name="basic"
                    initialValues={{
                      title: 
                      this.state.blog!==null && this.state.blog.title!==null
                        ? this.state.blog.title
                        : ""
                    }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
              >
                {/* {console.log(this.state)} */}
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
                  <Button type="primary" htmlType="submit" shape="round" onClick={() => this.saveBlog(this.state.blog.status)}>
                    保存
                  </Button> &nbsp;
                  {/* <Button type="primary" htmlType="submit" shape="round" onClick={() => this.saveBlog(BLOGSTATUS.Draft)}>
                    保存为草稿
                  </Button> &nbsp; */}
                  <Button type="primary" htmlType="submit" shape="round" onClick={() => this.saveBlog(BLOGSTATUS.Public)}>
                    保存并公开发布
                  </Button>
                  <font> &nbsp; 当前博客状态为：
                    {( this.state.blog!==null && this.state.blog.status===1  ? "公开发布" : "未发布草稿" )}
                  </font> &nbsp;
                  <Button shape="round" onClick={this.showDescriptionModal}>
                    编辑摘要
                  </Button> &nbsp;
                  <Button shape="round" onClick={this.showCategoryModal}>
                    编辑分类
                  </Button> &nbsp;
                  <Button shape="round" onClick={this.showTagModal}>
                    编辑标签
                  </Button> &nbsp;
                </Form.Item>

                <Form.Item>
                  <Editor
                      initialValue={this.state.blog!==null ? this.state.blog.contentMarkdown : ""}
                      ref={this.editorRef}
                    />
                </Form.Item>
              </Form>

              <DescriptionModalForm 
                descriptionModalVisible={this.state.descriptionModalVisible}  // 是否弹出对话框
                onCancel={this.hideDescriptionModal}  // 对话框中点击取消的操作
                description={this.state.blog!==null ? this.state.blog.description : ""}
              />
              <CategoryModalForm 
                categoryModalVisible={this.state.categoryModalVisible}  // 是否弹出对话框
                onCancel={this.hideCategoryModal}  // 对话框中点击取消的操作
                categoryContent={this.state.blog!==null ? this.state.blog.categoryContent : ""}
                categoryList={this.state.categoryList}
              />
              <TagModalForm 
                tagModalVisible={this.state.tagModalVisible}  // 是否弹出对话框
                onCancel={this.hideTagModal}  // 对话框中点击取消的操作
                tag={this.state.blog!==null ? this.state.blog.tag : ""}
                tagList={this.state.tagList}
              />
            </Form.Provider>
          </div>
          : <Spin style={{ margin: '22% 48%', zIndex: '-11' }} tip={this.state.loadingWords} size="large"/>
        }
      </>
    )
  }
}
