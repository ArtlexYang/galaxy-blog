package pers.artlex;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;

/**
 * 没有@MapperScan扫描mapper包的话会报UnsatisfiedDependencyException
 */
@SpringBootApplication
//@MapperScan(basePackages = "pers.artlex.mapper")
public class GalaxyApplication {

	public static void main(String[] args) {
		SpringApplication.run(GalaxyApplication.class, args);
	}

}
