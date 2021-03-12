package pers.artlex.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;
import pers.artlex.entity.GalaxyBlog;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * 服务类
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
public interface GalaxyBlogService extends IService<GalaxyBlog> {
    public List<Map<String, String>> getBlogStatisticsAll();
    public List<Map<String, String>> getBlogStatisticsPublic();
    public List<Map<String, String>> getBlogStatisticsDraft();
    public List<Map<String, String>> getBlogStatisticsMyselfAll(Long userId);
    public List<Map<String, String>> getBlogStatisticsMyselfPublic(Long userId);
    public List<Map<String, String>> getBlogStatisticsMyselfDraft(Long userId);

    public IPage<Map<String, String>> getTagBlogListPublicPage(String tagContent, Page<Map<String, String>> page);
    public IPage<Map<String, String>> getTagBlogListMyselPage(String tagContent, Long userId, Page<Map<String, String>> page);

    public List<Map<String, String>> statisticsBlogTimeListPublic();
    public List<Map<String, String>> getTimeBlogListPublic(String time);
}
