---
title: 6-【软件雏鹰计划-Java版】第六期编程题目练习题解
date: 2024/05/13
category: 
    - Algorithm
    - 软件雏鹰计划
mathjax: false
---

就剩三道题了，想都不用想肯定是第六期剩下的题目了

## 二进制转十进制

{% folding blue::题目 %}

输入一个二进制字符串，请处理转换成十进制整数

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 64MB, 其他语言：128MB

### 输入

二进制字符串（仅含 0 和 1 ），用例保证转换结果范围在 32 位有符号整型范围以内。

### 输出

十进制整数

### 样例1

```
输入：
    00011
输出：
    3 
解释：
```

### 样例2

```
输入：
    11111111111111111111111111111111
复制输出：
    -1
解释：
    注：二进制字符串表示的是整数的补码形式，从右向左第32位1表示此数为负数。
```

{% endfolding %}

要注意的是这里是二进制补码（2‘s completion）转十进制

从右往左数第32位代表了数的正负——0代表正数，1代表负数

- 要注意这里不是从左往右数第1位，因为本题严格规定了数据是32位有符号整数，因此对于位数不足32位的，应当默认其符号位为0即正数

对于正数而言，其补码等于它的原码，因此我们直接将其余位按照原码处理即可

- 从左往右遍历每一位，跑一个reduce,其中acc（迭代变量）等于acc<<1（或者acc*2）加上该位

对于负数而言，其补码等于它的原码取反再加一，因此其绝对值的原码应当等于补码减一后再取反

- 二进制补码减一可能比较难以计算，因此这里可以直接取反，但是得到的原码绝对值会比实际绝对值小一,因此应当再加一补回来
- 按位取反后同正数操作获得（绝对值-1）的原码的十进制表示，加一取相反数即结果

```java
private static int binaryToDecimal(String binaryString) {
    int decimal = 0;
    if (binaryString.length() == 32 && binaryString.charAt(0) == '1') {
        for (int i = 1; i < binaryString.length(); i++) {
            decimal = (decimal << 1) + (binaryString.charAt(i) == '0' ? 1 : 0);
        }
        decimal = -(decimal + 1);
    } else {
        for (int i = 0; i < binaryString.length(); i++) {
            decimal = (decimal << 1) + (binaryString.charAt(i) == '0' ? 0 : 1);
        }
    }
    return decimal;
}
```

## 完美答案收集

{% folding blue::题目 %}

考生在在线平台考试结束后，可以查看自己每道题的结果（包括题干、选项、答案、回答正确或错误），针对回答错误的题目并没有给出正确答案。这时需要综合多个考生的正确答案才能得到一份该试卷的完美答案（即包含所有题目的正确答案）。

假设共有 questionsCount 道题，题目编号从 1 到 questionsCount。现给出每个考生的答对题目的编号，格式如`1 3`，表示答对第1到3题；`9 9`表示答对第9题。
说明：

- 考生答对的题目是连续的。
- 每个考生至少答对1道题。

请计算至少需综合多少个考生的正确答案才能得到完美答案，如果无法综合到完美答案，则输出-1。

### 解答要求

时间限制: C/C++ 3000ms, 其他语言：6000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

第一行一个整数，表示题目的总数量questionsCount，范围 [1, 1024]
第二行一个整数，表示考生人数peopleCount，范围 [1, 1024]
接下来peopleCount行，每行两个整数start end， 1 <= start <=end <= questionsCount

### 输出

一个整数，表示可以综合到完美答案的最少人数；如果无法综合到完美答案，则输出-1 。

### 样例1

```
输入：
    10
    6
    1 3
    4 6
    1 6
    6 10
    5 8
    10 10
输出：
    2
解释：
    试卷一共有10道题；
    第一位同学答对了1~3题；
    第二位同学答对了4~6题；
    第三位同学答对了1~6题；
    第四位同学答对了6~10题；
    第五位同学答对了5~8题；
    第六位同学只答对了第10题一个题。

    要综合到所有题的正确答案，可以有多种方法，例如：综合第一、二、四这3位考生的答案，或者综合第三、四这2位考生的答案。 至少需要综合2位考生的答案。
```

{% endfolding %}

本题是一道非常标准的贪心模板题，一个更常见的题干描述是“会议安排”——即给定多个会议的起始时间和结束时间，求最多能安排多少场区间不重叠的会议。但是本题的要求是覆盖完整区间，因此在条件上需要稍加改动。

将correctRanges按照左边界升序排序，假设我们当前已经凑齐了1～n题的答案的话，设rightEdge=n,那么理所当然地，下一个答案集应当满足如下条件：

- 左边界应当小于等于rightEdge+1
- 右边界应当尽可能大

其中，左边界是**定性条件**，只要满足即可，而右边界是**定量条件**，我们需要尽可能选择更优解——即我们应当在所有满足“左边界小于等于rightEdge+1“的答案集中选择“右边界最大“的那个答案集来加入我们的集合中——更大的右边界必然会让我们的答案集更加接近完美答案，也必然会更有可能让我们选择不那么多的区间数量就达成我们的目的

- rightEdge：当前已凑齐答案中最大的题号
- 一个答案集的左/右边界：该学生做对的第一道/最后一道题的题号

安排会议可能更好解释这个思路——给定多个区间如果要找到最多的不重叠区间数量，设rightEdge是目前已知最晚结束的会议，那么下一个会议应当保证左边界大于等于rightEdge（定性条件），同时右边界应当尽可能的小（定量条件），因为更小的右边界必然会给后续的选择更多的机会

```java
private static int getMinPeople(int questionsCount, int peopleCount, int[][] correctRanges) {
    Arrays.sort(correctRanges, Comparator.comparingInt(a -> a[0]));

    int rightEdge = 0;
    int cnt = 0;
    int maxRight = Integer.MIN_VALUE;
    for (int[] range : correctRanges) {
        if (range[0] > rightEdge + 1) {
            rightEdge = maxRight;
            maxRight = Integer.MIN_VALUE;
            cnt++;
        }

        if (range[0] <= rightEdge + 1) {
            maxRight = Math.max(maxRight, range[1]);
        }
    }

    if (maxRight > rightEdge) {
        rightEdge = maxRight;
        cnt++;
    }

    return rightEdge >= questionsCount ? cnt : -1;
}
```

## CI任务调度

{% folding blue::题目 %}

持续集成 CI 系统需要调度多台虚拟机资源 VM ，用于并发执行多个任务（每个任务有两个属性，执行时间T和优先级P），调度规则如下：

- 一个VM同一时间只能执行一个任务。
- 当VM不足时，优先级高的任务优先被执行，**数字越小优先级越高**；优先级相同的任务，执行时间长的先被执行。
- 当资源充足时，不同优先级的任务可以同时被执行。

现给定一次构建的N个任务，VM数量为M，请计算执行完所有任务的总时间。 结果需要取模 1e9+7（1000000007），如计算初始值为：1000000008，则返回 1。

### 解答要求

时间限制: C/C++ 1000ms, 其他语言：2000ms

内存限制: C/C++ 256MB, 其他语言：512MB

### 输入

第一行一个整数 M，表示空闲资源VM的数量，取值范围 [1,10000]。
第二行一个整数 N，表示该次构建的任务数量，取值范围[1,20000]。
接下来 N行，每行两个整数 T 和 P，分别表示一个任务的执行时间和优先级，取值范围：1 <= T <= 10^9， 1 <= P <= 10 。

### 输出

一个整数，表示执行完所有任务的总时间。

### 样例1

```
输入：
    2
    4
    1 1
    2 1
    3 2
    2 2
输出：
    4
解释：
    由于只有两个VM，优先级为1的两个任务先被执行，优先级为2的两个任务等待。其中VM1执行完时长为1的任务后，这时可以执行优先级为2、时长为3的任务；接着等VM2空闲时，再执行时长为2的任务。 这样可以得到执行完所有任务的总时间为4。
```

### 样例2

```
输入：
    4
    3
    3 1
    1 1
    2 2
输出：
    3
解释：
    4个VM，3个任务。由于资源充足，3个任务虽然优先级不一样，但仍可全部并发执行，执行完所有任务的总时间为3 。
```

{% endfolding %}

```java
private static int taskScheduler(int resourcesNum, int[][] taskAttributes) {
    class Task {
        public final long start;
        public final int time;
        public final int priority;

        public Task(int time, int priority) {
            this(time, priority, -1);
        }

        public Task(Task task, long start) {
            this(task.time, task.priority, start);
        }

        private Task(int time, int priority, long start) {
            this.time = time;
            this.priority = priority;
            this.start = start;
        }
    }

    List<Task> tasks = new ArrayList<>();
    for (int[] taskAttribute : taskAttributes) {
        tasks.add(new Task(taskAttribute[0], taskAttribute[1]));
    }
    tasks.sort((o1, o2) -> {
        if (o1.priority != o2.priority) {
            return o1.priority - o2.priority;
        }
        return o2.time - o1.time;
    });

    PriorityQueue<Task> VMs = new PriorityQueue<>(Comparator.comparingLong(o -> o.start + o.time));
    long time = 0;

    for (Task task : tasks) {
        if (VMs.size() >= resourcesNum && !VMs.isEmpty()) {
            time += VMs.peek().start + VMs.peek().time - time;
            while (!VMs.isEmpty() && VMs.peek().start + VMs.peek().time <= time) {
                VMs.poll();
            }
        }
        VMs.add(new Task(task, time));
    }

    int leftMax = Integer.MIN_VALUE;
    for (Task task : VMs) {
        leftMax = (int) max(leftMax, task.start + task.time - time);
    }

    return (int) ((time + leftMax) % (1e9 + 7));
}
```