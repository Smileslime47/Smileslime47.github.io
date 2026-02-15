---
title: SpringBoot - 2.版本控制
date: 1919/08/10
categories:
  - Java
  - SpringBoot
---
## 依赖冲突
当两个类同时依赖同一个类时，就可能发生冲突的问题，举例来说：当A引入了一个低版本的C，而B引入了一个高版本的C时，Maven就会无法得知此时应当引入哪个版本的C，此时则会发送依赖冲突的问题，导致程序抛出异常。

## Exclude
通过在需要被舍弃的冲突依赖下加入exclusion标签，将低版本的依赖项去除即可，如
```XML
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.2.4</version>
    <exclusions>
        <exclusion>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <groupId>org.mybatis.spring.boot</groupId>
        </exclusion>
    </exclusions>
</dependency>
```

## 版本锁定
我们可以在pom.xml中添加父工程**spring-boot-starter-parent**，对于父工程包含的依赖会自动锁定版本号，此时在dependencies下对于父工程包含的依赖项就不需要再添加version标签指定版本号了
```XML
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.1.0</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
```