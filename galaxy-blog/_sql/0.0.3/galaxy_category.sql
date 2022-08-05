use galaxy;  -- 进入库
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