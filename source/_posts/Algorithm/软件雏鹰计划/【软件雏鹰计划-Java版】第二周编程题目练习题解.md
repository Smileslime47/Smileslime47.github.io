---
title: 【软件雏鹰计划-Java版】第二周编程题目练习题解
date: 2024/04/28
category: 
    - Algorithm
    - 软件雏鹰计划
mathjax: false
---
## 表达式计算

{% folding blue::题目 %}

四则运算表达式可用表达式树来表达，如图所示。 图中最右边部分是该表达式树的后序遍历（后序遍历是指先遍历左子树，再遍历右子树，最后访问节点本身，简写 LRN）。

![](https://klt-static-content1.obs.cn-north-4.myhuaweicloud.com/1457282723772747777/exam/20230214/5320356721994ff6b530c376d7dcdb41_image.png)

现给你一个字符串，代表一个后序遍历形式的四则运算表达式，请计算出表达式的结果（只输出整数部分）。

> 注：

- 都是双目运算，不存在单目运算;
- 中间计算结果范围：[-2^31, 2^31)；
- 除法只需保留整数部分，比如:5/4=1, (-5)/3=-1, 5/(-3)=-1，无需考虑余数；无需考虑除数为0的情况，用例不存在除零。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 64MB, 其他语言：128MB

### 输入

一个字符串，代表一个四则运算表达式，由若干操作数和运算符组成，操作数、运算符之间都用一个逗号隔开。长度范围：[1,50000)。
注：用例保证输入合法：1）一定有计算结果； 2）操作数是合法的整数； 3）运算符只包含`+`，`-`，`*`，`/`四种。

### 输出

一个整数，表示表达式的计算结果，用例保证最终结果范围：-2,147,483,648 ~ 2,147,483,647。

### 样例1

```
输入：
    9,3,5,-,2,*,+
输出：
    5
解释：
```

### 样例2

```
输入：
    3,-3,-,2,/,10,-
输出：
    -7
解释：
```

{% endfolding %}

本质上是计算逆波兰表达式（a.k.a 后缀表达式），常规的数学计算式是中缀表达式

后缀表达式的好处在于不需要括号来表示优先级，以及一次从左到右的顺序遍历即可计算出答案，具体的计算流程在维基百科已经很解释的很清楚了，只需要把伪代码实现一下就可以了

引自维基百科：

- while 输入
  - 读取下一个字符X
  - 如果X是数字
    - 将X入栈
  - 反之如果X是操作符
    - 根据操作符的目数从栈中取出指定数量的数字（加减乘除都只取出两个）
    - 计算操作结果
    - 将操作结果再次入栈

在保证输入表达式正确的情况下，遍历完表达式后，栈里应当只有一个数字，即为整个表达式的运算结果

```java
private static int calcExpression(String expression) {
    String[] tokens = expression.split(",");
    int[] stack = new int[tokens.length];
    int top = -1;
    for (String token : tokens) {
        switch (token) {
            case "+":
                stack[top - 1] += stack[top];
                top--;
                break;
            case "-":
                stack[top - 1] -= stack[top];
                top--;
                break;
            case "*":
                stack[top - 1] *= stack[top];
                top--;
                break;
            case "/":
                stack[top - 1] /= stack[top];
                top--;
                break;
            default:
                stack[++top] = Integer.parseInt(token);
                break;
        }
    }
    return stack[top];
}
```

## 话单发送

{% folding blue::题目 %}

某核心网设备向计费网关发送话单（一个话单指一条通话记录的信息），发送规则如下：

- 每个话单具有长度和优先级两个属性，优先级值越小表示优先级越高，高优先级的发送完，才能发送次优先级的。
- 设备有一个承载规格，表示发送话单总容量的阈值，发送话单的总长度不能超过承载规格。

现给定设备的承载规格和待发送话单（长度和优先级）列表，请计算最多可以发送多少个话单。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

第一行是正整数 cap ，表示设备的承载规格，取值范围：[1,10000]
第二行是正整数 num ，表示待发送话单的数量，取值范围：[0,100]
第三行 num 个整数，依次表示每个待发送话单的长度，每个值的范围：[0, 1000]
第四行 num 个整数，依次表示每个待发送话单的优先级，每个值的范围：[0,30]

> 第三行和第四行的数据一一对应，表示同一个话单的长度和优先级。

### 输出

输出一个整数，表示最多能发送话单的个数。

### 样例1

```
输入：
    110
    5
    50 20 30 10 50
    2 2 1 3 1
输出：
    3
解释：
    - 首先尝试发送优先级为 1 的话单，长度分别是30和50，长度之和在承载规格范围内，优先级 1 的两个话单全部完成发送，剩余容量为30。
    - 接着尝试发送优先级为 2 的话单，长度20的被发送，剩余容量为10，长度50的无法发送。
    - 因优先级 2 的话单未发送完（仍剩余一条），优先级3的所有话单都无法发送。

    所以，最多能发送的话单数为 3 。
```

{% endfolding %}

任务调度算法，和CI调度不同的是，这里没有要求相同优先级的按什么顺序发送，因此对于优先度相同的话单，我们直接优先按长度小的发送，即可保证发送数量最多

把bill数组转换为一个List\<Bill\>，然后按照优先级升序，长度升序排序即可

顺序遍历bills,并维护当前设备剩余的阈值和已发送的话单数量，直至剩余阈值无法继续发送新的话单即可返回结果

```java
private static int getMaxSendNumber(int cap, int[] billLen, int[] billPrior) {
    class Bill {
        int len;
        int prior;
    }

    List<Bill> bills = new ArrayList<>();
    for (int i = 0; i < billLen.length; i++) {
        Bill bill = new Bill();
        bill.len = billLen[i];
        bill.prior = billPrior[i];
        bills.add(bill);
    }

    bills.sort((o1, o2) -> {
        if (o1.prior == o2.prior) {
            return o1.len - o2.len;
        }
        return o1.prior - o2.prior;
    });

    int count = 0;
    int leftCap = cap;
    for (Bill bill : bills) {
        if (bill.len <= leftCap) {
            leftCap -= bill.len;
            count++;
        } else {
            break;

        }
    }

    return count;
}
```

## 字符排序

{% folding blue::题目 %}

给定一个字符串，仅含英文字母和数字，请按如下规则对其进行排序：

- 排序后，原位置是数字的，排序后仍然是数字；原位置是字母的，排序后仍然是字母。
- 数字：按 0-9 升序。
- 英文字母：大写字母大于小写字母，小写字母按 a-z 升序，大写字母按 A-Z 升序。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 64MB, 其他语言：128MB

### 输入

输入为一行字符串，长度范围 [1,1000)，字符串中不会出现除英文字母、数字以外的别的字符。

### 输出

输出排序后的字符串。

### 样例1

```
输入：
    a2CB1c
输出：
    a1cB2C
解释：
    第二、五位置的数字分别为 2、1，排序后为1、2 ；
    第一、三、四、六位置的字母分别为 a、C、B、c，小写字母a、c排在前；大写字母C、B排在后，并按 A-Z 升序为 B、C ；

    因此最终输出为 a1cB2C
```

### 样例2

```
输入：
    ab12C4Ac3B
输出：
    ab12c3AB4C
解释：
    无
```

{% endfolding %}

先将字符串中的数字和字母分别放到两个List里并按要求排序

构建一个新的空字符串res，并遍历inputStr中的每个字符

- 如果是字母，就从排好序的字母列表中取出一个元素放到res末尾
- 如果是数字，就从排好序的数字列表中取出一个元素放到res末尾

```java
private static String characterSort(String inputStr) {
    char[] chars = inputStr.toCharArray();
    int[] cases = new int[chars.length];
    List<Character> nums = new ArrayList<>();
    List<Character> letters = new ArrayList<>();

    for (int i = 0; i < chars.length; i++) {
        if (Character.isDigit(chars[i])) {
            nums.add(chars[i]);
            cases[i] = 0;
        } else {
            letters.add(chars[i]);
            cases[i] = 1;
        }
    }

    nums.sort(Character::compareTo);
    letters.sort((o1, o2) -> {
        if (Character.isLowerCase(o1) && Character.isUpperCase(o2)) {
            return -1;
        } else if (Character.isUpperCase(o1) && Character.isLowerCase(o2)) {
            return 1;
        } else {
            return o1 - o2;
        }
    });

    StringBuilder result = new StringBuilder();
    int numIndex = 0;
    int letterIndex = 0;
    for (int aCase : cases) {
        if (aCase == 0) {
            result.append(nums.get(numIndex++));
        } else {
            result.append(letters.get(letterIndex++));
        }
    }
    return result.toString();
}
```

## 单板告警统计

{% folding blue::题目 %}

假设某系统中有两块单板，这两块单板上产生的告警ID（以十六进制字符串表示）分别存储在列表 arrayA 和列表arrayB 中。
请统计并输出系统中的所有告警ID（即arrayA和arrayB的并集）：

- 如果告警ID存在重复，先需去重。
- 然后以告警ID所表示值的升序排序输出

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

第一行1个整数，表示告警列表arrayA的长度，取值范围为：[0,1000]
第二行表示告警列表arrayA的数据，告警ID以单空格分隔
第三行1个整数，表示告警列表arrayB的长度，取值范围为：[0,1000]
第四行表示告警列表arrayB的数据，告警ID以单空格分隔

> 告警ID为无符号整数，以十六进制字符串表示，由数字字符、大写字母A~F组成，固定为 8 个字符。

### 输出

按升序排序的告警ID，以单空格分隔

### 样例1

```
输入：
    2
    00001001 00ABCD00
    3
    FFFFFAAB FFFFFAAB 00ABCD00
输出：
    [00001001 00ABCD00 FFFFFAAB]
解释：
    系统中共有三个告警ID：
    00ABCD00，去重后保留一个；
    FFFFFAAB，去重后保留一个；
    00001001，只有一个。
    按所表示值的大小升序排列，输出这三个告警ID为 [00001001 00ABCD00 FFFFFAAB] 。
```

### 样例2

```
输入：
    0

    1
    FFFFFAAB
输出：
    [FFFFFAAB]
解释：
```

{% endfolding %}

两个集合取并集，然后把结果放在LIst里升序输出即可

```java
private static String[] getAllFault(String[] arrayA, String[] arrayB) {
    Set<String> set = new HashSet<>();

    set.addAll(Arrays.asList(arrayA));
    set.addAll(Arrays.asList(arrayB));

    List<String> list = new ArrayList<>(set);
    Collections.sort(list);

    return list.toArray(new String[0]);
}
```