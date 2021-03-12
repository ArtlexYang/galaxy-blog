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
import pers.artlex.entity.GalaxyTag;
import pers.artlex.service.GalaxyBlogService;
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
     * 显示所有发布的博客列表（每页10篇）
     *
     * @param currentPage: 当前用户选择的页面
     * @param blogCount: 当前页面显示的博客数
     * @param isAdmin: 是否是管理模式
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
     * @param blogCount: 当前页面显示的博客数
     * @param isAdmin: 是否是管理模式
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
     * @param blogCount: 当前页面显示的博客数
     * @param isAdmin: 是否是管理模式
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
     * @return
     */
    @GetMapping("/blogList/time")
    public ResponseResult getBlog2TimeListPublic() {
        List<Map<String, String>> blogTimeList = this.galaxyBlogService.statisticsBlogTimeListPublic();
        return ResponseResult.success(JSONUtil.toJsonStr(blogTimeList));
    }

    /**
     * 根据月份统计公开发布的博客的数量
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
        GalaxyBlog temp = null;

        // id存在进入编辑，id不存在进入创建
        if(galaxyBlog.getId() != null) {
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
        if (galaxyBlog.getStatus().intValue()==BLOGSTATUS.DRAFT.status.intValue()) {
            temp.setStatus(BLOGSTATUS.DRAFT.status.intValue());
        } else if (galaxyBlog.getStatus().intValue()==BLOGSTATUS.PUBLIC.status.intValue()) {
            temp.setStatus(BLOGSTATUS.PUBLIC.status.intValue());
        } else {
            temp.setStatus(BLOGSTATUS.DRAFT.status.intValue());
        }

        // 第三个参数是省略的字段，不推荐添加
        BeanUtil.copyProperties(galaxyBlog, temp, "userId", "status");
        galaxyBlogService.saveOrUpdate(temp);

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
        if (galaxyBlog.getId() != null) {
            if (galaxyBlogService.remove(new QueryWrapper<GalaxyBlog>().eq("id", galaxyBlog.getId()))) {
                return ResponseResult.success(null);
            }
        }
        return ResponseResult.failure("博客不存在");
    }

}
