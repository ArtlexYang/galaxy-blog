import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';

// 引入样式组件
import { 
  Layout, 
  Menu, 
  Input 
} from 'antd';
import { 
  HomeOutlined,
  RadarChartOutlined,
  BarsOutlined,
  DeploymentUnitOutlined,
  ContactsOutlined,
} from '@ant-design/icons';

// 引入子组件
import Blog from "./Blog";
import BlogDetail from './Blog/BlogDetail'
import Galaxy from "./Galaxy";
import Category from "./Category";
import Tag from "./Tag";
import Record from "./Record";
import About from "./About";
// 使用类类读取样式，防止不同组件的重名样式冲突
import styles from './index.module.css';
// 引入图片
import imgURL from '../../img/favicon.ico';

/**
 * 本组件用于游客展示（固定导航头、子组件路由跳转）
 */
const {Header, Content, Footer} = Layout;
const {Search} = Input;
export default class Home extends Component {
  onMenuClick = () => {
    return console.log("1")
  }

  onSearchClick = () => {
    return () => {
      console.log("2")
    }
  }

  render() {
    return (
      <Layout >
        <Header
          style={{
            position: 'fixed',
            zIndex: 1,
            width: '100%',
            minWidth: 604,
          }}
        >
          <img
            src={imgURL}
            style={{
              marginLeft: '-20px',
              height: '39px',
              width: '39px',
            }}
            alt="ArtlexKylin"
          />

          <div style={{ marginTop: '-64px', marginLeft: '30px' }}>
            <font color="#fff">Galaxy Blog</font>
          </div>

          <Menu
            onClick={this.onMenuClick}
            style={{ marginTop: '-64px', marginLeft: '140px' }}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={
              sessionStorage.getItem('homeMenuKey')===null
              ? '1'
              : sessionStorage.getItem('homeMenuKey')
            }
          >
            <Menu.Item
              key="1"
              style={{
                borderLeft: '1px solid rgb(66, 66, 66) !important',
              }}
            >
              <Link to="/home/blog"><HomeOutlined />
                首页
              </Link>
            </Menu.Item>

            {/* <Menu.Item
              key="2"
              style={{
                borderLeft: '1px solid rgb(66, 66, 66) !important',
              }}
            >
              <Link to="/home/galaxy"><RadarChartOutlined />
                星图
              </Link>
            </Menu.Item> */}

            <Menu.Item
              key="3"
              style={{
                borderLeft: '1px solid rgb(66, 66, 66) !important',
              }}
            >
              <Link to="/home/category"><BarsOutlined />
                类型
              </Link>
            </Menu.Item>

            <Menu.Item
              key="4"
              style={{
                borderLeft: '1px solid rgb(66, 66, 66) !important',
              }}
            >
              <Link to="/home/tag"><DeploymentUnitOutlined />
                标签
              </Link>
            </Menu.Item>

            <Menu.Item
              key="5"
              style={{
                borderLeft: '1px solid rgb(66, 66, 66) !important',
                borderRight: '1px solid rgb(66, 66, 66) !important',
              }}
            >
              <Link to="/home/record"><ContactsOutlined />
                归档
              </Link>
            </Menu.Item>

            {/* <Menu.Item
              key="6"
              style={{
                borderLeft: '1px solid rgb(66, 66, 66) !important',
                borderRight: '1px solid rgb(66, 66, 66) !important',
              }}
            >
              <Link to="/home/about"><ContactsOutlined />
                关于
              </Link>
            </Menu.Item> */}
          </Menu>

          {/* <Search
            onClick={this.onSearchClick} 
            style={{
              position: 'absolute',
              padding: 0,
              border: 0,
              marginTop: '-48px',
              left: '1560px',
              width: '300px',
            }}
            placeholder="输入关键词查找博客"
            allowClear
          /> */}
        </Header>

        <Content
          style={{
            margin:'64px auto',
            // backgroundColor: 'white',
            minHeight: '1000px',
            width: '90%',
          }}
        >
          <Switch>
            {/* 注册路由 */}
            {/* 声明接收params参数(声明接收) */}
            <Route exact path="/home/blog/:blogId" component={BlogDetail}/>
            <Route path="/home/blog" component={Blog}/>
            {/* <Route path="/home/galaxy" component={Galaxy}/> */}
            <Route path="/home/category" component={Category}/>
            <Route path="/home/tag" component={Tag}/>
            <Route path="/home/record" component={Record}/>
            {/* <Route path="/home/about" component={About}/> */}
            {/* 所有路由均不匹配，去到博客主页 */}
            <Redirect to="/home/blog"/>
          </Switch>
        </Content>

        <Footer style={{ textAlign: 'center' }}>Created by ArtlexKylin</Footer>
      </Layout>
    );
  }
}