---
title: ClassLoader——类加载器
date: 2023/03/11
categories: 
  - Java
  - JVM底层原理
---
## class文件及Class对象简述
---
当我们编译并执行一个Java程序时，实际上经过了多步：
1. 编译：.java源码文件由编译器编译为.class字节码文件
2. 执行：class字节码在被JVM虚拟机执行时由相应的classLoader加载进内存，创建为Class对象
3. 实例化：JVM根据Class对象实例化一个新的对象以供进程调用

在Java中，一个类**严格对应**一个class文件，每个class文件描述了关于这个类的详细信息，包括其元数据、常量池、构造方法、成员变量、成员方法、静态成员等内容。

我们可以认为，JVM中存在两种对象——实例对象和Class对象，Class对象是对应实例对象的一个**静态蓝图**，在首次实例化一个对象时，我们会先加载并创建一个Class对象，然后以该Class对象为蓝图构建实例对象，此后每次实例化新的同类对象都会调用该Class对象。

## 类加载器
---
Class对象的构造函数是**私有的**，无法在外部进行显式调用，也无法显式声明一个Class对象。

但是每个Class对象都有一个classLoader字段绑定构造自己的类加载器，在实际加载时通过classLoader的defineClass方法构造自身

当我们首次调用一个类时，JVM通过classLoader寻找并加载相应的class文件，创建一个对应的Class对象（这种**按需加载**的方式也被叫做**懒加载**/**动态加载**）。每次当我们通过new实例化一个新的对象时，实际上在JVM眼中是通过动态加载入内存的Class对象调用相应的构造器并构造一个新的对象，因此Class对象只会在首次调用时加载并用于创造所有该Class对应的对象。

换句话说，如果程序运行时没有真正调用到一个对象，那么JVM就不会去加载这个Class类；实际中我们经常通过动态加载的特性来根据程序的实际运行状态来加载不同的类。

```java
class Class<T> {
  ...
  private final ClassLoader classLoader;
  ...
}
```

考虑到不同class的来源（java核心类、扩展框架、项目自身类等等），JVM在java.lang.ClassLoader中提供了多个classloader，在首次调用一个新类时，根据优先级逐个尝试加载。

### BootstrapClassLoader——引导类加载器
BootstrapClassLoader用于加载JDK内部的核心类（如java.util.*、java.lang.*等），它属于JVM虚拟机核心的一部分。此外BootstrapClassLoader也是其他所有类加载器的父类，因此也被叫做**根加载器**。
- BootstrapClassLoader加载的类一般在JAVA_HOME/lib中

### ExtensionClassLoader——扩展类加载器
ExtensionClassLoader用于加载一些JDK自带的一些标准扩展库，如swing等等，此外ExtensionClassLoader也是其SystemClassLoader父类。
-ExtensionClassLoader加载的类一般在JAVA_HOME/lib/ext中

### SystemClassLoader——系统类加载器
SystemClassLoader是面向用户的类加载器，用于在JVM运行Java程序时根据classpath寻找并加载需要调用的包和库，也被叫做AppClassLoader。这一类的类加载器可以通过ClassLoader提供的静态方法getSystemClassLoader()来获取。

### CustomClassLoader——自定类加载器
自定类加载器往往是AppClassLoader的子类，我们可以通过继承java.lang.ClassLoader来自行构造类加载器。此外在自行构造类加载器时，也可以自行制定父加载器`protected ClassLoader(ClassLoader parent)`，在不指定父加载器时默认继承AppClassLoader，而指定为null则继承BootstrapClassLoader

## CLASSPATH
---
CLASSPATH是一系列文件路径的集合，在Windows中用分号分隔，它指示了AppClassLoader要从哪些路径里搜索需要调用的类文件。CLASSPATH有多种设置方式：
- 直接设置系统环境变量CLASSPATH，考虑到现实中往往和不同需求挂钩，一般不建议这么做
- 在启动JVM时传入CLASSPATH参数，如`java -cp .;xxx`
- 在不传入CLASSPATH参数时，CLASSPATH默认为"."，即当前目录

把JVM的核心库传入CLASSPATH是**不必要**的行为，因为双亲委派机制，这些库依赖于BootstrapClassLoader加载，而CLASSPATH仅仅为AppClassLoader负责

### jar包
jar本质上是一个可以作为目录的压缩包，在传入大规模的第三方类时可以通过jar包来简化操作

当我们输入`java -cp .;./xxx.jar`时，classLoader就会试图在当前目录下的xxx.jar中去寻找需要的类文件



## 双亲委派机制（parent-）
---
在JVM加载一个新类时，会根据一个优先级逐个调用类加载器，在类加载器接收到加载类的请求时，不会在其对应路径下搜寻该类时，而是先将请求委托给其父类，只有在其父类无法加载该类时才会试图亲自加载。

在程序运行时，类加载器往往按照CustomClassLoader->AppClassLoader->ExtensionClassLoader->BootstrapClassLoader的顺序进行委派，即
- BootstrapClassLoader首先尝试在JAVA_HOME/lib中寻找对应类，当BootstrapClassLoader无法在路径下找到类时，向回委派给ExtensionClassLoader
- ExtensionClassLoader尝试在JAVA_HOME/lib/ext中寻找对应类，当ExtensionClassLoader无法在路径下找到类时，向回委派给AppClassLoader
- AppClassLoader尝试在#CLASSPATH中寻找对应类，当AppClassLoader无法在路径下找到类时，向回委派给CustomClassLoader（如果有）或报错

采用双亲委派保证了类是自顶而下逐级尝试加载的，可以避免类的重复加载，父加载器在搜寻到对应类后可以直接调用。此外可以保证优先调用JDK自身的内部库，防止用户自定义的核心库被恶意调用。

此外由于继承关系，子类加载器可以访问父类加载器加载的类（如JDK核心内部库等），而反之则不然，保证了内部库对于程序的可见性，换句话说即子类加载器加载的类可以访问父类加载器加载的类，而反正则不能

### 缺陷
JDK的核心内部类提供了多个SPI（Service Provider Interface,服务提供者接口），这些类往往需要第三方类来**实现接口**，最典型的例子就是在JDBC中我们需要通过java.sql.driver的DriverManager来注册驱动，而java.sql.driver是由BootstrapClassLoader加载的，实现该方法的com.mysql.jdbc.Driver则是通过AppClassLoader加载的，为了让BootstrapClassLoader去#CLASSPATH中加载第三方类的方法，我们需要通过**ContextClassLoader——上下文加载器**和Class.forName来实现。

`Thread.currentThread().setContextClassLoader(this.loader)`可以将当前类的类加载器存储至上下文加载器中，并在需要的时候通过`Thread.currentThread().getContextClassLoader()`返回储存的类加载器。

而Class.forName()有一个多参数版本为：
```
Class<?> forName(String name, boolean initialize, ClassLoader cl)
```
可以通过指定classLoader来调用指定的classLoader解析当前类

那么我们就可以在父级类加载器加载的类的代码中通过上下文加载器来调用子级类加载器，并用子级类加载器来解析实现该接口的第三方类，从而规避双亲委派机制。

## 常量池
---

常量池是JVM中的一块**静态内存空间**，编译器在将源码编译为Class文件后，也将**字面量**和**符号引用**以指针链接的形式存入**常量池**中
- **字面量**包括了
    - 文本字面量：如String s="123"这种字面量赋值
    - final类型的成员变量
- **符号引用**包括了
    - 类的全限定名，将Java包命名格式中的xxx.xxx.xxx替换为xxx/xxx/xxx的路径格式
    - 字段名，包括类名称、源文件名、变量名等等

在Java程序运行时，由于Java是**后期绑定/运行时绑定**的，即面向对象程序在编译时不预先解析方法，而是在运行时再去解析，这时候就依赖于常量池中的字段来寻找方法

JDK自带了一个反汇编工具——javap，可以帮助我们分析Class对象的构成
```
javap
用法: javap <options> <classes>
其中, 可能的选项包括:
  --help -help -h -?               输出此帮助消息
  -version                         版本信息
  -v  -verbose                     输出附加信息
  -l                               输出行号和本地变量表
  -public                          仅显示公共类和成员
  -protected                       显示受保护的/公共类和成员
  -package                         显示程序包/受保护的/公共类
                                   和成员 (默认)
  -p  -private                     显示所有类和成员
  -c                               对代码进行反汇编
  -s                               输出内部类型签名
  -sysinfo                         显示正在处理的类的
                                   系统信息（路径、大小、日期、SHA-256 散列）
  -constants                       显示最终常量
  --module <模块>  -m <模块>       指定包含要反汇编的类的模块
  -J<vm-option>                    指定 VM 选项
  --module-path <路径>             指定查找应用程序模块的位置
  --system <jdk>                   指定查找系统模块的位置
  --class-path <路径>              指定查找用户类文件的位置
  -classpath <路径>                指定查找用户类文件的位置
  -cp <路径>                       指定查找用户类文件的位置
  -bootclasspath <路径>            覆盖引导类文件的位置
  --multi-release <version>        指定要在多发行版 JAR 文件中使用的版本
GNU 样式的选项可使用 = (而非空白) 来分隔选项名称
及其值。

每个类可由其文件名, URL 或其
全限定类名指定。示例:
   path/to/MyClass.class
   jar:file:///path/to/MyJar.jar!/mypkg/MyClass.class
   java.lang.Object
```

我们现在有一个Java的helloworld程序，并通过JDK提供的`javap`对其进行反汇编
```Java
/*Main.java*/
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");
    }
}
```
```
> javap -c Main.class
Compiled from "Main.java"
public class Main {
  public Main();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #13                 // String Hello world!
       5: invokevirtual #15                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return
}
```
从这里可以看出编译器为Main类自动补全了零参构造器（public Main）

我们将程序修改，可以观察到其不同类型的变量的存储形式，并将反汇编指令修改为`javap -c -v Main.Class`
- -v   -verbose可以显示该Class对象的常量池
```Java
public class Main {
    final int i=111;
    static int test=5;
    public static void main(String[] args) {
        System.out.println("Hello world!");
        String s="123";
        int j=10;
    }
}
```
```
> javap -c -v Main.class
//这里是程序的一些元数据，包括修改日期、长度、源文件等等
  Last modified 2023年3月11日; size 732 bytes
  SHA-256 checksum 3f5aabfe4ea8c85ce7f6f91b4b97154a5440190b09f2ece92c4690f40ffd00e2
  Compiled from "Main.java"
public class Main
  minor version: 0
  major version: 63
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #8                          // Main
  super_class: #2                         // java/lang/Object
  interfaces: 0, fields: 2, methods: 3, attributes: 1

//常量池 
Constant pool:
   #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
   #2 = Class              #4             // java/lang/Object
   #3 = NameAndType        #5:#6          // "<init>":()V
   #4 = Utf8               java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = Fieldref           #8.#9          // Main.i:I
   #8 = Class              #10            // Main
   #9 = NameAndType        #11:#12        // i:I
  #10 = Utf8               Main
  #11 = Utf8               i
  #12 = Utf8               I
  #13 = Fieldref           #14.#15        // java/lang/System.out:Ljava/io/PrintStream;
  #14 = Class              #16            // java/lang/System
  #15 = NameAndType        #17:#18        // out:Ljava/io/PrintStream;
  #16 = Utf8               java/lang/System
  #17 = Utf8               out
  #18 = Utf8               Ljava/io/PrintStream;
  #19 = String             #20            // Hello world!
  #20 = Utf8               Hello world!
  #21 = Methodref          #22.#23        // java/io/PrintStream.println:(Ljava/lang/String;)V
  #22 = Class              #24            // java/io/PrintStream
  #23 = NameAndType        #25:#26        // println:(Ljava/lang/String;)V
  #24 = Utf8               java/io/PrintStream
  #25 = Utf8               println
  #26 = Utf8               (Ljava/lang/String;)V
  #27 = String             #28            // 123
  #28 = Utf8               123
  #29 = Fieldref           #8.#30         // Main.test:I
  #30 = NameAndType        #31:#12        // test:I
  #31 = Utf8               test
  #32 = Utf8               ConstantValue
  #33 = Integer            111
  #34 = Utf8               Code
  #35 = Utf8               LineNumberTable
  #36 = Utf8               LocalVariableTable
  #37 = Utf8               this
  #38 = Utf8               LMain;
  #39 = Utf8               main
  #40 = Utf8               ([Ljava/lang/String;)V
  #41 = Utf8               args
  #42 = Utf8               [Ljava/lang/String;
  #43 = Utf8               s
  #44 = Utf8               Ljava/lang/String;
  #45 = Utf8               j
  #46 = Utf8               <clinit>
  #47 = Utf8               SourceFile
  #48 = Utf8               Main.java

//代码块
{
  final int i;
    descriptor: I
    flags: (0x0010) ACC_FINAL
    ConstantValue: int 111

  static int test;
    descriptor: I
    flags: (0x0008) ACC_STATIC

  public Main();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: aload_0
         5: bipush        111
         7: putfield      #7                  // Field i:I
        10: return
      LineNumberTable:
        line 1: 0
        line 2: 4
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      11     0  this   LMain;

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: (0x0009) ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=3, args_size=1
         0: getstatic     #13                 // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #19                 // String Hello world!
         5: invokevirtual #21                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: ldc           #27                 // String 123
        10: astore_1
        11: bipush        10
        13: istore_2
        14: return
      LineNumberTable:
        line 5: 0
        line 6: 8
        line 7: 11
        line 8: 14
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      15     0  args   [Ljava/lang/String;
           11       4     1     s   Ljava/lang/String;
           14       1     2     j   I

  static {};
    descriptor: ()V
    flags: (0x0008) ACC_STATIC
    Code:
      stack=1, locals=0, args_size=0
         0: iconst_5
         1: putstatic     #29                 // Field test:I
         4: return
      LineNumberTable:
        line 3: 0
}
SourceFile: "Main.java"
```