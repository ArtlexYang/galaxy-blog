package pers.artlex.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import pers.artlex.common.dto.TreeData;
import pers.artlex.entity.GalaxyCategory;
import pers.artlex.mapper.GalaxyCategoryMapper;
import pers.artlex.service.GalaxyCategoryService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 服务实现类
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@Service
public class GalaxyCategoryServiceImpl extends ServiceImpl<GalaxyCategoryMapper, GalaxyCategory> implements GalaxyCategoryService {
    @Autowired
    private GalaxyCategoryMapper galaxyCategoryMapper;

    @Override
    public List<Map<String, String>> getCategoryStatisticsAll(){
        return galaxyCategoryMapper.getCategoryStatisticsAll();
    }
    @Override
    public List<Map<String, String>> getCategoryStatisticsPublic(){
        return galaxyCategoryMapper.getCategoryStatisticsPublic();
    }
    @Override
    public List<Map<String, String>> getCategoryStatisticsMyself(Long userId){
        return galaxyCategoryMapper.getCategoryStatisticsMyself(userId);
    }

    /**
     * 获取所有分类列表
     * @return
     */
    @Override
    public List<TreeData> getCategoryLevelListAll() {
        // 读2级列表
        List<Map<String, String>> categoryListLevel2 = galaxyCategoryMapper.getCategoryLevelListAll(2);
        // 存储父分类的id,二维数组第一维的下标（map的value不能直接修改）
        Map<String, Integer> categoryMapLevel1FatherToLevel2KidIndex = new LinkedHashMap<>();
        // 第一维是父分类下标，由categoryMapLevel1FatherToLevel2KidIndex确定
        List<List<TreeData>> kidList = new ArrayList<>();
        // 统计有相同1级内容的2级内容分类
        for (Map<String, String> tempMap : categoryListLevel2) {
            int index = 0;
            if (!categoryMapLevel1FatherToLevel2KidIndex.containsKey(String.valueOf(tempMap.get("pid")))) {
                kidList.add(index, new ArrayList<>());
                kidList.get(index)
                        .add(new TreeData(
                                String.valueOf(tempMap.get("id")),
                                tempMap.get("content") + " [" + String.valueOf(tempMap.get("blogCount")) + "篇]"));
                categoryMapLevel1FatherToLevel2KidIndex.put(String.valueOf(tempMap.get("pid")), index);
                ++index;
            } else {
                // 如果存在
                kidList.get(categoryMapLevel1FatherToLevel2KidIndex.get(String.valueOf(tempMap.get("pid"))))
                        .add(new TreeData(
                                String.valueOf(tempMap.get("id")),
                                tempMap.get("content") + " [" + String.valueOf(tempMap.get("blogCount")) + "篇]"));
            }
        }

        // 读1级列表
        List<Map<String, String>> categoryListLevel1 = galaxyCategoryMapper.getCategoryLevelListAll(1);
        List<TreeData> result = new ArrayList<>();
        // 建立1级树
        for (Map<String, String> tempMap : categoryListLevel1) {
            TreeData treeData;
            // 判断有没有子树
            if (!categoryMapLevel1FatherToLevel2KidIndex.containsKey(String.valueOf(tempMap.get("id")))) {
                // 新的树根（内容拼接分类名和博客数）
                treeData
                        = new TreeData(
                        String.valueOf(tempMap.get("id")),
                        tempMap.get("content") + " [" + String.valueOf(tempMap.get("blogCount")) + "篇]"
                );
            } else {
                // 新的树根（内容拼接分类名和博客数）
                treeData
                        = new TreeData(
                        String.valueOf(tempMap.get("id")),
                        tempMap.get("content") + " [" + String.valueOf(tempMap.get("blogCount")) + "篇]",
                        kidList.get(categoryMapLevel1FatherToLevel2KidIndex.get(String.valueOf(tempMap.get("id"))))
                );
            }
            result.add(treeData);
        }

        return result;
    }

    /**
     * 根据用户id获取对应的分类列表
     * @param userId
     * @return
     */
    @Override
    public List<TreeData> getCategoryLevelListMyself(Long userId) {
        // 读2级列表
        List<Map<String, String>> categoryListLevel2 = galaxyCategoryMapper.getCategoryLevelListMyself(2, userId);
        // 存储父分类的id,二维数组第一维的下标（map的value不能直接修改）
        Map<String, Integer> categoryMapLevel1FatherToLevel2KidIndex = new LinkedHashMap<>();
        // 第一维是父分类下标，由categoryMapLevel1FatherToLevel2KidIndex确定
        List<List<TreeData>> kidList = new ArrayList<>();
        // 统计有相同1级内容的2级内容分类
        for (Map<String, String> tempMap : categoryListLevel2) {
            int index = 0;
            if (!categoryMapLevel1FatherToLevel2KidIndex.containsKey(String.valueOf(tempMap.get("pid")))) {
                kidList.add(index, new ArrayList<>());
                kidList.get(index)
                        .add(new TreeData(
                                String.valueOf(tempMap.get("id")),
                                tempMap.get("content") + " [" + String.valueOf(tempMap.get("blogCount")) + "篇]"));
                categoryMapLevel1FatherToLevel2KidIndex.put(String.valueOf(tempMap.get("pid")), index);
                ++index;
            } else {
                // 如果存在
                kidList.get(categoryMapLevel1FatherToLevel2KidIndex.get(String.valueOf(tempMap.get("pid"))))
                        .add(new TreeData(
                                String.valueOf(tempMap.get("id")),
                                tempMap.get("content") + " [" + String.valueOf(tempMap.get("blogCount")) + "篇]"));
            }
        }

        // 读1级列表
        List<Map<String, String>> categoryListLevel1 = galaxyCategoryMapper.getCategoryLevelListMyself(1, userId);
        List<TreeData> result = new ArrayList<>();
        // 建立1级树
        for (Map<String, String> tempMap : categoryListLevel1) {
            TreeData treeData;
            // 判断有没有子树
            if (!categoryMapLevel1FatherToLevel2KidIndex.containsKey(String.valueOf(tempMap.get("id")))) {
                // 新的树根（内容拼接分类名和博客数）
                treeData
                        = new TreeData(
                        String.valueOf(tempMap.get("id")),
                        tempMap.get("content") + " [" + String.valueOf(tempMap.get("blogCount")) + "篇]"
                );
            } else {
                // 新的树根（内容拼接分类名和博客数）
                treeData
                        = new TreeData(
                        String.valueOf(tempMap.get("id")),
                        tempMap.get("content") + " [" + String.valueOf(tempMap.get("blogCount")) + "篇]",
                        kidList.get(categoryMapLevel1FatherToLevel2KidIndex.get(String.valueOf(tempMap.get("id"))))
                );
            }
            result.add(treeData);
        }

        return result;
    }
}
