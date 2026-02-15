---
title: 1.认识 Kotlin
date: 1919/8/10
categories:
  - Kotlin
  - Kotlin基础
---
## 函数式编程
- **Complicated**：复杂的，指一个事物由许多子部件组成，每一个子部件都有各自的用途
- **Complex**：复合的，指指一个系统由许多**相似**的事物组成，这些事物彼此之间的交互构成了宏观系统的行为

函数式编程最大的特点在于拥有**复合性**，将类似的操作进行组合，相比 OOP 中侧重于对事物的抽象和封装，函数式编程更侧重于数学中的演绎和推导

## Scala
由于 Java 在很多地方有硬性的语言规范，在函数式编程上经常难以实现最优的方案，因此出现了完全支持函数式编程的语言 - Scala

但是也因为 Scala 完全面向函数式编程，它有着较为陡峭的学习曲线，领域更加面向学术，在工业领域上仍然需要一个更好的 Java 替代品（Better Java）出现

## Kotlin
相比 Scala 着重于完全补全 Java 的函数式特性，Kotlin 更关注如何在实际开发中应用函数式。如果说 Scala 是 more than Java，那么 Kotlin 则立志成为 better Java，给予 Java 程序员一个新的选择

### 语法糖
- 更加智能的类型推导，如 SmartCast
- 表达式函数
- 原生支持单例类、数据类等

### 生态
Kotlin 是一门通用语言，虽然在大众眼中 Kotlin 主要面向于 Android 开发，但是得益于其和 Java 几乎完美的兼容性，Kotlin 几乎能做 Java 能实现的一切功能
- Android 开发
    - Google 宣布 Kotlin 作为安卓首要开发语言
- 服务端开发
    - Spring 完美支持 Kotlin，此外还有 Ktor 、Koin 等 Kotlin 原生框架
- 前端开发
    - 动态类型支持、类型安全的构造器
- Native 代码支持
    - 在 Kotlin Native 项目的支持下，Kotlin 可以摆脱 JVM 直接编译为机器码，从而获得更好的性能表现