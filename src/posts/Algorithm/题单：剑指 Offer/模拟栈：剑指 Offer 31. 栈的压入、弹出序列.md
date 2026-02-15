---
title: 模拟栈：剑指 Offer 31. 栈的压入、弹出序列
date: 2023/05/18
categories: 
    - Algorithm
    - 题单：剑指 Offer
mathjax: false
---
原题地址：https://leetcode.cn/problems/zhan-de-ya-ru-dan-chu-xu-lie-lcof

## 题解
我们通过一个双端队列来模拟栈

先按照入栈序列顺序入栈，考虑到一个问题：**当当前栈顶等于出栈序列的第一个元素**时我们怎么办

这个时候栈顶元素必须随之出栈，否则后续入栈会导致该元素**必然不可能是第一个出栈元素**

当栈顶出栈后，删除出栈序列的第一个元素，并继续入栈。如果出栈序列合法，那么当入栈完毕后，**出栈序列应当被删除至空**，反之则说明出栈序列不合法

**时间复杂度**：O(N)

**空间复杂度**：O(N)

```java
class Solution {
    public boolean validateStackSequences(int[] pushed, int[] popped) {
        Deque<Integer> stk=new LinkedList<>();
        int itr=0;
        for(int i=0;i<pushed.length;i++){
            stk.push(pushed[i]);
            while(itr<popped.length&&stk.size()>0&&stk.peek()==popped[itr]){
                stk.pop();
                itr++;
            }
        }
        return itr>=pushed.length;

    }
}

```
