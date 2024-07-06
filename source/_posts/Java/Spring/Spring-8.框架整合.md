---
title: Spring - 8.框架整合
date: 1919/08/10
categories:
  - Java
  - Spring
---
## 整合JUnit
---
由于Spring的IoC特性，在JUnit中对Bean进行单元测试需要先创建ApplicationContext然后通过工厂获取Bean，较为繁琐

我们可以通过Spring中的Spring-test依赖整合Junit

```xml
<dependency>
    <groupid>org.springframework</groupid>
    <artifactId>spring-test</artifactId>
    <version>5.1.9.REALEASE<version>
</dependency>
```
### @RunWith
我们可以通过`@RunWith(SpringJUnit4ClassRunner.class)`让单元测试模块运行在Spring环境中

### @ContextConfiguration
通过`@ContextConfiguration`注解可以让单元测试模块加载指定的配置类/配置文件
- 参数locations传入配置文件路径
- 参数classes传入配置类的Class对象

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext.xml")
//@ContextConfiguration(classes=Config.class)
public class SpringTest{
    ...
}
```

然后在测试模块的对象字段中，调用@Autowired即可让Spring自动注入对应bean

## 整合Mybatis
---
关于Mybatis和Spring整合可以参照[Mybatis文档](https://mybatis.org/spring/zh/getting-started.html)

我们可以通过mybatis中的mybatis-spring依赖整合Junit

```xml
<dependency>
    <groupid>org.mybatis</groupid>
    <artifactId>mybatis-spring</artifactId>
    <version>2.0.4<version>
</dependency>
```

### SqlSessionFactoryBean
Mybatis将SqlSessionFactory封装在SqlSessionFactoryBean，并在配置时需要传入一个**DataSource**
```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <property name="dataSource" ref="dataSource" />
  <property name="configuration" value="classpath:mybatis-config.xml"/>
</bean>
```

```java
@Configuration
public class MyBatisConfig {
  @Bean
  public SqlSessionFactory sqlSessionFactory() throws Exception {
    SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
    factoryBean.setDataSource(dataSource());
    return factoryBean.getObject();
  }
}
```

### MapperScanner
我们可以通过配置mapperScanner来将**mapper对象注入到Spring容器中**
```xml
<bean id="mapperScannerConfigurer" class="org.mybatis.spring.MapperScannerConfigurer">
  <property name="basePackage" value="org.example"/>
</bean>
```
