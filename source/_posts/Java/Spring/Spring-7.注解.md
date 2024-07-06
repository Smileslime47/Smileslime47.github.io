---
title: Spring - 7.注解
date: 1919/08/10
categories:
  - Java
  - Spring
---
## 注解配置
---
Spring支持通过注解配置来替代一部分XML文件配置，从而简化配置流程

为了在Spring中使用注解配置，需要在ApplicationContext.xml中开启**组件扫描**

```xml
<context:component-scan base-package="org.example"/>
```

在配置完如上属性后，Spring会在对应的包路径下扫描并解析注解

## IoC注解
---
对于`<bean class="org.example.User" id="User">`这行配置，我们可以直接通过在其类名上添加@Component注解实现

```java
@Component("User")
public class User{
	...
}
```

此外，**@Service、@Repository、@Controller**也有类似的效果，但有其对应的语义：
- @Service用于Service类的配置
- @Repository用于Dao类的配置
- @Controller用于MVC中Controller的配置

## DI注解
---
在采用IoC注解后，我们失去了在XML配置中配置初始化（即依赖注入）的功能，此时还需要通过DI相关注解配置

### @Value
对于基本数据类型，我们可以直接通过@Value注入属性，并支持SpEL表达式，该注解只能在**类成员属性**上

通过@Value注入属性不需要实现其getter和setter方法
```java
@Component("User")
public class User{
	//@Value("#{19+1}")
	@Value("20")
	private int age;
	...
}
```

### @Autowired
对于对象成员，可以通过@Autowired使Spring自动在容器中寻找对应bean来注入该属性

要注意的是，注入的bean必须在容器中存在（即依赖类也被配置为Spring Bean）

```java
@Component("UserService")
public class UserService{
	@Autowired
	private UserDao userDao
	...
}
```
```java
//创建Service类并注入
UserService userService=(UserService)app.getBean("UserService");
```

此外，Autowired还支持一些属性配置
- @Autowired(required = false)指示Spring该注入非必须项
	- 此时依赖类即便没有被配置为Bean也不会导致程序异常，只是会跳过该注入，对应属性为null
	- 该属性大部分情况下较少改动

但是，单独使用@Autowired注解在一个类有多种Bean预设的时候，会导致Spring不知道要用哪个Bean来注入
- 在这种情况下，Spring会优先根据**和字段名相同**的Bean匹配
- 在没有和字段名相同的Bean且required=true的情况下会报错

### @Qualifier
在容器中同一个类含有多个Bean的情况下，@Autowired可能无法独立完成依赖注入，此时可以搭配@Qualifier注解实现
- @Qualifier注解**必须搭配**@Autowired注解使用，单独使用没有任何效果

```java
@Component("UserService")
public class UserService{
	@Autowired
	@Qualifier("UserDao1")
	private UserDao userDao
	...
}
```

## XML配置注解
---
在搭配XML配置注解后，可以完全通过**类**替代掉XML的配置文件

### @Configuration
在标记一个类为@Configuration后，该配置类的作用等同于XML配置文件

此时ApplicationContext不再使用`ClassPathXmlApplicationContext`，而是`AnnotationConfigApplicationContext`，并在构造参数中传入配置类的Class对象

```java
@Configuration
public class ApplicationConfig{
	...
}
```
```java
//传入class对象
AnnotationConfigApplicationContext app=new AnnotationConfigApplicationContext(ApplicationConfig.class);
```

### @ComponentScan
开启组件扫描功能，效果同`<context:component-scan base-package="org.example"/>`
- 参数basePackages/values传入一个**字符串或者字符串数组**

```java
@Configuration
@ComponentScan(basePackages="org.example")
public class ApplicationConfig{
	...
}
```

### @Bean
IoC注解中提供的相关注解仅能注解在**项目本身的类**中，而对于**第三方库的类**则难以配置相应Bean，此时需要通过@Bean实现，直接替代XML中的bean标签

要注意的是，@Bean标签是一个方法注解，注解在**返回第三方库的getter方法**上

```Java
@Configuration
@ComponentScan(basePackages="org.example")
public class ApplicationConfig{
	@Bean("UserDao")
	public T getClass(){
		...
		return (T)...
	}
	...
}
```

此外在该类只有一个Bean时，@Bean也可以不传入参数，则app通过Class对象获取bean

```Java
@Configuration
@ComponentScan(basePackages="org.example")
public class ApplicationConfig{
	@Bean
	public T getClass(){
		...
		return (T)...
	}
	...
}
```
```java
T t=app.getBean(T.class);
```

### @PropertySource
传入第三方配置文件，效果等同于`<context:property-placeholder location="classpath:xxx"></context:property-placeholder>`
- 参数传入一个字符串

```Java
@Configuration
@ComponentScan(basePackages="org.example")
@PropertySource("jdbc.properties")
public class ApplicationConfig{
	...
}
```

在传入配置文件后，可以在@Value中通过SpEL表达式获取其中的参数

```Java
//SpEL表达式中用${}解析配置文件参数
@Value("${jdbc.driver}")
public String driverName;
```


