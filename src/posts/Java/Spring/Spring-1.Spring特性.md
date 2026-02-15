---
title: Spring - 1.Spring特性
date: 1919/08/10
categories:
  - Java
  - Spring
---
Spring官网：https://spring.io/

## 控制反转
---
**控制反转**（Inversion of Control，IoC）是用于解决**模块依赖**导致的代码耦合的问题的一种方案，控制反转的实现方式通常有**依赖注入**（Dependency Injection）和**依赖寻找**（Dependency Lookup）两种

举例来说，当一个**class A**中用到了**class B**时，我们需要显性地在class A的代码内new出一个class B的对象，并对其进行初始化操作。而在采用**依赖注入**后，我们只需要在class A中声明出class B的**引用**即可，而关于class B的**参数初始化，构造**等过程则在容器控制程序指定的配置文件（XML等）中指定，从而使这个步骤脱离class A的逻辑代码，在调用到相关代码时，**容器控制程序**会接管class B的创建权（原理通常是反射，如Class.forName等实现），并基于XML创建对应对象，并将对象注入到class A对应的引用上

在实现控制反转后，对象的管理权和创建权**被移交给框架**，类彼此之间复杂的依赖关系**由框架来解决**，我们只需要从容器中获取对应类即可

## Spring构成
![](/images/posts/jvme0c60b4606711fc4a0b6faf03230247a.png)

## 配置
---
### 导入SpringIOC依赖
```xml
<!--Maven pom.xml-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.0.7</version>
</dependency>
```

### 创建配置文件
配置文件通常是`src/.../resource/applicationContext.xml`

在IDEA中可以通过**右键文件夹->新建->XML配置文件->Spring 配置**来快速生成如下的文件头
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

</beans>
```

