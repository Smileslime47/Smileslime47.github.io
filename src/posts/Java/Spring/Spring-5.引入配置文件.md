---
title: Spring - 5.引入配置文件
date: 1919/08/10
categories:
  - Java
  - Spring
---
## 引入properties配置文件
---
我们可以在Spring的配置文件下通过**context:property-placeholder**标签来将其他的配置文件（如jdbc.properties）引入，并通过${key}来调用

如：
```
jdbc.driver=org.mariadb.jdbc.driver
...
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <context:property-placeholder location="classpath:jdbc.properties">
    </context:property-placeholder>

    <bean ...>
        <property name="driver" value="${jdbc.driver}"></property>
        ...
    </bean>
</beans>
```

有几点要注意的是：
- 由于在编译后resources和src的内容实际上会被**合并在类加载路径**下，这里的路径应当直接用classpath下的相对路径
- 需要在beans标签上设置好context命名空间

## 引入xml配置文件
---
当同时存在多个Spring配置文件（如一个主配置文件，一个数据库配置文件等）时，可以通过import标签在主配置文件中引入其他配置文件

如：
```xml
<import resource="classpath:jdbc.xml">
```