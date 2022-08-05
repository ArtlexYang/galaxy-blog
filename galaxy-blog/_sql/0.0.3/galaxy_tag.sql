use galaxy;  -- 进入库
DROP TABLE IF EXISTS galaxy_tag;  -- 先删除，再建

/*建galaxy_label表*/
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
  INDEX(`content`)
  -- UNIQUE KEY (`user_id`, `blog_id`, `content`)
  -- CONSTRAINT fk_galaxy_blog FOREIGN KEY(`blog_id`) REFERENCES galaxy_blog(`id`)  -- 外键
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;