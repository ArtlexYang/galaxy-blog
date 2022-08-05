use galaxy;  -- 进入库

INSERT INTO `galaxy`.`galaxy_user`(`username`, `password`, `salt`, `status`, `nickname`, `avatar`)
VALUES ('artlex', '123456', '1', '127', 'ArtlexKylin', 'https://avatar.csdnimg.cn/5/A/6/1_weixin_42159233_1606490691.jpg');


INSERT INTO `galaxy`.`galaxy_category`(`user_id`, `content`, `blog_count`)
VALUES (1, '一级显示分类', 6);
INSERT INTO `galaxy`.`galaxy_category`(`user_id`, `content`, `level`, `pid`, `blog_count`)
VALUES (1, '二级显示分类', 2, 1, 1);
INSERT INTO `galaxy`.`galaxy_category`(`user_id`, `content`, `status`, `level`, `pid`, `blog_count`)
VALUES (1, '二级不显示分类', 0, 2, 1, 1);
INSERT INTO `galaxy`.`galaxy_category`(`user_id`, `content`, `status`, `blog_count`)
VALUES (1, '一级不显示分类', 0, 1);
INSERT INTO `galaxy`.`galaxy_category`(`user_id`, `content`, `status`)
VALUES (1, '空分类', 1);


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
INSERT INTO `galaxy`.`galaxy_tag`(`user_id`, `content`)
VALUES (1, '空标签111');

INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 'ArtlexKylin', '草稿测试文章标题', '草稿测试文章的markdown内容', '<p>草稿测试文章的html内容</p>', 0);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `nickname`, `title`, `content_markdown`, `content_html`, `status`, `click_count`, `like_count`, `collect_count`, `comment_count`)
VALUES (1, 'ArtlexKylin', '公开发布测试文章标题', '公开发布测试文章的markdown内容', '<p>公开发布测试文章的html内容</p>', 1, 1, 2, 3, 4);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 'ArtlexKylin', '公开发布测试文章标题', '公开发布测试文章的markdown内容', '<p>公开发布测试文章的html内容</p>', 1);

INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '一级显示分类', 'ArtlexKylin', '测试分类1文章的标题', '测试分类1文章的markdown内容', '<p>测试分类1文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 2, '二级显示分类', 'ArtlexKylin', '测试分类2文章的标题', '测试分类2文章的markdown内容', '<p>测试分类2文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 3, '二级不显示分类', 'ArtlexKylin', '测试分类3文章的标题', '测试分类3文章的markdown内容', '<p>测试分类3文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, '一级显示分类', 'ArtlexKylin', '测试标签1文章的标题', '测试标签1文章的markdown内容', '<p>测试标签1文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, '测试标签2', 'ArtlexKylin', '测试标签2文章的标题', '测试标签2文章的markdown内容', '<p>测试标签2文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, '测试标签3', 'ArtlexKylin', '测试标签3文章的标题', '测试标签3文章的markdown内容', '<p>测试标签3文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, '一级显示分类,测试标签3', 'ArtlexKylin', '测试标签1,3文章的标题', '测试标签1,3文章的markdown内容', '<p>测试标签1,3文章的html内容</p>', 1);

INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '一级显示分类', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题1', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '一级显示分类', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题2', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '一级显示分类', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题3', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '一级显示分类', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题4', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '一级显示分类', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题5', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);
INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `category_id`, `category_content`, `tag`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 1, '一级显示分类', '测试标签1', 'ArtlexKylin', '填充分类1标签1文章的标题6', '填充分类标签文章的markdown内容', '<p>填充分类标签文章的html内容</p>', 1);

INSERT INTO `galaxy`.`galaxy_blog`(`user_id`, `nickname`, `title`, `content_markdown`, `content_html`, `status`)
VALUES (1, 'ArtlexKylin', '测试开启打赏、关闭分享许可、关闭评论文章标题', '测试开启打赏、关闭分享许可、关闭评论文章的markdown内容', '<p>公测试开启打赏、关闭分享许可、关闭评论文章的html内容</p>', 1);