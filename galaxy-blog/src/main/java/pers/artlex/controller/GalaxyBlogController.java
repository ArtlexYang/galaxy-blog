package pers.artlex.controller;


import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pers.artlex.common.lang.ResponseResult;
import pers.artlex.entity.GalaxyBlog;
import pers.artlex.entity.GalaxyCategory;
import pers.artlex.entity.GalaxyTag;
import pers.artlex.service.GalaxyBlogService;
import pers.artlex.service.GalaxyCategoryService;
import pers.artlex.service.GalaxyTagService;
import pers.artlex.util.ShiroUtil;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 前端控制器
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@RestController
public class GalaxyBlogController {

    @Autowired
    GalaxyBlogService galaxyBlogService;
    @Autowired
    GalaxyCategoryService galaxyCategoryService;
    @Autowired
    GalaxyTagService galaxyTagService;

    private static enum USER {
        BLOGGER("普通博主", 1),
        ADMINISTRATOR("超级管理员", 127);

        private String name;
        private Integer status;

        USER(String name, Integer status) {
            this.name = name;
            this.status = status;
        }
    }

    private static enum BLOGSTATUS {
        DRAFT("未发布草稿", 0),
        PUBLIC("公开发布", 1);

        private String name;
        private Integer status;

        BLOGSTATUS(String name, Integer status) {
            this.name = name;
            this.status = status;
        }
    }

    /**
     * 显示所有发布的博客列表（默认每页10篇）
     *
     * @param currentPage: 当前用户选择的页面
     * @param blogCount:   当前页面显示的博客数
     * @param isAdmin:     是否是管理模式
     * @return
     */
    @GetMapping("/blogList")
    public ResponseResult getBlogList(@RequestParam(defaultValue = "1") Integer currentPage,
                                      @RequestParam(defaultValue = "10") Integer blogCount,
                                      @RequestParam(defaultValue = "false") Boolean isAdmin) {
        // 设置每页显示的博客数
        Page page = new Page(currentPage, blogCount);
        IPage pageData;
        if (isAdmin) {
//            System.out.println(ShiroUtil.getProfile().getStatus());
            // 只能编辑自己的文章（超级管理员可以看到并编辑所有的文章，不管是什么状态的）
            if (ShiroUtil.getProfile().getStatus().intValue() == USER.ADMINISTRATOR.status.intValue()) {
                // 根据创建时间显示
                pageData = galaxyBlogService.page(page, new QueryWrapper<GalaxyBlog>().orderByDesc("create_time"));
            } else {
                // 只显示该用户自己的博客
                pageData = galaxyBlogService.page(page, new QueryWrapper<GalaxyBlog>().eq("user_id", ShiroUtil.getProfile().getId().longValue()).orderByDesc("create_time"));
            }
        } else {
            // 根据创建时间显示（公开发布的才能显示）
            pageData = galaxyBlogService.page(page, new QueryWrapper<GalaxyBlog>().eq("status", BLOGSTATUS.PUBLIC.status.intValue()).orderByDesc("create_time"));
        }
        return ResponseResult.success(pageData);
    }

    /**
     * 显示分类下公开发布的博客列表（每页10篇）
     *
     * @param currentPage: 当前用户选择的页面
     * @param blogCount:   当前页面显示的博客数
     * @param isAdmin:     是否是管理模式
     * @return
     */
    @GetMapping("/blogList/category/{categoryId}")
    public ResponseResult getCategoryBlogList(@PathVariable(name = "categoryId") Long categoryId,
                                              @RequestParam(defaultValue = "1") Integer currentPage,
                                              @RequestParam(defaultValue = "10") Integer blogCount,
                                              @RequestParam(defaultValue = "false") Boolean isAdmin) {
        // 设置每页显示的博客数
        Page page = new Page(currentPage, blogCount);
        IPage pageData;
        if (isAdmin) {
//            System.out.println(ShiroUtil.getProfile().getStatus());
            // 只能编辑自己的文章（超级管理员可以看到并编辑所有的文章，不管是什么状态的）
            if (ShiroUtil.getProfile().getStatus().intValue() == USER.ADMINISTRATOR.status.intValue()) {
                // 根据创建时间显示
                pageData = galaxyBlogService.page(page, new QueryWrapper<GalaxyBlog>().eq("category_id", categoryId).orderByDesc("create_time"));
            } else {
                // 只显示该用户自己的博客
                pageData = galaxyBlogService.page(page, new QueryWrapper<GalaxyBlog>().eq("category_id", categoryId).eq("user_id", ShiroUtil.getProfile().getId().longValue()).orderByDesc("create_time"));
            }
        } else {
            // 根据创建时间显示（公开发布的才能显示）
            pageData = galaxyBlogService.page(page, new QueryWrapper<GalaxyBlog>().eq("category_id", categoryId).eq("status", BLOGSTATUS.PUBLIC.status.intValue()).orderByDesc("create_time"));
        }
        return ResponseResult.success(pageData);
    }

    /**
     * 显示标签下公开发布的博客列表（每页10篇）
     *
     * @param currentPage: 当前用户选择的页面
     * @param blogCount:   当前页面显示的博客数
     * @param isAdmin:     是否是管理模式
     * @return
     */
    @GetMapping("/blogList/tag/{tagContent}")
    public ResponseResult getTagBlogList(@PathVariable(name = "tagContent") String tagContent,
                                         @RequestParam(defaultValue = "1") Integer currentPage,
                                         @RequestParam(defaultValue = "10") Integer blogCount,
                                         @RequestParam(defaultValue = "false") Boolean isAdmin) {
        // 设置每页显示的博客数
        Page page = new Page(currentPage, blogCount);
        IPage pageData;
        if (isAdmin) {
//            System.out.println(ShiroUtil.getProfile().getStatus());
            // 只能编辑自己的文章（超级管理员可以看到并编辑所有的文章，不管是什么状态的）
            if (ShiroUtil.getProfile().getStatus().intValue() == USER.ADMINISTRATOR.status.intValue()) {
                pageData = galaxyBlogService.getTagBlogListPublicPage(tagContent, page);
            } else {
                // 只显示该用户自己的博客
                pageData = galaxyBlogService.getTagBlogListMyselPage(tagContent, ShiroUtil.getProfile().getId().longValue(), page);
            }
        } else {
            // 根据创建时间显示（公开发布的才能显示）
            pageData = galaxyBlogService.getTagBlogListPublicPage(tagContent, page);
        }
        return ResponseResult.success(pageData);
    }

    /**
     * 根据月份统计公开发布的博客的数量
     *
     * @return
     */
    @GetMapping("/blogList/time")
    public ResponseResult getBlog2TimeListPublic() {
        List<Map<String, String>> blogTimeList = this.galaxyBlogService.statisticsBlogTimeListPublic();
        return ResponseResult.success(JSONUtil.toJsonStr(blogTimeList));
    }

    /**
     * 根据月份统计公开发布的博客的数量
     *
     * @return
     */
    @GetMapping("/blogList/time/{time}")
    public ResponseResult getTime2BlogListPublic(@PathVariable(name = "time") String time) {
        List<Map<String, String>> blogTimeList = this.galaxyBlogService.getTimeBlogListPublic(time);
        return ResponseResult.success(JSONUtil.toJsonStr(blogTimeList));
    }

    /**
     * 博客具体内容
     *
     * @param id
     * @return
     */
    @GetMapping("/blog/{id}")
    public ResponseResult detail(@PathVariable(name = "id") Long id) {
        // 查找指定的博客
        GalaxyBlog blog = galaxyBlogService.getById(id);
        Assert.notNull(blog, "博客不存在");
        // 增加点击量
        blog.setClickCount(blog.getClickCount() + 1);
        galaxyBlogService.updateById(blog);
        return ResponseResult.success(blog);
    }

    /**
     * 编辑/新建博客
     *
     * @param galaxyBlog
     * @return
     */
    @RequiresAuthentication
    @PostMapping("/blog/edit")
    public ResponseResult edit(@Validated @RequestBody GalaxyBlog galaxyBlog) {
//        System.out.println(galaxyBlog);
        GalaxyBlog temp = null;

        if (galaxyBlog.getStatus()==null) {
            galaxyBlog.setStatus(0);
        }

        // 博客分类相关
        // 处理分类
        // 判断分类是否变化
        GalaxyCategory galaxyCategory =
                galaxyCategoryService.getOne(
                        new QueryWrapper<GalaxyCategory>()
                                .eq("user_id", galaxyBlog.getUserId())
                                .eq("id", galaxyBlog.getCategoryId())
                                .eq("content", galaxyBlog.getCategoryContent()));
        // 该博客之前是否有分类（没有分类为null）
        // 搜索为null说明修改了分类，没有修改就不用对分类进行同步
        if (galaxyCategory == null
                && (
                        (galaxyBlog.getCategoryId()!=null && !equals(galaxyBlog.getCategoryId()))
                        ||
                        (galaxyBlog.getCategoryContent()!=null && !equals(galaxyBlog.getCategoryContent())))) {
            // 修改了就找到修改前的分类对象
            galaxyCategory =
                    galaxyCategoryService.getOne(
                            new QueryWrapper<GalaxyCategory>()
                                    .eq("user_id", galaxyBlog.getUserId())
                                    .eq("id", galaxyBlog.getCategoryId())
                    );
            // 分类对象不为空且是发布文章，分类对象中的blogCount要-1
            if (galaxyCategory != null && galaxyBlog.getStatus() == 1) {
                galaxyCategory.setBlogCount(galaxyCategory.getBlogCount() - 1);
                galaxyCategoryService.updateById(galaxyCategory);
            }

            // 新分类不是是null/""的话
            if (galaxyBlog.getCategoryContent() != null && galaxyBlog.getCategoryContent() != "") {
                // 找到修改后的分类对象
                galaxyCategory =
                        galaxyCategoryService.getOne(
                                new QueryWrapper<GalaxyCategory>()
                                        .eq("user_id", galaxyBlog.getUserId())
                                        .eq("content", galaxyBlog.getCategoryContent())
                        );
                // 如果新分类已经存在了
                if (galaxyCategory != null) {
                    // 发布文章才+1
                    if (galaxyBlog.getStatus() == 1) {
                        galaxyCategory.setBlogCount(galaxyCategory.getBlogCount() + 1);
                        galaxyCategoryService.updateById(galaxyCategory);
                    }
                    // 更新galaxyBlog的categoryId
                    galaxyBlog.setCategoryId(galaxyCategory.getId());
                } else {
                    galaxyCategory = new GalaxyCategory();
                    galaxyCategory.setUserId(galaxyBlog.getUserId());
                    galaxyCategory.setContent(galaxyBlog.getCategoryContent());
                    galaxyCategory.setStatus(1);
                    // 发布文章才设为1，不然就用默认的0
                    if (galaxyBlog.getStatus() == 1) {
                        // 只有这一篇博客
                        galaxyCategory.setBlogCount(1L);
                    }
                    galaxyCategoryService.save(galaxyCategory);
                    // 获取新分类的id并赋值给galaxyBlog的categoryId
                    galaxyCategory =
                            galaxyCategoryService.getOne(
                                    new QueryWrapper<GalaxyCategory>()
                                            .eq("user_id", galaxyCategory.getUserId())
                                            .eq("content", galaxyCategory.getContent())
                            );
                    galaxyBlog.setCategoryId(galaxyCategory.getId());
                }
            }

        }


        // 博客内容相关
        // id存在进入编辑，id不存在进入创建
        if (galaxyBlog.getId() != null) {
            temp = galaxyBlogService.getById(galaxyBlog.getId());
//            System.out.println(temp.getUserId());
//            System.out.println(ShiroUtil.getProfile().getId());
//            System.out.println(ShiroUtil.getProfile().getStatus());
            // 只能编辑自己的文章（超级管理员可以看到并编辑所有的文章）
            if (ShiroUtil.getProfile().getStatus().intValue() != USER.ADMINISTRATOR.status.intValue()) {
                Assert.isTrue(temp.getUserId().longValue() == ShiroUtil.getProfile().getId().longValue(), "没有权限编辑");
            }
        } else {
            temp = new GalaxyBlog();
            temp.setUserId(ShiroUtil.getProfile().getId());
        }
        // 防止前端乱传状态导致错误
        if (galaxyBlog.getStatus().intValue() == BLOGSTATUS.DRAFT.status.intValue()) {
            temp.setStatus(BLOGSTATUS.DRAFT.status.intValue());
        } else if (galaxyBlog.getStatus().intValue() == BLOGSTATUS.PUBLIC.status.intValue()) {
            temp.setStatus(BLOGSTATUS.PUBLIC.status.intValue());
        } else {
            temp.setStatus(BLOGSTATUS.DRAFT.status.intValue());
        }
        // 第三个参数是省略的字段，不推荐添加
        BeanUtil.copyProperties(galaxyBlog, temp, "userId", "status");
        // temp的id会自动更新
        galaxyBlogService.saveOrUpdate(temp);


        // 博客tag相关
        // 获取博客id（保证新建博客也能获取到）
//        GalaxyBlog galaxyBlogNew;
//        if (galaxyBlog.getId() == null) {
//            System.out.println(temp);
//            galaxyBlogNew =
//                    galaxyBlogService.getOne(
//                            new QueryWrapper<GalaxyBlog>()
//                                    .eq("user_id", temp.getUserId())
//                                    .eq("title", temp.getTitle())
//                                    .eq("content_markdown", temp.getContentMarkdown())
//                                    .eq("category_content", temp.getCategoryContent())
//                                    .eq("tag", temp.getTag())
//                                    .last("LIMIT 1")
//                    );
//        } else {
//            galaxyBlogNew = temp;
//        }
//
//        System.out.println(galaxyBlogNew);

        // 维护tag列表，优化版，还能保持数据库中tag顺序与blog.tag的顺序一致
        List<GalaxyTag> blogOldTagList =
                galaxyTagService.list(
                        new QueryWrapper<GalaxyTag>()
                                .eq("user_id", temp.getUserId())
                                .eq("blog_id", temp.getId())
                );
        String[] blogNewTagNameList;
        // 一定会返回一个数组
        if (galaxyBlog.getTag()!=null) {
            blogNewTagNameList = galaxyBlog.getTag().split(",");
        } else {
            blogNewTagNameList = new String[0];
        }

        int oldIndex, newIndex;
        for (oldIndex=0, newIndex=0; newIndex<blogNewTagNameList.length; ) {
            // 是否越过旧tag列表的长度
            if (oldIndex<blogOldTagList.size()) {
                // 没有进行修改
                if (blogOldTagList.get(oldIndex).getContent().equals(blogNewTagNameList[newIndex])) {
                    ++oldIndex;
                    ++newIndex;
                } else {
                    GalaxyTag galaxyTag = blogOldTagList.get(oldIndex);
                    galaxyTag.setContent(blogNewTagNameList[newIndex]);
                    galaxyTagService.saveOrUpdate(galaxyTag);
                    ++oldIndex;
                    ++newIndex;
                }
            } else {
                // oldIndex越越界了直接向数据库中插入数据
                GalaxyTag galaxyTag = new GalaxyTag();
                galaxyTag.setUserId(temp.getUserId());
                galaxyTag.setBlogId(temp.getId());
                galaxyTag.setStatus(1);
                galaxyTag.setContent(blogNewTagNameList[newIndex]);
                galaxyTagService.saveOrUpdate(galaxyTag);
                ++newIndex;
            }
        }
        // 如果旧tag列表比新tag列表多
        while(oldIndex<blogOldTagList.size()) {
            galaxyTagService.removeById(blogOldTagList.get(oldIndex++));
        }

        return ResponseResult.success(temp);
    }

    /**
     * 删除博客
     *
     * @param galaxyBlog
     * @return
     */
    @RequiresAuthentication
    @PostMapping("/blog/delete")
    public ResponseResult delete(@Validated @RequestBody GalaxyBlog galaxyBlog) {
        // 删除博客
        if (galaxyBlog.getId() == null
                || galaxyBlog.getId() < 0
                || !galaxyBlogService.remove(new QueryWrapper<GalaxyBlog>().eq("id", galaxyBlog.getId()))) {
           return ResponseResult.failure("删除博客失败，博客不存在");
        }
        // 维护分类
        GalaxyCategory galaxyCategory = galaxyCategoryService.getOne(new QueryWrapper<GalaxyCategory>().eq("id", galaxyBlog.getCategoryId()).last("LIMIT 1"));
        if (galaxyCategory != null && BLOGSTATUS.PUBLIC.status.equals(galaxyBlog.getStatus())) {
            galaxyCategory.setBlogCount(galaxyCategory.getBlogCount() - 1);
            if (!galaxyCategoryService.updateById(galaxyCategory)) {
                return ResponseResult.failure("分类文章数减一失败");
            }
        }
        // 维护标签（前面已经判断过博客id合法性，这里就不用再判断了）
        if (!galaxyTagService.remove(new QueryWrapper<GalaxyTag>().eq("blog_id", galaxyBlog.getId()))) {
            return ResponseResult.failure("删除标签失败");
        }


        return ResponseResult.success("删除博客成功");
    }

    /**
     * 增加博客点击量
     * @return
     */
    @PutMapping("/blog/click/{id}")
    public ResponseResult incrementclick(@PathVariable(name = "id") Long id) {
        // 查找指定的博客
        GalaxyBlog blog = galaxyBlogService.getById(id);
        Assert.notNull(blog, "博客不存在");
        // 增加点击量
        blog.setClickCount(blog.getClickCount() + 1);
        galaxyBlogService.updateById(blog);
        return ResponseResult.success("增加点击量成功");
    }

    /**
     * 增加博客点赞量
     * @return
     */
    @PutMapping("/blog/like/{id}")
    public ResponseResult incrementLike(@PathVariable(name = "id") Long id) {
        // 查找指定的博客
        GalaxyBlog blog = galaxyBlogService.getById(id);
        Assert.notNull(blog, "博客不存在");
        // 增加点赞量
        blog.setLikeCount(blog.getLikeCount() + 1);
        galaxyBlogService.updateById(blog);
        return ResponseResult.success("增加点赞量成功");
    }

    /**
     * 增加博客点赞量
     * @return
     */
    @PutMapping("/blog/collect/{id}")
    public ResponseResult incrementCollect(@PathVariable(name = "id") Long id) {
        // 查找指定的博客
        GalaxyBlog blog = galaxyBlogService.getById(id);
        Assert.notNull(blog, "博客不存在");
        // 增加点赞量
        blog.setCollectCount(blog.getCollectCount() + 1);
        galaxyBlogService.updateById(blog);
        return ResponseResult.success("增加收藏量成功");
    }
}
