---
title: DFS：剑指 Offer 13. 机器人的运动范围
date: 2023/05/06
categories: 
    - Algorithm
    - 题单：剑指 Offer
mathjax: false
---
原题地址：https://leetcode.cn/problems/ji-qi-ren-de-yun-dong-fan-wei-lcof/

## 题解
DFS：用递归搜索每个点**未搜索的相邻点**，每次进入递归时先判断**位数和**是否有效，无效则直接return

用一个skip数组维护已搜索的点，每次遍历未搜索的点时若位数和有效则cnt++

最后返回cnt即可

**时间复杂度**：O(N)

**空间复杂度**：O(N)
```Java
class Solution {
    var cnt=0
    fun movingCount(m: Int, n: Int, k: Int): Int {
        traceback(Array(n){BooleanArray(m){false}},0,0,m,n,k)
        return cnt
    }
    fun traceback(skip:Array<BooleanArray>,r:Int,c:Int,m:Int,n:Int,k:Int){
        var sum=0
        skip[r][c]=true

        //计算位数和
        for(i in r.toString()){
            sum+=i-'0'
        }
        for(i in c.toString()){
            sum+=i-'0'
        }

        if(sum<=k)cnt++
        else return
        

        if(r>0&&!skip[r-1][c])
            traceback(skip,r-1, c, m,n,k)
        if(r<n-1&&!skip[r+1][c])
            traceback(skip,r+1, c, m,n,k)
        if(c>0&&!skip[r][c-1])
            traceback(skip, r, c-1, m, n, k)
        if(c<m-1&&!skip[r][c+1])
            traceback(skip, r, c+1, m, n, k)
    }
}
```
