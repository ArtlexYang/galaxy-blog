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
  -- FOREIGN KEY(uid) REFERENCES galaxy_user(id),
  -- FOREIGN KEY(cid) REFERENCES galaxy_classification(id),
  -- FOREIGN KEY(tid) REFERENCES galaxy_tag(id),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;