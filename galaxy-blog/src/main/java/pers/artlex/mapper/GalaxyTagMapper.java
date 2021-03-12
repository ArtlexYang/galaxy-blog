package pers.artlex.mapper;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;
import pers.artlex.entity.GalaxyTag;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;
import java.util.Map;

/**
 * Mapper 接口
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
public interface GalaxyTagMapper extends BaseMapper<GalaxyTag> {
    /**
     * 获取所有标签对应公开+草稿博客的总数
     * @return
     */
    public List<Map<String, String>> getTagStatisticsAll();
    /**
     * 获取所有公开标签对应公开博客的总数
     * @return
     */
    public List<Map<String, String>> getTagStatisticsPublic();
    /**
     * 获取对应用户的标签对应公开+草稿博客的总数
     * @param userId
     * @return
     */
    public List<Map<String, String>> getTagStatisticsMyself(@Param("userId") Long userId);
}
