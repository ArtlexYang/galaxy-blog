package pers.artlex.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * <p>
 * 
 * </p>
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GalaxyBlog implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @NotNull(message = "文章作者ID不能为空")
    private Long userId;

    @NotBlank(message = "文章标题不能为空")
    private String title;

    private String description;

    private String content;

    @NotNull(message = "文章状态不能为空")
    private Integer status;

    private String classification;

    private String label;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;


}
