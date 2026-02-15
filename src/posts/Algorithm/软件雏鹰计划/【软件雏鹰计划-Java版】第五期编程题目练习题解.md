---
title: 5-【软件雏鹰计划-Java版】第五期编程题目练习题解
date: 2024/05/13
category: 
    - Algorithm
    - 软件雏鹰计划
mathjax: false
---
## 简易 DHCP 服务器

{% folding blue::题目 %}

DHCP服务器的功能是为每一个MAC地址分配唯一的IP地址。现假设：分配的IP地址范围从 192.168.0.0 到 192.168.0.255 **总共256个**可用地址（以点分十进制表示）。请实现一个简易的DHCP服务器，功能如下：

- **分配Request**：根据输入的MAC地址分配IP地址池中的IP地址：
  - 如果对应的IP已分配并未释放，则为**重复申请**，直接返回对应已分配的IP地址。
  - 如果一个MAC地址已申请过并已释放，即：当前未分配IP地址，则为再申请，优先分配**最近一次曾经为其分配过的**IP地址，请返回此地址。
  - 按升序分配从未被分配过的IP地址；如果地址池中地址都已被分配过，则按**升序**分配已释放出来的IP地址；若可分配成功，则返回此IP地址。
  - 若仍然无法分配成功，则返回`NA`。
- **释放Release**：根据输入的MAC地址释放已分配的IP地址：
  - 如果申请释放的对应的IP地址已分配，则释放此IP地址；
  - 如果申请释放的对应的IP地址不存在，则不作任何事情；

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

首行为整数n, 表示其后输入的命令行数，范围[1,2000]。
之后每行为一条分配命令，格式为：`命令=MAC地址`

- 命令只有两种：`REQUEST` 和 `RELEASE`，分别表示分配和释放；
- MAC地址为：12个大写英文字母或数字，如：`AABBCCDDEEF1`。

### 输出

1. REQUEST命令，输出分配结果(IP地址字符串或字符串NA)，均为字符串形式。

> 注意：IP地址的各区段不设置前置 0

2. RELEASE命令，不输出任何内容。

### 样例1

```
输入：
    2
    REQUEST=AABBCCDDEEF1
    RELEASE=AABBCCDDEEF1
输出：
    192.168.0.0
解释：
    REQUEST=AABBCCDDEEF1 按升序分配从未使用过的IP地址，输出192.168.0.0
    RELEASE=AABBCCDDEEF1 不输出
```

### 样例2

```
输入：
    6
    REQUEST=AABBCCDDEEF1
    REQUEST=F2FBBCCDDEEF
    RELEASE=AABBCCDDEEF1
    RELEASE=F2FBBCCDDEEF
    REQUEST=333333333333
    REQUEST=F2FBBCCDDEEF
输出：
    192.168.0.0
    192.168.0.1
    192.168.0.2
    192.168.0.1
解释：
    REQUEST=AABBCCDDEEF1 按升序分配从未使用过的IP，为192.168.0.0
    REQUEST=F2FBBCCDDEEF 按升序分配从未使用过的IP，为192.168.0.1
    RELEASE=AABBCCDDEEF1 释放IP 192.168.0.0。
    RELEASE=F2FBBCCDDEEF 释放IP 192.168.0.1。
    REQUEST=333333333333 按升序分配从未使用过的IP，为192.168.0.2
    REQUEST=F2FBBCCDDEEF 该MAC地址再申请，优先分配最近一次曾经为其分配过的IP，为192.168.0.1
```

{% endfolding %}

对着题干模拟就好了

```java
static class DhcpServer {
    private final String[] ipMap = new String[256];
    private final boolean[] ipUsed = new boolean[256];
    private final Map<String, Integer> usingIp = new HashMap<>();
    private final Map<String, Integer> lastRecentlyUsedIp = new HashMap<>();

    public DhcpServer() {
        for (int i = 0; i < 256; i++) {
            ipMap[i] = "";
        }
    }

    public String request(String mac) {
        if (usingIp.containsKey(mac)) {
            return getIp(usingIp.get(mac));
        }

        if (lastRecentlyUsedIp.containsKey(mac) && ipMap[lastRecentlyUsedIp.get(mac)].isEmpty()) {
            int ipTail = lastRecentlyUsedIp.get(mac);
            useIp(mac, ipTail);
            return getIp(ipTail);
        }

        for (int i = 0; i < 256; i++) {
            if (ipMap[i].isEmpty() && !ipUsed[i]) {
                useIp(mac, i);
                return getIp(i);
            }
        }

        for (int i = 0; i < 256; i++) {
            if (ipMap[i].isEmpty() && ipUsed[i]) {
                useIp(mac, i);
                return getIp(i);
            }
        }

        return "NA";
    }

    public void release(String mac) {
        if (usingIp.containsKey(mac)) {
            int ip = usingIp.get(mac);
            ipMap[ip] = "";
            usingIp.remove(mac);
            lastRecentlyUsedIp.put(mac, ip);
        }
    }

    private static String getIp(int tail) {
        return "192.168.0." + tail;
    }

    private void useIp(String mac, int ipTail) {
        ipMap[ipTail] = mac;
        ipUsed[ipTail] = true;
        usingIp.put(mac, ipTail);
    }
}
```

## 代码缩进

{% folding blue::题目 %}

缩进**的代码，通过多次操作，最终实现对每一行的缩进长度要求。

一次操作指：

- 一次操作是缩进一个TAB长度（如样例1图所示）。注：这里缩进仅指从左往右，不能回退。
- 一次操作可选择一行或**连续多行**同时缩进。

现给出一段代码的每行缩进长度要求，用一个数字序列表示，请计算**至少**需要多少次操作才能实现。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

一个整数 n ，表示代码总行数，取值范围：[1, 65535]。
接下来一行有 n 个整数，依次表示第 1~n 行的最终缩进长度要求，取值范围：[0, 1000000]。

### 输出

一个整数，表示所需的最少操作次数。

### 样例1

```
输入：
    5
    1 2 3 2 1
输出：
    3
解释：
    最少需三次，第1次操作全选所有行，缩进1个TAB；第2次操作选择2、3、4行，再缩进1个TAB；第3次操作，选择第3行，再缩进1个TAB。 初始5行都未缩进，每次操作后的缩进变化情况如下图所示：
```
![](https://klt-static-content1.obs.cn-north-4.myhuaweicloud.com/1457282723772747777/exam/20230418/2b5a136833d843a480bae66d3fa1ce7a_649d5abe05.png)

### 样例2

```
输入：
    9
    0 1 2 0 2 4 2 1 0
输出：
    6
解释：
    第1次操作选择第2、3行，缩进1个TAB；第2次选择第3行缩进1个TAB；第3次选择第5、6、7、8行，缩进1个TAB；第4次选择第5、6、7行，缩进1个TAB；第5次和第6次操作都选择第6行，分别缩进1个TAB。通过6次操作达成目标，因此输出6
```

{% endfolding %}

代码缩进时只有向内缩进才需要操作，而向外回退则不需要操作，简单来说，1 2 1这个序列，在从1层缩进前进到2层缩进需要进行一步操作，此时已经操作完毕，2层回到1层不需要额外的操作

因此直接遍历steps,当当前指针比上一个数大（需要缩进）时，结果加上两个数字的差；当当前指针比上一个数小则不进行任何操作。

最后输出结果即可

```java
static int getMinStep(int[] steps) {
    int cnt = 0, last = 0;
    for (int step : steps) {
        cnt += Math.max(0, step - last);
        last = step;
    }
    return cnt;
}
```

## 四则运算求值

{% folding blue::题目 %}

给定一个字符串形式的计算表达式，其中只包含数字和加`+`、减`-`、乘`*`、除`/`四种运算符，乘除计算优先级高于加减。

请对该计算表达式求值，并返回计算结果。如果在计算过程中遇到除零，则返回字符串`error`。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 64MB, 其他语言：128MB

### 输入

一个字符串形式的计算表达式，长度范围：[1,100]

> 用例保证，输入数字和中间及最终计算结果的值都是整数，且在int型范围内。

### 输出

一个10进制整数； 或字符串`error`

### 样例1

```
输入：
    3/0
输出：
    error
解释：
```

{% endfolding %}

用eval()直接逃课了（

```java
private static String calculate(String expression) {
    try {
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("js");
        String result = engine.eval(expression).toString();
        return result.equals("Infinity") ? "error" : result;
    } catch (ScriptException e) {
        return "error";
    }
}
```