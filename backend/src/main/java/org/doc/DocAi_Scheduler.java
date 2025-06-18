package org.doc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("org.doc.Repository")
@EntityScan("org.doc.Entity")
public class DocAi_Scheduler
{
	public static void main(String[] args)
	{
		SpringApplication.run(DocAi_Scheduler.class, args);
	}
}
