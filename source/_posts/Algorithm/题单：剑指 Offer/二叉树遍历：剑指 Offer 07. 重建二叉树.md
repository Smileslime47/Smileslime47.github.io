# 剑指 Offer 07. 重建二叉树
原题地址：https://leetcode.cn/problems/zhong-jian-er-cha-shu-lcof

## 题解
给定一棵树的前序遍历和中序遍历序列，我们可以知道：
- 前序遍历的结构是：[根节点,[左子树的前序遍历],[右子树的前序遍历]]
- 中序遍历的结构是：[[左子树的中序遍历],根节点,[右子树的中序遍历]]

设前序遍历序列在数组中的范围为[preRange[0],preRange[1]]

设中序遍历序列在数组中的范围为[midRange[0],midRange[1]]

对于当前节点，我们可以很轻易地通过前序遍历的第一个值找到该节点的值，下一步是构建它的**左子树和右子树**

我们在找到根节点的值后，扫描中序遍历序列，可以在序列中找到根节点值所在的下标**i**

那么
- 对于左子树的序列长度leftLen=i-midRange[0]
- 对于右子树的序列长度rightLen=midRange[1]-i

有了左子树和右子树的序列长度后，我们就可以轻易地找出左子树和右子树在**总前序遍历序列**中**各自前序遍历的下标范围**
- 左子树的前序遍历序列的范围为[preRange[0]+1,preRange[0]+leftLen]
- 右子树的前序遍历序列的范围为[preRange[1]-rightLen+1,preRange[1]]

在得到子树的**前序遍历序列**和**中序遍历序列**后，我们就可以迭代地构建根节点的两颗子树了

**时间复杂度**：O(N)

**空间复杂度**：O(N)

```java
class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        return rebuild(preorder,inorder,new int[]{0,preorder.length-1},new int[]{0,preorder.length-1});
    }

    TreeNode rebuild(int[] pre,int[] mid,int[]preRange,int[]midRange){
        if(preRange[0]>preRange[1])return null;
        if(midRange[0]>midRange[1])return null;
        
        TreeNode node=new TreeNode(pre[(preRange[0])]);
        int i,leftLen=0,rightLen=0;
        for(i=midRange[0];i<=midRange[1];i++){
            if(mid[i]==pre[preRange[0]]){
                leftLen=i-midRange[0];
                rightLen=midRange[1]-i;
                break;
            }
        }

        node.left=rebuild(pre,mid,new int[]{preRange[0]+1,preRange[0]+leftLen},new int[]{midRange[0],i-1});
        node.right=rebuild(pre,mid,new int[]{preRange[1]-rightLen+1,preRange[1]},new int[]{i+1,midRange[1]});

        return node;
    }
}
```
