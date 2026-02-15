---
title: 位运算：剑指 Offer 56 - I. 数组中数字出现的次数
date: 2023/05/09
categories: 
    - Algorithm
    - 题单：剑指 Offer
mathjax: false
---
原题地址：https://leetcode.cn/problems/shu-zu-zhong-shu-zi-chu-xian-de-ci-shu-lcof/

## 题解
参考题解思路

考虑当数组中只有一个独立元素，其他元素均出现两次时，我们可以很容易地想到对整个数组中所有的元素**异或（^）**，由于**相同位置0，不同位置1**，出现两次的元素被异或后都只会得到0，只有单独的那个元素会留下来，因此得到的结果就是单独出现的那个元素

这道题由于出现了两个独立元素，我们同样的方法只能得到**两个独立元素的异或结果**，但是这个异或结果代表的信息是**这两个数字中都有哪些位是不同的**。我们在这个结果中随便取一个值为1的位，即这两个数字在这一位上是不同的。根据这一位的值为0/1，我们可以将数组分为两组，其中相同的元素由于二进制值完全一样必然被分为一组，而两个独立元素则因为这一位上的值彼此不同而**被分在不同两组里**

这时我们得到的两组元素就有了**只有一个独立元素，其他元素均出现两次**的性质，这时我们对两组数字分别异或，分别得到的结果就是两个我们需要的答案了

**时间复杂度**：O(N)

**空间复杂度**：O(1)

```Java []
class Solution {
    public int[] singleNumbers(int[] nums) {
        int xor=0;
        int[] ans=new int[2];
        boolean[] flag=new boolean[2];
        int difDigit=0;

        flag[0]=false;
        for (int num : nums) {
            xor = flag[0] ? xor ^ num : num;
            flag[0] = true;
        }
        for(int i=0;i<32;i++){
            if((xor&(1<<i))!=0){
                difDigit=i;
                break;
            }
        }

        flag[0]=false;
        for (int num : nums) {
            if ((num & (1 << difDigit)) == 0) {
                ans[0] = flag[0] ? ans[0] ^ num : num;
                flag[0] = true;
            }
            if ((num & (1 << difDigit)) != 0) {
                ans[1] = flag[1] ? ans[1] ^ num : num;
                flag[1] = true;
            }
        }
        return ans;
    }
}
```
```Kotlin []
class Solution {
    fun singleNumbers(nums: IntArray): IntArray {
        var xorOf2 = 0
        val ans = IntArray(2)
        val flag = BooleanArray(2)
        var difDigit = 0
        flag[0] = false
        for (num in nums) {
            xorOf2 = if (flag[0]) xorOf2 xor num else num
            flag[0] = true
        }
        for (i in 0..31) {
            if (xorOf2 and (1 shl i) != 0) {
                difDigit = i
                break
            }
        }
        flag[0] = false
        for (num in nums) {
            if (num and (1 shl difDigit) == 0) {
                ans[0] = if (flag[0]) ans[0] xor num else num
                flag[0] = true
            }
            if (num and (1 shl difDigit) != 0) {
                ans[1] = if (flag[1]) ans[1] xor num else num
                flag[1] = true
            }
        }
        return ans
    }
}

```