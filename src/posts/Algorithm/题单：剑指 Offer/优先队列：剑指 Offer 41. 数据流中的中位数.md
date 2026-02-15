---
title: 优先队列：剑指 Offer 41. 数据流中的中位数
date: 2023/05/11
categories: 
    - Algorithm
    - 题单：剑指 Offer
mathjax: false
---
原题地址：https://leetcode.cn/problems/shu-ju-liu-zhong-de-zhong-wei-shu-lcof/

## 题解
参考官方题解

我们创建两个优先队列，其中**minQue**为小于等于中位数的队列（降序），**maxQue**为大于中位数的队列（升序），如对于数据流[1,2,3,4,5]而言
- minQue={3,2,1}
- maxQue={4,5}

由于中位数位置的特殊性，我们可以知道
- 当数据个数为奇数时，**minQue的长度为maxQue的长度+1**，且中位数等于**minQue的队头**
- 当数据个数为偶数时，**minQue的长度等于maxQue的长度**，且中位数等于**minQue的队头与maxQue的队头的平均数**

在加入新元素a时，需要平衡两个优先队列，考虑两种情况：

**当原先数据个数为奇数时**：

此时加入元素后数据个数为偶数，加入后minQue和maxQue的长度必须相等，设b=minQue.remove()
- 此时我们获得了a、b和两个长度相同的队列，比较a和b的大小，将**较大值**加入maxQue，**较小值**加入minQue即可

**当原先数据个数为偶数时**：

此时加入元素后数据个数为奇数，加入后minQue.size()=maxQue.size()+1，设b=minQue.remove(),c=maxQue.remove()
- 此时我们获得了a、b、c和两个长度相同的队列，比较a、b、c的大小，将**较大值**加入maxQue，**较小的两个值**加入minQue即可

**时间复杂度**：O(1)

**空间复杂度**：O(N)

```java
class MedianFinder {
    PriorityQueue<Integer> maxQue=new PriorityQueue<>((Integer a,Integer b)->a-b);
    PriorityQueue<Integer> minQue=new PriorityQueue<>((Integer a,Integer b)->b-a);
    /** initialize your data structure here. */
    public MedianFinder() {
        maxQue=new PriorityQueue<>((Integer a,Integer b)->a-b);
        minQue=new PriorityQueue<>((Integer a,Integer b)->b-a);
    }

    public void addNum(int num) {
        int b,c,min,max;
        if(minQue.size()==0){
            minQue.add(num);
        }
        else if(maxQue.size()==minQue.size()){
            b=maxQue.remove();
            c=minQue.remove();
            max=Math.max(num,Math.max(b,c));
            min=Math.min(num,Math.min(b,c));
            minQue.add(min);
            minQue.add(num +b+c-max-min);
            maxQue.add(max);
        }else if(maxQue.size()==minQue.size()-1){
            b=minQue.remove();
            max=Math.max(num,b);
            min=Math.min(num,b);
            minQue.add(min);
            maxQue.add(max);
        }
    }

    public double findMedian() {
        if(maxQue.size()==minQue.size()){
            return (double)(maxQue.peek()+minQue.peek())/2;
        }else{
           return  (double)minQue.peek();
        }
    }
}
```
