---
title: SpringBoot - 3.配置文件
date: 1919/08/10
categories:
  - Java
  - SpringBoot
---
## 约定大于配置
SpringBoot采用**约定优于配置**的原则，对于整合的各种框架，采用一套默认的配置方案（约定），只有在开发者对其中的某一项有更改的需要时，再去配置文件中对特定项进行配置，简化了配置流程。

## 配置
SpringBoot的application.properties文件的配置要简单得多，直接采用了**配置项=值**的语法，有更优的可读性
```
#devtools
spring.devtools.restart.enabled=true
spring.devtools.restart.additional-paths=src/main/java
spring.devtools.restart.exclude=static/**

#druid
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.datasource.url=jdbc:mariadb://localhost:3306/library_manage_system
spring.datasource.username=root
spring.datasource.password=root

#mybatis
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

除properties外，SpringBoot也支持YML配置，YAML（YML ain't markdown language）/YML是一种非标记语言，采用了相比XML更易读的语法规范，以下是相同内容的XML和YML的配置文件的对比
```XML
<student>
    <name>sangeng</name>
    <age>15</age>
</student>
```
```
student:
    name: sangeng
    age: 15
```

### properties和yml的转换
properties和yml文件可以在一些在线网站上简单地互相转换：https://www.toyaml.com/index.html


## 读取YML配置
SpringBoot提供了一些注解可以自动解析YML中的参数

### @Value
对于YML文件，如
```
student:
    name: sangeng
    age: 15
```

我们可以直接通过@Value注解来解析其中的**简单数据类型**
```Java
@Value("${student.name}")
String name
```

### @ConfigurationProperties
对于对象而言，我们可以通过@ConfigurationProperties让SpringBoot自动解析YML并将其中的内容绑定到对象的字段上，并优先采用byName的匹配原则，并对于集合、对象等复杂数据类型都能自动解析并绑定
```
student:
    name: sangeng
    age: 15
```
```Java
@ConfigurationProperties(prefix="student")
public class student{
    private String name;
    private int age;
}
```