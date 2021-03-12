package pers.artlex.controller;


import cn.hutool.json.JSONUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pers.artlex.common.dto.TreeData;
import pers.artlex.common.lang.ResponseResult;
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
public class GalaxyTagController {
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
     * 显示博客标签列表
     * 默认只有一页内容
     *
     * @param isAdmin:  是否是管理模式
     * @param isGlobal: 管理模下获取全局统计数据
     * @return
     */
    @GetMapping("/tagList")
    public ResponseResult list(@RequestParam(defaultValue = "false") Boolean isAdmin, @RequestParam(defaultValue = "false") Boolean isGlobal) {
        List<TreeData> categoryList;
        if (isAdmin) {
            Integer tempStatus = ShiroUtil.getProfile().getStatus().intValue();
            if (isGlobal) {
                if (tempStatus == USER.ADMINISTRATOR.status.intValue()) {
                    // 显示所有的统计
                    categoryList = galaxyTagService.getTagListAll();
                } else {
                    return ResponseResult.failure("权限不足，无法统计");
                }
            } else {
                // 合法用户
                Long tempUserId = ShiroUtil.getProfile().getId().longValue();
                if (tempStatus >= USER.BLOGGER.status.intValue()) {
                    // 显示所有的统计
                    categoryList = galaxyTagService.getTagListMyself(1L);
                } else {
                    return ResponseResult.failure("权限不足，无法统计");
                }
            }
        } else {
            // 游客模式，看到所有公开的统计（可以为空）
            categoryList = galaxyTagService.getTagListAll();
        }
        return ResponseResult.success(JSONUtil.toJsonStr(categoryList));
    }
}
