---
title: 二分：剑指 Offer 53 - I. 在排序数组中查找数字 I
date: 2023/04/24
category: 
    - Algorithm
    - 题单：剑指 Offer
mathjax: false
---
原题地址：https://leetcode.cn/problems/zai-pai-xu-shu-zu-zhong-cha-zhao-shu-zi-lcof/

## 题解
既然这题给出了**递增数组**这一条件，那么必然是要求我们通过**二分查找**来实现

因为要统计Target在数组中的出现次数，自然我们需要查找的是**Target在数组中的最小下标**

对于常规的二分查找算法来说，求出nums[mid]后并不复杂
- nums[mid]<target则begin=mid+1
- nums[mid]>target则end=mid-1
- nums[mid]=target则返回mid
- begin>=end则返回begin

但是由于要求出最小下标，当满足nums[mid]=target时我们需要考虑到两种情况
- TTTTMTTTT，即mid在Target中间的情况，这时的mid显然不是我们要找的，观察易得最小下标在mid左侧，处理方法同nums[mid]>target即可
- MTTTTTTTT，即mid在Target首部的情况，这时的mid是我们需要的，我们需要比较nums[mid]==target&&nums[mid-1]!=target得出
    - 要注意的是，当mid==0时也是满足我们需求的情况，要特殊判断

**时间复杂度**：O(logN)

**空间复杂度**：O(1)
```java
class Solution {
    public int search(int[] nums, int target) {
        if(nums.length==0)return 0;
        int cnt=0;

        int begin=0,end=nums.length-1,mid=(begin+end)/2;
        while(begin<=end){
            mid=(begin+end)/2;
            //...M...T...
            if(nums[mid]<target)begin=mid+1;
            //...T...M...
            else if(nums[mid]>target)end=mid-1;
            else if(nums[mid]==target){
                //...TTTTMTTTT...
                if(mid>0&&nums[mid-1]==target)end=mid-1;
                //...MTTTTTTTT...
                //else if(mid==0||nums[mid-1]!=nums[mid])
                else break;
            }
        }


        for(int i=mid;i<nums.length;i++){
            if(nums[i]==target)cnt++;
            else break;
        }
        return cnt;
    }
}
```
