package pers.artlex.controller;

import cn.hutool.core.map.MapUtil;
import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pers.artlex.common.dto.LoginDto;
import pers.artlex.common.lang.ResponseResult;
import pers.artlex.entity.GalaxyUser;
import pers.artlex.service.GalaxyUserService;
import pers.artlex.util.JwtUtil;

import javax.servlet.http.HttpServletResponse;

/**
 * @author: ArtlexKylin
 * @date: 2020/12/15 14:38
 */
@RestController
public class AccountController {
    @Autowired
    GalaxyUserService galaxyUserService;

    @Autowired
    JwtUtil jwtUtil;

    /**
     * 用户登录
     *
     * @param loginDto
     * @param response
     * @return
     */
    @PostMapping("/login")
    public ResponseResult login(@Validated @RequestBody LoginDto loginDto, HttpServletResponse response) {
        // 获取用户
        GalaxyUser galaxyUser = galaxyUserService.getOne(new QueryWrapper<GalaxyUser>().eq("username", loginDto.getUsername()));
        if (galaxyUser == null) {
            return ResponseResult.failure(401, "账号或密码不正确", null);
        }
//        Assert.notNull(galaxyUser, "用户不存在");

        // 数据库存储明文密码
        if (!galaxyUser.getPassword().equals(loginDto.getPassword())) {
            return ResponseResult.failure(401, "账号或密码不正确", null);
        }

        // 数据库存储md5加密密码
//        if (!user.getPassword().equals(SecureUtil.md5(loginDto.getPassword()))) {
//            return ResponseResult.failure("账号或密码不正确");
//        }

        // 生成jwt
        String jwt = jwtUtil.generateToken(galaxyUser.getId());
        // 设置角色的jwt
        response.setHeader("Authorization", jwt);
        // 设置角色Authorization
        response.setHeader("Access-control-Expose-Headers", "Authorization");

        // 返回不敏感的信息
        return ResponseResult.success(MapUtil.builder()
                .put("id", galaxyUser.getId())
                .put("username", galaxyUser.getUsername())
                .put("avatar", galaxyUser.getAvatar())
                .put("email", galaxyUser.getEmail())
                .put("status", galaxyUser.getStatus())
                .put("lastLogin", galaxyUser.getLastLogin())
                .map()
        );
    }

    /**
     * 用户登出
     *
     * @return
     */
    @RequiresAuthentication
    @GetMapping("/logout")
    public ResponseResult logout() {
        SecurityUtils.getSubject().logout();
        return ResponseResult.success(null);
    }

}
