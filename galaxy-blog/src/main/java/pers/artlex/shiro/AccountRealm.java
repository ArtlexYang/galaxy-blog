package pers.artlex.shiro;

import cn.hutool.core.bean.BeanUtil;

import pers.artlex.entity.GalaxyUser;
import pers.artlex.service.GalaxyUserService;
import pers.artlex.util.JwtUtil;


import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author: ArtlexKylin
 * @date: 2020/11/29 16:25
 */
@Component
public class AccountRealm extends AuthorizingRealm {
    /**
     * JWT工具包
     */
    @Autowired
    JwtUtil jwtUtil;

    /**
     * 服务层实例
     */
    @Autowired
    GalaxyUserService galaxyUserService;

    /**
     * 操作前判断是否是jwt的token
     *
     * @param token
     * @return
     */
    @Override
    public boolean supports(AuthenticationToken token) {
        return token instanceof JwtToken;
    }

    /**
     * 身份认证 获取权限
     *
     * @param principals
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        return null;
    }

    /**
     * 身份认证 获取信息
     *
     * @param token
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        // 将token转换成JwtToken（以及调用过了上面的supports函数，保证可以转换）
        JwtToken jwtToken = (JwtToken) token;
        // jwtUtil.getClaimByToken：校验Token
        // jwtToken.getPrincipal()：返回Token
        // getSubject()：JwtUtil.generateToken()拼接的是.setSubject(userId + "")，所以获取的值是userid
        String userId = jwtUtil.getClaimByToken((String) jwtToken.getPrincipal()).getSubject();

        // 从数据库中查询放到DO(数据库对象)里
        GalaxyUser user = galaxyUserService.getById(Long.valueOf(userId));
        if (user == null) {
            throw new UnknownAccountException("账户不存在");
        }
        if (user.getStatus() == -1) {
            throw new LockedAccountException("账户已被锁定");
        }

        // 新建账户摘要对象
        AccountProfile profile = new AccountProfile();
        // 将user的值赋给profile（只复制profile有的属性，解耦）
        BeanUtil.copyProperties(user, profile);

        // jwtToken.getCredentials()：返回Token
        return new SimpleAuthenticationInfo(profile, jwtToken.getCredentials(), getName());
    }
}
