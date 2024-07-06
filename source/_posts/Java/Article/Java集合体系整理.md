---
title: Java集合体系整理
date: 1919/08/10
categories:
  - Java
  - Article
---
## 常见集合
### List、Set、Queue和Map区别
- List：线性表，有序存储元素
- Set：无序、不可重复的集合
- Queue：FIFO的队列
- Map：存储键值对的映射关系的表

## 线性表

### ArrayList和Array的区别
- 前者基于Object的Array，可以动态扩展数组长度
- Array只支持随机访问，而ArrayList还可以通过add和remove动态增删元素
- ArrayList支持泛型，而Array不支持泛型数组

### Vector和Stack
List的古老实现，线程安全但少用，现在主要使用CopyOnWriteArrayList

### 时间复杂度：
ArrayList：
- 尾部增删：O(1)
- 其他增删：O(N)
- 查找：O(1)

LinkedList：
- 头尾增删：O(1)
- 其他增删：O(N)
- 查找：O(N)

### ArrayList和LinkedList的区别
- 前者基于Array，后者基于Node内部类的链表
- 时间复杂度不同
- 内存空间（ArrayList有冗余空间，LinkedList节点空间更大）

### ArrayList的扩容机制
每次add元素返回add后的元素数量minCapacity，若超过数组容量则调用grow方法
- grow：每次扩容假设扩容为原来的1.5倍，若仍不满足则直接设为minCapacity

### Queue和Deque的区别
前者是单端队列，后者是双端队列，并且实现了stack操作

### ArrayDeque和LinkedList
前者是基于双指针的可变长数组，后者是基于链表

前者不支持存储Null数据，在作为Deque时性能优于后者


## Set和Map
### HashSet、LinkedSet和TreeSet
- HashSet是基于HashMap实现的，无法保证元素的放入和取出顺序
- LinkedSet是基于链表和哈希表实现的，放入和取出遵循FIFO
- TreeSet是基于红黑树实现的，支持对元素的自定义排序

### HashMap和HashTable
- hashtable是map的古老实现，线程安全，但是效率差
- hashmap是拉链法+红黑树，hashtable只有拉链法
- hashmap支持存储null值

### HashMap和HashSet
HashSet仍然是基于HashMap实现的，检查重复是直接根据对hashmap的put返回值判断

### HashMap和TreeMap
TreeMap实现了NavigableMap和SortedMap接口，可以对键值对进行排序和搜索

### HashMap和ConcurrentHashMap和HashTable
ConcurrentHashMap是线程安全实现的HashMap
- 1.7之前采用分段锁的机制，用一个segement数组存储每一段数组
- 1.8之后采用CAS算法+Synchronized，仅对单个数组上锁，并且和Hashmap一样采用了红黑树

HashTable对整个操作方法用synchronized修饰，导致同一时间只有一个线程能够操作哈希表，本质上仍然是串行执行的

### HashMap
拉链法+红黑树，哈希冲突时不计算二次哈希，而是将哈希值相等的键值对存在一个链表中

当数组长度>64且链表长度>8时链表被转换为红黑树

缺点：多线程扩容死循环和线程不安全
- 多线程扩容死循环：JDK1.7之前对链表采用头插法，多个线程put值导致同时对一个链表进行操作时，可能会导致环形链表
- 线程不安全：操作的原子性无法保证：读取、修改、保存

遍历方式：
- 迭代器（Iterator）方式遍历；
- For Each 方式遍历；
- Lambda 表达式遍历（JDK 1.8+）
- Streams API 遍历（JDK 1.8+）

扩容机制：
- Hashmap内部有三个参数：
  - capacity：数组实时容量，初始值为16
  - loadFactor ：负载因子，默认为0.75
  - threshold：数组能存储的键值对数量，为capacity*loadFactor
- 空参构造时map的桶未被初始化，为null对于第一次put会先将数组初始化为16
- 如果在参数构造器指定桶容量，则会初始化为**第一个不小于指定参数的2的幂数**
- 之后每次需要扩容时将容量变为原来的二倍