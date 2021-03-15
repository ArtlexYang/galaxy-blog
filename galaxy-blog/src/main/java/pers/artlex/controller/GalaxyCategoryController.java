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

import pers.artlex.common.dto.TreeData;
import pers.artlex.common.lang.ResponseResult;
import pers.artlex.entity.GalaxyBlog;
import pers.artlex.entity.GalaxyCategory;
import pers.artlex.service.GalaxyBlogService;
import pers.artlex.service.GalaxyCategoryService;
import pers.artlex.service.GalaxyTagService;
import pers.artlex.util.ShiroUtil;

import java.util.List;

/**
 * 前端控制器
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@RestController
public class GalaxyCategoryController {

    @Autowired
    GalaxyBlogService galaxyBlogService;
    @Autowired
    GalaxyCategoryService galaxyCategoryService;

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
        PRIVATE("私有发布", 1),
        PUBLIC("公开发布", 2);

        private String name;
        private Integer status;

        BLOGSTATUS(String name, Integer status) {
            this.name = name;
            this.status = status;
        }
    }

    /**
     * 显示博客分类列表
     * 默认只有一页内容
     *
     * @param isAdmin:  是否是管理模式
     * @param isGlobal: 管理模下获取全局统计数据
     * @return
     */
    @GetMapping("/categoryListTree")
    public ResponseResult getCategoryListTree(@RequestParam(defaultValue = "false") Boolean isAdmin, @RequestParam(defaultValue = "false") Boolean isGlobal) {
        List<TreeData> categoryList;
        if (isAdmin) {
            Integer tempStatus = ShiroUtil.getProfile().getStatus().intValue();
            if (isGlobal) {
                if (tempStatus == USER.ADMINISTRATOR.status.intValue()) {
                    // 显示所有的统计
                    categoryList = galaxyCategoryService.getCategoryLevelListAll();
                } else {
                    return ResponseResult.failure("权限不足，无法统计");
                }
            } else {
                // 合法用户
                Long tempUserId = ShiroUtil.getProfile().getId().longValue();
                if (tempStatus >= USER.BLOGGER.status.intValue()) {
                    // 显示所有的统计
                    categoryList = galaxyCategoryService.getCategoryLevelListMyself(tempUserId);
                } else {
                    return ResponseResult.failure("权限不足，无法统计");
                }
            }
        } else {
            // 游客模式，看到所有公开的统计（可以为空）
            categoryList = galaxyCategoryService.getCategoryLevelListAll();
        }
        return ResponseResult.success(JSONUtil.toJsonStr(categoryList));
    }

    /**
     * 显示所有发布的分类列表，管理员才能访问（默认每页10篇）
     *
     * @param currentPage: 当前用户选择的页面
     * @param blogCount:   当前页面显示的博客数
     * @return
     */
    @RequiresAuthentication
    @GetMapping("/categoryListAdmin")
    public ResponseResult getCategoryListAdmin(@RequestParam(defaultValue = "1") Integer currentPage,
                                               @RequestParam(defaultValue = "10") Integer blogCount) {
        // 设置每页显示的博客数
        Page page = new Page(currentPage, blogCount);
        IPage pageData;
        // 只能编辑自己的分类（超级管理员可以看到并编辑所有的分类）
        if (ShiroUtil.getProfile().getStatus().intValue() == USER.ADMINISTRATOR.status.intValue()) {
            // 根据创建时间显示
            pageData = galaxyCategoryService.page(page, new QueryWrapper<GalaxyCategory>().orderByDesc("create_time"));
        } else {
            // 只显示该用户自己的博客
            pageData = galaxyCategoryService.page(page, new QueryWrapper<GalaxyCategory>().eq("user_id", ShiroUtil.getProfile().getId().longValue()).orderByDesc("create_time"));
        }
        return ResponseResult.success(pageData);
    }

    @RequiresAuthentication
    @PostMapping("/category/edit")
    public ResponseResult newCategory(@Validated @RequestBody GalaxyCategory galaxyCategory) {
        if (galaxyCategory.getContent() == null) {
            return ResponseResult.failure("传入了一个错误的空对象");
        }
        GalaxyCategory verifyTemp;
        // 如果是2级分类，要验证2级分类的父id是否存在
        if (galaxyCategory.getLevel()!=null && galaxyCategory.getLevel()!=1) {
            verifyTemp = galaxyCategoryService.getOne(new QueryWrapper<GalaxyCategory>().eq("id", Long.valueOf(galaxyCategory.getPid())));
            if (verifyTemp==null) {
                // 找不到父id，错误
                return ResponseResult.failure("父id不正确，请重新输入");
            }
        }

        GalaxyCategory temp = null;
        if (galaxyCategory.getStatus() == null) {
            // 不首页推荐是0
            temp.setStatus(0);
        }

        // id存在进入编辑，id不存在进入创建
        if (galaxyCategory.getId() != null) {
            temp = galaxyCategoryService.getById(galaxyCategory.getId());
            // 只能编辑自己的分类（超级管理员可以看到并编辑所有的分类）
            if (ShiroUtil.getProfile().getStatus().intValue() != USER.ADMINISTRATOR.status.intValue()) {
                Assert.isTrue(temp.getUserId().longValue() == ShiroUtil.getProfile().getId().longValue(), "没有权限编辑");
            }

            // 把有相同分类id的博客的categoryContent改了（只会替换非null列）
            GalaxyBlog galaxyBlog = new GalaxyBlog();
            galaxyBlog.setCategoryContent(galaxyCategory.getContent());
            galaxyBlogService.update(galaxyBlog, new QueryWrapper<GalaxyBlog>().eq("category_id", galaxyCategory.getId()));

        } else {
            // 验证添加的分类的重复性
            Long userIdTemp = galaxyCategory.getUserId() != null ? galaxyCategory.getUserId() : ShiroUtil.getProfile().getId().longValue();
            verifyTemp =
                    galaxyCategoryService
                            .getOne(
                                    new QueryWrapper<GalaxyCategory>()
                                            .eq("user_id", userIdTemp)
                                            .eq("content", String.valueOf(galaxyCategory.getContent()))
                                            .last("LIMIT 1")
                            );
            if (verifyTemp != null) {
                // 已经存在相同的分类了，返回错误
                return ResponseResult.failure("已存在相同分类，添加失败");
            }

            temp = new GalaxyCategory();
            temp.setUserId(ShiroUtil.getProfile().getId());
        }
        // 第三个参数是省略的字段，不推荐添加
        BeanUtil.copyProperties(galaxyCategory, temp, "userId");
        galaxyCategoryService.saveOrUpdate(temp);

        return ResponseResult.success(temp);
    }

    /**
     * 删除分类
     *
     * @param galaxyCategory
     * @return
     */
    @RequiresAuthentication
    @PostMapping("/category/delete")
    public ResponseResult delete(@Validated @RequestBody GalaxyCategory galaxyCategory) {
        if (galaxyCategory.getId() != null) {
            if (galaxyCategoryService.remove(new QueryWrapper<GalaxyCategory>().eq("id", galaxyCategory.getId()))) {
                // 删除此分类博客的分类标签
                GalaxyBlog galaxyBlog = new GalaxyBlog();
                galaxyBlog.setCategoryId(0L);
                galaxyBlog.setCategoryContent("");
                galaxyBlogService.update(galaxyBlog, new QueryWrapper<GalaxyBlog>().eq("category_id", galaxyCategory.getId()));
                return ResponseResult.success("删除分类成功");
            }
        }
        return ResponseResult.failure("分类不存在");
    }
}
