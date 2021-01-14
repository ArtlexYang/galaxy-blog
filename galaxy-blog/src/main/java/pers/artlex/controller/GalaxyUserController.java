package pers.artlex.controller;


import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pers.artlex.common.lang.ResponseResult;
import pers.artlex.entity.GalaxyUser;
import pers.artlex.service.GalaxyUserService;

/**
 * <p>
 * 前端控制器
 * </p>
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

}
