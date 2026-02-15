---
title: J2EE 考试范围及复习提纲
date: 2023/12/27
categories:
  - Memo
---

注：课程中SpringMVC部分主要采用**前后端不分离+JSP页面负责前端的数据传递和视图渲染**，Mybatis的Mapper和Spring的Bean注册主要基于**XML**进行配置，**不涉及关于前后端分离（Vue及Http网络请求）和SpringBoot的内容**

## 考试范围

范围：第一章到第十五章
小题以课堂练习的知识点为基础

### 小题x4

- 单选 1x20
- 多选 2x5
- 判断 1x10
- 填空 1x10

### 大题x2

名词解释 3x8
- 教材范围$1.2、2.1、2.3、3.4、3.5、4.2、4.3、5.2、6.2、6.4、7.4、7.5、8.1、9.1、11.4、12.1$

简答 26分4道
- 教材范围$1.3、2.3、7.2、8.4、11.3、12.1、13.3、15.1$

---

## Mybatis基础课堂练习(1-3章) 

### 1. [√]MyBatis框架是一种ORM框架，ORM框架即为对象关系映射框架。

### 2. [x]MyBatis映射文件中`<mappers>`元素是配置文件的根元素，它包含一个namespace属性，该属性为这个`<mappers>`指定了唯一的命名空间。
- 配置文件的根元素是`<configuration>`，映射文件的根元素是`<mapper>`
- namespace字段是`<mapper>`的属性而不是`<mappers>`的

### 3. [x]SqlSession实例也是线程安全的，可以将其放在一个类的静态字段、实例字段或任何类型的管理范围(如Servlet的HttpSession)中使用。
- SqlSession是线程不安全的，因此不能放在静态字段中

### 4. [√]MyBatis动态SQL中的`<choose>` ( `<when>`、`<otherwise>`)元素类似Java中的switch...case...default语句，用于进行多条件分支判断。

### 5. 有关MyBatis工作原理说法错误的是
- A.[√]MyBatis的全局配置文件配置了MyBatis的运行环境等信息，其中主要内容是获取数据库连接。
- B.[√]MyBatis映射文件中配置了操作数据库的SQL语句，需要在MyBatis的全局配置文件中加载才能执行。
  - 映射文件指的是mapper.xml，需要在全局配置的`<mappers>`中注册
- C.[x]可以通过MyBatis的环境等配置信息构建会话对象SqlSession。
  - 通过MyBatis的环境等配置信息构建**SqlSessionFactory**
- D.[√]SqlSession对象，该对象中包含了执行SQL的所有方法。

### 6. 关于MyBatis模糊查询中进行SQL字符串拼接时，说法错误的是
- A.[√]使用“$”进行SQL字符串拼接时，无法防止SQL注入问题。
  - `#{}`表示一个占位符，向占位符输入参数，MyBatis 会自动进行Java类型和jdbc类型的转换，且不需要考虑参数的类型，以预编译的方式传入，可以有效的防止 SQL注入，提高系统安全性。例如:传入字符串，MyBatis最终拼接好的SQL就是参数两边加单引号。
  - `${}`表示SQL的拼接，通过`${}`接收参数，将参数的内容不加任何修饰拼接在SQL中，以字符串替换方式`${}`替换成变量的值，可能存在SQL注入的安全隐患。在用于传入数据库对象，例如传入表名和列名，还有排序时使用order by动态参数时可以使用`${}`。
- B.[√]可以使用MySQL中的concat()函数进行字符串拼接。
- C.[x]使用MySQL中的concat()函数进行字符串拼接，也无法防止SQL注入。
  - Mybatis(重点)的xml中的**concat函数**可以防止SQL注入
- D.[√]使用MySQL中的concat()函数进行字符串拼接，导致数据库移植性变差。
  - 见下文中`bind`用法，`concat()`函数只适用于**MySQL**，而`bind`可以兼容`Oracle`、`Postgre`等数据库

###  7. 以下有关`<sql>`元素说法错误的是
- A.[√]`<sql>`元素的作用就是定义可重用的SQL代码片段，然后在其他语句中引用这—代码片段。
- B.[√]使用`<include>`元素的refid属性可以引用自定义的代码片段。
  - 在查询语句的外侧定义sql，然后可以在查询语句内测通过include引用sql	
- C.[x]使用`<include>`元素refid的属性值为自定义代码片段的name.
  - 属性值应当为自定义片段的**id**(见下例)
- D.[√]`<sql>`元素是`<mapper>`元素的子元素。

**7例：**
```xml
<mapper>
    ...
    <sql id="ref">
        ${abc},name,authorId
    </sql>
    ...
    <select id="selectbyId" resultMap="BaseResultMap">
        select
        <include refid="ref">
            <!--这里在refid中使用id引入，其实看名字也看出来了——ref id-->
            <property name="abc" value="bid"/>
        </include>
        from
        blog where bid = #{bid}
    </select>
</mapper>
```

### 8. 以下关于`<select>`元素及其属性说法错误的是
- A.[√]`<select>`元素用来映射查询语句，它可以帮助我们从数据库中读取出数据，并组装数据给业务开发人员。
- B.[√]parameterType属性表示传入SQL语句的参数类的全限定名或者别名。
- C.[x]resultMap表示外部resultMap的命名引用，返回时可以同时使用resultType和resultMap。
  - 可以使用 resultType 或 resultMap，但不能同时使用。
  - resultTyoe是`<select>`的一个属性，即`<select resultType="...">`，而resultMap是和`<select>`并列的一个元素，即`<resultMap>...</resultMap><select>...</select>`(具体使用可以见下例)
  - resultType用于返回数据的字段和POJO类的名称严格一一对应时，指明返回数据的POJO类型，不需要多余的属性
  - resultMap用于名称不严格一一对应时，还能在子元素中用`<result>`额外地指定POJO变量名和数据字段的绑定关系（如`<result property="id" column="uid"></result>`）	
- D.[√]在同一个映射文件中可以配置多个`<select>`元素

### 9.以下不属于`<foreach>`元素中使用的属性的是
- A.[√]separator
  - 迭代后返回的元素之间的分隔符，默认是" , "
- B.[√]collection
  - 进行迭代的集合对象
- C.[x]current
  - 这大概是老师自己乱起的名字
- D.[√]item
  - 必选，指明迭代时的别名(类似for(Obj item:list)中的item)
- 除此之外还有open、close、index三个属性

### 10.以下有关MyBatis动态SQL中的主要元素说法错误的是
- A.[√]`<if>`用于单条件分支判断。
- B.[√]`<choose>` ( `<when>`、`<otherwise>`)用于多条件分支判断。
- C.[√]`<foreach>`循环语句，常用于in语句等列举条件中。
- D.[x]`<bind>`从OGNL表达式中创建—个变量，并将其绑定到上下文，只于模糊查询的sql中。
  - 常用于模糊查询，但是大部分通用数据库的参数引用都可以用bind
  - 相比concat函数，bind会保证**在不同数据库的兼容性问题**（如Oracle），而concat函数只在MySQL中有效
  - 举例来说，MySQL中"IN A,B,C"的表达式，在Oracle中可能是“A || B || C”，而bind保证了不需要为每种数据库单独写一份映射文件

---

## 深入Mybatis课堂练习（4-5章）

### 1. [x]MyBatis是通过`<resultMap>`元素的`<collection>`子元素该元素来处理一对一关联关系的。
  - 见上第8题C，通过`<result>`子元素处理

### 2. [√]MyBatis在映射文件中加载关联关系对象主要通过两种方式:嵌套查询和嵌套结果。
- 当一个POJO对象同时包含多个表的数据时可以用嵌套查询/嵌套结果获取数据
- **嵌套查询**：对多个表进行多次查询，再将查询结果合并出一个完整的POJO对象，优点是不需要写复杂的SELECT语句，缺点是多次表查询，效率低下
- **嵌套结果**：手写多表查询（JOIN），缺点就是写出来的SQL语句会很复杂，但是优点是只有一次查询，性能好

**2嵌套查询例：**
可以看到SELECT语句较简单，但是resultMap的`<collection>`子元素中指定了额外的select操作，当返回结果集时，对于每个集合中的元素都需要单独执行一次查询
```xml
<resultMap id="queryStudentAndCourseMap" type="student">
    <id property="stId" column="st_id"/>
    <result property="stName" column="st_name"/>
    <result property="stAge" column="st_age"/>
    <collection property="courseList" column="st_id" ofType="course" select="mybatis.mapper.CourseMapper.selectCourseByStId"/>
    <!--每查询到一个该类型的result元素时，都要执行一次这里指定的查询操作来获取对应的外键信息-->
    <!--换句话说，查询一群学生时，对于每一个学生都会跑一次查询来查询他的课程，有多少个学生就会多跑多少次查询-->
</resultMap>

<select id="queryStudentAndCourse" resultMap="queryStudentAndCourseMap">
    select
        st_id,
        st_name,
        st_age
    from student
    where st_id = #{stId}
</select>
```

**2嵌套结果例：**
可以看到resultMap中没有额外的查询操作，但是写出来的SELECT语句包含复杂的多表联立
```xml
<resultMap id="studentClassCourseMap" type="student">
    <result property="stName" column="st_name"/>
    <result property="stAge" column="st_age"/>
    <association property="aClass" column="c_id" javaType="class" resultMap="classMap"/>
    <collection property="courseList" column="c_id" resultMap="courseMap" ofType="course"/>
</resultMap>

<select id="queryStAndClassAndCourse" resultMap="studentClassCourseMap">
    select
        s.st_name,
        s.st_age,
        c.c_name,
        co.co_name
    from student s
    join class c on s.c_id = c.c_id
    join course co on s.st_id = co.st_id
    where s.st_id = #{stId}
</select>
<!--这里直接用了多表查询，省去了上面嵌套查询的额外查询-->
```

### 3. [√]后端分页是指前端通过Ajax请求指定页码(pageNum）和每页大小(pageSize)，后端查询出当页的数据返回给前端。

### 4. [√]MyBatis的数据缓存分为会话和应用两个级别，即一级缓存和二级缓存。

### 5. 以下关于`<association>`元素中常用属性说法错误的是
- association用于当**表中含有另一个表的外键时，建立映射关系**，比如说，当Student类中含有Teacher类时，除了要在resultMap中建立Student表和Student类的映射之外，还需要建立Teacher表和Teacher类的映射
- A.[√]property指定映射到的实体类对象属性，与表字段——对应。
- B.[√]column指定表中对应的字段。
- C.[√]javaType指定映射到实体对象属性的类型。
- D.[x]fetchType指定在关联查询时是否启用延迟加载，默认值为eager.
  - 默认值为lazy

**5例：**
```xml
<resultMap type="Student" id="studentResultMap">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <result column="gender" property="gender" />
    <result column="major" property="major"/>
    <result column="grade" property=" grade" />

    <!--学生表中的“导师”外键-->
    <association property="supervisor" javaType="Teacher">
        <id property="id" column="t_id" />
        <result property="name" column="t_name" />
        <result property=" gender" column="t_gender" />
        <result property="researchArea" column=" research_area" />
    </association>
</resultMap>
```

### 6. 下面关于数据库中多表之间关联关系说法错误的是
- A.[√]—对一关联关系可以在任意一方引入对方主键作为外键。
- B.[x]一对多关联关系在“一”的一方，添加“多”的一方的主键作为外键。
  - 比如说一个工厂有很多产品的话，肯定不能在工厂里存储所有产品的主键啊...应该在产品上添加工厂的主键作为外键
- C.[√]多对多关联关系会产生中间关系表，引入两张表的主键作为外键。
- D.[√]多对多关联关系的两个表的主键成可以为联合主键或使用新的字段作为主键。
### 7. 下面关于`<collection>`元素的描述正确的是
- collection加**在resultMap定义的“一对多”中的“一”方，用于在查询“一”的数据时，返回所属的所有“多“的一方**（比如查询工厂时，Factory类下还有个Products的List字段，但是就像上题说的，数据库里肯定不能在工厂表里存储每个工厂的所有产品）
- A.[√]MyBatis就是通过`<collection>`元素来处理一对多关联关系的。
- B.[x]`<collection>`元素的属性与`<association>`元素完全相同。
  - **association只能用于建立一对一的外键关系，而collection只能用于建立一对多的外键关系**
- C.[x]ofType属性与javaType属性对应，它用于指定实体对象中所有属性所包含的元素类型。
  - ofType指定的**是”集合“中元素的类型**，而非对象属性的类型
- D.[x]`<collection>`元素只能使用嵌套查询方式。
  - 见2题例，**可用多表联立进行嵌套结果查询**，Mybatis会自动处理结果

### 8. Mapper接口编程方式很简单，下面有关Mapper接口必须遵守的规范不包括的是
- A.[√]Mapper接口名称和对应的Mapper.xml映射文件的名称必须一致。
- B.[√]Mapper.xml中的namespace与Mapper接口的类路径相同。
  - namespace用于将该配置文件绑定到项目的Mapper接口中，应当填写接口的全限定名（类似这个Mapper本身的JavaType）
- C.[x]Mapper接口中的方法名和Mapper.xml中定义的每个执行语句的name相同。
  - 应当和id相同，SELECT没有name属性
- D.[√]Mapper接口方法的输出参数类型要和Mapper.xml中定义的resultType的类型要相同。

### 9. 下列关于MyBatis框架注解描述错误的是
- A.[√]MyBatis的注解位于org.apache.ibatis.annotations包中
- B.[√]@select、@insert、@update和@delete可以完成常见的CRUD(增删改查) SQL语句映射
- C.[x]注解只能实现“一对一”与“一对多”的关联查询
  - not even a wrong，不关联查询直接跑简单查询也是可以的啊= =
- D.[√]MyBatis框架可以使用@lnsertProvider、@UpdateProvider、@DeleteProvider和@SelectProvider等注解支持动态SQL

### 10.  下列关于MyBatis的缓存机制说法错误的是
- A.[√]MyBatis提供了默认下基于Java HashMap的缓存实现，以及用于与osCache、Ehcache、 Hazelcast和Memcached连接的默认连器。
- B.[√]—级缓存是Session会话级别的缓存，位于表示—次数据库会话级别的SqlSession对象之中，又被称之为本地缓存。
  - 一级缓存的作用域是对于SqlSession而言的，换句话说，对于同一个SqlSession，所有mapper都共享同一个缓存区域
- C.[√]二级缓存是Application应用级别的缓存，它的生命周期很长，它的作用范围是整个Application应用。
  - 二级缓存的作用域也是对于mapper而言的，换句话说，对于同一个mapper的SQL语句，多个SqlSession是共享同一个缓存区域的
- D.[x]一级缓存缓存的是结果对象，二级缓存缓存的是SQL语句。
  - 两种缓存的都是结果数据，缓存语句有什么用啊= =

---

## Spring基础课堂练习（6-8章）

### 1. [√]Spring是一个轻量级的开源框架，并具有简单、可测试和松耦合等特点。
   - 不能再对了

### 2. [x]依赖注入(DI)与控制反转(loC)的含义不同，描述的不是同一个概念。
   - 是同一个概念，IoC是最终目的，而DI是实现这个目的的途径（即通过依赖注入来达成控制反转的效果）

### 3. [√]当Bean的作用域为singleton时，Spring容器就只会存在一个共享的Bean实例，对该Bean的所有请求，容器只会返回同一个Bean实例。
   - 相对的，prototype则会对于每次请求都new出一个新的实例返回

### 4. [√]使用AspectJ实现AOP有两种方式:一种是基于XML的声明式AspectJ，另一种是基于注解的声明式AspectJ。

**4XML声明例：**
```xml
<bean id="myAspect" class="com.itheima.aspectj.xml.MyAspect" />
<aop:config>
    <!--1.配置切面 -->
    <aop:aspect  id="aspect"  ref="myAspect">
        <!--  2.配置切入点 -->
        <aop:pointcut expression="execution(* com.itheima.jdk.*.*(..))"  id="myPointCut" />
        <!-- 3.配置通知 -->
        <!-- 前置通知 -->
        <aop:before method="myBefore" pointcut-ref="myPointCut" />
        <!-- 后置通知 -->
        <aop:after-returning method="myAfterReturning"
                  pointcut-ref="myPointCut" returning="returnVal" />
        <!-- 环绕通知 -->
        <aop:around method="myAround" pointcut-ref="myPointCut" />
        <!-- 异常通知 -->
        <aop:after-throwing method="myAfterThrowing"
                  pointcut-ref="myPointCut" throwing="e" />
        <!-- 最终通知 -->
        <aop:after method="myAfter" pointcut-ref="myPointCut" />
    </aop:aspect>
</aop:config>
```

**4注解声明例：**
```java
@Component
@Aspect
public class AlphaAspect {
    //定义切入点表达式
    @Pointcut ( "execution(*com.nowcoder.community.service.*.*(..)) ".)//使用一个返回返回值为void、方法体为空的方法来命名切入点
    public void pointcut( ) {}

    //前置通知
    @Before( "pointcut() ")public void before() { ... }
    //最终通知
    @After( "pointcut() " )public void after() { ... }
    //后置通知
    @AfterReturning ( "pointcut( )" )public void afterRetuning( ) { ... }
    //异常通知
    @AfterThrowing( "pointcut() ")public void afterThrowing( ) { ... }
    //环绕通知
    @Around ( "pointcut() ")
    public object around(ProceedingJoinPoint joinPoint) throws Throwable {
        system.out.println( "around before" );
        object obj = joinPoint.proceed( );
        System.out.println( "around after" );
        return obj;
    }
}
```

### 5. Spring的核心容器是其他模块建立的基础，以下哪个不是该容器的组成模块
- A.[√]Beans模块
- B.[√]Core模块
- C.[√]Context模块
- D.[x]AOP模块
- 除了A,B,C外，Core Container的另一个模块是SpEL，详见下图
  
![](https://docs.spring.io/spring-framework/docs/4.3.x/spring-framework-reference/html/images/spring-overview.png)

### 6. 下面关于Spring的核心容器描述错误的是
- A.[√]Spring框架提供了两种核心容器，BeanFactory和ApplicationContext
  - `BeanFactory beanFactory = new XmlBeanFactory(new FileSystemResource( "F:/applicationContext.xml"));`
  - `ApplicationContext applicationContext = new FileSystemXmlApplicationContext("F:/applicationContext.xml");`
  - ApplicationContext是BeanFactory的**子接口**（但是两个接口都有实现的Bean），实现了更多功能，见D选项
- B.[√]BeanFactory就是管理Bean的工厂，负责初始化各种Bean，并调用它们的生命周期方法。
  - 正确，ApplicationContext多出来的是资源访问、事务管理这些功能，关于Bean的管理都是前者实现的
- C.[x]BeanFactory是通过XML配置文件加载Bean,而ApplicationContext是通过属性文件加载Bean的。
  - 两者都是通过xml加载的，说到底，**属性文件是tmd啥？**
- D.[√]ApplicationContext是BeanFactory的子接口，也被称为应用上下文，是更常用的Spring核心容器。

### 7. 下列选项中，不属于Spring中实例化Bean的方式的是
- A.[√]构造器实例化
  - `<bean class="org.example.User" id="user"/>`默认就是构造器实例化的，对应@Component注解
- B.[√]静态工厂方式实例化
  - `<bean id="user2" class="org.example.User2Factory" factory-method="getUser"/>`，注意**class也变成了工厂的全限定名**
- C.[√]实例工厂方式实例化
  - `<bean class="org.example.User3Factory" id="user3Factory"/><bean id="user3" factory-bean="user3Factory" factory-method="getUser"/>`
- D.[x]抽象方法实例化
  - 抽象方法根本就没有实例化的过程怎么实例化啊（

### 8. Spring容器支持多种形式的Bean的装配方式，其中不包括
- A.[√]基于XML的装配
- B.[x]基于属性(Properties)的装配
  - 这里我也没搜到Spring中关于Properties的概念，搜到的大部分都是SpringBoot中的properties配置文件
  - 盲猜又是老师自己乱起的名
- C.[√]基于注解(Annotation)的装配
- D.[√]自动装配
  - 就是`@autowired`（类型优先匹配），这里不再赘述了

**8XML装配例：**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="..." class="...">
        <!-- collaborators and configuration for this bean go here -->
    </bean>
    <bean id="..." class="...">
        <!-- collaborators and configuration for this bean go here -->
    </bean>
    <!-- more bean definitions go here -->
</beans>
```

**8注解装配例：**
```java
@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

等效于beans.xml中的

```xml
<beans>
    <bean id="myService" class="com.acme.services.MyServiceImpl"/>
</beans>
```

### 9. 下列有关AOP专业术语中，用于表示切面与程序流程的交叉点的是
- A.[x]Joinpoint
  - Joinpoint是**拦截过程中**拿到的被代理对象正在执行的方法
- B.[√]Pointcut
  - Pointcut指明了Joinpoint的位置，也就是要被拦截的方法的位置
- C.[x]Aspect
  - Aspect是Pointcut和Advice的集合，一般也指Aspect类
- D.[x]Advice
  - Advice是在Joinpoint（也就是被增强的方法）前后要执行的增强操作

### 10. 关于AspectJ注解的介绍，说法错误的是
- A.[√]Aspect用于定义一个切面
- B.[√]Pointcut用于定义切入点表达式
- C.[√]@Before用于定义前置通知，相当于BeforeAdvice
- D.[x]@After用于定义后置通知，相当于AfterReturningAdvice
  - After**不考虑被拦截方法的返回值**，而AfterReturning会**将方法的返回值也拦截下来**

---

## Mybatis与Spring整合（9-10章）

### 1.[x]Spring中的事务管理分为编程式事务管理和声明式事务管理，其中的编程式事务管理是通过AOP技术实现的事务管理。
- 编程式事务是通过`TransactionManager`类及其相应的方法编写事务代码实现的
  - 因此事务管理和业务代码**强耦合**，是不AoP的，类似写多线程同步的感觉
- 声明式事务是通过Spring提供的`@Transactional`注解或xml的`<tx:method>`元素的实现的，**基于AoP**

### 2.[√]注解`@Transactional`与`<tx:method>`元素中的事务属性基本是对应的，并且其含义也基本相似。
- 见1题声明式事务

### 3.[√]MyBaits与Spring进行整合时，Dao层开发既可以使用传统的DAO方式的开发整合，也可以使用Mapper接口方式的开发整合。

**3传统Dao配置例：**
```Java
//interface
public interface StudentDao {
  public Student findById(Integer id);
}
```

手动实现Dao层代码：
```Java
//Impl，注意这里继承了SqlSessionDaoSupport用来获取数据库的session
public class StudentDaoImpl extendsSqlSessionDaoSupport implements StudentDao {
  @Override
  public Student findById(Integer id){
    return this.getSqlSession().selectOne("org.example.po"+".StudentMapper.findById",ID)
  }
}
```

```XML
<?xml version="1.0" encoding="UTF-8"?>
< ! DOCTYPE mapper PUBLIC "- //mybatis.org//DTD Mapper 3.8//EN"
"http: / /mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="org.example.po.StudentMapper">
  <select id="findById" parameterType="Integer"
  resultType="student">
    select * from student where id = #{id}
  </select>
</mapper>
```

**3Mapper接口配置例：**
```Java
//interface
public interface StudentMapper {
  public Student findById(Integer id);
}
```

由Spring自动构造出Mapper的实例化Bean：
```xml
<!--applicationContext.xml-->
...
<beans>
  <!--注册Mapper接口的实例化Bean-->>
  <!--方法1：通过MapperFactoryBean手动配置各个Mapper实例化Bean的属性-->>
  <bean id="customerMapper" class="org.mybatis.spring.mapper.MapperFactoryBean">
    <property name="mapperInterface" value="org.example.mapper.StudentMapper"/>
    <property name="sqlSessionFactory" ref="sqlSessionFactory"/> 
  </bean>
  <!--方法2：通过MapperScannerConfiguer扫描指定包路径下的所有Mapper-->
  <bean class="org.mybatis.spring.mapper. MapperScannerConfigurer">
    <property name="basePackage" value="org.example.mapper"/>
  </bean>
</beans>
```

XML部分无变化
```XML
<?xml version="1.0" encoding="UTF-8"?>
< ! DOCTYPE mapper PUBLIC "- //mybatis.org//DTD Mapper 3.8//EN"
"http: / /mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="org.example.po.StudentMapper">
  <select id="findById" parameterType="Integer"
  resultType="student">
    select * from student where id = #{id}
  </select>
</mapper>
```

### 4.[√]在项目中，业务层(Service层)既是处理业务的地方，又是管理数据库事务的地方。业务层实现类往往需要使用注解@Service和@Transactional来标识。
- 正确，因为一般来说Service内的函数才是相对于业务而言的”原子“操作，事务管理也应当在Service中进行

### 5.JdbcTemplate类包含在Spring JDBC模块的哪个包中
- JdbcTemplate实现了简单的SQL操作、异常处理、事务管理等功能
- A.[√]core(核心包)
- B.[x]dataSource(数据源包)
- C.[x]object (对象包)
- D.[x]support(支持包)

**JdbcTemplate源码：**
```Java
package org.springframework.jdbc.core;

...

public class JdbcTemplate extends JdbcAccessor implements JdbcOperations {
  ...
}
```
### 6.JdbcTemplate的直接父类是
- 见5题JdbcTemplate源码
- A.[√]JdbcAccessor
  - JdbcAccessor是一个抽象类，包含了访问数据源（DataSource）的一些方法
- B.[x]JdbcOperations
  - JdbcOperations是一个接口，要求实现类覆写执行SQL语句的相关方法（excute、query等）
- C.[x]JdbcSupper
- D.[x]Object

### 7.以下关于@Transactional注解可配置的参数信息及描述正确的是
- A.[√]value用于指定需要使用的事务管理器，默认为""
- B.[x]read-only用于指定事务是否只读，默认为`true`
  - 默认是false，用常识想一想大部分事务肯定是读写都有的
- C.[x]isolation用于指定事务的隔离级别，默认为`lsolation.READ_COMMITTED`
  - MySQL默认是可重复读（`REPEATED_READ`），四个事务隔离级别不再赘述
- D.[x]propagation用于指定事务的传播行为，默认为`Propagation.SUPPORTS`
  - 默认是`REQUIRED`

**事务传播级别：**
- Propagation.REQUIRED（有一个事务就行，在哪无所谓）
  - 如果当前存在事务，则加入该事务，如果当前不存在事务，则创建一个新的事务。
- Propagation.REQUIRES_NEW（必须在内层**重新**开一个事务）
  - 重新创建一个新的事务，如果当前存在事务，暂停当前的事务。
- Propagation.NESTED（优先嵌套）
  - 逻辑和REQUIRED的操作一样，区别在于：
  - REQUIRED是加入原事务，因此最终也只有一个事务，回滚时全部回滚
  - NESTED是将自己的事务嵌套到原事务中，回滚时支持只有自己回滚而父事务不回滚
- Propagation.MANDATORY（必须外层**已经**有一个事务）
  - 如果当前存在事务，则加入该事务;如果当前不存在事务，则抛出异常。
- Propagation.NEVER（必须外层**没有任何**事务）
  - 以非事务的方式运行，如果当前存在事务，则抛出异常。
- Propagation.SUPPORTS（有没有事务无所谓）
  - 如果当前存在事务，则加入该事务;如果当前不存在事务，则以非事务的方式继续运行。
- Propagation.NOT_SUPPORTED（只要没有事务就行）
  - 以非事务的方式运行，如果当前存在事务，暂停当前的事务。

### 8.以下不属于MapperScannerConfigurer类在Spring配置文件中使用时可以配置的属性的是
- A.[√]basePackage
  - 指定Scanner搜索的包路径
- B.[√]annotationClass
  - 指定扫描的注解类，默认就是`@Mapper`，即`Mapper.class`
- C.[√]sqlSessionFactoryBeanName
  - 当项目中有多个DataSource时，可以用该Property指明绑定的SqlSessionFactory
- D.[x]mapperlnterface
  - 这里应该是`markerInterface`，指定一个接口，使Scanner**只会扫描实现了该接口的Mapper**

### 9.在MyBatis+Spring的项目中，以下有关事务的相关说法正确的是
- A.[x]在MyBatis+Spring的项目中，事务是由MyBatis来管理的。
  - 事务是由Spring管理的（`TransactionManager`或者声明式的`@Transactional`）
- B.[x]在项目中，数据访问层既是处理业务的地方，又是管理数据库事务的地方。
  - 处理业务的是Service层
- C.[√]进行注解开发时，需要在配置文件中配置事务管理器并开启事务注解。
- D.[x]进行注解开发时，需要使用@Transactional注解来标识表现层中的类。
  - 表现层指**Viewer**和**Controller**（即Web层），但是事务是在**Service**层管理的，即业务层，还有一层是持久层——**Dao**

### 10. Mapper接口编程方式很简单，下面有关Mapper接口必须遵守的规范不包括的是
- A.[√]Mapper接口名称和对应的Mapper.xml映射文件的名称必须一致。
- B.[√]Mapper.xml中的namespace与Mapper接口的类路径相同。
  - namespace用于将该配置文件绑定到项目的Mapper接口中，应当填写接口的全限定名（类似这个Mapper本身的JavaType）
- C.[x]Mapper接口中的方法名和Mapper.xml中定义的每个执行语句的name相同。
  - 应当和id相同，SELECT没有name属性
- D.[√]Mapper接口方法的输出参数类型要和Mapper.xml中定义的resultType的类型要相同。
- 这题是前面的原题

---

## Spring MVC基础（11-12章）

### 1.[√]在web.xml中配置SpringMVC的前端控制器DispatcherServlet，其中`<load-on-startup>`子元素中的1表示容器在启动时立即加载这个Servlet。
- 望文生义，嗯哼

### 2.[x]在Spring MVC的工作流程中，HandlerAdapter将会将ModelAndView对象返回给ViewReslover。
- 见下11.4简答题Spring MVC工作流程，HandlerAdapter将ModelAndView对象返回给**DispatcherServlet**

### 3.[√]在控制器类中，每一个请求处理方法都可以有多个不同类型的参数，以及一个多种类型的返回结果。
- 参考`@RestController`，可以以表单（xxx-form）传入多个参数，也可以返回一个JSON对象作为复杂的返回结果

### 4.[√]在使用POJO类型数据绑定时，前端请求的参数名必须与要绑定的POJO类中的属性名一样。
- 由于JavaScript的对象都是哈希表，当后端返回一个POJO对象时，前端接收到的对象的结构和后端的POJO类就是相同的，直接用相同的字段名去访问

### 5. Spring MVC中的后端控制器是指
- A.[x]HandlerAdapter
- B.[x]DispatcherServlet
- C.[x]ViewReslover
- D.[√]Handler
  - Handler和Controller是同一个概念，后端的控制器就是Controller，详见11.4简答题Spring MVC工作流程

### 6.以下有关Spring MVC支持的返回值类型及说法错误的是
- 视图可以理解为**返回结果的结构**，类似**VO对象**，设置好数据后，根据不同的返回类型（PDF、JSON、JSP）可能需要有不同的渲染/编码方式，在经过ViewResolver渲染后才会返回给前端，在前后端分离的情况下几乎只会用到**JSON视图**来返回给前端JSON对象
- 如果视图以**JSP**返回的话，那么就会直接渲染成一个JSP页面，一般说的**跳转视图**也是指这个，此时视图名称代表跳转的JSP文件名，举例来说，当视图名称为`"hello"`时，控制器会通知前端跳转到`/WEB-INF/jsp/index.jsp`页面下
- A.[√]ModelAndView返回值类型中可以添加Model数据，并指定视图。
  - 新建一个`ModelAndView`对象后，通过`addObject()`方法添加数据，并通过`setViewName()`方法设置视图名称
- B.[x]String返回值类型也可以携带数据并跳转视图。
  - String返回值默认只返回**视图名**(默认情况)或者**字符串数据**(`@ResponseBody`情况)，无法同时做到返回视图和数据（注：其实可以在方法参数添加Model来返回数据，但是这一点和题意不符）
- C.[√]void返回类型主要在异步请求时使用，它只返回数据，而不会跳转视图。
  - 第一种情况：当前操作不需要返回值
  - 第二种情况：通过方法参数的`HttpServletResponse`设置返回值，如`res.setStatus()`等方法
  - 第三种情况：通过方法参数的`HttpServletResponse`设置重定向，如`res.sendRedirect()`
  - 第四种情况：通过`HttpServletResponse`的`getWritter()`方法获取Writer，并返回字符串
- D.[√]String类型除了可以返回视图页面外，还可以进行重定向与请求转发。

**6String返回视图例：**
```Java
@RequestMapping("...")
//如果这里加上@ResponseBody的话，那就是返回字符串数据了
public String test() {
  return "hello"; //视图名称，参考上ModelAndView的setViewName
}
```

**6String重定向例：**
重定向相当于修改地址栏地址并刷新了页面，不仅会清空请求域数据，而且会与服务端进行两次Http请求
```Java
@RequestMapping("...")
public String test(Model model) {
  return "redirect:/aa/index"
}
```

**6String转发例：**
转发只是修改了服务端响应的部分，不会改变地址栏也不会丢失数据
```Java
@RequestMapping("...")
public String test(Model model) {
  return "forward:/aa/index"
}
```

### 7.RequestMapping注解类型的作用是
- RequestMapping指明了该方法**拦截Http请求的哪个请求路径/域名**，这题的选项给的挺模糊的，反正大概是这么一个意思
- A.[√]用于映射─个请求或—个方法。
- B.[x]用于映射一个控制器类。
- C.[x]用于映射请求参数。
- D.[x]用于映射请求类型。

### 8.以下有关Spring MVC数据绑定中集合数据绑定的说法正确的是
- 绑定数组时：Controller方法参数可以直接接受一个`Array`数组，可以直接在方法参数中传递而不需要封装，常用在**根据主键id批量删除**
- 绑定集合时：Controller方法参数不能直接接受一个`List<POJO>`集合，需要将该集合封装到一个类中来传递，常用在**批量修改数据**
- A.[x]批量删除用户操作时，前端请求传递过来的参数就会包含多个相同类型的数据，此时可以采用数组类型数据绑定的形式。
  - 存疑，它想强调的可能是**相同名称**的数据，比如批量删除肯定传过来的都是**名称为Id的Integer**，如果在一堆Id中间加一个Age进去也算相同类型（Integer），但是这时候就不对了（但是这么有点强行解释的意思了）
- B.[x]使用集合数据绑定需要后台方法中定义一个集合类型参数介绍绑定前端请求参数。
  - 不能直接在参数中使用`Collection`集合类，需要将其封装，见D选项
- C.[x]绑定数组与绑定集合页面传递的参数相同，只是后台接收方法的参数不同。
  - 传递数组时，前端传递的参数是**包含多个单一类型的简单数组**，而传递集合时，前端传递的参数是**包含多个复杂对象的对象数组**
- D.[√]在使用集合数据绑定时，后台方法中不支持直接使用集合形参进行数据绑定。
  - Controller方法参数不能直接接受一个`List<POJO>`集合，需要将该集合封装到一个类中来传递

**8传递数组例**
```Java
@RestController
public class UserController{
  @RequestMapping("...")
  public void delete(Integer[] usersId){
    ...
  }
}
```

**8传递集合例**
```Java
public class UsersVo{
  List<User> Users;
}

@RestController
public class UserController{
  @RequestMapping("...")
  public void update(UsersVo usersVo){
    ...
  }
}
```

### 9.下面不属于Spring MVC中进行数据绑定的常用默认参数类型的是
- A.[√]HttpServletRequest
- B.[√]HttpServletResponse
- C.[√]HttpSession
- D.[x]ModelView
  - 应当是Model/ModelMap，`ModelAndView`类只能自行`new`，不能在**方法参数**中直接引入

### 10.下面关于包装POJO类型数据绑定的说法正确的是
- A.[√]如果查询条件参数是包装类的直接基本属性，则参数名直接用对应的属性名。
- B.[x]如果查询条件参数是包装类的直接基本属性，则参数名必须使用对应的“对象.属性名”。
  - 方法参数里都不知道对象的引用叫什么怎么可能写**对象.属性名**
- C.[x]如果查询条件参数是包装类中POJO的子属性，则参数名必须为属性名。
- D.[x]如果查询条件参数是包装类中POJO的子属性，则参数名必须为“对象.子属性.属性值”的形式。
  - C和D一起解释，比如说`Order`类同时包含`Product`和`Customer`，你就不能在参数里就直接**解构这个Order**，正确的做法是参数里把**整个Order对象**传进来，然后在方法体中再去获取它的成员

---

## SSM框架整合（13-15章）

### 1.[x]`<mvc:interceptor>`中的子元素可以按照任意位置编写。
- 课件原文：**注意:`<mvc:interceptor>`中的子元素必须按照上述代码的配置顺序进行编写，否则文件会报错。**

**1拦截器配置例**
```XML
<mvc:interceptors>
  <!--全局拦截器-->
  <bean class="cn.test.interceptor.Customlnterceptor"/>

  <!--局部拦截器-->
  <mvc:interceptor>
    <!--拦截地址-->
    <mvc:mapping path="/**">
    <!--例外地址-->
    <mvc:exclude-mapping path="/login"/>
    <!--局部拦截器类-->
    <bean class="cn.test.interceptor.Interceptor1"/>
  </mvcinterceptor>

  <!--局部拦截器-->
  <mvc:interceptor>
    <mvc:mapping path="/hello"/>
    <bean class="cn.test.interceptor.Interceptor"/>
  </mvc:interceptor>
</mvc:interceptors>
```

### 2.[√]Spring MVC的文件上传是通过MultipartResolver对象实现的，并可以通过UUID等方式对上传的文件名称进行重命名来避免重名问题。
- 上传文件时，前端传递一个**multipart/form-data**类型的数据，后端通过**CommonsMultipartResolver**解析文件
- 下载文件时，后端将文件以字节流的形式写到`HttpServletResponse`中，前端会接收到一个**Blob**对象（即**大型二进制对象**）

### 3.[√]Spring MVC框架通过HandlerExceptionResolver处理程序异常，它仅有一个接口方法resolveException()。

**3HandlerExceptionResolver源码：**
```Java
public interface HandlerExceptionResolver {
    @Nullable
    ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, @Nullable Object handler, Exception ex);
}
```

### 4.[x]Spring 2.0版开始引入格式化转换框架，这个框架位于org.springframework.format包中。
- Formatter是在Spring 3.0加入的，包名是对的

**4Formatter接口源码：**
```Java
package org.springframework.format;

public interface Formatter<T> extends Printer<T>, Parser<T> {
}
```

### 5.使用@RequestMapping注解限定POST请求方法时，需要做出的指定是
- A.[√]method=RequestMethod.POST
- B.[x]method=HttpMethod.POST
  - Spring也有这个枚举，但是用这个会报错（因为只接受`RequestMethod`）
- C.[x]method=POST
- D.[x]method=Method.POST
  - Method指的一般是反射的Method类，反射的方法类当然不对啦

### 6.以下有关Spring MVC中自定义拦截器的方法说法错误的是
- A.[√]自定义的拦截器可实现Handlerlnterceptor接口来实现。
- B.[√]preHandler()方法会在控制器方法前执行，其返回值表示是否中断后续操作。
- C.[x]postHandle()方法会在控制器方法和解析视图之后执行。
- D.[√]afterCompletion())方法:该方法会在整个请求完成，即视图渲染结束之后执行。
- 正确顺序应当是：**preHandle拦截->HandlerAdapter处理请求（Handle）->postHandle拦截->DispatcherServlet渲染(Render)->afterCompletion拦截**
- 注：只有preHandle拦截器是**按照index正序顺序拦截**的（1,2,3...），其余的都是**按照逆序**拦截（...3,2,1）

### 7.关于使用拦截器实现的用户权限验证的执行流程，下面说法错误的是
- 这里的业务逻辑都是课件自己设计的，出的题很怪，比如说C选项，你在拦截器写了提示的代码就会有提示，不写就不会有，包括A和B也是你想怎么重定向/跳转就怎么写业务代码，不是定死的。这里只能从几个选项里选出那个明显错误的D选项
- A.[√]只有登录后的用户才能访问系统中的主页面。
- B.[√]如果没有登录系统而直接访问主页面，则兰截器会将请求拦截，并转发到登录页面。
- C.[√]如果用户名或密码错误，会在登录页面给出相应的提示信息。
- D.[x]当已登录的用户在系统主页中单击“退出”链接时，系统会回到主页面。
  - 应当回到登陆页面，总不能注销了还在个人主页吧
  - 注：这里的逻辑和SpringSecurity是类似的，访问网站直接进入**登陆页面**，如果不登陆的话整个网站都访问不了，可以认为这个网站**整体就是一个后台网站**，不包括前台的部分

### 8.下面关于文件下载方法内容描述错误的是
- A.[√]响应头信息中的MediaType代表的是lnterner Media Type (即互联网媒体类型) ，也叫做MIME类型。
  - **互联网媒体类型**（Internet Media Type）也叫**内容类型**（Content Type）和**多用途互联网邮件扩展**（英语：Multipurpose Internet Mail Extensions，缩写：MIME），话是这么说但是该协议现在已经并不局限于邮件附件，而是成为了通用的媒体传输协议
- B.[√]MediaType.APPLICATION_OCTET_STREAM的值为application/octet-stream，即表示以二进制流的形式下载数据。
  - 详见维基百科[互联网媒体类型#Type_application](https://zh.wikipedia.org/wiki/%E4%BA%92%E8%81%94%E7%BD%91%E5%AA%92%E4%BD%93%E7%B1%BB%E5%9E%8B#Type_application)——**application/octet-stream:任意的二进制文件（通常做为通知浏览器下载文件）**
- C.[√]HttpStatus类型代表的是Http协议中的状态。
  - 就是三位的状态码，具体含义见下
- D.[x]HttpStatus.OK表示500，即服务器已成功处理了请求。
  - 1XX：请求处理中
  - 2XX：成功（Success）
  - 3XX：重定向
  - 4XX：客户端错误
  - 5XX：服务端错误

### 9.在下面选项中，不属于整合SSM框架所编写的配置文件的是
- A.[√]db.properties
  - 数据库常量配置文件
- B.[√]applicationContext.xml
  - Spring配置文件
- C.[√]mybatis-config.xml
  - Mybatis配置文件
- D.[x]Struts.xml
  - 为啥会有Strust? Strusts是和Spring MVC相同定位的Web MVC开发框架，但是已经是上一代的框架了，而且也不可能在一个项目中同时用到两种Web MVC框架
- 除此之外还需要配置SpringMVC的配置文件**springmvc-servlet.xml**和Servlet的web容器配置**web.xml**

### 10.在SSM框架整合中，下列选项中不需要配置在web.xml中的是
- A.[√]Spring的文件监听器
- B.[√]编码过滤器
- C.[x]视图解析器
- D.[√]Spring MVC前端控制器

**在springmvc-servlet.xml中配置的内容：**
- ControllerComponent控制器组件扫描
- Annotation-Driven注解驱动
- Resources静态资源访问（static）
- MultipartResolver文件解析器
- ViewResolver视图解析器
- Intercepters拦截器

**在web.xml中配置的内容：**
- ContextLoaderListener文件监听器
- CharacterEncodingFilter编码过滤器
- DispatcherServlet前端控制器
- 可以看到web.xml中配置的都是一些系统级别的整体设置，并不和SpringMVC强绑定

---

## 1.2 Mybatis框架简介（名词解释）

### 概念

**数据持久化**：将内存中的数据模型转换为存储模型，以及将存储模型转换为内存中的数据模型的统称。数据模型可以是任何数据结构或对象模型，而存储模型可以是关系模型、XML、二进制流等。

**Mybatis**：Mybatis是一个开源的数据持久层框架，内部封装了通过JDBC访问数据库的操作，支持普通的SQL查询、存储过程和高级映射，消除了所有JDBC代码和参数的手工设置和结果集的检索。
- 主要思想是将程序中的大量SQL语句剥离出来，配置在文件中

**ORM框架**：Object Relational Mapping——对象关系映射，解决面向对象语言和数据库数据类型不匹配的技术。通过描述Java对象和数据库表之间的映射关系，自动将Java中的对象持久化到关系型数据库的表中。是一种数据持久化技术，在对象模型和关系型数据库之间建立对应关系，并提供通过JavaBean对象操作数据库表中数据的机制。

**POJO对象**：Plain Old Java Object——普通旧式Java对象，符合JavaBean规范的实体类，不需要继承/实现任何Java基类/接口，其状态保存在属性中，访问属性必须通过对应的getter方法和setter方法。

## 1.3 Mybatis工作原理（简答）

1. 读取配置文件`mybatis-config.xml`，包含Mybatis的全局配置信息，用于获取数据库链接
2. 读取多个映射文件`mapper.xml`，每个映射对应数据库中的一张表
3. 通过配置信息构建会话工厂`SqlSessionFactory`（该类是线程安全的）
4. 创建会话对象`SqlSession`（该类是线程不安全的），该对象包含执行SQL的所有方法
5. 创建`Executor`执行器，通过`SqlSession`传递的参数动态生成Sql语句并负责查询缓存的维护
6. 创建`MappedStatement`对象，用于存储要映射的SQL语句的ID、参数等信息。`mapper.xml`中的一个SQL语句对应一个`MappedStatement`对象，SQL语句的ID就是`MappedStatement`的ID
7. 输入映射：`Executor`通过`MappedStatement`将输入的Java对象映射到SQL语句中
8. 输出映射：`Executor`通过`MappedStatement`将SQL输出的结果映射至Java对象中

## 2.1 Mybatis核心接口和类（名词解释）

### 概念

**SqlSessionFactoryBuilder**：负责构建`SqlSessionFactory`，并提供多个`build()`方法的重载，特点是用过即丢，创建`SqlSessionFactory`后就不再需要了，因此最佳范围是存在在方法体内，即局部变量

**SqlSessionFactory**：创建`SqlSession`实例的工厂，Mybatis的所有应用以`SqlSessionFactory`为中心，可以通过其`openSession()`方法来获取`SqlSession`实例
- openSession(boolean)：传入true时表示开启自动提交，无事务控制，默认为true
- `SqlSessionFactory`的生命周期是**Application**，一旦创建就会在整个应用运行过程中始终存在，没有必要销毁或者再次创建，即**单例模式**

**SqlSession**：用于执行持久化操作，类似JDBC的`Connection`对象，提供了面向数据库执行SQL命令所需的所有方法，可以通过`SqlSession`实例直接运行已映射的SQL语句
- 生命周期取决于**数据库会话**，每次访问都会创建，并且是**thread local**的，即每个线程独占自己的`SqlSession`实例，不与其他进程共享（因为该对象是非线程安全的），范围应当是**request作用域或方法体内**

## 2.3 Mybatis映射文件（名词解释&简答）

这段写的我吐血...

注：整个xml并**不一定逻辑通顺**，仅用来帮助理解映射文件的元素使用方法，比如说前面举例用user，后面就用student了

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper ...>
<!--namespace属性指向mapper.xml所对应的Mapper接口的全限定名-->

  <select ...>
  <!--id属性表示命名空间中的唯一标识符-->
  <!--parameterType属性表示方法传入参数的全限定名（可选，因为Mybatis支持类型推断）-->
  <!--resultType属性表示SQL语句返回类型的全限定名-->
  <!--resultMap属性表示外部resultMap的命名引用，和resultType二选一使用-->
  <!--flushCache属性表示每次查询是否清空缓存，默认为false-->
  <!--useCache属性表示是否使用二级缓存，默认为true-->
  <!--timeout属性表示超时时间，单位为秒-->
  <!--fetchSize属性表示获取结果的容量-->
  <!--statementType属性设置使用JDBC的哪个Statement，可选项为STATEMENT,PREPARED(默认),CALLABLE-->
  <!--resultSetType属性表示结果集类型，可选项为FORWARD_ONLY,SCROLL_SENSITIVE,SCROLL_INSENSITIVE，无默认值-->
    select 
    <include refid="userColumns"> 
      <property name="extra" value="address"/>
    </include>
    from user where id =#{id}
  </select>

  <insert ...>
  <!--支持大部分select的属性-->
  <!--keyProperty属性指示将插入的返回值赋值给POJO的哪个属性，一般绑定为主键-->
  <!--keyColumn属性指示第几列字段为主键，当且仅当主键不在第一列时需要设置-->
  <!--useGeneratedKeys属性指示使用JDBC的getGeneratedKeys()方法获取数据库内部生成的主键，默认为false-->
    <selectKey ...>
    <!--当且仅当当前数据库不支持自动生成主键时，使用该元素来自动生成主键-->
    <!--keyProperty属性参考上文-->
    <!--resultType属性参考上文-->
    <!--statementType属性参考上文-->
    <!--order属性：BEFORE指示先设置主键再插入元素，AFTER指示先插入元素再配置主键-->
      select if(max(id) is null,1,max(id)+1) as newId from user
    </selectKey>
    insert into user(id,userName,userPassword,...) values (#{id},#{userName},#{userPassword},...)
  </insert>
    
  <update>
  <!--参考select-->
  </update>

  <delete>
  <!--参考select-->
  </delete>

  <sql id="userColumns">
  <!--宏定义-->
  <!--id属性指示命名空间的唯一标识符-->
    userName,userPassword,gender,birthday,phone,${extra}
  </sql>

  <resultMap>
  <!--用于构建复杂的类和表的映射关系-->
  <!--id属性指示命名空间的唯一标识符-->
  <!--type属性将其绑定到表名上-->
    <constructor>
    <!--用于向该POJO类的构造器传入参数-->
      <idArg/><!--指示主键字段-->
      <arg/>
    </constructor>

    <result property="stName" column="st_name"/>
    <result property="stAge" column="st_age"/>
    <!--result用于绑定POJO类中的字段名和数据库表中的字段名-->

    <association property="class" column="class_id" javaType="Class" resultMap="classMap"/>
    <!--association用于绑定POJO中的引用和数据库表中的外键-->

    <collection property="courses" column="course_id" ofType="Course" resultMap="courseMap"/>
    <!--collection用于构建一对多关系（如学生的选课列表）-->

   <discriminator column="enabled" javaType="int">
   <!--根据返回结果中的某个字段切换不同的类型-->
        <case value="1" resultMap="enabledStudent"/>
        <case value="0" resultMap="disabledStudent"/>
    </discriminator>
  </resultMap>
</mapper>
```

## 3.4 使用foreach元素完成复杂查询（名词解释？）

```XML
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper ...>
  <select ...>
    select * from user 
      where role in
        <foreach 
          collection="array" 
          item="roleIds" 
          open="(" 
          separator="," 
          close=")">
        <!--collection属性指示入参类型，可选项为：list,array,map-->
        <!--item属性指示集合在下文的别名-->
        <!--index属性指示当前迭代的位置，用于在下文引用-->
        <!--open、separator、close不再赘述-->
          #{roleIds}
        </foreach>
  </select>
</mapper>
```

## 3.5 bind元素（名词解释？）

```XML
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper ...>
  <select 
    id="findUserByName" 
    parameterType="User" 
    resultType="User">
    <bind 
      name="pattern_username" 
      value="'%'+_parameter.getUserName()+'%'"/>
    <!--bind可以将某些字段经过格式化处理后再在下文中通过name别名引用，
    常用于模糊查询，具体属性用法不再赘述-->
    select * from user 
      where username like #{pattern_username}
  </select>
</mapper>
```

## 4.2 一对一关系Association（名词解释？）
```XML
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper ...>
  <resultMap>
    <association 
      property="class" 
      column="class_id" 
      javaType="Class" 
      select="mybatis.mapper.ClassMapper.selectClassByStId"/>
    <!--association用于绑定POJO中的引用和数据库表中的外键-->
    <!--property属性指定POJO中对应的字段名-->
    <!--column属性指定数据库表中对应的字段名-->
    <!--javaType属性指定该字段的Java类型-->
    <!--resultMap属性指定字段的resultMap-->
    <!--select属性：当该字段需要通过嵌套查询获取数据时，指定对应的查询操作-->
    <!--fetchType属性指定在关联查询时是否启用延迟加载，可选项为lazy(默认),eager-->
  </resultMap>
</mapper>
```

## 4.3 一对多关系Collection（名词解释？）
```XML
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper ...>
  <resultMap>
    <collection 
    property="courseList" 
    column="st_id" 
    ofType="course" 
    select="mybatis.mapper.CourseMapper.selectCourseByStId"/>
    <!--collection用于在一对多关系查询一方时，获取对应的多方数据-->
    <!--和association不同点在于javaType换成了ofType，指示集合元素的类型-->
  </resultMap>
</mapper>
```

## 5.2 事务管理（名词解释）

### 概念

**事务**：事务是由一步或几步操作组成最小的逻辑执行单元，整个事务不能被拆开执行，要么全部执行，要么全部取消执行。一般来说，一个业务逻辑往往具有原子性，应当使用事务，如转账操作
- 事务的特性：**ACID**
  - **Atomicity——原子性**：事务是最小执行单位，不可再分
  - **Consistency——一致性**：事务执行的结果，必然使数据库从一种一致性状态转变为另一种一致性状态（如转账操作，前后总额不变）
  - **Isolation——隔离性**：各个事务互不干扰，一个事务的内部操作不能影响其他事务的操作结果
  - **Durability——持久性**：事务一旦提交，对数据的变更就应当持久化，如记录到永久存储器中

**Transaction接口**：
包含`getConnection()`、`commit()`、`rollback()`、`close()`方法，有`JdbcTransaction`和`ManagedTransaction`两个实现类，前者通过JDBC自带的事务管理机制实现事务管理，后者通过第三方容器实现事务管理（如WebLogic、JBOSS等）
- ManagedTransaction的`commit()`和`rollback()`不会进行任何操作，将具体实现交给第三方容器处理（可能是通过拦截器之类的手段）

## 6.2 Spring的核心容器（名词解释）

### 概念

**BeanFactory**：提供了完整的IoC服务支持，负责管理Bean，包括Bean的初始化和生命周期的控制等功能，创建时需要提供容器的详细配置信息
- 实现类：`XmlBeanFactory`

**ApplicationContext**：是`BeanFactory`的子接口，也叫做应用上下文，除了BeanFactory的功能外，还添加了国际化、资源访问、事件传播等功能
- 实现类：`ClassPathXmlApplicationContext`、`FileSystemXmlApplicationContext`
- 创建后通过`Object getBean(String name)`和`<T> T getBean(Class<T> requiredType)`获取Bean实例

## 6.4 依赖注入和控制反转（名词解释）

### 概念

**控制反转**：Inverse of Control，指对象的实例不再由调用者/应用代码创建，而是由容器（Spring）负责管理，从而将实例的控制权从应用代码转移到框架容器

**依赖注入**：Dependency Inject，当类A包含一个类B成员时，实例化A的过程则依赖于B的实例化，在业务逻辑复杂的情况下，会产生一个复杂的依赖关系链，导致代码的强耦合——增加了开发的复杂程度。在引入Spring框架后，实例的生命周期的控制转移给Spring，由Spring负责将被依赖对象赋值给依赖对象的成员，为调用者注入了其依赖实例。
- 注入方法：**setter方法注入**和**构造方法注入**
- IoC和DI是从两个角度描述的同一个概念

## 7.2 Bean的实例化（简答）
见Spring基础课堂练习（6-8章）第七题：

### 构造器实例化
```XML
<bean id="user" class="org.example.User"/>
```

### 静态工厂方式实例化
```XML
<bean id="user2" class="org.example.User2Factory" factory-method="getUser"/>
```

### 实例工厂方式实例化
```XML
<bean id="user3Factory" class="org.example.User3Factory"/>
<bean id="user3" factory-bean="user3Factory" factory-method="getUser"/>
```

## 7.4 Annotation装配（名词解释）

Bean的装配方式：XML装配、Annotation装配、自动装配
- 画考试范围没有画XML装配（7.3）这一节，可能是不打算考吧

### 概念

**@Component**：仅表示该类是一个Bean，并不说明该类的具体含义及功能

**@Repository**：将Dao层的类标识为Bean，额外支持了数据库异常的处理

**@Service**：将业务逻辑层的类标识为Bean

**@Controller**：将控制层的类标识为Bean

**@Autowired**：指示Spring装配该成员变量，优先按照Bean类型匹配

**@Qualifier**：和@Autowired配合使用，传入一个Bean实例名称后强制转为优先按照该Bean实例名称匹配

**@Resource**：指示Spring装配该成员变量，优先按照Bean名称匹配
- name属性用于限定Bean实例名称
- type属性用于限定Bean实例类型

### 组件扫描

在Spring配置文件中配置：

```XML
<context:component-scan base-package="包路径">
```

自动注册该包路径下所有包含上述的Bean注解的Bean组件

## 7.5 自动装配（名词解释）

除`@Autowired`和`@Resource`外，也可以在XML中配置自动装配
- 注：这个分节真的有点迷惑= =自动装配的注解不在自动装配这一节里说

可以在配置文件的`<bean>`元素中设置**autowired**属性来设置自动装配的方式

|可选项|含义|
|-----|----|
|default|继承父标签`<beans>`中**default-autowire**的设置|
|byName|名称优先匹配，没有满足类型则不进行装配|
|byType|类型优先匹配，没有满足类型则不进行装配，如果有多个满足类型则抛出异常|
|constructor|类似byType，但是优先寻找**构造器参数一致**的构造方法|
|no|不进行自动装配|

## 7.6 Bean的作用域（自行加入）

虽然没有画范围，但是这是很重要的东西还是记一下

除前两个作用域外，剩下的仅作了解即可

|作用域（7个）|含义|
|-----|----|
|singleton|单例模式，每次获取Bean都只会返回同一个Bean实例|
|prototype|原型模式，每次获取Bean都会返回一个新的Bean实例|
|request|每个HttpRequest都会装配一个新的Bean实例，仅在该Request内有效|
|session|每个session都会装配一个新的Bean实例，仅在该session内有效|
|globalSession|每个全局Http Session装配一个Bean实例，仅在使用portlet上下文时有效（？）|
|application|每个SevletContext装配一个Bean实例，仅在Web相关的ApplicationContext中生效|
|websocket|每个websocket装配一个Bean实例，仅在Web相关的ApplicationContext中生效|

## 7.7 Bean的生命周期（自行加入）

虽然没有画范围，但是这是很重要的东西还是记一下

![1703769492357](image/J2EE考试范围及复习提纲/1703769492357.png)
- ③、④、⑤、⑦仅在Bean实现了对应接口时生效
- ⑥和⑨在Bean涉及到AoP相关增强时生效
- ⑧在指定了初始化方法时生效（init-method）
- ⑩取决于该Bean是`singleton`还是`prototype`
- ⑪取决于该Bean是实现了`Disposable`接口还是在配置文件中设置了`destory-method`

## 8.1 Spring AoP简介（名词解释）

### 概念

**面向切面编程**：Aspect Oriented Programming，是对OOP的有益补充，适用于具有横切逻辑的场合（如访问控制、事务管理、性能检测）。举例来说，我们可能会在项目的各个业务代码都穿插一些**日志输出**、**事务控制**（这些应用场景被叫做**切面——Aspect**）相关的代码，这些代码往往有两个特性：**零散分布在项目各处**和**集中分布在业务代码前后**，前者让我们无法通过常规的面向对象方式解决这个问题，但后者让我们可以通过**代理模式/装饰器模式**来解决该问题。Spring AOP允许我们将这些代码（这些代码被叫做**通知——Advice**）从业务代码中抽离出来，集中放在一起管理。当我们获取相关的Bean实例时，Spring并不会返回我们直接定义的Bean，而是设计一个新的类——该类的大部分代码和我们定义的Bean相同，但是**在相关的业务方法前后加回了我们原本抽离的代码**，并将实例化后的**代理对象**返回给调用者

**切面**：Aspect，这里指封装的用于横向插入系统功能的类

**连接点**：Joinpoint，指在程序执行过程中的某个阶段点。在Spring AOP中，通知方法可以引入Joinpoint参数，从而对正在执行的方法进行调用等操作

**切入点**：Pointcut，指切面与程序流程的交叉点，即需要处理的连接点
- 简单来说，在Spring AOP中，Pointcut指出了哪个方法需要被拦截，而Joinpoint则是当前正在被拦截的那个方法

**通知**：Advice，指在特定切入点执行的增强处理，即上文中提到的被抽离的增强代码，是切面的具体实现

**目标对象**：Target Object，指被代理的对象，也叫做被通知对象/被增强对象

**代理**：Proxy，指目标对象被应用AOP后，动态创建出来的代理对象
- **AOP代理**：AoP Proxy，指被AOP框架创建的代理对象（因为代理模式并不只用在AOP中）

**织入**：Weaving，指将通知代码插入到目标对象，并生成代理对象的这一过程

## 8.4 基于XML的声明式AspectJ（简答）

## 9.1 Spring JDBC（名词解释）

### 概念

**JdbcTemplate**：数据抽象层的基础，继承自抽象类`JdbcAccessor`，并实现了`JdbcOperations`接口
- `JdbcAccessor`提供了一些公共属性
  - `DataSource`：用于获取数据库连接，还可以引入对数据库连接的缓冲池和分布式事务的支持
  - `SQLExceptionTranslator`：负责对`SQLException`进行转译
- `JdbcOperations`定义在JdbcTemplate在可以使用的操作集合，包括添加、修改、查询、删除等

**Spring JDBC模块**：主要由四个包组成
- **core**：核心包，包含JDBC的核心功能——`JdbcTemplate`类、`SimpleJdbcInsert`类、`SimpleJdbcCall`类和`NamedParameterJdbcTemplate`类
- **dataSource**：数据源包，访问数据源的实用工具类
- **object**：对象包，以OOP的方式访问数据库，执行查询并将返回结果转为业务对象，在数据库表和业务对象之间建立映射
- **support**：支持包，包含core包和object的支持类，如提供异常转换功能的SQLException类

## 11.3 Spring MVC的工作流程（简答）

### SpringMVC的特点
来自章首：
- 采用MVC设计模式
- 松耦合可插拔的组件结构
- 高度的可配置性、扩展性和灵活性
- 注解驱动
- RESTful风格的支持

来自11.3.3：
- MVC之间角色划分清晰
- Spring生态的一部分，完美兼容Spring家族其他框架
- 灵活性强，便于和其他框架集成
- 配置灵活
- 面向接口编程
  - 提供了大量控制器接口和实现类，可以使用现成的实现类也可以自己实现
- 支持多种视图技术
  - JSP、Velocity、FreeMarker等
- 支持国际化
- 提供开发Web应用的完整流程
- 提供前端控制器DispatcherServlet
  - 后端开发人员无需顾虑前端请求的接受和转发等问题
- 数据绑定
- 内置输入参数校验
- 基于XML的配置文件，编辑不需要重新编译整个项目

### 简述Spring MVC的工作流程
1.  用户通过浏览器发送请求，请求会被 Spring MVC 的**前端控制器-DispatcherServlet**接收。
2.  DispatcherServlet 拦截到请求后，会调用**处理器映射器-HandlerMapping**。
3.  HandlerMapping根据请求 URL 找到具体的**处理器-Handler** ，生成Handler对象（如果有，还会生成拦截器对象）并返回给 DispatcherServlet 。
4. DispatcherServlet 根据返回信息（Handler）选择合适的**处理器适配器-HandlerAdapter**。
5. HandlerAdapter 会调用并指定 Handler 。此处和上述所说的处理器 Handler ，就是我们所编写的 Controller 类。
6. Controller 执行完成后，会返回一个 **ModelAndView 对象**，该对象中会包含**视图名**和**模型对象**。
7. HandlerAdapter 将 ModelAndView 返回给 DispatcherServlet 。
8. DispatcherServlet 会根据返回信息（ModelAndView）选择一个合适的**视图解析器-ViewResolver**。
9. 视图解析器 ViewResolver 解析视图后，会向 DispatcherServlet 返回具体的 View 对象。
10. DispatcherServlet 对 View 进行渲染。即，将**模型数据**填充至**视图**中。
11. DispatcherServlet 将渲染后的结果返回、发送给客户端浏览器。

在上述执行过程中，DispatcherServlet、HandlerMapping、HandlerAdapter 和 ViewResolver 对象的工作都是在框架内部执行的，开发人员并不需要关心这些对象内部实现过程。

和程序员有关的内容只有 **Handler（即，代码中的 Controller）**，和 ModelAndView 对象

## 11.4 Spring MVC的核心类（名词解释）

### 概念

**MVC**：Model（模型）、View（视图）和Controller（控制器）
- Model：负责数据逻辑（业务规则）的处理和实现数据操作——JavaBean
- View：负责格式化数据并展现给用户，包括数据展示、用户交互、界面设计等——JSP/Html
- Controller：负责接受并转发Http请求，对请求进行处理后指派视图或将响应结果发送给客户端——Servlet

**DispatcherSerlet**：前端控制器，负责将前端传来的Http请求分发

**Controller**:控制器，这里特指后端控制器，用于处理特定的Http请求，将请求结果传递给视图以展现HTML，或者将请求结果写入Response响应体中返回给前端（RESTful）

**@RequestMapping**：指示该类/该方法处理的URL请求路径
- value:URL的相对路径
- name:映射别名
- method:指示该类/该方法只处理某种特定方法的请求（GET/POST/DELETE/PUT等）
- params:指示请求体(HttpRequest)中必须包含某些参数
- headers:指示请求头(Header)中必须包含某些参数
- consumes:指示请求头中指定的内容类型（Context-Type）
- produces:指示请求头中指定的返回类型(Accept)
- 除`@RequestMapping`外，还可以用`@GetMapping`、`@PostMapping`等注解直接说明该方法处理的请求方法

### DispatcherServlet配置

```XML
<!--web.xml-->
<servlet>
<!--配置前端过滤器-->
  <servlet-name>springmvc</servlet-name>
  <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
  <!--初始化时加载配置文件-->
  <!--不配置则默认寻找WEB-INF/[servletName]-servlet.xml-->
  <init-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:springmvc-config.xml</param-value>
  </init-param>
  <!--表示容器在启动时立即加载Servlet，默认为0 -->
  <load-on-startup>1</load-on-startup>
</servlet>
<servlet-mapping>
  <servlet-name>springmvc</servlet-name>
  <ur1-pattern>/</ur1-pattern>
</servlet-mapping>
```

### Controller 配置

通过`@Controller`注解声明一个类为控制器
- 也可以通过实现`Controller`接口来声明，但是这种方式已经过时了，且只能处理**一个**请求
- 要注意的是，不能忘了在配置文件中配置**组件扫描**来将该包下的控制器类注册为Bean

```XML
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmins: context="http://www.springframework.org/schema/context"
        xsi:schemaLocation="http://www.springframework.org/schema/beans
                            http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
                            http://www .springframework.org/schema/context
                        http://www.springframework.org/schema/context/spring-context-3.2.xsd">
                        <!--↑这里要记得引入spring-context-->
  <!--指定需要扫描的包-->
  <context: component-scan base-package="com.test.controller"/>
</beans>
```

通过在**控制器类**或者**控制器方法**上添加`@RequestMapping`指示该类/方法处理的URL请求路径
- 当在类上标注该注解时，相当于在该类下的所有方法都添加了一级**父级路径**

在控制器的**请求处理方法**中，可以直接将`HttpServletRequest`、`HttpServletResponse`和`HttpSession`三个对象加到方法参数中，Spring会自动处理这三个参数，将对应内容传入方法中
- 除此之外，还可以传入:`WebRequest`、`Locale`、`TimeZone`、`InputStream/OutputStream`、`HttpMethod`、`Principal`、`HttpEntity`、`ModelMap`(这个在之前的数据绑定也提到过)、`RedirectAttribute`、`BindingResult`、`SessionStatus`、`UriComponentsBuilder`等参数

常见的返回值类型：
- **ModelAndView**
  - 添加Model数据，并指定视图
- Model
- Map
- View
- **String**
  - 跳转视图（不能携带数据），此时通过**方法参数**的Model参数写入数据，void同理
  - 在视图名前添加`redirect:`、`forward:`可以将**跳转**操作变更为**重定向**、**转发**
- **void**
  - 异步请求，只返回数据，不跳转视图
- HttpEntity<?>/ResponseEntity<?>
- Callable<?>
- DeferredResult<?>

## 12.1 数据绑定（名词解释&简答）

### 概念

**数据绑定**：SpringMVC通过`DataBinder`将Http请求的参数进行类型转换，并赋值给控制器方法中的参数

### 数据绑定的过程

![1704268984298](image/J2EE考试范围及复习提纲/1704268984298.png)

1. SpringMVC将ServletRequest传递给DataBinder
2. SpringMVC将请求路径下对应控制器方法的参数对象传递给DataBinder
3. DataBinder根据**ConversionService**将1中包含的信息转换为2中对象的类型
4. DataBinder通过**Validator**校验数据的合法性
5. DataBinder将转换结果封装到**BindingResult**中，SpringMVC将该对象的内容传递给对应的控制器方法

## 13.3 拦截器（简答）

### 拦截器配置

**实现拦截器**：
- 实现`HandlerInterceptor`接口
  - 或者继承实现上述接口的对象，如`HandlerIntercepterAdapter`
- 实现`WebRequestInterceptor`接口
  - 或者继承实现上述接口的对象

**HandlerInterceptor接口源码**：
```Java
public interface HandlerInterceptor {
    default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        return true;
    }

    default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
    }

    default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
    }
}
```
- `preHandle`：在控制器方法前执行
  - boolean返回值返回**true**表示允许继续执行，**false**表示中断后续操作
- `postHandle`：在控制器方法执行后，**解析视图**前执行，用于对模型和视图进一步更改
- `afterCompletion`：视图渲染结束后执行，用于资源清理、记录日志等

在`servlet.xml`（不是web.xml）中注册拦截器：
```XML
<!-- 配置用于session验证的拦截器 -->
<!-- 
    如果有多个拦截器满足拦截处理的要求，则依据配置的先后顺序来执行
 -->
<mvc:interceptors>
    <!--全局拦截器-->
    <bean class="com.test.GlobalIntercepter" />
    <mvc:interceptor>
        <!-- 拦截所有的请求，这个必须写在前面，也就是写在【不拦截】的上面 -->
        <mvc:mapping path="/**" />
        <!-- 但是排除下面这些，也就是不拦截请求 -->
        <mvc:exclude-mapping path="/login.html" />
        <mvc:exclude-mapping path="/account/login.do" />
        <mvc:exclude-mapping path="/account/regist.do" />
        <!-- 拦截器java代码路径 -->
        <bean class="com.test.LogsInterceptor" />
    </mvc:interceptor>
</mvc:interceptors>
```

### 拦截器执行流程

**单个拦截器的执行流程**：
![1704270467259](image/J2EE考试范围及复习提纲/1704270467259.png)

**多个拦截器的执行流程**：
![1704270479604](image/J2EE考试范围及复习提纲/1704270479604.png)

## 15.1 整合环境搭建（简答）