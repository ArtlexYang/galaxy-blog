package pers.artlex.shiro;

import lombok.Data;

import java.io.Serializable;

/**
 * @author: ArtlexKylin
 * @date: 2020/12/1 15:24
 * 保存账户扼要信息
 */
@Data
public class AccountProfile implements Serializable {
    /**
     * id：账户id
     * username：账户名
     * avatar：头像地址路径
     * email：邮箱
     * status：用户权限
     */
    private Long id;
    private String username;
    private String avatar;
    private String email;
    private Integer status;
}