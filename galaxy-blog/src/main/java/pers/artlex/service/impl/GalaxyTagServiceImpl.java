package pers.artlex.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import pers.artlex.common.dto.TreeData;
import pers.artlex.entity.GalaxyTag;
import pers.artlex.mapper.GalaxyTagMapper;
import pers.artlex.service.GalaxyTagService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 服务实现类
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@Service
public class GalaxyTagServiceImpl extends ServiceImpl<GalaxyTagMapper, GalaxyTag> implements GalaxyTagService {
    @Autowired
    private GalaxyTagMapper galaxyTagMapper;

    @Override
    public List<Map<String, String>> getTagStatisticsAll(){
        return galaxyTagMapper.getTagStatisticsAll();
    }
    @Override
    public List<Map<String, String>> getTagStatisticsPublic(){
        return galaxyTagMapper.getTagStatisticsPublic();
    }
    @Override
    public List<Map<String, String>> getTagStatisticsMyself(Long userId){
        return galaxyTagMapper.getTagStatisticsMyself(userId);
    }

    /**
     * 获取所有分类列表
     * @return
     */
    @Override
    public List<TreeData> getTagListAll() {
        // 读1级列表
        List<Map<String, String>> tagList = galaxyTagMapper.getTagStatisticsAll();
        List<TreeData> result = new ArrayList<>();
        // 建立1级树
        for (int i=0; i<tagList.size(); ++i) {
            Map<String, String> tempMap = tagList.get(i);
            result.add(new TreeData(String.valueOf(i), tempMap.get("content") + " [" + String.valueOf(tempMap.get("total")) + "篇]"));
        }
        return result;
    }

    /**
     * 根据用户id获取对应的分类列表
     * @param userId
     * @return
     */
    @Override
    public List<TreeData> getTagListMyself(Long userId) {
        // 读1级列表
        List<Map<String, String>> tagList = galaxyTagMapper.getTagStatisticsMyself(userId);
        List<TreeData> result = new ArrayList<>();
        // 建立1级树
        for (int i=0; i<tagList.size(); ++i) {
            Map<String, String> tempMap = tagList.get(i);
            result.add(new TreeData(String.valueOf(i), tempMap.get("content") + " [" + String.valueOf(tempMap.get("total")) + "篇]"));
        }
        return result;
    }
}
