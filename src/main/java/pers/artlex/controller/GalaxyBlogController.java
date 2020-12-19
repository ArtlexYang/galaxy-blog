package pers.artlex.controller;


import cn.hutool.core.bean.BeanUtil;
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
import pers.artlex.service.GalaxyBlogService;
import pers.artlex.util.ShiroUtil;

import java.time.LocalDateTime;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@RestController
public class GalaxyBlogController {

    @Autowired
    GalaxyBlogService galaxyBlogService;

    /**
     * 显示博客列表
     * 默认只有一页内容
     *
     * @param currentPage
     * @return
     */
    @GetMapping("/blogs")
    public ResponseResult list(@RequestParam(defaultValue = "1") Integer currentPage) {
        // 设置每页显示的博客数
        Page page = new Page(currentPage, 5);
        // 根据创建时间显示
        IPage pageData = galaxyBlogService.page(page, new QueryWrapper<GalaxyBlog>().orderByDesc("create_time"));

        return ResponseResult.success(pageData);
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
            // 只能编辑自己的文章
            Assert.isTrue(temp.getId().longValue() == ShiroUtil.getProfile().getId().longValue(), "没有权限编辑");
        } else {
            temp = new GalaxyBlog();
            temp.setUserId(ShiroUtil.getProfile().getId());
            temp.setStatus(0);
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
