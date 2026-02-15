---
title: SpringBoot - 1.SpringBoot简介
date: 1919/08/10
categories:
  - Java
  - SpringBoot
---
## SSM框架的问题
基于Spring框架的Java项目开发确实解决了模块之间复杂的依赖问题，但是仍然需要对引入的各种模块进行大量的配置。当我们想要对一个Spring项目引入Mybatis、Tomcat等开发常用的框架时，每一个框架都需要单独配置注入以及配置选项等。

## SpringBoot
SpringBoot是基于Spring的一系列框架的封装，采用了**约定大于配置**的原则，简化了开发者的配置流程，同时提供了许多原生Spring不提供的服务：内嵌Web容器（Tomcat）、外部化配置健康检查等功能

用通俗的语言来讲：SpringBoot可以简单地理解为一系列Spring和许多常用框架的**傻瓜式整合包**，如一个Spring-boot-web-starter包含了spring-web、spring-mvc、tomcat、json解析等web开发常用的框架

同时SpringBoot采用了**约定大于配置**的原则，对于被整合到SpringBoot的第三方框架，他们往往提供一套默认的配置选项（即**约定**），仅当开发者需要特定地修改配置中的某一个选项时，才需要在配置文件中单独配置，这样在Spring的开发中极大地简化了配置的过程。

## 配置和启动类
在pom.xml下添加如下依赖
```XML
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.1.0</version>
</dependency>
```
要注意的是，SpringBoot在版本3.0前后采用了不同的依赖注入方式，对于某些整合SpringBoot的框架而言可能会出现版本不兼容的情况

在加入SpringBoot依赖后，按照如下方式配置启动类：
```Java
@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
```
配置完启动类后即可直接启动SpringBoot项目，SpringBoot会自动部署Tomcat容器并在本地的8080端口上监听请求

### Spring Initializer
可以通过Idea创建项目下的Spring Initializer快速构建SpringBoot项目，该功能是调用了[Spring提供的快速构建API](https://start.spring.io/)

## 打包部署
由于SpringBoot内嵌Web容器，可以更方便地在服务器上部署SpringBoot，在pom.xml下添加如下**插件**
```XML
<build>
    <plugins>
        <!--SpringBoot打包-->
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

随后在Maven项目管理中执行**package**指令即可打包项目

## starter包
上面提到了SpringBoot实际上是一系列框架的**整合包**，当我们进行服务端开发的时候，用到的实际上就是**spring-boot-starter-web**，这个依赖包含了spring-boot-starter、JSON解析、Tomcat、SpringMVC等网站开发必要的库

对于官方提供的starter包，一般以**spring-boot-starter-xxxx**命名

对于第三方提供的starter包，一般以**xxxx-spring-boot-starter**命名
