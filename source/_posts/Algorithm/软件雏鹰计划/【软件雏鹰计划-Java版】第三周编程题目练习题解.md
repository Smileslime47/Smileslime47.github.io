---
title: 【软件雏鹰计划-Java版】第三周编程题目练习题解
date: 2024/04/28
category: 
    - Algorithm
    - 软件雏鹰计划
mathjax: false
---
>  这次的批次计算任务和最长指定瑕疵度元音子串都是滑动窗口，边界条件调试起来很痛苦
> 
> 已经确认暴力算法（O(N2) ）会卡时间（99%）

## 批次计算任务

{% folding blue::题目 %}

某业务需要连续上报 10000 批的数据（批次从1到10000），可能会存在数据上报失败（某一批次数据上报失败后不影响后续数据上报）。假设已知 nCount 批上报失败的批次，现给你 mCount 次机会纠错，每次机会只能纠错一个批次，并保证成功。

请计算纠错后（不一定需要用完所有机会），最大的连续上报成功的数据批数是多少。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

第一行两个整数 `nCount mCount`，分别表示上报失败的批数和纠错的机会，取值范围都为 [0,10000]
第二行 nCount 个整数，表示上报失败的批次序列，且为升序，值的范围 [1,10000]

### 输出

一个整数，表示最大的连续上报成功的数据批数

### 样例1

```
输入：
    2 1
    83 800
输出：
    9917
解释：
    纠错前，连续上报成功的区间为[1,82]、[84,799]和[801,10000]，批数分别为82、716、9200。 选择对第800批纠错，纠错后[84,10000]连续上报成功的批数最大，为9917
```
![](https://klt-static-content1.obs.cn-north-4.myhuaweicloud.com/20211110/exam/660a28310edf4ba9a5e652d12ea8d53f_%E6%89%B9%E6%AC%A1%E4%BB%BB%E5%8A%A1.png)

### 样例2

```
输入：
    2 2
    12 34
输出：
    10000
解释：
    对两批都纠错，则10000批数据全部连续上报成功
```

### 样例3

```
输入：
    5 1
    2 3000 5000 8000 9990
输出：
    4999
解释：
    选择对第5000批纠错，则[3001,7999]连续上报成功，批数为4999
```

{% endfolding %}

这道题理论上也可以当做石子合并的变种（区间DP），但是因为提交不给看错误样例，实在是调不出来就放弃了。

要保证**连续最长**，应当保证所有纠错都是连续的，不会出现修好A之后跳过B再去修C的情况，这是使用滑动窗口的前提。

既然限定了最多纠错m组数据，那么设left为**被纠错**的m组数据中最左侧的数据（即索引最小的数据），right为**被纠错**的m组数据中最右侧的数据（即索引最大的数据）

滑动逻辑：

1. 在固定left,且当前纠错的数据数量尚未达到m时，先无脑向右扩展窗口（继续修右边的数据），即right++
2. 在一定次数扩展后，纠错数量达到m时，即为当前left下能达到的最长连续批数
3. 向右收缩窗口（放弃修左边的数据），即left++，直到当前纠错的数据数量重新小于m为止，然后回到步骤1

要注意的是，代码中：

1. left和right对应的是nums中的索引，即**上报失败的数据中的第n组数据**
2. leftPos和rightPos对应的是这个窗口的左边界和右边界，即**连续数据中的第一个数据和最后一个数据的位置**

以[83,800]为例，当left为1时，指的是上报失败的数据中的第1组数据（以0起始），此时第1组数据800是被修好的，第0组数据83未被修好，那么连续数据的左边界leftPos应当为83+1即84

在不考虑边界情况（即left和right均为nums中间的某组数据）时，可以得到：

1. 最左侧，第nums[left]组数据已经被修好了，因此这组连续数据的左边界leftPos应当为nums[left-1] +1
2. 最右侧，第nums[right]组数据已经被修好了，因此这组连续数据的右边界rightPos应当为nums[right+1] – 1
3. 此时，这组连续数据的长度即为rightPos – leftPos + 1

```java
private static int batchCalculation(int nCount, int mCount, int[] nums) {
    if (mCount >= nCount) {
        return 10000;
    }

    int res = 0;

    int left = 0;
    int right = 0;
    int leftPos = 0;
    int rightPos = 0;
    int fixCnt = 1;
    int fixMax = mCount;

    res = max(nums[0] - 1, 10000 - nums[nums.length - 1]);
    for (int i = 1; i < nums.length; i++) {
        res = max(res, nums[i] - nums[i - 1] - 1);
    }

    while (left < nums.length) {
        while (fixCnt <= fixMax && right <= nums.length) {
            if (fixCnt <= fixMax) {
                leftPos = left - 1 == -1 ? 1 : nums[left - 1] + 1;
                rightPos = right + 1 == nums.length ? 10000 : nums[right + 1] - 1;

                res = max(res, rightPos - leftPos + 1);
            }

            right++;
            fixCnt++;
        }

        if (right >= nums.length) {
            break;
        }

        while (fixCnt > fixMax) {
            left++;
            fixCnt--;
        }
    }

    return res;
}
```

## 促销活动

{% folding blue::题目 %}

华为商城举办了一个促销活动，某一秒内最早的订单（可能多个）可以获取免单。
现给定一批订单记录，请计算有多少个订单可以获取免单。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

第一行一个整数 size, 表示顾客下单数量，其值范围：[1, 50000)
随后为 size 行字符串，每行表示一个订单的下单时间，格式为：
YYYY-MM-DD hh:mm:ss.fff

其中 YYYY-MM-DD hh:mm:ss 表示下单时间的 年-月-日 小时:分:秒，皆为合法范围。
fff 表示下单时间的毫秒值，值的范围为 [0, 999]

### 输出

一个整数，表示有多少个订单可以获取免单。

### 样例1

```
输入：
    3
    2019-01-01 00:00:00.001
    2019-01-01 00:00:00.002
    2019-01-01 00:00:00.003
输出：
    1
解释：
    三个订单都是同一秒（年-月-日 小时:分:秒）内下单，毫秒时间第一个订单最早，可以免单。
```

### 样例2

```
输入：
    6
    2019-01-01 00:00:00.001
    2019-01-01 00:00:00.002
    2019-01-01 00:00:00.003
    2019-01-01 08:59:00.123
    2019-01-01 08:59:00.123
    2018-12-28 13:08:00.999
输出：
    4
解释：
    前三个订单是同一秒（年-月-日 小时:分:秒 都相同）内下单，第一个订单的毫秒时间最早、可以免单； 第二、三个订单不是该秒内的最早时间、不可免单。
    第四、五个订单是另外的同一秒内下单，且毫秒时间也完全相同，因此同为最早时间、都可以免单。
    最后一个订单是该秒内唯一的一个订单，也是最早、可以免单。

    因此共有 4 个订单可以免单。
```

### 样例3

```
输入：
    5
    2019-01-01 00:00:00.004
    2019-01-01 00:00:00.004
    2019-01-01 00:00:01.006
    2019-01-01 00:00:01.006
    2019-01-01 00:00:01.005
输出：
    3
解释：
    前两个订单是同一秒内同一时刻（也是最早）下单，第三第四个订单不是当前秒内最早下单，不可免单，第五个订单可以免单。
```

{% endfolding %}

我们只需要记录每个YYYY-MM-DD hh:mm:ss下最小的fff出现了几次即可，由于时间格式是YYYY-MM-DD hh:mm:ss.fff，直接通过split(“[.]”)即可将时间拆成我们需要的两部分

用哈希表存储，其中键为**YYYY-MM-DD hh:mm:ss**格式的字符串，值为一个Pair（由于Java中没有Pair,这里只能使用int[]替代）,第一个数据是fff,即当前记录的最小毫秒数，第二个数据为该毫秒数出现了几次

- 找到同一个键下更小的毫秒数时，刷新Pair为该毫秒数，次数重置为1即可
- 找到同一个键下相同的毫秒数时，次数++即可
- 找到同一个键下更大的毫秒数时，直接跳过该组数据

```java
private static int freeOrder(String[] orderTime) {
    Map<String, int[]> map = new HashMap<>();
    for (String s : orderTime) {
        String time = s.split("[.]")[0];
        String millsStr = s.split("[.]")[1];
        int mills = Integer.parseInt(millsStr);

        if (map.containsKey(time)) {
            if (map.get(time)[0] > mills) {
                map.put(time, new int[]{mills, 1});
            } else if (map.get(time)[0] == mills) {
                map.put(time, new int[]{mills, map.get(time)[1] + 1});
            }
        } else {
            map.put(time, new int[]{mills, 1});
        }
    }

    int res = 0;
    for (Map.Entry<String, int[]> entry : map.entrySet()) {
        res += entry.getValue()[1];
    }

    return res;
}
```

## 遥控小车

{% folding blue::题目 %}

假设在平面直角坐标系（上北-Y轴正方向，下南-Y轴负方向，左西-X轴负方向，右东-X轴正方向）上，一个遥控小车最初位于原点 (0, 0) 处，且面朝北方。

遥控小车可以接受下列三条指令之一：
"G"：直走 1 个单位
"L"：左转 90 度
"R"：右转 90 度

给定一批指令，遥控小车按顺序执行每个指令后，请计算遥控小车最终所处的位置。

> 用例保证整个过程中坐标(x,y)的值都在 int (32 位系统)范围内

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 64MB, 其他语言：128MB

### 输入

字符串表示的一批遥控指令，仅由字符 G、L、R组成，长度范围[1,100]

### 输出

小车最终所处位置的坐标

### 样例1

```
输入：
    GG
输出：
    (0,2)
解释：
```

{% endfolding %}

模拟即可，不再赘述

```java
private static String execCommand(String commands) {
    int[] position = new int[]{0,0};
    int direction = 0;
    for(char c : commands.toCharArray()){
        if(c == 'G'){
            position[1] += (int)Math.round(Math.cos(direction * Math.PI / 180));
            position[0] += (int)Math.round(Math.sin(direction * Math.PI / 180));
        }else if(c == 'L'){
            direction = (direction + 270) % 360;
        }else if(c == 'R'){
            direction = (direction + 90) % 360;
        }
    }
    return "("+position[0]+","+position[1]+")";
}
```

## 最长的指定瑕疵度元音子串

{% folding blue::题目 %}

定义：开头和结尾都是元音字母（`aeiouAEIOU`）的字符串为 元音字符串 ，其中混杂的非元音字母数量为其 瑕疵度 。比如:

- "a" 、 "aa"是元音字符串，其瑕疵度都为0
- "aiur"不是元音字符串（结尾不是元音字符）
- "abira"是元音字符串，其瑕疵度为2

给定一个字符串，请找出指定瑕疵度的最长元音字符子串，并输出其长度，如果找不到满足条件的元音字符子串，输出0。

> 子串：字符串中任意个连续的字符组成的子序列称为该字符串的子串。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

首行输入是一个整数，表示预期的瑕疵度flaw，取值范围 [0, 65535]。
接下来一行是一个仅由字符a-z和A-Z组成的字符串，字符串长度 (0, 65535]。

### 输出

输出一个整数，代表满足条件的元音字符子串的长度。

### 样例1

```
输入：
    0
    asdbuiodevauufgh
输出：
    3
解释：
    满足条件的最长元音字符子串有两个，分别为uio和auu，长度为3。
```

### 样例2

```
输入：
    2
    aeueo
输出：
    0
解释：
    没有满足条件的元音字符子串，输出0
```

### 样例3

```
输入：
    1
    aabeebuu
输出：
    5
解释：
    满足条件的最长元音字符子串有两个，分别为aabee和eebuu，长度为5
```

{% endfolding %}

思路同样为滑动窗口

由于元音子串只考虑首尾均为元音的子串，因此可以通过一个List-vowelPos记录下整个字符串中所有元音字母的位置，我们只需要考虑首尾（即左右指针/窗口边界）由位于vowelPos里的元素组成的子串即可

于是对于相邻的两个元音组成的元音子串input.substring(vowelPos[a],vowelPos[a+1]+1)，其瑕疵度为vowelPos[a+1] – vowelPos[a] -1

其中left和right均为vowelPos的索引，代表子串的左边界和右边界

滑动逻辑：

1. 在固定left,且当前瑕疵度尚未达到flaw时，先无脑向右扩展窗口，即right++，其瑕疵度的变化量为vowelPos[right] – vowelPos[right – 1] -1
2. 在一定次数扩展后，瑕疵度达到flaw时，即为当前left下能达到的最长元音子串，跳到步骤4
3. 在一定次数扩展后，瑕疵度大于flaw时，当前left无法组成指定瑕疵度的子串，跳到步骤4
4. 向右收缩窗口，即left++，其瑕疵度的变化量为vowelPos[left + 1] – vowelPos[left] -1,直到当前瑕疵度重新小于flaw为止，然后回到步骤1

```java
private static int getLongestFlawedVowelSubstrLen(int flaw, String input) {
    Set<Character> vowel = new HashSet<>(Arrays.asList('a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'));
    List<Integer> vowelPos = new ArrayList<>();
    int res = 0;

    for (int i = 0; i < input.length(); i++) {
        if (vowel.contains(input.charAt(i))) {
            vowelPos.add(i);
        }
    }

    int left = 0;
    int right = 0;
    int flawCnt = 0;

    while (left < vowelPos.size()) {
        while (flawCnt <= flaw && right < vowelPos.size()) {
            if (flawCnt == flaw) {
                res = max(res, vowelPos.get(right) - vowelPos.get(left) + 1);
            }

            right++;

            if (right < vowelPos.size() && vowelPos.get(right) - vowelPos.get(right - 1) > 1) {
                flawCnt += vowelPos.get(right) - vowelPos.get(right - 1) - 1;
            }
        }

        if (right >= vowelPos.size()) {
            break;
        }

        while (flawCnt > flaw) {
            if (vowelPos.get(left + 1) - vowelPos.get(left) > 1) {
                flawCnt -= vowelPos.get(left + 1) - vowelPos.get(left) - 1;
            }
            left++;
        }
    }

    return res;
}
```