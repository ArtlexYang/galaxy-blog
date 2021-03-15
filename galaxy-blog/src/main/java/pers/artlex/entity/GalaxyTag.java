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
public class GalaxyTag implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    @NotNull(message = "标签所有者ID不能为空")
    private Long userId;
    private Long blogId;

    @NotBlank(message = "标签名不能为空")
    private String content;
    private String description;

    private Integer status;
    private Long sort;

    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
