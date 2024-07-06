---
title: 3.高阶函数和 Lambda
date: 1919/8/10
categories:
  - Kotlin
  - Kotlin基础
---
## 高阶函数
**高阶函数**：接受函数作为参数，或者返回一个函数作为返回值

在 Java 中比较常见的例子是 filter/comparator，当我们对一个表进行排序时，往往希望用户根据实际需求传入排序条件

在传统的写法中，我们需要传入一个实现了`Comparator`接口的类，并覆写 compare 方法
```Java
arr.sort(new Comparator<Integer>() {
    @Override
    public int compare(Integer a, Integer b) {
        return b-a;
    }
});
```

更函数式的写法则是直接传入一个 Lambda 表达式，在 Java 8 中实现了函数式接口（`@Funtional`）的类可以直接这么写：
```Java
arr.sort((int a,int b)->{return a-b;})
```

接下来我们讨论在 Kotlin 中函数是如何作为参数和返回值进行传递的

## 函数类型
在Kotlin中，除基本数据类型和引用类型外，还有**函数类型**，定义一个函数类型的格式如下
```Kotlin
(Int) -> Unit
```
- 函数类型通过一个`->`符号连接，左端为用括号包裹起来的参数类型，右端为返回值类型

函数类型支持一系列灵活的定义，如：
- 多个参数
  - `(Int,String) -> Unit`
- 参数名及可选参数
  - `(a:Int,b:String?) -> Unit`
- 嵌套函数
  - `(Int) -> ((Int) -> Unit)`
  - `((Int) -> Unit) -> (Int)`

于是我们可以在类型中声明函数：
```Kotlin
fun sort(arr:Array<Int>,comparator:((Int)->Int)):Unit
```

### 调用现成函数
我们可以通过`::`来调用类中的某些方法，如`Book::getBook`，也可以在类前加双冒号来调用它的**构造方法**，如`::Book`，并返回一个该类的实例

除了调用类中的方法定义外，`::`也可用于调用类的类型定义，如`Book::name`

双冒号在一定程度上类似Java中的反射类

### 调用匿名函数
对于某些一次性/临时的函数类型（最经典的，comparator），可以通过匿名函数来定义一个函数类型，例如
```Kotlin
fun(a:Int,b:Int):Int {
    return a-b
}
```

于是我们可以在函数中传入匿名函数，例如

```Kotlin
fun sort(arr:Array<Int>,comparator:((Int)->Int)):Unit

sort(arr,fun(a:Int,b:Int):Int {return a-b})
```

## Lambda表达式
尽管匿名函数在函数类型上已经足够简洁，但是我们仍然可以采用一种更简洁的语法：Lambda表达式，它实际上是函数式编程的一种**语法糖**
- 对于已经明确了参数类型和返回类型的**函数类型**，我们传入匿名函数时没必要再定义一遍参数类型和返回类型，因为编译器是有能力自动推导的
- 对于一个表达式函数体，return关键字是可以被省略的
- 对于一个代码块函数体，我们可以认为最后一行为一个表达式，其值为返回值
- 我们可以模仿函数类型的写法(`->`)，让传参的可读性更好

对于上例，我们可以简化成：
```Kotlin
sort(arr,（a,b)->{a-b})
```

要注意的是，Lambda表达式整体必须用`{}`包裹

Lambda表达式也可以用于变量赋值，如：
```Kotlin
val sum:(Int,Int)->Int = { x:Int,y:Int -> x+y }
val sum = { x:Int,y:Int -> x+y }            //两种类型推导
val sum:(Int,Int)->Int = { x，y -> x+y }    //两种类型推导
```

### 隐式名称
对于仅包含一个参数的Lambda表达式，Kotlin提供了隐式名称来简化Lambda表达式，对于常规的写法，例如：
```Kotlin
listOf(1,2,3).forEach{ item -> print(item) }
```

我们可以简化为：
```Kotlin
listOf(1,2,3).forEach{ print(it) }
```

### 闭包
不论是匿名函数还是Lambda表达式，他们都以某种方式访问/修改了外部的环境变量，这种**捆绑外界环境变量的函数**称为**闭包（Closure）**，一个闭包可以被作为参数传递或者直接调用

在Java中由于函数式的限制，闭包仅能访问外部变量（如Comparator），而Kotlin的闭包不仅支持访问外部变量，还可以对外部变量进行修改，例如
```Kotlin
var sum=0
arr.filter { it>0 }.forEach { sum += it }
```

### 柯里化
严格的函数式语言是基于**Lambda演算**作为理论基础的，而Lambda演算中规定了所有函数**最多只能接受一个参数**

对于下例：
```Kotlin
val sum={a:Int,b:Int,c:Int -> a+b+c}
sum(1,2,3)
```

我们可以将其改写为柯里化的形式：
```Kotlin
val sum={a:Int -> {b:Int -> {c:Int -> a+b+c}}}
sum(1)(2)(3)
```

这样我们将**一个传入三个参数的函数**变为了**三个只接受一个参数的函数**，每次调用的时候返回下一个阶段的函数，一直到所有参数全部传递完毕，才会得到最终的完整函数

柯里化虽然仅仅在学术层面上（Lambda演算）有重要作用，但是在开发中合理运用柯里化可以让代码更加简洁

对于**最后一个参数为函数类型**的函数，Kotlin允许将传参括号省略掉
```Kotlin
fun operate(action:(Int a,Int b)-> Int)
operate({a,b->a+b})     //常规写法
operate{a,b->a+b}       //柯里化的写法

fun operate(x:Int,y:Int,action:(Int a,Int b)-> Int)
operate(1)(2){a,b->a+b} //柯里化的写法
```

要注意的是，Kotlin的柯里化只是一种**语法糖**，即**curryingLike**的写法，并非Scala那种真正意义上的柯里化，因此我们调用一个柯里化的、**未完全传参**的函数只会得到报错结果