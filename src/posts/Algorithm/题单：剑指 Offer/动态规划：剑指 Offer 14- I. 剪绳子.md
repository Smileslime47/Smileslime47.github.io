---
title: 动态规划：剑指 Offer 14- I. 剪绳子
date: 2023/05/16
categories: 
    - Algorithm
    - 题单：剑指 Offer
mathjax: true
---
原题地址：https://leetcode.cn/problems/jian-sheng-zi-lcof/

## 题解
### 动态规划
设dp[i]为**绳子长度为i时的最大乘积**

我们可以认为，这段绳子i，是由一段绳子j和一段绳子i-j组成的，其中**绳子j已经被切分好算出了最大乘积**，而**i-j是我们在这个基础上加上去的一段绳子**，由于我们已经知道了绳子j的最大乘积，在这种情况下，我们可以求出dp[i]

$$dp[i]=dp[j]\times (i-j)$$

令j遍历[0,i]，求所有情况下的最大值即为dp[i]的取值

考虑一种特殊情况：
- 对于j=-1的情况，我们可以认为是**0到i为止整段绳子没有被做过任何切割**，dp[i]=i+1
- 由于绳子n至少被切割一次，因此当i=n-1时应当跳过这一步

输出dp[n-1]即为答案

**时间复杂度**：O(N^2)

**空间复杂度**：O(N)

```java
class Solution {
    public int cuttingRope(int n) {
        int[] dp=new int[n];
        for(int i=0;i<n;i++){
            if(i<n-1)dp[i]=i+1;
            for(int j=0;j<i;j++){
                dp[i]=Math.max(dp[i],dp[j]*(i-j));
            }
        }
        return dp[n-1];
    }
}
```
