---
title: SpringMybatis - 事务级操作
date: 1919/08/10
categories:
  - Java
  - Spring
---
## 事务
---
事务指的是**一组数据库的操作**，这组操作要么同时成功，要么同时失败

### 事务特性
- **隔离性**
  - 不同事务之间彼此隔离，互不影响
- **原子性**
  - 每个事务是一个不可分割的整体
- **一致性**
  - 事务中的操作要么同时成功，要么同时失败，状态一致
- **持久性**
  - 事务在提交后影响就会持久化，不再变动

### 原始实现
对于JDBC而言，事务的实现是基于Connection类的rollback和commit实现的
```java
Connection con=...;
con.setAutoCommit(false);
try{
    ...
    connection.commit();
}catch(...){
    connection.rollback();
}
```

## 声明式事务
---
在Spring-Mybatis中，可以通过XML配置或者注解配置的方式将一组操作**声明**为一组事务，省去了繁琐的实现过程

### 配置
我们需要在Spring容器中添加一个DataSourceTransactionManager的Bean来开启事务的管理
```xml
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
  <constructor-arg ref="dataSource" />
</bean>
```
```java
@Configuration
public class DataSourceConfig {
  @Bean
  public DataSourceTransactionManager transactionManager() {
    return new DataSourceTransactionManager(dataSource());
  }
}
```

### 声明
在开启事务后，在事务方法上添加`@Transactional`注解即可声明
- 此外@Transactional也可以注解在**类**上，代表该类的**所有方法**均为事务操作
```java
@Service
public class UserService{
    @Autowired
    private UserDao userDao;

    @Transactional
    public void action(){
        ...
    }
}
```

### 事务传播
当事务嵌套调用时：如事务A调用了事务B，则事务B的调用失败也会导致事务A的调用失败

但是对于某些**不重要的事务**，我们可能希望该事务的失败**不会影响**调用它的上级事务的失败，需要避免事务传播的行为

这时需要通过@Transcational的**propagation**参数
- REQUIRED（默认值）
  - 若外层方法也为事务，则该方法加入到和外层方法的同一事务中
  - 若外层方法不是事务，则该方法被独立声明为事务
- SUPPORT
  - 若外层方法也为事务，则该方法加入到和外层方法的同一事务中
  - 若外层方法不是事务，则该方法也不是事务
- REQUIRED_NEW
  - 无论外层方法是否为事务，该方法都将自己独立声明为一个新的事务
- NOT_SUPPORT
  - 无论外层方法是否为事务，该方法都不是事务
- MANDATORY
  - 若外层方法也为事务，则该方法加入到和外层方法的同一事务中
  - 若外层方法不是事务，则**报错**
- NEVER
  - 若外层方法也为事务，则**报错**
  - 若外层方法不是事务，则该方法也不是事务

### 隔离级别
我们可以通过@Transactional的**isolation**参数设置事务的隔离级别