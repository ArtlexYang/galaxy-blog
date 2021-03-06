package pers.artlex.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pers.artlex.common.lang.ResponseResult;
import pers.artlex.entity.GalaxyBlog;
import pers.artlex.service.GalaxyBlogService;
import pers.artlex.service.GalaxyClassificationService;
import pers.artlex.util.ShiroUtil;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@RestController
@RequestMapping("/galaxy-classification")
public class GalaxyClassificationController {

    @Autowired
    GalaxyClassificationService galaxyClassificationService;

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
     * 显示分类列表
     * 默认只有一页内容
     *
     * @param currentPage: 当前用户选择的页面
     * @param classificationCount: 当前页面显示的博客数
     * @param isAdmin: 是否是管理模式
     * @return
     */
//    @GetMapping("/classification")
//    public ResponseResult list(@RequestParam(defaultValue = "1") Integer currentPage,
//                               @RequestParam(defaultValue = "10") Integer classificationCount,
//                               @RequestParam(defaultValue = "false") Boolean isAdmin) {
//        // 设置每页显示的博客数
//        Page page = new Page(currentPage, classificationCount);
//        IPage pageData;
//        if (isAdmin) {
//            // 只能编辑自己的文章（超级管理员可以看到并编辑所有的分类，不管是什么状态的）
//            if (ShiroUtil.getProfile().getStatus().intValue() == GalaxyBlogController.USER.ADMINISTRATOR.status.intValue()) {
//                // 根据创建时间显示
//                pageData = galaxyClassificationService.page(page, new QueryWrapper<GalaxyBlog>().orderByDesc("create_time"));
//            } else {
//                // 只显示该用户自己的博客
//                pageData = galaxyClassificationService.page(page, new QueryWrapper<GalaxyBlog>().eq("user_id", ShiroUtil.getProfile().getId().longValue()).orderByDesc("create_time"));
//            }
//        } else {
//            // 根据创建时间显示（公开发布的才能显示）
//            pageData = galaxyClassificationService.page(page, new QueryWrapper<GalaxyBlog>().eq("status", GalaxyBlogController.BLOGSTATUS.PUBLIC.status.intValue()).orderByDesc("create_time"));
//        }
//
//        return ResponseResult.success(pageData);
//    }
}
