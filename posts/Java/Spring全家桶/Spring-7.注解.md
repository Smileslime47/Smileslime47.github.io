# 注解
## 注解配置
Spring支持通过注解配置来替代一部分XML文件配置，从而简化配置流程

为了在Spring中使用注解配置，需要在ApplicationContext.xml中开启**组件扫描**

```xml
<context:component-scan base-package="org.example"/>
```

在配置完如上属性后，Spring会在对应的包路径下扫描并解析注解

## IoC注解
对于`<bean class="org.example.User" id="User">`这行配置，我们可以直接通过在其类名上添加@Component注解实现

```java
@Component("User")
public class User{
	...
}
```

此外，**@Service、@Repository、@Controller**也有类似的效果，但有其对应的语义：
- @Service用于Service类的配置
- @Repository用于DAO类的配置
- @Controller用于MVC中Controller的配置

## DI注解
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

	