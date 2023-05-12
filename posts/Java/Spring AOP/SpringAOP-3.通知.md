# 通知

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
    @Pointcut("* org.example..*.*(..)")
    public void pt1(){}

    @Before("pt1()")
    public void advice1{
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
    @Pointcut("* org.example..*.*(..)")
    public void pt1(){}

    @Around("pt1()")
    public void around(ProceedingJoinPoint pjp){
        System.out.println("Before");
        try{
            pjp.proceed();
            System.out.println("AfterReturning");
        }catch(Throwable throable){
            System.out.println("AfterThrowing");
        }finally{
            System.out.println("After");
        }
    }
}
```

## 获取切入点信息
---
