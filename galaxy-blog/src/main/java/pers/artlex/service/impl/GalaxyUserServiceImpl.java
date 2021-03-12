package pers.artlex.service.impl;

import pers.artlex.entity.GalaxyUser;
import pers.artlex.mapper.GalaxyUserMapper;
import pers.artlex.service.GalaxyUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * 服务实现类
 *
 * @author ArtlexKylin
 * @since 2020-12-01
 */
@Service
public class GalaxyUserServiceImpl extends ServiceImpl<GalaxyUserMapper, GalaxyUser> implements GalaxyUserService {

}
