package pers.artlex.controller;


import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pers.artlex.common.lang.ResponseResult;
import pers.artlex.entity.GalaxyBlog;
import pers.artlex.entity.GalaxyCategory;
import pers.artlex.entity.GalaxyUser;
import pers.artlex.service.GalaxyUserService;
import pers.artlex.util.ShiroUtil;

import java.util.Map;

/**
 * 前端控制器
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@RestController
@RequestMapping("/user")
public class GalaxyUserController {
    @Autowired
    GalaxyUserService galaxyUserService;

    /**
     * @RequiresAuthentication：需要Authentication权限才能访问
     * @GetMapping：浏览器查询数据
     * @return：返回json数据
     */
    @RequiresAuthentication
    @GetMapping("/index")
    public ResponseResult index() {
        GalaxyUser user = galaxyUserService.getById(1L);
        return ResponseResult.success(user);
    }

    /**
     * 保存用户
     * @PostMapping：数据库插入数据
     * @Validated：调用实体实体验证
     * @RequestBody：将json数据转换为对象
     * @param galaxyUser
     * @return
     */
    @PostMapping("/save")
    public ResponseResult save(@Validated @RequestBody GalaxyUser galaxyUser) {
        return ResponseResult.success(galaxyUser);
    }

    @RequiresAuthentication
    @PostMapping("/edit")
    public ResponseResult editUser(@RequestBody GalaxyUser galaxyUser) {
        galaxyUser.setId(ShiroUtil.getProfile().getId().longValue());
        galaxyUserService.updateById(galaxyUser);
        return ResponseResult.success("保存用户信息成功。");
    }

    @RequiresAuthentication
    @PostMapping("/edit/password")
    public ResponseResult editUserPassword(@RequestBody Map<String, String> password) {
        Assert.notNull(password, "传入了错误的空对象");
        GalaxyUser galaxyUser = galaxyUserService.getById(ShiroUtil.getProfile().getId().longValue());
        if (galaxyUser.getPassword().equals(password.get("oldPassword"))) {
            galaxyUser.setPassword(password.get("newPassword"));
            galaxyUserService.updateById(galaxyUser);
            return ResponseResult.success("修改用户密码成功。");
        } else {
            return ResponseResult.failure("修改失败，原密码错误。");
        }
    }

//    @RequiresAuthentication
//    @PostMapping("/edit/password")
//    public ResponseResult editUserPassword(@RequestBody String oldPassword, @RequestBody String newPassword) {
//        GalaxyUser galaxyUser = galaxyUserService.getById(ShiroUtil.getProfile().getId().longValue());
//        if (galaxyUser.getPassword().equals(oldPassword)) {
//            galaxyUser.setPassword(newPassword);
//            galaxyUserService.updateById(galaxyUser);
//            return ResponseResult.success("修改用户密码成功。");
//        } else {
//            return ResponseResult.failure("修改失败，原密码错误。");
//        }
//    }
}
