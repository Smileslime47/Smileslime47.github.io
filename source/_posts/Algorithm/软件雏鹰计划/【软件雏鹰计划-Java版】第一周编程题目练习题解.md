---
title: 1-【软件雏鹰计划-Java版】第一周编程题目练习题解
date: 2024/04/28
category: 
    - Algorithm
    - 软件雏鹰计划
mathjax: false
---
## 公共字符

{% folding blue::题目 %}
 
给定 m 个字符串，请计算有哪些字符在所有字符串中都出现过 n 次及以上。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 64MB, 其他语言：128MB

### 输入

首行是整数 n ，取值范围 [1,100]
第二行是整数 m ，表示字符串的个数，取值范围 [1,100]
接下来 m 行，每行一个仅由英文字母和数字组成的字符串，长度范围 [1,1000)

### 输出

按ASCII码升序输出所有符合要求的字符序列； 如果没有符合要求的字符，则输出空序列[]。

### 样例1

```
输入：
    2
    3
    aabbccFFFFx2x2
    aaccddFFFFx2x2
    aabcdFFFFx2x2
输出：
    [2 F a x]
解释：
    字符 a 在三个字符串中都出现 2次，符合要求；
    字符 b 在第二三个字符串中分别出现 0次、1次，不符合要求；
    字符 c 在第三个字符串中出现 1次，不符合要求；
    字符 d 在第三个字符串中出现 1次，不符合要求；
    字符 F 在三个字符串中都出现了 4 次，符合要求；
    字符 x 在三个字符串中都出现了 2 次，符合要求；
    字符 2 在三个字符串中都出现了 2 次，符合要求；

    因此字符 a、F、x、2符合要求，按ASCII码升序输出为 [2 F a x]
```

### 样例2

```
输入：
    2 3
    aa
    bb
    cc
输出：
    []
解释：
```
 
{% endfolding %}

维护一个resultChars[i]，代表ASCII码为i的字符是否在每个字符串中都出现了n次或以上

对于每个字符串，统计每个字符的出现次数，并根据统计结果更新resultChars

最后遍历resultChars,值为true的则将其ASCII码（即数组索引）输出到结果即可

```java
private static char[] getNTimesCharacter(int nValue, String[] strings) {
    boolean[] resultChars = new boolean[128];
    for(int i = 0;i<128;i++){
        resultChars[i] = true;
    }

    for (String s : strings) {
        int[] charCount = new int[128];
        for (char c : s.toCharArray()) {
            charCount[c]++;
        }
        for (int i = 0;i<128;i++) {
            resultChars[i] &= charCount[i] >= nValue;
        }
    }

    List<Character> result = new ArrayList<>();
    for(int i = 0;i<128;i++){
        if(resultChars[i]){
            result.add((char) i);
        }
    }

    char[] resultArray = new char[result.size()];
    for(int i = 0;i<result.size();i++){
        resultArray[i] = result.get(i);
    }
    return resultArray
}
```

## 呼叫转移

{% folding blue::题目 %}
 
**呼叫转移**是指您的电话无法接听或您不愿接电话，可以将来电转移到其它电话号码上。它是电信业一项传统通信业务，又称呼叫前转、呼入转移。

- 用户被呼叫时的状态有4种：`idle`，`busy`，`no-response`，`unreachable`
- 用户可登记的5种呼叫转移，格式为`type number`，type代表转移种类， number代表转移号码：
- type为 0：无条件转移，优先级最高，用户处于任何状态都触发此转移
- type为 1：用户状态`busy`时触发此转移
- type为 2：用户状态`no-response`时触发此转移
- type为 3：用户状态`unreachable`时触发此转移
- type为 4：默认转移，优先级最低，用户不是`idle`状态时，且无法触发上述四种转移，触发此转移

>注：同一个状态可登记多次，以最后一次登记为准。

现给出某一用户当前的用户状态，以及其登记的若干个呼叫转移号码，请输出最终的呼叫结果：

- 若发生转移，则输出转移号码
- 若用户状态为idle，且未发生转移时，则呼叫本机成功，输出`success`
- 若呼叫失败：既没有发生转移，也没有呼叫本机成功，则输出`failure`。例如，用户状态为 busy，但用户既未登记 type 为 0 或 1 或 4 的呼叫转移，则呼叫失败。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

第一行是数字 num 和 字符串 status：num代表呼叫转移登记的次数（ 0 < N <= 20），status表示用户被呼叫时的状态。
接下来 num 行是用户的呼叫转移登记操作，转移号码长度 6-15位，用例保证输入合法。

### 输出

一个字符串，代表最终的呼叫结果

### 样例1

```
输入：
    3 busy
    2 18912345678
    4 18912345678
    4 13312345567
输出：
    13312345567
解释：
    用户busy，且没有登记 busy 转移，但登记默认转移，呼叫转移到默认转移号码。
    默认转移号码已最后一次登记为准
```

### 样例2

```
输入：
    1 no-response
    3 075587678100
输出：
    failure
解释：
    用户no-response，没有登记no-response转移，也没有登记默认转移，呼叫失败。
```

### 样例3

```
输入：
    1 idle
    3 075587678100
输出：
    success
解释：
    用户idle，且没有登记无条件转移，呼叫成功
```
 
{% endfolding %}

本质上是写一个简单的有限状态机，但是要考虑到的细节比较多

应当存储一个从Type到号码的哈希表，并按照一个优先级顺序给result逐个尝试赋值

- 最高优先级：当tpye0有值时，result总为该值，反之则下一步操作
- 当status为idel时，result总为success，反之则下一步操作
- 当status为busy时，尝试在type1有值时为result赋值，反之则下一步操作
- 当status为no-response时，尝试在type2有值时为result赋值，反之则下一步操作
- 当status为unreachable时，尝试在type3有值时为result赋值，反之则下一步操作
- 尝试在在type4有值时为result赋值，反之则下一步操作
- result值为failure

```java
private static String calling(String status, List<RegCallOperate> regCallForwardNums) {
    Map<Integer, String> lastRegCallForwardNums = new HashMap<>();

    for (RegCallOperate operate : regCallForwardNums) {
        lastRegCallForwardNums.put(operate.type, operate.number);
    }

    String result = lastRegCallForwardNums.getOrDefault(0, ""); 
    if (status.equals("idle")) {
        return result.isEmpty() ? "success" : result;
    } else if (status.equals("busy")) {
        result = result.isEmpty() ? lastRegCallForwardNums.getOrDefault(1, "") : result; 
    } else if (status.equals("no-response")) {
        result = result.isEmpty() ? lastRegCallForwardNums.getOrDefault(2, "") : result; 
    } else if (status.equals("unreachable")) {
        result = result.isEmpty() ? lastRegCallForwardNums.getOrDefault(3, "") : result; 
    }

    return result.isEmpty() ? lastRegCallForwardNums.getOrDefault(4, "failure") : result;
}
```

## 大小端整数

{% folding blue::题目 %}

计算机中对整型数据的表示有两种方式：大端序和小端序，大端序的高位字节在低地址，小端序的高位字节在高地址。例如：对数字 65538，其4字节表示的大端序内容为`00 01 00 02`，小端序内容为`02 00 01 00`。

现输入一个字符串表示的十进制整数（含负数），请分别输出以4字节表示的大端序和小端序：

- 负数以补码形式表示。
- 如果输入的整数的值超出 [-2^31, 2^32) 范围，则输出字符串`overflow`。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 64MB, 其他语言：128MB

### 输入

十进制整数，以负号-开头表示负数，其它为正整数；数字长度范围：[1,32]。

> 输入数字不含前导零。

### 输出

大端序 + `\n` + 小端序；或字符串`overflow`。

> 大端序和小端序的输出格式：每个字节以两位16进制数字表示（16进制数中A-F要大写），字节之间以单空格分隔。

### 样例1

```
输入：
    -10 
输出：
    FF FF FF F6
    F6 FF FF FF
解释：
    含负号表示为负整数。
    该负整数的补码表示为 FF FF FF F6，其对应大端序和小端序内容分别为FF FF FF F6 和 F6 FF FF FF。
    按输出格式要求输出其大端序和小端序内容，中间加换行符。
```

### 样例2

```
输入：
    4027691818
输出：
    F0 11 B3 2A
    2A B3 11 F0
解释：
    输入 4027691818 为正整数，按输出格式要求输出其大端序和小端序内容，中间加换行符。
```

### 样例3

```
输入：
    1234567890123456789012345678900
输出：
    overflow
解释：
    输入数字超过[-2^31, 2^32) 范围，因此输出 overflow 。
```

{% endfolding %}

将nums转化为Long，由于十六进制表示/字节表示的数字是8bit一编码的，通过位运算获取每8位的编码结果，将其按顺序存储在一个Byte数组中

分别从左到右输出再从右到左输出一遍字节数组即可

```java
private static String getHexString(String num) {
    long number;
    try {
        number = Long.parseLong(num);
    } catch (NumberFormatException e) {
        return "overflow";
    }

    if (number < -1L << 31 || number >= 1L << 32) {
        return "overflow";
    }
    byte[] bytes = new byte[4];
    bytes[0] = (byte) ((number >> 24) & 0xFF);
    bytes[1] = (byte) ((number >> 16) & 0xFF);
    bytes[2] = (byte) ((number >> 8) & 0xFF);
    bytes[3] = (byte) (number & 0xFF);
    StringBuilder str = new StringBuilder();
    for (int i = 0; i < bytes.length; i++) {
        str.append(String.format("%02X", bytes[i])).append(i != bytes.length - 1 ? " " : "");
    }
    str.append("\n");
    for (int i = bytes.length - 1; i >= 0; i--) {
        str.append(String.format("%02X", bytes[i])).append(i != 0 ? " " : "");
    }
    return str.toString();
}
```