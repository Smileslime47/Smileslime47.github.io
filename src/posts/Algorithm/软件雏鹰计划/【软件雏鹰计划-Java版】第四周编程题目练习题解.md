---
title: 4-【软件雏鹰计划-Java版】第四周编程题目练习题解
date: 2024/04/29
categories: 
    - Algorithm
    - 软件雏鹰计划
mathjax: false
---
## 统计无重复字符子串

{% folding blue::题目 %}

给定一字符串，请统计位置连续，且无重复字符出现的子串数量。例如abc是无重复字符的子串，`abb`不是。
注：内容一样但位置不一样的子串，按不同子串参与统计。

一个字符串中任意个连续的字符组成的子序列称为该字符串的**子串**。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

一个字符串，仅由小写英文字母组成，其长度范围：[1, 1000000]

### 输出

一个整数，表示统计出的无重复字符的子串的数量。

### 样例1

```
输入：
    abac
输出：
    8
解释：
    子串有 a、b、a、c、ab、ba、ac、aba、bac、abac, 无重复字符的子串为 a、b、a、c、ab、ba、ac、bac，因此统计结果为8。
```

### 样例2

```
输入：
    xbmxbnh
输出：
    21
解释：
    无重复字符的子串为 x、b、m、x、b、n、h、xb、bm、mx、xb、bn、nh、xbm、bmx、mxb、xbn、bnh、mxbn、xbnh、mxbnh，因此统计结果为21。
```

{% endfolding %}

先从比较容易理解的一个朴素的DP角度去考虑这道题：设dp[i]是**字符串子串[0,i]（即input.substring(0,i+1)）中，无重复字符子串的数量**，那么当我们把问题扩展到dp[i+1]时，只需要在dp[i]的基础上加上**以字符input[i+1]结尾的新的无重复子串的数量**即可。同时，dp[input.length()-1]即为本题需要的答案

仔细考虑这个数组，该数组实质上是一个**前缀和数组**，而dp[input.length()-1]其实就是**字符串input中以每个字符结尾的无重复子串个数之和**

于是现在的问题变成了——对于input中的任意一个字符input[a]，如何求得该字符串中**以input[a]结尾的所有无重复字符子串**

假设input[j-1,j]是一个无重复子串、input[j-2,j]是一个无重复子串、…、input[i,j]是一个无重复子串，而input[i-1,j]恰好不再是一个无重复子串，此时我们发现，子串input[i,j]恰好是**以input[j]结尾的最长无重复字符子串**，当input[i-1,j]不再构成无重复子串时，对于任意k\<i，子串input[k,j]都不再满足无重复字符的要求，因此同时，j-i+1恰好为**以input[j]结尾的无重复字符子串个数**

因此对于input中的任意一个字符input[a]，只需要求得以input[a]结尾的最长无重复字符子串input[b,a]，此时a-b+1就是以input[a]结尾的所有无重复字符子串个数，最后将input中每个字符的**以该字符结尾的无重复字符子串个数**加在一起即为本题答案

要求以某字符结尾的最长无重复子串可以简单地继续用两层循环来实现，对于“以某字符结尾”来说可能会比较反直觉，但是实际上，该操作**等价于求“以某字符起始“的最长无重复子串**，由于字符串的正序和倒序没有意义，直接求**以某字符起始的最长无重复子串**也是没有问题的

当然这里我还是想得太绕弯子了，只要能想到这道题本质上是求：**以字符串的每个字符起始/结尾的最长无重复子串**，剩下的代码就迎刃而解了

```java
private static int getCountOfSubString(String input) {
    int res = 0;
    boolean[] existed = new boolean[128];

    for (int left = 0,right=0; left < input.length(); left++) {
        while (right < input.length() && !existed[input.charAt(right)]) {
            existed[input.charAt(right)] = true;
            right++;
        }
        res += right - (left == right ? left : left + 1) + 1;
        existed[input.charAt(left)] = false;
    }

    return res;
}
```

## 手机壳库存管理

{% folding blue::题目 %}

库存管理对于手机壳销售是否达成盈利最大化至关重要。

仓库中有一批不同型号的手机壳，每种型号手机壳的库存数量存在数组`inventory`中、总售价存在数组`price`中。每种型号手机壳的 销售收益 = 销售数量 * (price[i] / inventory[i]) 。

现给定市场上手机壳的最大需求量`demand`，请制定最佳销售策略以获得最大的总销售收益，并返回该值。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

首行两个正整数 M 和 N，M 表示手机壳种类的个数，取值范围：[1, 1000]； N 表示市场最大需求量，取值范围：[1, 500] （单位为千部）。
第2行 M 个数字，表示每种型号手机壳的数量（单位为千部），每个数字的取值范围：(0.0,1000.0]
第3行 M 个数字，表示每种手机壳的总售价（单位为万元），顺序与第2行一一对应，每个数字的取值范围：(0.0,10000.0]。

### 输出

浮点数形式的最大收益值（万元为单位）

> 系统进行浮点数结果判断，误差在0.01之内即认为正确。

### 样例1

```
输入：
    3 20
    18 15.0 10
    75.0 72 45
输出：
    94.50
解释：
    最大收益策略是卖出全部 15 千部第 2 种型号手机壳、以及 5 千部第 3 种型号手机壳，获得 72 + 45/2 = 94.5（万元）。
```

{% endfolding %}

> 本来以为这道题是0-1背包问题，结果直接贪心就ok了
>
> 关键在于这里的货物是可拆分的，如果在货物不可拆的情况下求最大利润就是背包DP了

显然,要卖出最高利润，我们应当优先卖出**单价**较高的手机壳，因此在解析输入的时候可以直接将价格转换为单价来表示

通过优先队列存储库存中的所有手机壳款式，按照单价从高到低卖出直到满足需求量即可

```java
private static String phoneCaseInventoryManage(float demand, float[] inventory, float[] price) {
    class PhoneCase {
        public final double inventory;
        public final double price;
        public PhoneCase(float inventory, float price) {
            this.inventory = inventory;
            this.price = price / inventory;
        }
    }
    PriorityQueue<PhoneCase> cases = new PriorityQueue<>((case1, case2) -> {
        if (case1.price == case2.price)
            return 0;
        else if (case1.price > case2.price)
            return -1;
        else
            return 1;
    });
    for (int i = 0; i < inventory.length; i++) {
        cases.add(new PhoneCase(inventory[i], price[i]));
    }
    double leftDemand = demand;
    double profit = 0;
    while (leftDemand > 0 && !cases.isEmpty()) {
        PhoneCase phoneCase = cases.poll();
        if (phoneCase.inventory >= leftDemand) {
            profit += leftDemand * phoneCase.price;
            break;
        } else {
            profit += phoneCase.inventory * phoneCase.price;
            leftDemand -= phoneCase.inventory;
        }
    }
    return String.format("%.2f", profit);
}
```

## 日活月活统计

{% folding blue::题目 %}

现有一份接口访问日志，每行日志格式如下，请统计日活数和月活数。
`yyyy-mm-dd|client_ip|url|result`

各字段说明：
`yyyy-mm-dd`：日志打印时间，一个日志文件中时间跨度保证都在同一个月内，但不保证每行是按日期有序的。
`client_ip`：为合法的点分十进制ipv4地址（1.1.1.1和1.01.001.1应视为同一个地址）。
`url`：访问的地址，格式如 /login.do，/query.html，仅包含字母、.、/和_。
`result`：接口访问结果，只有2种值：success 或 fail 。

**日活数、月活数的统计规则：**

- 日活数统计：统计**当天**有多少个不同的 client_ip 访问的地址是 /login.do，且结果为 success。
- 月活数统计：统计**当月**有多少个不同的 client_ip 访问的地址是 /login.do，且结果为 success。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

首行一个正整数 num ，表示日志行数，范围为 [1,50000]。
接下来 num 行字符串，每行字符串表示一条日志内容，每行字符串长度不超过150。

### 输出

32个整数，以单空格分隔。第1个整数表示月活数，第 2-32 个整数分别表示当月1-31天的日活数。

### 样例1
```
输入：
    5
    2020-02-01|192.168.218.218|/login.do|success
    2020-02-01|192.168.218.218|/login.do|success
    2020-02-01|192.168.210.210|/login.do|fail
    2020-02-02|192.168.210.210|/login.do|success
    2020-02-02|192.168.218.218|/login.do|success
输出：
    2 1 2 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
解释：
    二月的第一天即2月1日，有两条日志访问/login.do的结果为success，但都来自同一个ip（192.168.218.218），因此当天的日活数统计为1。
    第二天有两条访问成功，来自两个不同的ip，因此日活数为 2。
    当月仅有2个ip访问成功，因此月活数为2。注意：月活数不是日活数的简单累加。
```

### 样例2

```
输入：
    3
    2020-12-01|192.168.218.001|/login.do|success
    2020-12-01|192.168.218.1|/login.do|success
    2020-12-01|192.168.218.2|/to_login.do|success
输出：
    1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
解释：
    192.168.218.001和192.168.218.1视为同一个ip，/to_login.do 与 /login.do 不匹配，因此统计下来日活数为1，月活数为1。
```

{% endfolding %}

> 虽然这里是用正则匹配做的，但是众所周知正则匹配的性能实在是太烂了，这段代码交上去就能看见1000ms+的耗时

通过正则匹配和捕获组可以方便地拿到字符串中的信息

因为IP地址本身就是一个四字节整数，因此直接将其转换为整数表示即可消除其中前导0的影响，举例来说，127.0.0.1即对应整数（(127 << 24) + (0 << 16) + (0 << 8) + 1）

将URL和RESULT分别设置为”/\w+\.\w+”和”success|fail”然后在match的时候再去写检验当然是可行的，但是由于正则匹配本身是基于回溯算法做的，这么做只会徒增耗时

```java
interface Regex {
    String DATE = "(\\d{4})-(\\d{2})-(?<day>\\d{2})";
    String ADDRESS = "(?<address>(\\d{1,3}\\.){3}\\d{1,3})";
    String URL = "/login\\.do";
    String RESULT = "success";
    String PATTERN = DATE + "\\|" + ADDRESS + "\\|" + URL + "\\|" + RESULT;
}
private static int[] getActiveUserNum(String[] logs) {
    Pattern pattern = Pattern.compile(Regex.PATTERN);
    Set<Integer> monthlyAccessMap = new HashSet<>();
    Map<String, Set<Integer>> dailyAccessMap = new HashMap<>();
    for (String log : logs) {
        Matcher matcher = pattern.matcher(log);
        if (matcher.matches()) {
            String day = matcher.group("day");
            Integer address = Arrays.stream(matcher.group("address").split("\\.")).map(Integer::parseInt).reduce(0, (a, b) -> (a << 8) + b);
            monthlyAccessMap.add(address);
            dailyAccessMap.putIfAbsent(day, new HashSet<>());
            dailyAccessMap.get(day).add(address);
        }
    }
    int[] res = new int[32];
    res[0] = monthlyAccessMap.size();
    for (int i = 1; i <= 31; i++) {
        res[i] = dailyAccessMap.getOrDefault(String.format("%02d", i), new HashSet<>()).size();
    }
    return res;
}
```