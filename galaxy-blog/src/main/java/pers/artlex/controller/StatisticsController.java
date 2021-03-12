package pers.artlex.controller;

import cn.hutool.json.JSONUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.RestController;
import pers.artlex.common.lang.ResponseResult;
import pers.artlex.common.vo.StatisticsVo;
import pers.artlex.service.GalaxyBlogService;
import pers.artlex.service.GalaxyCategoryService;
import pers.artlex.service.GalaxyTagService;
import pers.artlex.util.ShiroUtil;

/**
 * 前端控制器
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@RestController
//@RequestMapping("/statistics")
public class StatisticsController {
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
     * 显示博客列表
     * 默认只有一页内容
     *
     * @param isAdmin:  是否是管理模式
     * @param isGlobal: 管理模下获取全局统计数据
     * @return
     */
    @GetMapping("/statistics")
    public ResponseResult list(@RequestParam(defaultValue = "false") Boolean isAdmin, @RequestParam(defaultValue = "false") Boolean isGlobal) {
        StatisticsVo statisticsVo;
        if (isAdmin) {
            Integer tempStatus = ShiroUtil.getProfile().getStatus().intValue();
            if (isGlobal) {
                if (tempStatus == USER.ADMINISTRATOR.status.intValue()) {
                    // 显示所有的统计
                    statisticsVo =
                            new StatisticsVo(
                                    galaxyBlogService.getBlogStatisticsAll(),
                                    galaxyBlogService.getBlogStatisticsPublic(),
                                    galaxyBlogService.getBlogStatisticsDraft(),
                                    galaxyCategoryService.getCategoryStatisticsAll(),
                                    galaxyTagService.getTagStatisticsAll()
                            );
                } else {
                    return ResponseResult.failure("权限不足，无法统计");
                }
            } else {
                // 合法用户
                Long tempUserId = ShiroUtil.getProfile().getId().longValue();
                if (tempStatus >= USER.BLOGGER.status.intValue()) {
                    // 显示所有的统计
                    statisticsVo =
                            new StatisticsVo(
                                    galaxyBlogService.getBlogStatisticsMyselfAll(tempUserId),
                                    galaxyBlogService.getBlogStatisticsMyselfPublic(tempUserId),
                                    galaxyBlogService.getBlogStatisticsMyselfDraft(tempUserId),
                                    galaxyCategoryService.getCategoryStatisticsMyself(tempUserId),
                                    galaxyTagService.getTagStatisticsMyself(tempUserId)
                            );
                } else {
                    return ResponseResult.failure("权限不足，无法统计");
                }
            }
        } else {
            // 游客模式，看到所有公开的统计（可以为空）
            statisticsVo =
                    new StatisticsVo(
                            null,
                            galaxyBlogService.getBlogStatisticsPublic(),
                            null,
                            galaxyCategoryService.getCategoryStatisticsPublic(),
                            galaxyTagService.getTagStatisticsPublic()
                    );
        }
//        return ResponseResult.success(statisticsVo.getTagList().size());
        return ResponseResult.success(JSONUtil.toJsonStr(statisticsVo));
    }
}
