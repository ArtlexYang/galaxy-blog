package pers.artlex.service;

import pers.artlex.common.dto.TreeData;
import pers.artlex.entity.GalaxyCategory;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * 服务类
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
public interface GalaxyCategoryService extends IService<GalaxyCategory> {
    public List<Map<String, String>> getCategoryStatisticsAll();
    public List<Map<String, String>> getCategoryStatisticsPublic();
    public List<Map<String, String>> getCategoryStatisticsMyself(Long userId);

    public List<TreeData> getCategoryLevelListAll();
    public List<TreeData> getCategoryLevelListMyself(Long userId);
}
