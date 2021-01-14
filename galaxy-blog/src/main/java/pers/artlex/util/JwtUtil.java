package pers.artlex.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * jwt工具类
 *
 * @author ArtlexKylin
 */
@Data
@Slf4j
@Component
@ConfigurationProperties(prefix = "artlex.jwt")
public class JwtUtil {

    /**
     * secret：密钥
     * expire：超时时间
     * header：请求头
     */
    private String secret;
    private long expire;
    private String header;

    /**
     * 登录生成JWTToken
     *
     * @param userId
     * @return
     */
    public String generateToken(long userId) {
        Date nowDate = new Date();
        //过期时间
        Date expireDate = new Date(nowDate.getTime() + expire * 1000);

        return Jwts.builder()
                .setHeaderParam("typ", "JWT")
                .setSubject(userId + "")
                .setIssuedAt(nowDate)
                .setExpiration(expireDate)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /**
     * 从Token中获取声明信息：验证Token是否错误
     *
     * @param token
     * @return
     */
    public Claims getClaimByToken(String token) {
        try {
            // 校验
            return Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            log.debug("validate is token error ", e);
            return null;
        }
    }

    /**
     * 验证token是否过期
     *
     * @param expiration：
     * @return true：过期
     */
    public boolean isTokenExpired(Date expiration) {
        return expiration.before(new Date());
    }
}
