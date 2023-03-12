---
tittle: JVM中对象的构造过程
date: 2023/03/12
tags: 
  - Java
  - JVM底层原理
---
# JVM中对象的构造过程
## new的过程
---
当我们首次调用一个类时（调用静态方法也好、实例化对象也好），JVM往往经过了以下几个步骤
- JVM检查该类的Class对象是否已经被加载，若未被加载则通过classLoader类加载器寻找对应的class文件并加载入内存创建Class对象；若对应Class对象已被加载则跳过这一步
- 若此时实例化一个新对象，new关键字会通知JVM根据对应的Class对象申请一块**堆**（heap）中的内存空间，并返回一个引用地址
- JVM初始化设置该内存空间的**对象头**和数据，此时JVM已经完成了对于虚拟机而言的对象的创建操作
- JVM根据参数调用Class对象中的构造函数，对对象进行初始化操作，此时才是真正完成了程序层面上的对象创建

## 零参构造器
---
在字节码中，我们使用一系列大写字母作为描述符来表示数据类型
|描述符|数据类型|
|---|---|
|B|byte|
|C|char|
|D|double|
|F|float|
|I|int|
|J|long|
|S|short|
|V|void|
|Z|boolean|
|L*|Object|
|[*|数组类型|

我们编写一个最简单的对象
```java
public class test {
}
```
用反汇编工具javap对其分析得到字节码的**可读格式**
```
public class test
...
Constant pool:
...
{
  public test();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 1: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Ltest;
}
SourceFile: "test.java"
```
这里可以看出在不指定一个类的构造函数时，编译器会为我们自动补全一个**零参构造器**——由于这个对象我们什么也没有写，因此分析出来的字节码也只包含了**常量池**和**零参构造器**。

下面我们来逐行分析这个零参构造器在JVM创建一个新对象时到底做了什么事：
```
  public test();
```
这里声明了下列代码块是test对象的零参构造器
```
    descriptor: ()V
```
**描述符**指出了这个方法的参数和返回值，由于是零参构造器所以括号内是没有任何参数的，**V**说明这是一个返回Void类型的方法，而这里描述符的字段（即“()V”）实际上是被存储在**常量池**中的
```
    flags: (0x0001) ACC_PUBLIC
```
这里的**访问权限修饰符**指出了这是一个public方法，即**公有构造器**，可以被外部调用
```
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
```
Code指出下方为JVM执行的代码块，包含了一系列操作码和操作数
- stack是分给给该方法的栈深度，也叫做**最大操作数栈**，由JVM分配
- locals是局部变量表大小，单位是**槽（slot）**，局部变量表用于存放方法中的参数变量和局部变量等
- args_size是该方法的参数数量

三者都为1是因为实际上所有方法在JVM中都是以静态方法（static）来实现的，在非静态方法中JVM隐藏了一个参数——this引用，通过this引用来告诉静态方法要操作的是**当前对象**，由于this引用本身也是一个参数变量，所以是需要栈深度和局部变量表来存储操作的

在局部变量表中，this引用始终占据局部变量表的**0槽位**

比如说我们调用了一个String的方法
```
s.charAt(0);
```
实际上在JVM眼里的形式是
```
String.charAt(s,0)
```
**aload_0**指的是将局部变量表中的**0槽**（即this引用）推入操作数栈顶

**invokespecial #1**是JVM的方法调用，通过#1在常量池中找到要调用的方法（这里是父类Object的init构造器），然后将操作数栈中的参数出栈传递给方法
  - JVM通过一系列invoke操作码来进行方法调用，这里不多解释

**return**表示方法返回，由于构造函数是一个Void类型的方法，所以没有返回值
```
      LineNumberTable:
        line 1: 0
```
LineNumberTable标记了Java源文件中行号与class文件中对应字节码位置的**偏移关系**

在JVM抛出异常报错时根据这个偏移关系找到源文件的错误行号
```
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Ltest;
```
LocalVariableTable就是分配给该方法的**局部变量表**了，可以看出这个方法的局部变量表只包含this引用

**Ltest**表示这是一个test类型的对象引用