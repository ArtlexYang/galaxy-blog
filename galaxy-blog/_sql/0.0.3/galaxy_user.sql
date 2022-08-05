use galaxy;  -- 进入库
DROP TABLE IF EXISTS galaxy_user;  -- 先删除，再建

/*建galaxy_user表*/
CREATE TABLE `galaxy_user`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(255) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `salt` varchar(64) NOT NULL COMMENT '密码盐值',
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '账号状态',

  `nickname` varchar(255) NOT NULL DEFAULT "" COMMENT '昵称',
  `avatar` varchar(1010) NOT NULL DEFAULT "" COMMENT '头像路径',
  `email` varchar(255) NOT NULL DEFAULT "" COMMENT '邮箱',
  `welcoming_speech` varchar(1010) NOT NULL DEFAULT "欢迎" COMMENT '登录欢迎词',
  `blog_count` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '博客数量',
  `comment_count` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '评论数量',

  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '账号状态更新时间',
  `last_login` datetime NOT NULL  DEFAULT CURRENT_TIMESTAMP COMMENT '最后登录时间',
  `limit_time` datetime NULL DEFAULT NULL COMMENT '限制登录时间',

  PRIMARY KEY(`id`),
  INDEX(`id`),
  UNIQUE KEY `username` (`username`) USING BTREE,
  UNIQUE KEY `email` (`email`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT '用户表';