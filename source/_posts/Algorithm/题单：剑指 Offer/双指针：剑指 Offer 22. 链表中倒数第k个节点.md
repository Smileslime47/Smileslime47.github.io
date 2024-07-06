# 剑指 Offer 22. 链表中倒数第k个节点
原题地址：https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/

## 题解
双指针，先让right向右移动k-1次，此时[left,right]的长度即为k，让整个窗口不断右移（left++,right++）至right.next==null

此时left指向节点即为倒数第k个节点

**时间复杂度**：O(N)

**空间复杂度**：O(1)
```java
class Solution {
    public ListNode getKthFromEnd(ListNode head, int k) {
        ListNode left=head,right=head;
        for (int i=0;i<k-1;i++){
            right=right.next;
        }
        while (right.next!=null){
            left=left.next;
            right=right.next;
        }
        return left;
    }
}
```
