---
title: Spring - 4.Lombok
date: 1919/08/10
categories:
  - Java
  - Spring
---
## Lombok介绍
---
>Lombok 是一种 Java™ 实用工具，可用来帮助开发人员消除 Java 的冗长，尤其是对于简单的 Java 对象（POJO）。它通过注解实现这一目的。

简单来说，Lombok可以通过直接介入编译器的**AST**来简化开发，在类前加入对应的**注解**来使Lombok自动生成对应的代码

详细的注解列表可以在官网查看：https://projectlombok.org/features/

## 依赖安装
---
```XML
	<dependency>
		<groupId>org.projectlombok</groupId>
		<artifactId>lombok</artifactId>
		<version>1.18.26</version>
		<scope>provided</scope>
	</dependency>
```
此外，还需要在IDEA中安装Lombok的插件

## 常用注解
---
### @Data
让Lombok自动为类的属性字段生成对应的**getter**、**setter**、**toString**、**equals**、**hashCode**方法

### @Getter/@Setter
让Lombok自动实现类的**getter/setter**方法

### @ToString
让Lombok自动实现类的**ToString方法**（常在print方法中被调用）

### @AllArgsConstructor/@NoArgsConstructor
让Lombok自动实现类的**全参构造器/零参构造器**
