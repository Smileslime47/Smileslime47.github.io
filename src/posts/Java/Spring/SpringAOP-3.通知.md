---
title: SpringAOP - 3.通知
date: 1919/08/10
categories:
  - Java
  - Spring
---
## 通知分类
---
通知主要分为五类，由各自对应的注解调用：
- @Before:方法执行前通知
- @After:方法执行后，**返回前**通知，抛出异常仍会继续执行
- @AfterReturning:方法执行后，**返回后**通知，抛出异常时不会执行
- @AfterThrowing:抛出异常后通知
- @Around:环绕通知


这些通知的参数传入**对应的切点方法**

```java
@Component
@Aspect
public class aspect{
    @Pointcut("execution(* org.example..*.*(..))")
    public void pt1(){}

    @Before("pt1()")
    public void advice1(){
        ...
    }
}
```

### 环绕通知@Around
在使用环绕通知时，**通知方法**的参数**必须包含一个**`ProceedingJoinPoint`类，在通知中通过调用该类的proceed()方法来**执行切入点方法**，否则切入点方法不会被执行

通过环绕通知，我们可以一次性实现多种通知位置，有更高的自由度
```java
@Component
@Aspect
public class aspect{
    @Pointcut("execution(* org.example..*.*(..))")
    public void pt1(){}

    @Around("pt1()")
    public Object around(ProceedingJoinPoint pjp){
        System.out.println("Before");
        Object ans=null;
        try{
            ans=pjp.proceed();
            System.out.println("AfterReturning");
        }catch(Throwable throwable){
            System.out.println("AfterThrowing");
        }finally{
            System.out.println("After");
        }
        return ans;
    }
}
```

## 获取切入点信息
---
为了在通知方法中**获取通知点的信息**，我们需要在**通知方法的参数列表**中添加一个`JoinPoint`的类
- 环绕通知中对应**ProceedingJoinPoint**

在通知方法中调用JoinPoint的方法即可获取到切入点的相关信息

```java
@Component
@Aspect
public class aspect{
    @Pointcut("execution(* org.example..*.*(..))")
    public void pt1(){}

    @Before("pt1()")
    public void advice1(JoinPoint jp){
        System.out.println(jp.getSignature().getName());
        ...
    }
}
```

### 获取返回值和抛出的异常
除在环绕通知中可以通过pjp.proceed()获取方法执行后的返回值和异常外，**AfterReturning和AfterThrowing**通知也可以通过注解参数获取切入点的返回值和异常
- 除value参数传入切入点外，还有一个`returning`参数和`throwing`参数，用于指明参数列表中的绑定参数

```java
@Component
@Aspect
public class aspect{
    @Pointcut("execution(* org.example..*.*(..))")
    public void pt1(){}

    @AfterReturning(value="pt1()",returning="ret")
    public void advice1(JoinPoint jp,Object ret){
        System.out.println(jp.getSignature().getName());
        ...
    }
}
```

则此时advice1中的局部变量**ret**被绑定为切入点方法的返回值

