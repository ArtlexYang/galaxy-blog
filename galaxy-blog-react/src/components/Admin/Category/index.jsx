import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import { List, Button, Skeleton, Form, Modal, Input, Select, Radio,message, Popconfirm } from 'antd';
import axios from 'axios';
// 引入redux相关文件
import store from '../../../redux/store'
import {
  delUser,
} from '../../../redux/actions/login.js'

// 文本域，用来输入摘要
const { TextArea } = Input;
// 选择器的选项
const { Option } = Select;
// 添加分类的弹出表单
const NewCategoryForm = ({ newCategoryModalVisible, onCancel }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.submit();
  };

  const onFinish = async (value) => {
    // 格式化分类对象（将字符串转换为数字） content: "11111", description: undefined, status: "否", level: 1, pid: undefined
    const category = {
      userId: JSON.parse(sessionStorage.getItem('userInfo')).id,
      content: value.content===undefined ? "" : value.content,
      description: value.description===undefined ? "" : value.description,
      status: value.status==="是" ? 1 : 0,
      level: value.level==="2级" ? 2 : 1,
      pid: value.pid===undefined || value.pid==="" ? 0 : value.pid
    }

    await axios.post('http://localhost:8081/category/edit', category).then(
      res => {
        if(res.data.statusCode===200) {
          message.success('保存成功');
          // 关闭对话框
          onCancel()
        } else {
          message.error(res.data.message)
        }
        
      },
      err => {
        // 后端服务错误
        if (err.response===undefined) {
          message.error('保存失败，连接服务器失败，请稍候重试');
        } else {
          message.error(err.response.data.message);
        }
      }
    )
  };

  // 关闭后重置内容，保证不提交重新打开时数据还原
  const afterClose = () => {
    form.setFieldsValue({ content: "", description: "", status: "否", level: "1级", pid: "" })
  }
  
  return (
    <Modal title="新建分类" visible={newCategoryModalVisible} onOk={onOk} onCancel={onCancel} afterClose={afterClose}>
      <Form 
        form={form} 
        layout="vertical" 
        name="descriptionForm"
        initialValues={{
          status: '否',
          level: "1级"
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="分类内容（中文、数字、字母、下划线）"
          name="content"
          rules={[
            {
              message: '需要填写分类内容!',
              required: true
            },
            {
              message: '分类内容字数过多!',
              max: 20
            },
            {
              message: '存在非法字符!',
              pattern: new RegExp(/^[\w\u4e00-\u9fa5]+$/gi),  // 匹配中文 数字 字母 下划线
            },
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="请输入分类内容"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={20}  // 限制最大字数
          />
        </Form.Item>
        <Form.Item
          label="分类描述（中文、数字、字母、下划线）"
          name="description"
          rules={[
            {
              message: '分类描述字数过多!',
              max: 50
            },
            {
              message: '存在非法字符!',
              pattern: new RegExp(/^[\w\u4e00-\u9fa5]+$/gi),  // 匹配中文 数字 字母 下划线
            },
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="此分类无摘要（可以为空）"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={50}  // 限制最大字数
          />
        </Form.Item>
        <Form.Item
          label="该分类是否在首页显示"
          name="status"
        >
          <Select placeholder="该分类是否在首页显示" defaultValue="否">
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="分类层级"
          name="level"
        >
          <Select placeholder="分类层级" defaultValue="1">
            <Option value="1">1级</Option>
            <Option value="2">2级</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="父级分类id，分类层级大于1时生效"
          name="pid"
          rules={[
            {
              message: '父级分类id过长!',
              max: 19,
            },
            {
              message: '只能输入正数!',
              pattern: new RegExp(/^[1-9]\d*$/gi),
            },
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="父级分类id，分类层级大于1时生效"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={19}  // 限制最大字数
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
// 修改分类的弹出表单
const EditCategoryForm = ({ editCategoryModalVisible, onCancel, selectedCategory }) => {
  const [isPostEdit , setIsPostEdit] = useState(false)
  const [category, setCategory] = useState(null)
  const [form] = Form.useForm();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value) => {
    // 格式化分类对象（将字符串转换为数字） content: "11111", description: undefined, status: "否", level: 1, pid: undefined
    const tempCategory = {
      id: selectedCategory.id,
      userId: JSON.parse(sessionStorage.getItem('userInfo')).id,
      content: value.content===null || value.content===undefined ? "" : value.content,
      description: value.description===null || value.description===undefined ? "" : value.description,
      status: value.status==="是" ? 1 : 0,
      level: value.level==="2级" ? 2 : 1,
      pid: value.pid===undefined || value.pid==="" ? 0 : value.pid
    }
    setCategory(tempCategory)

    axios.post('http://localhost:8081/category/edit', tempCategory).then(
      res => {
        if(res.data.statusCode===200) {
          message.success('保存成功');
          setIsPostEdit(true)
          // 关闭对话框
          onCancel()
        } else {
          message.error(res.data.message)
        }
      },
      err => {
        // 后端服务错误
        if (err.response===undefined) {
          message.error('保存失败，连接服务器失败，请稍候重试');
        } else {
          message.error(err.response.data.message);
        }
      }
    )
  };

  // 关闭后重置内容，保证不提交重新打开时数据还原
  const afterClose = () => {
    // 如果提交了编辑，重置为最新的。否则就用旧的来重置
    if (isPostEdit) {
      form.setFieldsValue({
        content: category.content,
        description: category.description,
        status: category.status===1 ? "是" : "否",
        level: category.level===2 ? "2级" : '1级',
        pid: (category.pid===null || category.pid===undefined) ? 0 : category.pid.toString()
      })
    } else {
      form.setFieldsValue({
        content: selectedCategory.content,
        description: selectedCategory.description,
        status: selectedCategory.status===1 ? "是" : "否",
        level: selectedCategory.level===2 ? "2级" : '1级',
        pid: selectedCategory.pid===null || selectedCategory.pid===undefined ? 0 : selectedCategory.pid.toString()
      })
    }
    setIsPostEdit(false)
  }
  
  
  return (
    <Modal title="修改分类" visible={editCategoryModalVisible} onOk={onOk} onCancel={onCancel} afterClose={afterClose}>
      {/* {console.log('Modal')}
      {console.log(selectedCategory)} */}
      <Form 
        form={form} 
        layout="vertical" 
        name="descriptionForm"
        initialValues={{
          content: selectedCategory.content,
          description: selectedCategory.description,
          status: selectedCategory.status===1 ? "是" : "否",
          level: selectedCategory.level===2 ? "2级" : '1级',
          pid: selectedCategory.pid===null || selectedCategory.pid===undefined ? 0 : selectedCategory.pid.toString()
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="分类内容（中文、数字、字母、下划线）"
          name="content"
          rules={[
            {
              message: '需要填写分类内容!',
              required: true
            },
            {
              message: '分类内容字数过多!',
              max: 20
            },
            {
              message: '存在非法字符!',
              pattern: new RegExp(/^[\w\u4e00-\u9fa5]+$/gi),  // 匹配中文 数字 字母 下划线
            },
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="请输入分类内容"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={20}  // 限制最大字数
          />
        </Form.Item>
        <Form.Item
          label="分类描述（中文、数字、字母、下划线）"
          name="description"
          rules={[
            {
              message: '分类描述字数过多!',
              max: 50
            },
            {
              message: '存在非法字符!',
              pattern: new RegExp(/^[\w\u4e00-\u9fa5]+$/gi),  // 匹配中文 数字 字母 下划线
            },
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="此分类无摘要（可以为空）"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={50}  // 限制最大字数
          />
        </Form.Item>
        <Form.Item
          label="该分类是否在首页显示"
          name="status"
        >
          <Select placeholder="该分类是否在首页显示" defaultValue="否">
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="分类层级"
          name="level"
        >
          <Select placeholder="分类层级" defaultValue="1级">
            <Option value="1级">1级</Option>
            <Option value="2级">2级</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="父级分类id，分类层级大于1时生效（为0时表示无父级分类）"
          name="pid"
          rules={[
            {
              message: '父级分类id过长!',
              max: 19,
            },
            {
              message: '只能输入非负数!',
              pattern: new RegExp(/^[0-9]\d*$/gi),
            },
          ]}
        >
          <TextArea
            // className={styles.inputText}
            placeholder="父级分类id，分类层级大于1时生效"  // 无输入下的提示
            allowClear  // 允许清空文本
            autoSize  // 自动高度
            showCount  // 显示字数
            maxLength={19}  // 限制最大字数
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
/**
 * 本组件用于博客的分类管理
 */
export default class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initLoading: true,
      loading: false,
      list: [],
      currentPage: 1,
      total: -1,
      pageSize: 10,
      newCategoryModalVisible: false,
      editCategoryModalVisible: false
    };

    this.selectedCategory = null
  }
  

  componentDidMount() {
    this.getPage(1)
  }

  getPage = async (currentPage) => {
    this.setState({loading: true})
    await axios
      .get('http://localhost:8081/categoryListAdmin?currentPage=' + currentPage )
      .then(
        res => {
          // 获取数据
          this.setState({
            initLoading: false,
            loading: false,
            list: res.data.data.records,
            currentPage: currentPage,
            total: res.data.data.total,
            pageSize: res.data.data.size,
          });
          // console.log(res.data.data.records)
        },
        err => {
          // 后端服务错误
          if (err.response===undefined) {
            message.error('连接服务器失败，请稍候重试');
          } else {
            // 弹窗提示
            message.error(err.response.data.message);
            // token失效了退出登录
            if (err.response.data.message==="token已失效，请重新登录") {
              store.dispatch(delUser())
            }
          }
        });
  }

  // 删除分类（只需要id）
  deleteCategory = async (category) => {
    console.log(category)
    await axios.post('http://localhost:8081/category/delete', category).then(
      res => {
        if(res.data.statusCode===200) {
          message.success(res.data.message);
        } else {
          message.error(res.data.message);
        }
      },
      err => {
        // 后端服务错误
        if (err.response===undefined) {
          message.error('连接服务器失败，请稍候重试');
        } else {
          message.error("无权限删除！");
        }
      }
    )
    // 刷新一下（重新获取一下数据就好）
    this.getPage(this.state.currentPage)
  }

  // 获取指定页码的分类列表
  paginationChange = (page, pageSize) => {
    // 更新当前页面
    this.setState({currentPage: page})
    this.getPage(page)
  }

  // 打开新建分类填写对话框
  showNewCategoryModal = () => { this.setState({newCategoryModalVisible: true})  }
  // 关闭新建分类填写对话框
  hideNewCategoryModal = () => {
    this.setState({newCategoryModalVisible: false})
    // 刷新页面
    this.getPage(this.state.currentPage)
  }
  // 打开编辑分类填写对话框
  showEditCategoryModal = (item) => {
    // console.log(item)
    this.setState({editCategoryModalVisible: true})
    this.selectedCategory = item
    this.getPage(this.state.currentPage)
  }
  // 关闭编辑分类填写对话框
  hideEditCategoryModal = () => {
    this.setState({editCategoryModalVisible: false})
    // 刷新页面
    this.getPage(this.state.currentPage)
  }

  render() {
    const { initLoading, loading, list, total, pageSize } = this.state;
    return (
        <>
          <List
            style={{ margin: '-25px 0px' }}
            loading={initLoading}  // loading时的占位符
            size="large"  // 高度增加
            itemLayout="horizontal"  // 竖直展示
            header={  // 头部显示
              <Button 
                style={{
                  position: 'fixed',
                  marginTop: '-75px',
                  marginLeft: '-25px',
                  height: '63px',
                  zIndex: 10,
                }} 
                type="primary"
                onClick={this.showNewCategoryModal}
                >
                  新建分类
              </Button>
            }
            dataSource={list}  // 列表数据源
            renderItem={item => (  // 渲染dataSource的方法
              <div>
                <List.Item
                  actions={[
                    <Link onClick={() => this.showEditCategoryModal(item)}>编辑分类</Link>,
                    // 向路由组件传递params参数(携带参数)
                    // <Link onClick={() => this.openCategoryBlogList(item.id)}>浏览分类文章列表</Link>,
                    <Popconfirm
                      title="你确定要删除本分类吗，本分类下所有的博客的分类都会清空"
                      onConfirm={() => this.deleteCategory(item)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Link>删除分类</Link>
                    </Popconfirm>,
                    <div>创建时间：{item.createTime.replace("T", " ")}</div>]}
                >
                  <Skeleton loading={item.loading} active>
                    <List.Item.Meta
                      title={<Link onClick={() => this.openCategoryBlogList(item.id)}>{item.id + "." + item.content}</Link>}
                      description={item.blogCount + " [篇] 公开博文"}
                    />
                  </Skeleton>
                </List.Item>
                <hr color="#e4e4e4"/>
              </div>
            )}
            pagination={{  // 底部分页
              onChange: this.paginationChange,
              pageSize: pageSize,
              total: total,
              style: { marginTop: '50px', textAlign: 'center'}
              }}
          />
          <NewCategoryForm 
            newCategoryModalVisible={this.state.newCategoryModalVisible}  // 是否弹出对话框
            onCancel={this.hideNewCategoryModal}  // 对话框中点击取消的操作
            // description={this.state.blog!==null ? this.state.blog.description : ""}
          />
          <EditCategoryForm 
            editCategoryModalVisible={this.state.editCategoryModalVisible}  // 是否弹出对话框
            onCancel={this.hideEditCategoryModal}  // 对话框中点击取消的操作
            selectedCategory={this.selectedCategory!==null ? this.selectedCategory : ""}
          />
        </>
    );
  }
}
