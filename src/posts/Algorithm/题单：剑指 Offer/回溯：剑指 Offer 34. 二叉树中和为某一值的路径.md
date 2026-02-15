---
title: 回溯：剑指 Offer 34. 二叉树中和为某一值的路径
date: 2023/05/06
categories: 
    - Algorithm
    - 题单：剑指 Offer
mathjax: false
---
原题地址：https://leetcode.cn/problems/er-cha-shu-zhong-he-wei-mou-yi-zhi-de-lu-jing-lcof/

## 题解
回溯，每次向List中加入当前节点value，并判断target-value是否为0，若为0则将List加入Ans中
- 要注意这里要传入一个List的深拷贝而非List本身，否则Ans中存的仍然是该List引用指向的表，后续修改会修改已存在Ans中的List

对Node的左节点和右节点进行迭代，每次迭代的target=target-node.value

**时间复杂度**：O(N)

**空间复杂度**：O(N)
```java
class Solution {
    fun pathSum(root: TreeNode?, target: Int): List<List<Int>> {
        val ans= LinkedList<List<Int>>()
        val tmp=LinkedList<Int>()
        traceback(root,ans,tmp,target)
        return ans
    }

    fun traceback(node:TreeNode?,ans:MutableList<List<Int>>,tmp:MutableList<Int>,target:Int){
        if(node==null)return
        tmp.add(node.`val`)
        if(target-node.`val`==0&&node.left==null&&node.right==null){
            ans.add(LinkedList(tmp))
        }else{
            traceback(node.left, ans, tmp, target-node.`val`)
            traceback(node.right, ans, tmp, target-node.`val`)
        }
        tmp.removeAt(tmp.size-1)
    }
}
```
