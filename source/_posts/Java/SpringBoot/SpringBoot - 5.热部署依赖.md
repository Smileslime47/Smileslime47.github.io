---
title: SpringBoot - 5.热部署依赖
date: 1919/08/10
categories:
  - Java
  - SpringBoot
---
## dev-tools
SpringBoot支持热部署，即在修改代码内容后自动重新运行程序，这样在浏览器上可以实时观察到效果，而不需要手动地重新运行，且重启速度要优于手动重新运行，这一点是基于SpringBoot的dev-tools实现的

在pom.xml下添加依赖
```XML
<!--SpringBoot热部署-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

## 设置
为了实现热部署，还需要在配置文件和IDE中进行配置

### 配置文件
在application.properties中添加如下配置：
```XML
#devtools
spring.devtools.restart.enabled=true
spring.devtools.restart.additional-paths=src/main/java
spring.devtools.restart.exclude=static/**
```

### IDEA
开启IDEA的**设置->高级设置->编译器->即使开发的应用当前正在运行，也允许自动make启动**

在如上配置完后，即可开启SpringBoot的热部署功能