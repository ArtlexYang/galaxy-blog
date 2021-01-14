package pers.artlex.config;

import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @author: ArtlexKylin
 * @date: 2020/11/28 16:47
 */
/**
 * @Configuration：定义配置类，替代xml文件
 * @EnableTransactionManagement：使用SpringBoot的事务管理
 * @MapperScan("pres.artlex.mapper")：扫描指定包下的接口，并生成实现类，与在main函数类使用此注解效果相同
 * @Bean：说明该类是需要注册的Bean
 */
@Configuration
@EnableTransactionManagement
@MapperScan("pers.artlex.mapper")
public class MybatisPlusConfig {
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        // 分页插件
        PaginationInterceptor paginationInterceptor = new PaginationInterceptor();
        return paginationInterceptor;
    }
}
