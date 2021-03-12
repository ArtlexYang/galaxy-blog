package pers.artlex.entity;

import java.time.LocalDateTime;
import java.io.Serializable;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
// Getter+Setter+ToString+Equals+HashCode
// +@RequiredArgsConstructor自动注入final修饰或有@NonNull注解的未经初始化的字段
import lombok.Data;
// @EqualsAndHashCode(callSuper = false)表示比较时不比较父类属性
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GalaxyUser implements Serializable {

    // java序列化所需参数
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    @NotBlank(message = "账号用户名不能为空")
    private String username;
    @NotBlank(message = "账号密码不能为空")
    private String password;
    @NotBlank(message = "账号盐值不能为空")
    private String salt;
    @NotNull(message = "账号状态不能为空")
    private Integer status;

    private String nickname;
    private String avatar;
    @Email(message = "邮箱格式不正确")
    private String email;
    private String welcomingSpeech;
    private Long blogCount;
    private Long commentCount;

    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private LocalDateTime lastLogin;
    private LocalDateTime limitTime;
}
