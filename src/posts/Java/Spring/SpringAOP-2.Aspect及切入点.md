---
title: SpringAOP - 2.Aspect及切入点
date: 1919/08/10
categories:
  - Java
  - Spring
---

## AOP概念
---
AOP是基于一系列**Aspect**即切面实现的增强功能，其中定义了许多概念：
### Joinpoint——连接点
连接点指在程序中可以被**扩展增强**的代码，通俗地说，就是**可以被增强的部分**

其中Spring AOP仅支持**对方法进行增强**

### Pointcut——切入点
切入点指在程序中**实际被增强**的代码，即**已经被增强的部分**

### Advice——通知
通知是指用于**实现增强**的代码

### Target——目标对象
目标对象是指被增强代码增强的对象

### Aspect——切面
切面是**切入点和通知的集合**，它是实现增强功能的单元，定义了**在哪里增强**和**如何增强**的具体实现

### Proxy——代理
在实现增强后，Spring容器并不会返回原始的Bean，而是类似于编译过程中的链接，根据切面和原始Bean合并成一个代理对象，这是基于Java的动态代理实现的

## Aspect Bean
---
和Spring一样，切面也可以通过一系列注解实现配置
### @Aspect
声明一个类为**切面类**，需要和@Component结合使用

```java
@Component
@Aspect
public class aspect{
    ...
}
```

### 切面执行顺序
在同时包含多个切面时，可能需要调整切面的执行顺序

Spring默认是根据**类名**排序的

当使用注解配置时，可以通过`@Order(int)`来设定切面顺序

当使用XML配置时，可以直接改变配置文件中切面代码的位置来设定顺序

## 切入点
---
### @Pointcut
在切面中指定一个切点，要注意的是，这个注解是一个**方法注解**
- 参数传入一个**切点表达式**，指明增强代码的位置
- 也可以通过切点注解@Annotation指明切点

```java
@Component
@Aspect
public class aspect{
    @Pointcut("execution(* org.example..*.*(..))")
    public void pt1(){}
}
```

### 切点表达式
结构：**execution( [访问修饰符] 返回值类型 包名.类名.方法名(参数列表) )**
- 访问修饰符部分可选
- 所有参数均可通过通配符(*)代替
- **包名.类名**表示当前包下某个类
- **包名..类名**表示当前包及其子包下的类
- **参数列表**可以填入`..`，表示任意类型、任意个数的参数列表，不填则代表是**空参方法**

### @annotation
@anootation可以搜寻**使用了特定注解的方法/类**，结合@annotation注解也可以让我们快速的配置切点，但是需要通过**自定义注解**实现功能

```Java
//自定义切点注解
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface mypt{ }
```

```Java
@Component("UserDao")
public class UserDao{
    //调用切点注解
    @mypt
    public User getUser{
        ...
    }
    ...
}
```

```java
@Component
@Aspect
public class aspect{
    //追踪切点方法
    @Pointcut("@Annotation(org.example.aspect.mypt)")
    public void pt1(){}
}
```

## 获取代理对象
---
由于JDK和Cglib实现方式的不同，代理对象的获取也会有所不同
```java
AnnotationConfigApplicationContext app=new AnnotationConfigApplicationContext(Config.class);
Controller ctrl= (Controller) app.getBean(ControllerImpl.class);
ctrl.aPointCut();
```
在JDK实现的情况下，上述代码会报错，这是因为JDK的动态代理实现中，代理对象是**实现接口Controller**的另一个**实现类**，和ControllerImpl是并列关系，在这种情况下，应当传入`Controller.class`即接口的Class

而在Cglib下，由于代理对象是**继承自ControllerImpl**的一个子类，因此不会报错

Spring AOP优先使用JDK的动态代理实现，但是由于JDK的动态代理要求被代理对象**必须实现某个接口**，在被代理对象的类并没有实现任何接口时，Spring会自动切换至Cglib实现