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
public class GalaxyLabel implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @NotBlank(message = "标签名不能为空")
    private String label;

    private Long blogId;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;


}
