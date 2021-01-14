# Project Structure Description 项目结构说明（开发顺序）
1. 项目配置相关<br>
1.1. /pom.xml (maven配置文件)<br>

2. 数据库相关<br>
2.1. src/main/resources/application.yml (数据库配置文件)<br>
2.2. src/main/java/pers/artlex/config/MybatisPlusConfig.java (MyBatis-Plus配置文件)<br>
2.3. src/main/java/pers/artlex/util/CodeGenerator.java (MyBatis-Plus代码生成代码)<br>
2.4. src/main/java/pers/artlex/entity (自动生成 DO 数据对象)<br>
2.4. src/main/java/pers/artlex/mapper (自动生成 DAO 数据持久层)<br>
2.4. src/main/java/pers/artlex/service (自动生成 Service 业务逻辑层)<br>
2.4. src/main/java/pers/artlex/controller (自动生成 View 请求处理层)<br>
2.4. src/main/resources/mapper (自动生成 自定义查询xml文件)<br>
3. 安全验证相关<br>
3.1. src/main/java/pers/artlex/config/ShiroConfig.java (Shiro配置文件)<br>
3.2. src/main/resources/META-INF/spring-devtools.properties (根据官网说明配置)<br>
3.3. src/main/java/pers/artlex/shiro/AccountProfile.java (账户扼要描述类：保存一些信息)<br>
3.4. src/main/java/pers/artlex/shiro/AccountRealm.java (账户域类：用于授权和登录)<br>
3.5. src/main/java/pers/artlex/shiro/JwtFilter.java (JWT过滤器，获取JWT、错误处理 ； 4.2. 跨域处理)<br>
3.6. src/main/java/pers/artlex/shiro/JwtToken.java (JWT包装类)<br>
3.7. src/main/java/pers/artlex/util/JwtUtil.java (JWT工具包：JWT生成、JWT错误/过期验证)<br>
4. 其他功能相关<br>
4.1. src/main/java/pers/artlex/entity (实体验证)<br>
4.2. src/main/java/pers/artlex/shiro/JwtFilter.java (过滤器跨域处理)<br>
4.3. src/main/java/pers/artlex/config/CorsConfig.java (服务器跨域处理配置)<br>
4.4. src/main/java/pers/artlex/common/dto/LoginDto.java (登录DTO数据传输对象)<br>
4.5. src/main/java/pers/artlex/controller/AccountController.java (写账户相关接口)<br>
4.6. src/main/java/pers/artlex/controller/GalaxyBlogController.java (写博客相关接口)<br>