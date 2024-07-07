---
title: 剑指 Offer 35. 复杂链表的复制
date: 2023/04/24
category: 
    - Algorithm
    - 题单：剑指 Offer
mathjax: false
---
原题地址：
- https://leetcode.cn/problems/fu-za-lian-biao-de-fu-zhi-lcof/
- https://leetcode.cn/problems/copy-list-with-random-pointer/

## 题解
**思路一：哈希表**

这道题的难点在于，当我们创建前面的节点时，**前面节点的random可能指向的后面的还未被创建节点**，如果此时我们提前把后面的节点创建出来来对应random，等到遍历到后面的节点时可能又难以找到这些节点，理所当然地，我们应当**先按顺序把所有的节点创建起来**再去考虑对应关系

```java
Node node=head;
while(node!=null){
    list.add(new Node(node.val));
    node=node.next;
}
```

在我们按顺序创建好这些节点后，建立起这些节点的next关系并不困难，但是如何建立起这些节点的random关系呢？问题在于原链表节点的random指向的还是原链表的节点，对于**Node 3->Node 7**，我们**无法找到NewNode 7**来建立起**NewNode 3->NewNode 7**，所以需要一个哈希表来将原链表节点与新链表节点联系起来，建立起**Node 7->NewNode 7**的键值对关系

要注意的是Node.random有可能是null，需要判断并分类处理

**时间复杂度**：O(N)

**空间复杂度**：O(N)
```java
class Solution {
    public Node copyRandomList(Node head) {
        if(head==null)return null;
        List<Node> list=new ArrayList<>();
        Map<Node,Node> map=new HashMap<>();

        int i=0;
        Node node=head;
        while(node!=null){
            list.add(new Node(node.val));
            map.put(node,list.get(i));
            i++;
            node=node.next;
        }

        node=head;
        i=0;

        while(node!=null){
            if(i<list.size()-1){
                list.get(i).next=list.get(i+1);
            }
            if(node.random==null){
                list.get(i).random=null;
            }else{
                list.get(i).random=map.get(node.random);
            }
            i++;
            node=node.next;
        }
        return list.get(0);
    }
}
```

**思路二：节点拆分**
参考官方题解

思路一中我们已经发现，这道题的难点是如何建立起**原链表节点和新链表节点的对应关系**，那么有没有一种不需要哈希表就能建立起关系的办法呢？官方题解给出了一种**节点拆分**的思想。

我们将新链表和原链表像归并那样**插在一起**，让原链表节点的next指向的是它对应的新链表节点，于是对于next关系我们就有了：

Node 1->NewNode 1->Node 2->NewNode 2->...->Node n->NewNode n->null

这样我们就可以很轻松地通过原链表节点Node n的next来找到新链表的对应节点NewNode n

Node 3->NewNode 3->...->Node 7->NewNode 7

对于Node 3->Node 7来说，我们可以直接NewNode 3.random=Node3.random(Node 7).next(NewNode 7)来建立起random关系

在建立起关系后，还需要将next关系还原，将新链表从中抽分开来：

NewNode.next=NewNode.next.next

要注意的是，和思路一一样，要判断next和random是否为null

**时间复杂度**：O(N)

**空间复杂度**：O(1)
```java
class Solution {
    public Node copyRandomList(Node head) {
        if(head==null)return null;
        Node newRoot,node,newNode;
        node=head;
        //混合两个链表，建立next关系
        while(node!=null){
            newNode=new Node(node.val);
            newNode.next=node.next;
            node.next=newNode;

            node=newNode.next;
        }

        //建立random关系
        newRoot=head.next;
        node=head;
        while(node!=null){
            newNode=node.next;
            newNode.random=node.random!=null?node.random.next:null;

            node=newNode.next;
        }

        //还原next关系
        node=head;
        while(node!=null){
            newNode=node.next;
            node.next=newNode.next;
            newNode.next=newNode.next!=null?newNode.next.next:null;

            node=node.next;
        }

        return newRoot;
    }
}
```
