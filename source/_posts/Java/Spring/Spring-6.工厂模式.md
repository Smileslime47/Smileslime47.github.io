---
title: Spring - 6.工厂模式
date: 1919/08/10
categories:
  - Java
  - Spring
---
## 配置beans
当我们创建一个bean时可能需要调用一系列初始化方法，而bean的init-method只能支持传入一个**空参方法**，面对这种情况可以采用**工厂模式**，通过factory的get方法获取对应的bean

当我们通过一个**工厂类实例**来创建bean时，我们称这个工厂为**实例工厂**

当我们通过一个**静态工厂类**来创建bean时，我们称这个工厂为**静态工厂**

Spring提供了一些属性供我们更加方便地配置工厂

## 实例工厂
对于一个实例工厂，该工厂本身也是一个bean，我们需要对工厂返回的bean进行一些属性配置：
- **factory-bean**：指示该baen使用的工厂对象
- **factory-method**：指示该bean使用的工厂方法

```xml
<beans>
	...
	<bean class="org.exmaple.Factory" id="Factory"></bean>
    <bean class="org.exmaple.Product" id="Product" factory-bean="Factory" factory-method="getProduct"></bean>
</beans>
```

在获取bean时不需要**创建和调用工厂bean**，在调用ApplicationContext的getBean时Spring会自动创建工厂并调用初始化方法

```java
Product pd=app.getBean("Product");
```

## 静态工厂
当我们把bean的class配置成工厂，并设置factory-method调用该工厂的方法时，Spring会将其解析为静态工厂

```xml
<beans>
	...
    <bean class="org.exmaple.StaticFactory" id="Product" factory-method="getProduct"></bean>
</beans>
```
