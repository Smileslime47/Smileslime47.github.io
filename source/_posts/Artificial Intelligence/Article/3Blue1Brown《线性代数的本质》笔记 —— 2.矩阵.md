---
title: 3Blue1Brown《线性代数的本质》笔记 —— 2.矩阵
author: Liu Yibang
date: 2024/08/24
categories: 
    - Artificial Intelligence
    - Article
mathjax: true
---

## 矩阵与线性变换

### 线性变换

线性变换（Linear Transformation）：接受一个向量并输出一个向量的变换
- 线性（Linear）指空间中的所有直线在变换后仍然是直线，且原点的位置没有发生改变
- 变换（Transformation）本质上是函数（function）的花哨说法，但与函数不同的是，**变换**一词在刻意地暗示你可以**用可视化的运动来思考这个过程**

![](/images/posts/linear-matrix-1.png)

这张图看似直线没有被弯曲，但是在加上对角线后就会发现对角线变得弯曲了，因此仍然不属于线性变换

![](/images/posts/linear-matrix-2.png)

总的来说，线性变换要保证**网格线平行且等距分布**，在这个大前提下，我们有一个重要的推论
- 变换前的向量 $\vec{v}$ 是**i帽与j帽**的线性组合 $a\hat{i_1} + b\hat{j_1}$，那么变换后的 $\vec{v}$ 仍是**变换后的i帽与j帽**的相同线性组合 $a\hat{i_2} + b\hat{j_2}$
- 换句话说，若在变换前有 $\vec{v} = -1 \hat{i} + 2 \hat{j}$，那么在变换后等式仍然成立，因此只要找到变换后的基向量代入式子，就能得到变换后的向量 $\vec{v}$

举例来说，对于向量

$$
\vec{v} = 
\begin{bmatrix}
    -1\\\\
    2\\\\
\end{bmatrix} = -1 \hat{i} + 2 \hat{j} = -1 
\begin{bmatrix}
    1\\\\
    0\\\\
\end{bmatrix} + 2 
\begin{bmatrix}
    0\\\\
    1\\\\
\end{bmatrix}
$$

在变换后，基向量坐标发生了改变，有

$$
\vec{v} = -1 \hat{i} + 2 \hat{j} = -1 
\begin{bmatrix}
    1\\\\
    -2\\\\
\end{bmatrix} + 2 
\begin{bmatrix}
    3\\\\
    0\\\\
\end{bmatrix} =
\begin{bmatrix}
    5\\\\
    2\\\\
\end{bmatrix}
$$

因此，只要我们知道了变换后的基向量，我们就能推出任意一个向量在变换后的位置。基于这点，我们可以说，一个二维线性变换仅有四个数字决定：变换后的i帽坐标和变换后的j帽坐标。

### 矩阵

于是，我们将这四个数字包装在一个**矩阵**（Matrix）中，用于定义一个线性变换的函数
- 也就是说，矩阵本质上是**对空间操纵的描述**
- 同样地，你也可以通过一个矩阵来想象线性变换的过程，只要分别移动i帽和j帽，然后另空间的其他部分随着基向量一起移动即可
- 例如：将坐标系逆时针旋转90度的矩阵就是：

$$
\begin{bmatrix}
    0 & -1\\\\
    1 & 0\\\\
\end{bmatrix}
$$

- 如果两个基向量是线性相关的，就意味着整个二维空间被挤压到它们所在的直线上

$$
\begin{bmatrix}
    2 & -2\\\\
    1 & -1\\\\
\end{bmatrix}
$$

同样以上例为例，将变换写成矩阵运算的形式：

$$
\vec{v} = 
\begin{bmatrix}
    1 & 3\\\\
    -2 & 0\\\\
\end{bmatrix}
\begin{bmatrix}
    -1\\\\
    2\\\\
\end{bmatrix} = -1
\begin{bmatrix}
    1\\\\
    -2\\\\
\end{bmatrix} + 2
\begin{bmatrix}
    3\\\\
    0\\\\
\end{bmatrix} =
\begin{bmatrix}
    5\\\\
    2\\\\
\end{bmatrix}
$$

在这种理解方式下，矩阵的**第一列**代表**变换后的第一个基向量**，**第二列**代表**变换后的第二个基向量**，更加通用的公式是：

$$
\vec{v} = 
\begin{bmatrix}
    a & b\\\\
    c & d\\\\
\end{bmatrix}
\begin{bmatrix}
    x\\\\
    y\\\\
\end{bmatrix} = x
\begin{bmatrix}
    a\\\\
    c\\\\
\end{bmatrix} + y
\begin{bmatrix}
    b\\\\
    d\\\\
\end{bmatrix} =
\begin{bmatrix}
    ax+by\\\\
    cx+dy\\\\
\end{bmatrix}
$$

## 矩阵乘法与线性变换复合

### 复合变换

我们已经知道了，矩阵是**对空间线性变换的描述函数**。和向量类似，我们也可以对多个线性变换进行累加操作（即先进行线性变换A，再在此基础上进行线性变换B），我们称之为**两个线性变换的复合变换**

举例来说，旋转（Rotation）变换的矩阵是：

$$
\begin{bmatrix}
    0 & -1\\\\
    1 & 0\\\\
\end{bmatrix}
$$

剪切（Shear）变换的矩阵是：

$$
\begin{bmatrix}
    1 & 1\\\\
    0 & 1\\\\
\end{bmatrix}
$$

通过对旋转后的基向量进行剪切变换，我们可以得到这两个变换的复合变换的矩阵，该矩阵描述了先进行旋转再进行变换后的总效应：

$$
\begin{bmatrix}
    1 & -1\\\\
    1 & 0\\\\
\end{bmatrix}
$$

如果我们想对一个向量 $\vec{v}$ 先应用旋转，再应用剪切的话，那么计算公式应当是：

$$
\begin{bmatrix}
    1 & 1\\\\
    0 & 1\\\\
\end{bmatrix}
\left(
    \begin{bmatrix}
        0 & -1\\\\
        1 & 0\\\\
    \end{bmatrix}
    \begin{bmatrix}
        x\\\\
        y\\\\
    \end{bmatrix}
\right) =
\begin{bmatrix}
    1 & -1\\\\
    1 & 0\\\\
\end{bmatrix}
\begin{bmatrix}
    x\\\\
    y\\\\
\end{bmatrix}
$$

值得一提的是，线性变换的公式是从右往左读的，按照这个公式，应当先应用右侧的旋转矩阵，再应用左侧的剪切矩阵。
- 这个习惯是基于函数写法的延续，举例来说，$f(x)$ 是对 $x$ 应用的函数，这里的 $f$ 也是写在左侧。如果我们把剪切矩阵记作函数 $g$，把旋转矩阵记作函数 $f$，把向量 $\vec{v}$ 记作 $x$ 的话，那么按照函数的写法就应当是 $g(f(x))$，可以看到这个顺序和上面的式子是相同的顺序

### 矩阵乘法

于是，我们称这个复合变换的矩阵为**旋转矩阵和剪切矩阵的积**
- 和向量不同的是，这里是积（乘法）而不是和（加法）

$$
\begin{bmatrix}
    1 & 1\\\\
    0 & 1\\\\
\end{bmatrix}
\begin{bmatrix}
    0 & -1\\\\
    1 & 0\\\\
\end{bmatrix} =
\begin{bmatrix}
    1 & -1\\\\
    1 & 0\\\\
\end{bmatrix}
$$

通过对线性变换过程中的基向量进行跟踪，我们可以很轻松地写出矩阵乘法的公式，对于：

$$
\begin{bmatrix}
    a & b\\\\
    c & d\\\\
\end{bmatrix}
\begin{bmatrix}
    e & f\\\\
    g & h\\\\
\end{bmatrix}
$$

复合函数的第一列列向量：

$$
\begin{bmatrix}
    a & b\\\\
    c & d\\\\
\end{bmatrix}
\begin{bmatrix}
    e\\\\
    g\\\\
\end{bmatrix} = e
\begin{bmatrix}
    a\\\\
    c\\\\
\end{bmatrix} + g
\begin{bmatrix}
    b\\\\
    d\\\\
\end{bmatrix} =
\begin{bmatrix}
    ae+bg\\\\
    ce+dg\\\\
\end{bmatrix}
$$

复合函数的第二列列向量：

$$
\begin{bmatrix}
    a & b\\\\
    c & d\\\\
\end{bmatrix}
\begin{bmatrix}
    f\\\\
    h\\\\
\end{bmatrix} = f
\begin{bmatrix}
    a\\\\
    c\\\\
\end{bmatrix} + h
\begin{bmatrix}
    b\\\\
    d\\\\
\end{bmatrix} =
\begin{bmatrix}
    af+bh\\\\
    cf+dh\\\\
\end{bmatrix}
$$

于是我们得出了复合变换的计算公式：

$$
\begin{bmatrix}
    a & b\\\\
    c & d\\\\
\end{bmatrix}
\begin{bmatrix}
    e & f\\\\
    g & h\\\\
\end{bmatrix} =
\begin{bmatrix}
    ae+bg & af+bh\\\\
    ce+dg & cf+dh\\\\
\end{bmatrix}
$$

- 矩阵乘法不满足交换律，即 $AB \neq BA$
- 矩阵乘法满足结合律，即 $(AB)C = A(BC)$
    - 如果你用公式推导的思路去做这个证明，会发现非常痛苦且没有帮助
    - 只从线性变换的角度上思考，两个公式本质上都描述了**先进行C变换，再进行B变换，最后进行A变换**，因此没有区别
