---
title: SpringBoot - 6.框架整合
date: 1919/08/10
categories:
  - Java
  - SpringBoot
---
## JUnit
### 引入依赖
在pom.xml中添加如下依赖
```XML
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
````

### 测试类
通过@SpringBootTest注解配置单元测试类
```Java
@SpringBootTest
public class ApplicationTest {
    @Autowired
    private UserController UserController;

    @Test
    public void testJunit(){
        ...
    }
}
```

