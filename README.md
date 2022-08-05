## 介绍
1. 大学本科阶段毕业设计
2. 我的第一个完整项目
3. 本项目包含完整的中文注释
4. 该项目将在重构后作为博客组件（待定）
<br>

## 运行
1. MySQL服务：<br>
①打开MySQL数据库（版本MySQL-8.0.20或以上）<br>
②数据库名为galaxy，MySQL用户名为“root”，密码为“root@123”<br>
③运行“galaxy-blog/_sql/0.0.3/allreset.sql”文件<br>
④启动MySQL监听<br>
<br>
2. Redis服务：<br>
①启动Redis（版本Redis-5.0.10或以上）<br>
<br>
3. 后端服务：galaxy-blog<br>
①在Intellij IDEA中打开“galaxy-blog”文件夹<br>
②配置Java版本为JDK-11.0.10（或以上）<br>
③pom.xml右键下载Maven依赖<br>
④选择galaxy-blog/src/main/java/pers/artlex/GalaxyApplication.java作为启动类并启动<br>
<br>
4. 前端服务：galaxy-blog-react<br>
①在VScode中打开“galaxy-blog-react”<br>
②安装依赖（需要电脑中已经安装Node.js）<br>
③打开此路径下的命令行输入“yarn start”启动<br>

## 技术栈
<table>
    <thead>
        <tr>
            <th>technology 技术</th>
            <th>explain 解释</th>
            <th>version 版本</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>SpringBoot</td>
            <td>容器，MVC框架</td>
            <td>2.3.4</td>
        </tr>
        <tr>
            <td>MyBatis-Plus</td>
            <td>ORM框架</td>
            <td>3.3.2</td>
        </tr>
        <tr>
            <td>Shiro-Redis</td>
            <td>安全认证融合框架</td>
            <td>3.2.1</td>
        </tr>
    </tbody>
</table>
<br>

## 文件夹含义（子项目含义）
- galaxy-blog 博客模块
- galaxy-blog-react 博客前端模块
<br>

## 版本更新记录
- V0.1.0 2020.12.15 实现博客后端基础功能
- V0.2.0 2020.01.12 使用Vue实现博客前端基础功能
- V0.3.0 2020.02.28 前端彻底重构重写，将前端从Vue迁移到React
<br>

## 感谢
Markdown Editer Markdown编辑器： <br>
- Default Editer 默认编辑器： https://github.com/nhn/tui.editor <br>
- Mathematical Editer 数学编辑器（未使用）： https://github.com/pandao/editor.md <br>
<br>

Learning Project 学习参考的项目与课程： <br>
- V0.1.0-0.2.0 参考博客骨架：https://juejin.cn/post/6844903823966732302
- V0.3.0 React学习教程：https://www.bilibili.com/video/BV1wy4y1D7JT