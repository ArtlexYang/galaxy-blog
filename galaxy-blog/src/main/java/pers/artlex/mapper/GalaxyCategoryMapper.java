package pers.artlex.mapper;

import org.apache.ibatis.annotations.Param;
import pers.artlex.entity.GalaxyCategory;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;
import java.util.Map;

/**
 * Mapper 接口
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
public interface GalaxyCategoryMapper extends BaseMapper<GalaxyCategory> {
    public List<Map<String, String>> getCategoryStatisticsAll();
    public List<Map<String, String>> getCategoryStatisticsPublic();
    public List<Map<String, String>> getCategoryStatisticsMyself(@Param("userId") Long userId);

    public List<Map<String, String>> getCategoryLevelListAll(@Param("level") Integer level);
    public List<Map<String, String>> getCategoryLevelListMyself(@Param("level") Integer level, @Param("userId") Long userId);
}
