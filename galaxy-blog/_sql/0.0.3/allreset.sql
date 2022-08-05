use galaxy;  -- 进入库
DROP TABLE IF EXISTS galaxy_blog;  -- 先删除，再建

/*建galaxy_blog表*/
CREATE TABLE `galaxy_blog`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '博客id',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '博客归属的用户id',
  `category_id` bigint(20) unsigned NOT NULL DEFAULT 0 COMMENT '博客归属的分类id',
  `category_content` varchar(255) NOT NULL DEFAULT "" COMMENT '博客归属的分类名',
  `tag` varchar(1010) NOT NULL DEFAULT "[]" COMMENT '博客归属的标签id',

  `nickname` varchar(255) NOT NULL COMMENT '作者名称',
  `title` varchar(255) NOT NULL COMMENT '博客标题',
  `description` varchar(1010) NOT NULL DEFAULT "" COMMENT '博客摘要',
  `catalog` varchar(1010) NOT NULL DEFAULT "" COMMENT '博客目录',
  `content_markdown` longtext NULL DEFAULT NULL COMMENT 'markdown版博客内容',
  `content_html` longtext NULL DEFAULT NULL COMMENT 'html版博客内容',
  
  `status` tinyint(4) unsigned NOT NULL DEFAULT 0 COMMENT '博客状态 0草稿 1私有 2公开',
  `flag` tinyint(4) unsigned NOT NULL DEFAULT 0 COMMENT '博客属性 0原创 1转载 2翻译',
  `top` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '置顶等级 0最小',
  `sort` bigint(20) unsigned NOT NULL DEFAULT 0 COMMENT '博客顺序',

  `is_appreciation` tinyint(4) unsigned NOT NULL DEFAULT 0 COMMENT '是否开启打赏 0关 1开',
  `is_license` tinyint(4) unsigned NOT NULL DEFAULT 1 COMMENT '是否开启分享许可 0关 1开',
  `is_comment` tinyint(4) unsigned NOT NULL DEFAULT 1 COMMENT '是否开启评论 0关 1开',
  `click_count` bigint(20) unsigned NOT NULL DEFAULT 0 COMMENT '博客点击量',
  `like_count` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '博客点赞量',
  `collect_count` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '博客收藏量',
  `comment_count` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '博客评论量',

  `last_comment_time` datetime NULL DEFAULT NULL COMMENT '最新评论时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  PRIMARY KEY(`id`),
  INDEX(`id`)
  -- UNIQUE KEY (`user_id`, `title`, `content_markdown`, `update_time`)
  -- FOREIGN KEY(uid) REFERENCES galaxy_user(id),
  -- FOREIGN KEY(cid) REFERENCES galaxy_classification(id),
  -- FOREIGN KEY(tid) REFERENCES galaxy_tag(id),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS galaxy_category;  -- 先删除，再建

/*建galaxy_category表*/
CREATE TABLE `galaxy_category`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '所属用户id',
  `content` varchar(255) NOT NULL COMMENT '分类名',
  `description` varchar(1010) NOT NULL DEFAULT "" COMMENT '分类描述',
  `status` tinyint(4) unsigned NOT NULL DEFAULT 1 COMMENT '分类状态 0不显示 1显示',
  `level` tinyint(4) unsigned NOT NULL DEFAULT 1 COMMENT '分类等级 1为一级',
  `pid` bigint(20) unsigned NOT NULL DEFAULT 0 COMMENT '上级分类的id',
  `blog_count` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '博客数量',
  `sort` bigint(20) unsigned NOT NULL DEFAULT 0 COMMENT '分类顺序',

  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  PRIMARY KEY(`id`),
  INDEX(`id`),
  UNIQUE KEY (`user_id`, `content`)
  -- CONSTRAINT fk_galaxy_blog FOREIGN KEY(`blog_id`) REFERENCES galaxy_blog(`id`)  -- 外键
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS galaxy_tag;  -- 先删除，再建

/*建galaxy_tag表*/
CREATE TABLE `galaxy_tag`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '标签id',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '用户id',
  `blog_id` bigint(20) unsigned NULL DEFAULT NULL COMMENT '博文id',

  `content` varchar(255) NOT NULL COMMENT '标签名',
  `description` varchar(1010) NOT NULL DEFAULT "" COMMENT '标签描述',
  `status` tinyint(4) unsigned NOT NULL DEFAULT 1 COMMENT '标签状态 0不显示 1显示',
  `sort` bigint(20) unsigned NOT NULL DEFAULT 0 COMMENT '标签顺序',

  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY(`id`),
  INDEX(`id`),
  INDEX(`content`),
  -- UNIQUE KEY (`user_id`, `blog_id`, `content`)
  -- CONSTRAINT fk_galaxy_blog FOREIGN KEY(`blog_id`) REFERENCES galaxy_blog(`id`)  -- 外键
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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


INSERT INTO `galaxy`.`galaxy_user`(`username`, `password`, `salt`, `status`, `nickname`, `avatar`)
VALUES ('artlex', '123456', '1', '127', 'ArtlexKylin', 'https://avatar.csdnimg.cn/5/A/6/1_weixin_42159233_1606490691.jpg');


INSERT INTO `galaxy`.`galaxy_category`(`user_id`, `content`)
VALUES (1, '一级显示分类');
INSERT INTO `galaxy`.`galaxy_category`(`user_id`, `content`, `level`, `pid`)
VALUES (1, '二级显示分类', 2, 1);
INSERT INTO `galaxy`.`galaxy_category`(`user_id`, `content`, `status`, `level`, `pid`)
VALUES (1, '二级不显示分类', 0, 2, 1);
INSERT INTO `galaxy`.`galaxy_category`(`user_id`, `content`, `status`)
VALUES (1, '一级不显示分类', 0);


INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `content`)
VALUES (1, '显示标签1');
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `content`, `status`)
VALUES (1, '不显示标签1', 0);
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `content`)
VALUES (1, '显示标签2');
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `blog_id`, `content`)
VALUES (1, 3, '显示标签1');
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `blog_id`, `content`, `status`)
VALUES (1, 3,  '不显示标签1', 0);
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `blog_id`, `content`)
VALUES (1, 3,  '显示标签2');
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `blog_id`, `content`)
VALUES (1, 4,  '显示标签2');

INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `content`)
VALUES (1, '显示标签3333');
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `content`, `status`)
VALUES (1, '不显示标签44444', 0);
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `content`)
VALUES (1, '显示标签5');
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `content`)
VALUES (1, '显示标签666666666666');
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `blog_id`, `content`)
VALUES (1, 4, '显示标签3333');
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `blog_id`, `content`, `status`)
VALUES (1, 5,  '不显示标签44444', 0);
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `blog_id`, `content`)
VALUES (1, 6,  '显示标签5');
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `blog_id`, `content`)
VALUES (1, 7,  '显示标签666666666666');

INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 'ArtlexKylin', '草稿测试文章标题', '草稿测试文章的markdown内容', '<p>草稿测试文章的html内容</p>', 0);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `nickname`, `title`, `content_markdown`, `content_html`, `status`, `click_count`, `like_count`, `collect_count`, `comment_count`)
VALUES (1, 'ArtlexKylin', '公开发布测试文章标题', '公开发布测试文章的markdown内容', '<p>公开发布测试文章的html内容</p>', 1, 1, 2, 3, 4);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 'ArtlexKylin', '公开发布测试文章标题', '公开发布测试文章的markdown内容', '<p>公开发布测试文章的html内容</p>', 1);

INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '测试分类1', 'ArtlexKylin', '测试分类1文章的标题', '测试分类1文章的markdown内容', '<p>测试分类1文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 2, '测试分类2', 'ArtlexKylin', '测试分类2文章的标题', '测试分类2文章的markdown内容', '<p>测试分类2文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 3, '测试分类3', 'ArtlexKylin', '测试分类3文章的标题', '测试分类3文章的markdown内容', '<p>测试分类3文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, '测试标签1', 'ArtlexKylin', '测试标签1文章的标题', '测试标签1文章的markdown内容', '<p>测试标签1文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, '测试标签2', 'ArtlexKylin', '测试标签2文章的标题', '测试标签2文章的markdown内容', '<p>测试标签2文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, '测试标签3', 'ArtlexKylin', '测试标签3文章的标题', '测试标签3文章的markdown内容', '<p>测试标签3文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, '测试标签1,测试标签3', 'ArtlexKylin', '测试标签1,3文章的标题', '测试标签1,3文章的markdown内容', '<p>测试标签1,3文章的html内容</p>', 1);

INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '测试分类1', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题1', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '测试分类1', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题2', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '测试分类1', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题3', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '测试分类1', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题4', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '测试分类1', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题5', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '测试分类1', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题6', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);

INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 'ArtlexKylin', '测试开启打赏、关闭分享许可、关闭评论文章标题', '测试开启打赏、关闭分享许可、关闭评论文章的markdown内容', '<p>公测试开启打赏、关闭分享许可、关闭评论文章的html内容</p>', 1);