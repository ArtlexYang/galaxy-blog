package pers.artlex.common.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @author: ArtlexKylin
 * @date: 2021/3/11 18:50
 */
@Data
public class TreeData {
    private String key, title;
    private List<TreeData> children;

    TreeData(){}

    public TreeData(String key, String title) {
        this.key = key;
        this.title = title;
        this.children = null;
    }

    public TreeData(String key, String title, List<TreeData> children) {
        this.key = key;
        this.title = title;
        this.children = new ArrayList<TreeData>(children);
    }

    public void addChildren(TreeData children) {
        this.children.add(children);
    }
}
