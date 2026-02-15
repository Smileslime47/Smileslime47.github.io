---
title: Java并发体系整理
date: 1919/08/10
categories:
  - Java
  - Article
---
## 多线程
### 线程和进程的区别
线程是**任务调度的最小单位**，进程是**资源分配的最小单位**。这点从内存空间的结构也可以看出来：
- JVM为进程分配资源，因此同一个进程中的线程共享堆和方法区
- JVM调度线程，因此每个线程有独立的方法栈和PC

从历史意义上说，线程是一种**轻量化的进程**，代替了原先进程中任务调度的地位

### 并发和并行
- 并发：同一时段内同时运作
- 并行：同一时刻内同时运作

### 并发的三大特性
原子性、有序性、可见性

### 同步和异步
- 同步：发出调用后线程等待回应，不进行进一步操作
- 异步：发出调用后线程继续操作，随时接受调用结果

### 线程安全
线程安全是对于同一份环境，多个线程同时访问都能保证数据处理的正确性和一致性

## Java多线程基础
### 线程的生命周期
- NEW、RUNNABLE、BLOCKED、WAITING、TIME-WAITING、TERMINATED

sleep、yield、wait、join的区别
- sleep：等待指定时间，这个过程中并不会让线程释放锁
- yield：让出当前的CPU调度
- wait：让进程释放锁并进入等待池，在其他进程调用notify后会从等待池中随机释放一个线程
- join：对某个thread实例对象调用，当前进程必须等待被调用的thread进程运行结束后再恢复执行
- 当线程因为synchronized进入阻塞状态后，需要等待其他进程释放锁才能解除block阻塞状态
- 当线程调用wait()状态后，需要等待其他进程通知（notify），此外也会自动释放锁
- 要注意的是，wait定义并不定义在thread中，调用时需要通过this.wait()调用

### Thread和Runnable的区别
Runnable是一个接口，要求覆写run方法，而Thread是Runnable接口的一个实现

### 上下文切换
上下文是**一个进程当前的运行状态**，当线程切换时当前线程记录自己的上下文，并加载下一个线程的上下文

线程切换有许多种原因：
- 主动让出，如wait等
- 时间片用完
- 调用了系统中断，如IO等
- 被终止运行

### 线程死锁
条件：
- 互斥
- 保持等待
- 不可抢占
- 循环等待

解除：
- 无视死锁
- 检测死锁（进程资源分配图）
- 避免死锁（通过银行家算法判断）
- 破坏死锁

在Java中，如果：
```Java
//线程A
synchronized(A){
    synchronized(B){
        ...
    }
}
//线程B
synchronized(B){
    synchronized(A){
        ...
    }
}
```

就会导致死锁问题，所以应当保证**获取锁的顺序相同**

### 可以直接调用run方法吗
run方法只是线程的执行过程，并不包含线程的初始化操作，具体的操作在start方法中

### JMM内存模型
核心：线程从主内存的共享变量中获取副本，对副本修改后同步在主内存中

### volatile
由于JMM模型会导致读取数据的不一致，对于共享变量需要用volatile修饰，对于volatile变量所有线程都会直接在主存中读取，在主存中修改，保证每次线程读取到的都是最新版本的变量值

但是由于无法保证操作的原子性，仍有可能出现读写错误的情况，这时需要通过synchronized关键字解决，volatile仅仅保证了变量对于各线程之间的可见性，即只要我修改了你就可以立即看见

### 乐观锁和悲观锁
悲观锁：假设每一次多线程访问变量都会导致错误，保证同一时刻只有一个线程在访问
- 实现：synchronized关键字、Lock类

乐观锁：假设通常情况下多线程访问变量不会导致错误，以防万一每次都进行检查即可
- 实现：CAS算法、版本号算法
- 缺点：CAS算法可能会导致ABA问题

### synchronized关键字
synchronized是**可重入的悲观锁**，且获取的锁比较自由，可以是任何一种共享对象
- 当synchronized修饰实例方法时，默认获取this对象
- 当synchronized修饰静态方法时，默认获取class对象

底层原理：基于对象监视器monitor
- 基于monitorenter和monitorexit，两个指针指向代码块的两端
- 执行到monitorenter时若锁计数器为0则说明可以获取对锁计数器++
- 在执行到monitorexit后锁计数器--

volatile和synchronized是互补的存在：
- volatile保证了变量的可见性，保证了每次修改都是对其他线程立即可见的
- synchronized保证了操作的原子性，保证了每次修改都只有一个线程在操作

### ReetrantLock
更强大的悲观锁，可以**非公平锁、轮询、超时、中断**

非公平锁：不按照申请顺序基于锁资源，而是按照优先级给予

可中断：可以终止当前获取锁的阻塞状态继续运行

### ReetrantReadWriteLock
读写锁实现了两把锁**读锁和写锁**
- 维持了**读读不互斥、读写、写写互斥**的准则
- 即读锁是共享锁、写锁是独占锁

适用于多个线程同时读取数据，又有一定写入操作的情景

### ThreadLocal
对于**单一的某个成员变量**，进程中的任一线程都可以访问修改，而ThreadLocal提供了一个**线程私有变量**的实现，当多线程对**同一个ThreadLocal类**进行读写操作（get和set）时，每次读写的都是线程自己的副本，而不会影响其他线程的值

原理：一个叫做ThreadLocalMap的哈希表，键值对为<Thread,Object>

内存泄漏问题：map中Thread为弱引用，而value为强引用，可能会导致thread被回收而value悬浮的情况，因此在每次使用完后最后调用一次remove方法

## 线程池
线程池是一个管理线程的资源池，在需要时直接从线程池中获取而省去了创建线程的时间开销，也提高了线程的可管理性，线程池是基于`Executor`类实现的

### 核心框架
Executror需要接受**实现了Runnable或者Callable的任务类**作为线程，交付给ThreadPoolExecutor

ThreadPoolExecutor接受到任务类后对其调用`ExecutorService.submit（Runnable task）`会返回一个FutureTask对象
- 随后可以调用`FutureTask.get()`来执行线程
- 也可以调用`FutureTask.cancel（boolean mayInterruptIfRunning）`来终止线程

线程池由一个线程池和一个缓冲队列组成，当线程池中的线程数量大于容量时，继续提交的任务会被放在缓冲队列中存储

### 核心参数
- corePoolSize：线程池中**维护**的线程容量，当线程数小于这个数量时，线程池不会对池中的线程销毁
- maximumPoolSize：当线程池的线程容量达到corePoolSize时，继续提交的任务会存在缓冲队列中，当缓冲队列也满后会继续在池中创建线程，但是仍然有一个maximumPoolSize的最大容量
- keepAliveTime：当发生如上情况，线程数量超过corePoolSize后，线程池会对池中线程进行清理，保持空闲超过该时间的线程会被清理掉
- unit：上述参数的计量单位
- workQueue：缓冲队列的实现形式
  - ArrayBlockingQueue：基于FIFO的有界阻塞队列
  - LinkedBlockingQuene：基于FIFO的无界队列，队列容量为Integer.MAX_VALUE，此时maximumPoolSize无效
  - SynchronousQuene：不进行缓存处理，遇到新任务直接创建线程，直到达到maximumPoolSize
  - PriorityBlockingQueue：具有优先级的LinkedBlockingQuene
- threadFactory：线程工厂
- handler：拒绝策略，当线程数达到maximumPoolSize对新提交线程的拒绝策略
  - CallerRunsPolicy：直接调用提交任务的run方法执行
  - AbortPolicy：丢弃任务并抛出RejectedExecutionException异常
  - DiscardPolicy：丢弃任务，不抛出异常
  - DiscardOldestPolicy：丢弃缓冲队列中队头的任务，并加入该任务

### 线程池创建
通常使用ThreadPoolExecutor的构造参数来创建

