package pers.artlex.mapper;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import pers.artlex.entity.GalaxyBlog;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;
import java.util.Map;

/**
 * Mapper 接口
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
public interface GalaxyBlogMapper extends BaseMapper<GalaxyBlog> {
    /**
     * 获取所有blog的统计
     * @return
     */
    public List<Map<String, String>> getBlogStatisticsAll();
    /**
     * 获取所有公开blog的统计
     * @return
     */
    public List<Map<String, String>> getBlogStatisticsPublic();
    /**
     * 获取所有草稿blog的统计
     * @return
     */
    public List<Map<String, String>> getBlogStatisticsDraft();
    /**
     * 根据用户id获取对应的所有blog的统计
     * @param userId
     * @return
     */
    public List<Map<String, String>> getBlogStatisticsMyselfAll(@Param("userId") Long userId);
    /**
     * 根据用户id获取对应的公开blog的统计
     * @param userId
     * @return
     */
    public List<Map<String, String>> getBlogStatisticsMyselfPublic(@Param("userId") Long userId);
    /**
     * 根据用户id获取对应的草稿blog的统计
     * @param userId
     * @return
     */
    public List<Map<String, String>> getBlogStatisticsMyselfDraft(@Param("userId") Long userId);

    /**
     * 根据tag获取所有对应博客
     * @param tagContent
     * @return
     */
    public Page<Map<String, String>> getTagBlogListPublic(@Param("tagContent") String tagContent, Page<Map<String, String>> page);

    /**
     * 根据tag和用户id获取所有对应博客
     * @param tagContent
     * @param userId
     * @return
     */
    public Page<Map<String, String>> getTagBlogListMyself(@Param("tagContent") String tagContent, @Param("userId") Long userId, Page<Map<String, String>> page);

    /**
     * 根据月份统计所有公开发布博数量
     * @return
     */
    public List<Map<String, String>> statisticsBlogTimeListPublic();

    /**
     * 根据"年-月"字符串查找所有公开发布的博客
     * @return
     */
    public List<Map<String, String>> getTimeBlogListPublic(@Param("time") String time);
}
