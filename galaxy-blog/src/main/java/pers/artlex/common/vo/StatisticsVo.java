package pers.artlex.common.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @author: ArtlexKylin
 * @date: 2021/3/10 16:43
 */
@Data
public class StatisticsVo implements Serializable {
    private List<Map<String, String>> blogStatisticsAll;
    private List<Map<String, String>> blogStatisticsPublic;
    private List<Map<String, String>> blogStatisticsDraft;
    // [{id:xxx,content:xxx,total:xxx}, ]
    private List<Map<String, String>> categoryList;
    // [{id:xxx,content:xxx,total:xxx}, ]
    private List<Map<String, String>> tagList;

    public StatisticsVo() {}

    public StatisticsVo(List<Map<String, String>> blogStatisticsAll, List<Map<String, String>> blogStatisticsPublic, List<Map<String, String>> blogStatisticsDraft, List<Map<String, String>> categoryList, List<Map<String, String>> tagList) {
        this.blogStatisticsAll = blogStatisticsAll;
        this.blogStatisticsPublic = blogStatisticsPublic;
        this.blogStatisticsDraft = blogStatisticsDraft;
        this.categoryList = categoryList;
        this.tagList = tagList;
    }
}
