package pers.artlex.util;

import org.apache.shiro.SecurityUtils;
import pers.artlex.shiro.AccountProfile;

/**
 * 包装方法
 *
 * @author: ArtlexKylin
 * @date: 2020/12/15 16:21
 */
public class ShiroUtil {
    private ShiroUtil() {}
    public static AccountProfile getProfile() {
        return (AccountProfile) SecurityUtils.getSubject().getPrincipal();
    }
}
