# 剑指 Offer 29. 顺时针打印矩阵
原题地址：https://leetcode.cn/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/

## 题解
模拟，循环逆时针打印的四个状态：
- 状态0：从左至右打印，碰到边界切换至状态1
- 状态1：从上至下打印，碰到边界切换至状态2
- 状态2，从右至左打印，碰到边界切换至状态3
- 状态3：从下至上打印，碰到边界切换至状态0

开一个二维的boolean数组skip，记录**录入过的元素**（这里用四个int记录边界墙也可以），此时**skip为true的元素就是遍历边界**

**时间复杂度**：O(N)

**空间复杂度**：O(N)
```java
class Solution {
    public int[] spiralOrder(int[][] matrix) {
        if(matrix.length==0)return new int[0];
        int[] ret=new int[matrix.length*matrix[0].length];
        boolean[][] skip=new boolean[matrix.length][matrix[0].length];
        
        int status=0,r=0,c=0,cnt=0;
        while(cnt<ret.length){
            skip[r][c]=true;
            ret[cnt]=matrix[r][c];
            cnt++;
            
            if(status==0){
                if(c<matrix[r].length-1&&!skip[r][c+1]){
                    c++;
                }else{
                    status=1;
                    r++;
                }
            }else if(status==1){
                if(r<matrix.length-1&&!skip[r+1][c]){
                    r++;
                }else{
                    status=2;
                    c--;
                }
            }else if(status==2){
                if(c>0&&!skip[r][c-1]){
                    c--;
                }else{
                    status=3;
                    r--;
                }
            }else{
                if(r>0&&!skip[r-1][c]){
                    r--;
                }else{
                    status=0;
                    c++;
                }
            }
        }
        return ret;
    }
}
```
