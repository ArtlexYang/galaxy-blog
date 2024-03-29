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
public class GalaxyBlog implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    @NotNull(message = "博客作者ID不能为空")
    private Long userId;
    private Long categoryId;
    private String categoryContent;
    private String tag;

    @NotBlank(message = "博客作者昵称不能为空")
    private String nickname;
    @NotBlank(message = "博客标题不能为空")
    private String title;
    private String description;
    private String catalog;
    private String contentMarkdown;
    private String contentHtml;

    private Integer status;
    private Integer flag;
    private Long top;
    private Long sort;

    private Integer isAppreciation;
    private Integer isLicense;
    private Integer isComment;
    private Long clickCount;
    private Long likeCount;
    private Long collectCount;
    private Long commentCount;

    private LocalDateTime lastCommentTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
