---
title: BST：剑指 Offer 36. 二叉搜索树与双向链表
date: 2023/05/06
category: 
    - Algorithm
    - 题单：剑指 Offer
mathjax: false
---
原题地址：https://leetcode.cn/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/

## 题解
对于一个节点，我们先求出**左子树**的链表形态和**右子树**的链表形态
- 对于这个节点，其前驱等于左子树链表的最后一个元素
- 对于这个节点，其后驱等于右子树链表的第一个元素

此时我们将这个节点的**左子树+自己+右子树**重新整合成一个链表
- 同理地，对于这个节点的父节点
- 若该节点为父节点的左节点，则返回整合后链表的最后一个元素
- 若该节点为父节点的右节点，则返回整合后链表的第一个元素

当根节点整合完毕后，找到链表的第一个元素first和最后一个元素end，连接first的left和end的right，然后返回first节点即可

**时间复杂度**：O(N)

**空间复杂度**：O(1)
```java
class Solution {
    public Node treeToDoublyList(Node root) {
        Node node=DFS(root,null);
        return node;
    }

    Node DFS(Node node,Node parent){
        if(node==null)return null;
        node.left=DFS(node.left,node);
        if(node.left!=null)node.left.right=node;
        node.right=DFS(node.right,node);
        if(node.right!=null)node.right.left=node;


        if(parent==null){
            Node first=node,end=node;
            while(first.left!=null){
                first=first.left;
            }
            while(end.right!=null){
                end=end.right;
            }
            first.left=end;
            end.right=first;
            return first;
        }else if(node==parent.left){
            while(node.right!=null){
                node=node.right;
            }
            return node;
        }else if(node==parent.right){
            while(node.left!=null){
                node=node.left;
            }
            return node;
        }
        return node;
    }
}
```
