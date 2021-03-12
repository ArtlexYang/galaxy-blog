package pers.artlex.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import pers.artlex.entity.GalaxyBlog;
import pers.artlex.mapper.GalaxyBlogMapper;
import pers.artlex.service.GalaxyBlogService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 服务实现类
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@Service
public class GalaxyBlogServiceImpl extends ServiceImpl<GalaxyBlogMapper, GalaxyBlog> implements GalaxyBlogService {
    @Autowired
    GalaxyBlogMapper galaxyBlogMapper;

    @Override
    public List<Map<String, String>> getBlogStatisticsAll() {
        return galaxyBlogMapper.getBlogStatisticsAll();
    }
    @Override
    public List<Map<String, String>> getBlogStatisticsPublic() {
        return galaxyBlogMapper.getBlogStatisticsPublic();
    }
    @Override
    public List<Map<String, String>> getBlogStatisticsDraft() {
        return galaxyBlogMapper.getBlogStatisticsDraft();
    }
    @Override
    public List<Map<String, String>> getBlogStatisticsMyselfAll(Long userId) {
        return galaxyBlogMapper.getBlogStatisticsMyselfAll(userId);
    }
    @Override
    public List<Map<String, String>> getBlogStatisticsMyselfPublic(Long userId) {
        return galaxyBlogMapper.getBlogStatisticsMyselfPublic(userId);
    }
    @Override
    public List<Map<String, String>> getBlogStatisticsMyselfDraft(Long userId) {
        return galaxyBlogMapper.getBlogStatisticsMyselfDraft(userId);
    }

    @Override
    public IPage<Map<String, String>> getTagBlogListPublicPage(String tagContent, Page<Map<String, String>> page) {
        return this.galaxyBlogMapper.getTagBlogListPublic(tagContent, page);
    }
    @Override
    public IPage<Map<String, String>> getTagBlogListMyselPage(String tagContent, Long userId, Page<Map<String, String>> page) {
        return this.galaxyBlogMapper.getTagBlogListMyself(tagContent, userId, page);
    }

    @Override
    public List<Map<String, String>> statisticsBlogTimeListPublic() {
        return this.galaxyBlogMapper.statisticsBlogTimeListPublic();
    }
    @Override
    public List<Map<String, String>> getTimeBlogListPublic(String time) {
        return this.galaxyBlogMapper.getTimeBlogListPublic(time);
    }
}
