---
title: Spring - 2.Beans
date: 1919/08/10
categories:
  - Java
  - Spring
---
## Bean介绍

---

**JavaBeans**指的是Java中的一种类，名称的含义是**可重用程序组件**，通常这些类包含**无参构造器、一系列private的属性字段、一系列public的getter和setter方法**，Bean常用于封装数据及序列化中。而Spring的核心特性之一就是**基于JavaBeans和依赖注入的组件管理。**

## Beans标签

---

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

</beans>
```

在我们如上创建好配置文件后，可以在里面设置bean，将其绑定到实体类中

```xml
<beans>
	...
	<bean class="org.exmaple.UserDao" id="UserDao"></bean>
</beans>
```

## 获取Bean

---

我们需要通过 `ClassPathXmlApplicationContext`这个Bean工厂类来读取配置文件并获取Bean，如：

```java
ApplicationContext app=new ClassPathXmlApplicationContext("applicationContext.xml");
UserDao user=(UserDao)app.getBean("UserDao");//Object getBean(String id)
```

要注意，getBean返回的是一个**Object对象**，需要进行类型转换

## Bean标签的常用属性

---

### class

这个bean绑定实体类的全限定名

### id

bean的唯一标识符，在调用bean（如getBeans或者SpEL调用）时用于区分

### name

bean可以有多个name，也可以多个bean有相同的name，在调用bean时优先返回后面的bean

### scope

指定bean的生成模式，常用的有两种：

- singleton：**单例模式**，在ApplicationContext读取配置文件时创建bean对象，不论调用几次getBean永远只会返回同一个bean对象
- prototype：**原型模式**，在调用getBean时创建bean对象，且每次调用getBean都会创建并返回一个新的bean对象

### lazy-init

默认为false，当lazy-init设置为true时，即便scope指定bean为单例模式（即singleton），bean对象也会**在调用的时候才创建**，即懒汉模式

### method

**init-method**

- 可以传入一个**空参方法**，在bean进行初始化时自动调用该方法

**destroy-method**

- 可以传入一个**空参方法**，在容器关闭（即对ApplicationContext调用close方法）时自动调用该方法
