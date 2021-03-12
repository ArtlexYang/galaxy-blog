package pers.artlex.service;

import pers.artlex.common.dto.TreeData;
import pers.artlex.entity.GalaxyTag;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * 服务类
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
public interface GalaxyTagService extends IService<GalaxyTag> {
    public List<Map<String, String>> getTagStatisticsAll();
    public List<Map<String, String>> getTagStatisticsPublic();
    public List<Map<String, String>> getTagStatisticsMyself(Long userId);

    public List<TreeData> getTagListAll();
    public List<TreeData> getTagListMyself(Long userId);
}
