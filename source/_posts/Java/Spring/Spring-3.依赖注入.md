---
title: Spring - 3.依赖注入
date: 1919/08/10
categories:
  - Java
  - Spring
---
## 模块间的依赖关系
---
当一个class A内含有一个class B字段时，我们称class B对class A构成了一个**依赖关系**，当我们初始化class A时也需要在class A的代码块内初始化class B，如果我们不初始化class B仅仅初始化class A，那么在调用class A的相关class B的方法时就会报错（空引用），此时class B和class A的代码块仍然有着**耦合性**

在没有依赖注入时我们的初始化代码：
```java
class A{
    ...
    private B classB=new B();
}
```
或者
```java
class A{
    ...
    private B classB；
    public A(B classB){
        this.classB=classB;
    }
}
```
或者
```java
class A{
    ...
    private B classB；
    public void setB(B classB){
        this.classB=classB;
    }
}
```
可以看出，无论是哪种方法都是依赖于代码块的，而通过Spring的依赖注入，我们可以实现初始化过程与代码的**解耦合**，将初始化通过配置文件来实现

## setter注入
---
当bean实体类已经**实现了各字段的setter和getter方法**时，我们可以在配置文件的bean标签下通过**property**标签来控制bean对象的字段初始值
```xml
<beans>
	...
	<bean class="org.exmaple.User" id="User">
        <property name="name" value="defaultName"></property>
        ...
    </bean>
</beans>
```
其中property标签有如下几种常用属性：
- name：bean实体类下对应的属性字段名
- value：给**基本数据类型**赋值时，该字段的初始值
- ref：给**引用**类型赋值时，该字段的初始值
    - 当使用ref属性时，属性值应当为**另一个bean在配置文件中设置的id**
    - 当我们给同一个类创建多个bean标签并配置不同的id时，就可以实现该类不同初始化选项的灵活切换
- 传入引用类型也可以通过在value属性中使用**SpEL**表达式（Spring表达式）来实现，即ref="user"和value="#{user}"是等价的

## constructor注入
---
当bean实体类已经**实现了有参构造器**时，我们可以我们可以在配置文件的bean标签下通过**constructor-arg**标签来控制bean对象的字段初始值
```xml
<beans>
	...
	<bean class="org.exmaple.User" id="User">
        <constructor-arg name="name" value="defaultName"></property>
        ...
    </bean>
</beans>
```
其中constructor-arg标签的常用属性与上文setter类似，但需要注意的是
- name属性对应的是构造器中的**形参名**
- 如果我们要调用一个含n个形参的构造器，那么bean标签下就必须要有n个constructor-arg标签，每个标签**单独传入一个形参**

## 复杂数据结构注入
---
当我们试图初始化**List、Set、Map**等较为复杂的数据结构时，直接通过name/ref属性往往难以实现需求，此时可以在**标签体**下来初始化数据结构
```xml
<beans>
	...
	<bean class="org.exmaple.User" id="User">
        <property name="nameList">
            <list>
                <value>abc</value>
                <value>def</value>
            </list>
        </property>

        <property name="classSet">
            <set>
                <ref>bean1</ref>
                <ref>bean2</ref>
            </set>
        </property>
        ...
    </bean>
</beans>
```
