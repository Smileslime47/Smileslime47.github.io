---
title: 【软件雏鹰计划-Java版】第二周编程题目练习题解
date: 2024/04/28
category: 
    - Algorithm
    - 软件雏鹰计划
mathjax: false
---
## 表达式计算

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