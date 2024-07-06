---
title: SpringAOP - 1.面向切面编程
date: 1919/08/10
categories:
  - Java
  - Spring
---

## 面向切面编程

---

**面向切面编程**（Aspect Oriented Programming）是用于将**业务核心代码**和**业务无关的增强代码**解耦合的技术，旨在不干涉**核心代码**的情况下动态实现日志、断点、监控、调试等增强功能。

**Spring AOP**提供了对Spring容器中的Bean实现AOP功能的接口，默认基于JDK提供的动态代理实现，但也可以手动设置为Cglib实现

## 配置

---

### 导入Spring AOP依赖

aspectj是一个实现了Java AOP功能的框架，定义了AOP相关的语法

Spring Context中已经包含了Spring AOP的依赖，但其仍是基于aspectj的框架

```xml
<!--Maven pom.xml-->
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.8.13</version>
</dependency>
```

### 开启AOP功能

对于XML配置文件，通过标签 `<aop:aspectj-autoproxy></<aop:aspectj-autoproxy>>`开启AOP功能

对于注解配置，在配置类下通过 `@EnableAspectJAutoProxy`注解开启AOP功能

### 切换动态代理实现
通过标签 `<aop:aspectj-autoproxy proxy-target-class="true"></<aop:aspectj-autoproxy>`切换至Cglib实现
