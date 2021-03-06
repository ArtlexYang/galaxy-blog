import React, { Component } from 'react';
import { Link, Route, Redirect } from'react-router-dom';

import { Layout, Menu } from 'antd';
import {
  PieChartOutlined,
  FileOutlined,
  BarsOutlined,
  UserOutlined,
} from '@ant-design/icons';

// 引入图片
import imgURL from '../../img/favicon.ico';
import Data from './Data';
import Blog from './Blog';
import Classification from './Classification';
import User from './User';

/**
 * 本组件用于后台管理（固定栏、子组件路由）
 */
const { Header, Content, Footer, Sider } = Layout;
export default class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = { collapsed: false, marginLeftPx: '225px' };
  }
  
  /* 侧边栏收起出发的函数 */
  onCollapse = collapsed => {
    this.setState({ collapsed, marginLeftPx: (this.state.marginLeftPx==='225px' ? '105px' : '225px') });
  };

  render() {
    const { collapsed, marginLeftPx } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        {/* 侧边栏：可收起的，是否收起看状态里的collapsed，点击收起按钮调用onCollapse函数 */}
        <Sider 
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse} 
          style={{ 
            position: 'fixed',
            overflow: 'auto',
            zIndex: 10,
            left: 0,
            height: '100vh',
          }}
        >
          <img
            style={{
              margin: '10px 20px',
              height: '39px',
              width: '39px',
            }} 
            src={ imgURL }
            alt="ArtlexKylin"
          />
          <div 
            style={{
              position: 'absolute',
              margin: '-40px 90px',
              width: '73px',
            }}
          >
            <font color="#fff">Galaxy Blog</font>
          </div>

          <Menu theme="dark" defaultSelectedKeys={['2']} mode="inline">

            <Menu.Item key="1" icon={<PieChartOutlined />}>
              <Link to="/admin/data">
                数据统计
              </Link>
            </Menu.Item>

            <Menu.Item key="2" icon={<FileOutlined />}>
              <Link to="/admin/blog">
                博客管理
              </Link>
            </Menu.Item>

            <Menu.Item key="3" icon={<BarsOutlined />}>
              <Link to="/admin/classification">
                分类管理
              </Link>
            </Menu.Item>

            <Menu.Item key="4" icon={<UserOutlined />}>
              <Link to="/admin/user">
                用户管理
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        
        <Layout style={{ minWidth: '1200px' }}>
          <Header
            style={{
              position: 'fixed',
              zIndex: 9,
              padding: 0,
              height: '63px',
              width: '100%',
              backgroundColor: 'white',
            }}
          ></Header>

          <Content
            style={{
              marginTop: '88px', 
              marginLeft: marginLeftPx, 
              marginRight: '25px', 
            }}
          >
            {/* 注册路由 */}
            <Route path="/admin/data" component={Data}/>
            <Route path="/admin/blog" component={Blog}/>
            <Route path="/admin/classification" component={Classification}/>
            <Route path="/admin/user" component={User}/>
            {/* 所有路由均不匹配 */}
            <Redirect to="/admin/blog"/>
            
            {/* 在文本中居中，美观些 */}
            <Footer style={{ marginTop: '50px', textAlign: 'center', }}>Created by ArtlexKylin</Footer>
          </Content>

          
        </Layout>
      </Layout>
    );
  }
}