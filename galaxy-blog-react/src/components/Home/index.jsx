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
  ContactsOutlined 
} from '@ant-design/icons';

// 引入子组件
import Blog from "./Blog";
import BlogDetail from './Blog/BlogDetail'
import Galaxy from "./Galaxy";
import Classification from "./Classification";
import Label from "./Label";
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
        <Header className={styles.header} style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <img className={styles.logo} src={imgURL} alt="ArtlexKylin"/>
          <div className={styles.text}>
            <font color="#fff">Galaxy Blog</font>
          </div>

          <Menu className={styles.menu} onClick={this.onMenuClick}
                theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" className={styles.menuNodeLeftLine}>
              <Link to="/home/blog"><HomeOutlined />
                首页
              </Link>
            </Menu.Item>
            <Menu.Item key="2" className={styles.menuNodeLeftLine}>
              <Link to="/home/galaxy"><RadarChartOutlined />
                星图
                </Link>
            </Menu.Item>
            <Menu.Item key="3" className={styles.menuNodeLeftLine}>
              <Link to="/home/classification"><BarsOutlined />
                类型
              </Link>
            </Menu.Item>
            <Menu.Item key="4" className={styles.menuNodeLeftLine}>
              <Link to="/home/label"><DeploymentUnitOutlined />
                标签
              </Link>
            </Menu.Item>
            <Menu.Item key="5" className={styles.menuNodeLeftRightLine}>
              <Link to="/home/about"><ContactsOutlined />
                关于
              </Link>
            </Menu.Item>
          </Menu>

          <Search className={styles.search} onClick={this.onSearchClick}
                      placeholder="输入关键词查找博客" allowClear/>
        </Header>

        <Content style={{margin:'64px auto', backgroundColor: 'white', minHeight: 'auto', width: '70%'}}>
          <Switch>
            {/* 注册路由 */}
            {/* 声明接收params参数(声明接收) */}
            <Route exact path="/home/blog/:blogId" component={BlogDetail}/>
            <Route path="/home/blog" component={Blog}/>
            <Route path="/home/galaxy" component={Galaxy}/>
            <Route path="/home/classification" component={Classification}/>
            <Route path="/home/label" component={Label}/>
            <Route path="/home/about" component={About}/>
            {/* 所有路由均不匹配，去到博客主页 */}
            <Redirect to="/home/blog"/>
          </Switch>
        </Content>

        <Footer style={{textAlign: 'center'}}>Created by ArtlexKylin</Footer>
      </Layout>
    );
  }
}