package pers.artlex.shiro;

import org.apache.shiro.authc.AuthenticationToken;

/**
 * @author: ArtlexKylin
 * @date: 2020/12/1 13:56
 */
public class JwtToken implements AuthenticationToken {

    private String token;

    public JwtToken(String jwt) {
        this.token = jwt;
    }

    @Override
    public Object getPrincipal() {
        return token;
    }

    @Override
    public Object getCredentials() {
        return token;
    }
}
