---
title: 通过Unsafe验证字符串常量池结构
date: 2023/06/18
categories:
  - Java
  - JVM底层原理
---
## 引言
许多Java程序员都知道，在JVM中，**字面量表示的字符串**是一种特殊的对象，这些字符串被存储在堆中的一个叫做**字符串常量池**的哈希表结构中，由于字符串常量池是JVM虚拟机的一个组成部分，所以该哈希表是基于**C++实现**的。

> 在C++实现的hotspot VM中，实际上字符串常量池（即StringTable）的结构就是一个<char*,java_lang_String>的哈希表结构

当我们说`String a="ab"`时，实际上是在该哈希表中寻找键值为**ab**的键值对，当不存在时**在该池中创建一个String对象**，然后将该对象返回给引用a

当我们说`String a=new String("ab")`时，"ab"字面量仍然是遵循上述的步骤**创建和/或返回了该String对象**，但是在new String这一步，实际上new关键字在**堆**中创建了一个该对象的**拷贝**，并将**拷贝对象返回给了引用a**，因此此时引用a所指的String对象和字面量"ab"所指的对象是不等（!=）的。

出于这点考虑，Java在设计时规定了String的**不可变性**，即：
* String对象的Value是private final类型，不允许更改，且不提供访问Value的setter方法
* String对象本身是final的，防止其他类继承String后覆写String的value字段

## 通过Unsafe修改String的Value字段
String的内容是存放在内部的一个叫做value的**byte数组**中的，那么我们有没有办法去修改String的value字段呢？答案是可以借助Unsafe类来强行进行**内存操作**。

虽然从Java本身的语法上，我们没有任何办法操作String的value字段，但是Java核心库提供了一个Unsafe类，该类可以**操作JVM中的内存数据**，内存操作相关的方法是被声明为native的，即方法本身是基于其他语言（如C++）实现的。我们可以直接找到String对象的内存地址，找到value数组的偏移值，然后就可以对value数组直接进行内存读写了。

由于Unsafe类是核心库调用的，该类仅能被**由BootstrapClassLoader加载的Java核心库**实例化，在我们的Java程序中直接实例化会抛出`SecurityException `异常。为了在Java中获取Unsafe对象，我们需要借助反射获取Unsafe中提供的`theUnsafe`单例对象:

```Java
import java.lang.reflect.Field;
import sun.misc.Unsafe;

private static Unsafe reflectGetUnsafe() {
    try {
        Field field = Unsafe.class.getDeclaredField("theUnsafe");
        field.setAccessible(true);
        return (Unsafe) field.get(null);
    } catch (Exception e) {
        return null;
    }
}
```

在Unsafe类中提供了对象内存操作的相关方法：

```Java
/**
    * Fetches a reference value from a given Java variable.
    * @see #getInt(Object, long)
    */
@ForceInline
public Object getObject(Object o, long offset) {
    return theInternalUnsafe.getReference(o, offset);
}

/**
    * Stores a reference value into a given Java variable.
    * <p>
    * Unless the reference {@code x} being stored is either null
    * or matches the field type, the results are undefined.
    * If the reference {@code o} is non-null, card marks or
    * other store barriers for that object (if the VM requires them)
    * are updated.
    * @see #putInt(Object, long, int)
    */
@ForceInline
public void putObject(Object o, long offset, Object x) {
    theInternalUnsafe.putReference(o, offset, x);
}
```

这里着重考虑`putObject(Object o, long offset, Object x)`方法，该方法会获取对象o的内存地址起始值，并将地址为**起始值+offset**的数据（这里约定地址正确，且为引用数据类型）修改为对象x的引用

有了这个方法，我们就可以很轻松地修改一个String的value了

首先，通过反射获取String类中value字段的偏移值：
```Java
long offset=unsafe.objectFieldOffset(String.class.getDeclaredField("value"));
```

对于String`String b= "ab";`，我们可以直接通过putObject修改b指向的String实例对象中value字段的内容：
```Java
unsafe.putObject(b,offset,new byte[]{'a','b','c'});
```

此时打印b，有：
```Java
System.out.println("b="+b); //b=abc
```


## 改变String带来的问题
在上面的基础上，我们设想如果我们修改了String的值有什么问题

### 修改new出来的String
在`String a=new String("ab")`时，a指向的对象是在常规堆中的String对象，实际上是字符串常量池中对应"ab"的String对象的拷贝。a指向的对象只对引用a负责，我们可以看如下例子：
```Java
Unsafe unsafe=reflectGetUnsafe();
assert unsafe!=null;
long offset=unsafe.objectFieldOffset(String.class.getDeclaredField("value"));

String a=new String("ab");
System.out.println("a="+a); //a=ab
unsafe.putObject(a,offset,new byte[]{'a','b','c'});
System.out.println("a="+a); //a=abc

String b= "ab";
System.out.println("b="+b); //b=ab
```
这里b的value没有被影响，因为a和b引用指向的实际上是两个不同的String对象，在我们没有通过unsafe修改String之前：
- a引用指向的是一个在常规堆中的String对象，其value为['a','b']
- a引用指向的是一个在常量池中的String对象，其value为['a','b']

### 修改字面量String
当我们将a修改为字面量赋值时，输出情况发生了变化：
```Java
String a="ab";
System.out.println("a="+a); //a=ab
unsafe.putObject(a,offset,new byte[]{'a','b','c'});
System.out.println("a="+a); //a=abc

String b= "ab";
System.out.println("b="+b); //b=abc
```
这里是因为此时a和b指向的对象是字符串常量池中的同一个String对象，当修改a指向String的内容时，b也随之被影响
- `String a="ab"`从字符串常量池中寻找"ab"键值对应的String对象
  - 此时常量池中的键值对为<char[]{'a','b'},String(value=byte[]{'a','b'})>
- `unsafe.putObject(a,offset,new byte[]{'a','b','c'});`修改了该对象中value的值为"abc"
  - 此时常量池中的键值对为<char[]{'a','b'},String(value=byte[]{'a','b','c'})>
- `String b= "ab";`从字符串常量池中寻找"ab"键值对应的String对象
  - 此时b获取到了对象String(value=byte[]{'a','b','c'})

### 字符串常量池源码
```C++
oop StringTable::basic_add(int index_arg, Handle string, jchar* name,
                           int len, unsigned int hashValue_arg, TRAPS) {

  assert(java_lang_String::equals(string(), name, len),
         "string must be properly initialized");
  // Cannot hit a safepoint in this function because the "this" pointer can move.
  No_Safepoint_Verifier nsv;

  // Check if the symbol table has been rehashed, if so, need to recalculate
  // the hash value and index before second lookup.
  unsigned int hashValue;
  int index;
  if (use_alternate_hashcode()) {
    hashValue = hash_string(name, len);
    index = hash_to_index(hashValue);
  } else {
    hashValue = hashValue_arg;
    index = index_arg;
  }

  // Since look-up was done lock-free, we need to check if another
  // thread beat us in the race to insert the symbol.

  oop test = lookup(index, name, len, hashValue); // calls lookup(u1*, int)
  if (test != NULL) {
    // Entry already added
    return test;
  }

  HashtableEntry<oop, mtSymbol>* entry = new_entry(hashValue, string());
  add_entry(index, entry);
  return string();
}
```
要注意jchar*是C++基于JNI（Java Native Interface），映射到JVM中char的数据结构，在JNI.h中可以发现JVM中数据类型的定义，其实是一系列不同位长的整数类型（https://github.com/luori366/JNI_doc）
```C++
typedef uint8_t         jboolean;       /* unsigned 8 bits，对应Java中的boolean*/
typedef int8_t          jbyte;          /* signed 8 bits，对应byte */
typedef uint16_t        jchar;          /* unsigned 16 bits，对应char */
typedef int16_t         jshort;         /* signed 16 bits，对应short */
typedef int32_t         jint;           /* signed 32 bits，对应int */
typedef int64_t         jlong;          /* signed 64 bits，对应long */
typedef float           jfloat;         /* 32-bit IEEE 754，对应float */
typedef double          jdouble;        /* 64-bit IEEE 754，对应double */
```

观察以上字符串常量池的源码可以发现在StringTable中添加键值对的一些细节
- StringTable接受一个类型为jchar*（可以近似认为为char*）的name参数，并根据该参数计算出hashcode
  - 这里的name参数实际上就对应我们在Java中的字面量，即"ab"这部分
- StringTable根据计算出的hashcode在HashTable中找到对应的索引，并在索引处加入一个string对象（**string()**）

在源码的基础上理解，StringTable并不能保证**键和值的对应性**，在StringTable根据"ab"这个字面量计算出该键值对对应的索引后，就将其放在了相应的位置，在我们修改了String的value字段后，**理论上用此时String.value重新计算一次hashcode会得出不一样的结果，并需要更新键值对的位置**，但很明显，大家都知道相比**随时监听String的对象的数据更改并更新哈希表**，Java采用了一个更取巧的办法——**将String对象设置为不可变**。

## 总结

要注意的是，字符串常量池中，键的char数组，和值中String.value的byte数组是分离开的两个数组，也就是说，该哈希表中的对应关系是**靠约定维持的**，即"ab"->代表着"ab"的String对象

当我们修改了该对象的内容为"abc"时，实际上从**语义上**破坏了这个映射关系，即"ab"->代表着"abc"的String对象，此时再声明`String b= "ab";`就会从常量池中获取到错误的String对象

这也是为什么String对象不可变的**根本原因**，我们说为什么String不可变的原因是**value字段是private final**这一点仅仅是String不可变的**直接原因**，但是很多人并没有想过这么做的目的是什么。在上述实践后我们就知道，实际上String不可变是为了维持字符串常量池的这一层“脆弱”的语义关系