package pers.artlex.shiro;

import cn.hutool.json.JSONUtil;

import pers.artlex.common.lang.ResponseResult;
import pers.artlex.util.JwtUtil;

import io.jsonwebtoken.Claims;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.ExpiredCredentialsException;
import org.apache.shiro.web.filter.authc.AuthenticatingFilter;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author: ArtlexKylin
 * @date: 2020/12/1 13:52
 */
@Component
public class JwtFilter extends AuthenticatingFilter {
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 跨域处理
     *
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @Override
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {

        // 把ServletRequest转换成HttpServletRequest
        HttpServletRequest httpServletRequest = WebUtils.toHttp(request);
        // 把ServletResponse转换成HttpServletResponse
        HttpServletResponse httpServletResponse = WebUtils.toHttp(response);

        // 从请求头中获取一些数据，作为响应头
        httpServletResponse.setHeader("Access-control-Allow-Origin", httpServletRequest.getHeader("Origin"));
        httpServletResponse.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
        httpServletResponse.setHeader("Access-Control-Allow-Headers", httpServletRequest.getHeader("Access-Control-Request-Headers"));

        // 跨域时会首先发送一个OPTIONS请求，这里给OPTIONS请求直接返回正常状态
        if (httpServletRequest.getMethod().equals(RequestMethod.OPTIONS.name())) {
            httpServletResponse.setStatus(org.springframework.http.HttpStatus.OK.value());
            return false;
        }

        // 自定义预处理完后执行父类的预处理
        return super.preHandle(request, response);
    }

    /**
     * 将请求头中的JWT字符串包装成Token类
     *
     * @param servletRequest
     * @param servletResponse
     * @return 没有请求头返回null；有请求头返回请求头包装后的JwtToken类实例
     * @throws Exception
     */
    @Override
    protected AuthenticationToken createToken(ServletRequest servletRequest, ServletResponse servletResponse) throws Exception {
        // 从请求头中获取JWT串
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String jwt = request.getHeader("Authorization");

        // 没有请求头返回null
        if (StringUtils.isEmpty(jwt)) {
            return null;
        }

        // 将请求头的Jwt字符串转换为Token（JwtToken类就是把字符串原样包装了一下）
        return new JwtToken(jwt);
    }

    /**
     * JWT验证
     *
     * @param servletRequest
     * @param servletResponse
     * @return 没有JWT就直接返回；有JWT就进行验证，成功登录，失败抛异常
     * @throws Exception
     */
    @Override
    protected boolean onAccessDenied(ServletRequest servletRequest, ServletResponse servletResponse) throws Exception {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String jwt = request.getHeader("Authorization");
        if (StringUtils.isEmpty(jwt)) {
            return true;
        }

        // 校验jwt
        Claims claim = jwtUtil.getClaimByToken(jwt);
        if (claim == null || jwtUtil.isTokenExpired(claim.getExpiration())) {
            throw new ExpiredCredentialsException("token已失效，请重新登录");
        }

        // 执行登录
        return executeLogin(servletRequest, servletResponse);
    }

    /**
     * 将失败返回包装成json格式（原方法只返回false）
     *
     * @param token
     * @param e
     * @param request
     * @param response
     * @return
     */
    @Override
    protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request, ServletResponse response) {
        // 升级类，使其可以使用.getWriter().print()方法
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        // 将错误原因导出
        Throwable throwable = e.getCause() == null ? e : e.getCause();
        // 将错误信息包装成类（方便转换）
        ResponseResult result = ResponseResult.failure(throwable.getMessage());
        // 转换成json字符串
        String json = JSONUtil.toJsonStr(result);

        try {
            // 写入response返回前端
            httpServletResponse.getWriter().print(json);
        } catch (Exception ex) {
        }

        return false;
    }

}
