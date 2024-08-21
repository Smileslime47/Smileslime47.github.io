---
title: 深度学习《Attention Is All You Need》精读报告
author: Liu Yibang
date: 2024/08/21
categories: 
    - Artificial Intelligence
    - Article
mathjax: true
---

本论文是 Transformer 模型的首次提出

## Abstract

主流的序列转导模型：RNN（循环神经网络 - Recurrent Neural Network）、CNN(卷积神经网络 - Convolutional Neural Networks)
- 序列转录模型（sequence transduction model）：给定一个序列，生成另外一个序列
- 基于 encoder-decoder 架构，通过注意力机制（attention）连接

提出 **Transformer** 架构：仅仅基于注意力机制，不使用循环和卷积，在多个翻译任务上取得较高的BLEU成绩
- **BLEU**：双语替换评测（bilingual evaluation understudy），用于评估模型生成的语句品质，通常将模型生成语句和人工翻译语句进行比较，通过计算两个语句的N-grams模型并统计匹配个数来得到结果。

> 双语替换评测的输出分数始终为0到1之间的数字。该输出值意味着候选译文与参考译文之间的相似程度，越接近1的值表示文本相似度越高。人工翻译少有能达到数值1，因为数值1表示候选文本与参考文本完全相同。—— Wikipedia

## Intruduction

循环神经网络已被确认为**序列建模和转导问题**的先进方法
- 特别提及了 LSTM（长短期记忆 - long short-term memory）和GRNN（门控循环神经网络 - gated recurrent neural networks）

递归模型**顺着输入输出序列的符号位置**进行因子计算。在计算过程中，将符号的位置与步骤对齐（Aligning the positions to steps in computation time），并以此生成一个隐藏状态$h_t$，作为上一个**隐藏状态**$h_{t-1}$和**输入位置**$t$的函数
- 换句话说，$h_t$是一个递归函数，接受$h_{t-1}$和t作为参数
- 按我的理解：**递归模型顺着输入输出序列的符号位置进行因子计算**指输入序列中元素的顺序就代表了因子计算的顺序 —— 如果将输入输出序列理解为一个数组的话，那么因子计算就是在对该数组进行正向遍历，从而就有了**位置与步骤对齐**

![Alt text](image.png)
- t代表时间步，即计算的顺序
- h代表隐藏层 —— 神经网络中的参数
- x和o代表输入和输出
- w、u和v代表权重

递归函数限制了训练样本的并行化（递归本身需要上一个状态函数，只能线性进行）
- 在长序列的训练中，考虑到内存大小限制了批处理的规模，并行化尤为重要（This inherently
sequential nature precludes parallelization within training examples, which becomes critical at longer
sequence lengths, as memory constraints limit batching across examples.）
- 最近的研究中通过**因数分解**和**条件计算**改进了计算效率，但仍然存在顺序计算的约束

**注意力机制**在过去就已经是序列转导的组成部分了，它允许对依赖关系进行建模，而不需要考虑它们在序列中的位置距离（allowing modeling of dependencies without regard to their distance in
the input or output sequences）

基于这点，作者引出了 **Transformer** 模型 —— 一种规避了递归算法，**完全依赖于注意力机制来描绘输入和输出之间全局依赖关系**的模型
- Transformer 模型显著地提高了并行度，并取得了较好的翻译效果

这一章主要提到了当前主流神经网络模型在并行性上存在的限制，由于使用了递归模型，不得不按照序列顺序计算隐藏状态，难以通过并行计算提升训练效率。在这种情况下，由于注意力机制不需要考虑序列中的位置距离就可以对远距离依赖关系进行建模，作者考虑到直接抛弃传统的递归模型，只依靠注意力机制来建立输入和输出之间的全局依赖关系。

## Background

> **存疑：什么是hidden representations？暂且理解为输入输出序列中位置所带来的的隐含关系**

减少序列化的计算也是 Extended Neural GPU、ByteNet 和 ConvS2S 等模型的目标，这些模型采用了卷积神经网络（CNN）作为基础块，对所有输入输出序列的位置并计算其隐藏表示（computing hidden representations in parallel for all input and output positions）
- 对于**将任意两个位置的输入/输出信号建立联系需要的操作次数**和**这两个信号在序列中的位置距离**的关系（the number of operations required to relate signals from two arbitrary input or output positions grows in the distance between positions）：ConvS2S 是线性增长的；而 ByteNet 是对数增长的
- 基于上一点，导致这些模型在学习远距离的依赖关系时较为困难

> **存疑：什么是有效分辨率？**

在 Transformer 模型中，操作次数被简化到了常数级 —— 代价是由于**平均注意力加权位置**导致的有效分辨率降低（albeit at the cost of reduced effective resolution due
to averaging attention-weighted positions）
- 在3.2章节中提到了通过多头注意力的解决方案

> **存疑：什么是递归注意力机制**?

**Self-Attention（a.k.a Intra-Attention）**：一种将单序列中不同位置联系起来，以计算序列表示的注意力机制
- 端到端记忆神经网络基于**递归注意力机制**而非**序列对齐递归**（即上文Introduction一章中提到的）
- 端到端指神经网络可以直接利用输入的数据，而不需要经过其他预处理（如标记等）
- Transfomer 模型是第一个完全依赖于自注意力机制而不使用 RNN 和 CNN（这两个使用的是序列对齐递归）的模型

这一章对上一章中提到的**计算远距离依赖关系**这一点进行了展开。由于传统的神经网络模型都需要考虑到序列中的位置关系，不得不对序列遍历处理，因此复杂度均不低于线性（$O(N)$）。Transformer 模型引入了自注意力机制，在不考虑序列中的位置的情况下，可以通过并行计算将复杂度缩减至常数级（$O(1)$）

## Model Architecture

大多数竞争性（competitive，这里指的应该是**有竞争力**的意思）的神经序列转导模型都采用了**编码器-解码器**架构
- 编码器（encoder）： 它接受一个长度可变的序列作为输入， 并将其转换为具有固定形状的编码状态。 
- 解码器（decoder）： 它将固定形状的编码状态映射到长度可变的序列。

编码器将一组符号表示的输入序列$(x_1,\dots,x_n)$映射为一组连续表示的序列$z=(z_1,\dots,z_n)$。给定 z，解码器将会一次一个地（one element at a time）生成符号表示的输出序列$(y_1,\dots,y_m)$。这个模型中每一步都是自回归的，在生成下一个符号时会使用上一步生成的符号作为额外的输入。

Transformer 模型整体架构遵循了**基于多重堆叠的自注意力、逐点（Point-Wise）、完全连接的编码器/解码器层**的设计
- Point-wise 操作主要指在计算机编程、尤其是在处理数组、矩阵或高维数据时，对数据的每个元素单独执行的操作。

> 在数学中，限定词逐点（英语：Pointwise）用于表明考虑某函数的每一个值$f(x)$的确定性质。一类重要的逐点概念是逐点运算，这种运算是定义在函数上的运算，是将定义域上的每一点的函数值分别进行运算。
> 
> —— [逐点 - Wikipedia](https://zh.wikipedia.org/wiki/%E9%80%90%E7%82%B9)

![Alt text](image-1.png)

### Encoder and Decoder Stacks

**编码器**：由一组 $N=6$ 个相同层构成，其中每个层分为两个子层。
- 第一个子层是多头自注意力机制——用于捕获长距离的依赖关系
- 第二个子层是一个简单的逐位（Position-Wise）的完全连接的前馈网络——用于学习局部特征

> **存疑：为什么要创建残差连接和层归一化？**

我们在每个子层中均创建了**残差连接**，并进行了**层归一化**（We employ a **residual connection** around each of
the two sub-layers, followed by **layer normalization**）

> 残差神经网络属于深度学习模型的一种，其核心在于让网络的每一层不直接学习预期输出，而是学习与输入之间的残差关系。这种网络通过添加“跳跃连接”，即跳过某些网络层的连接来实现身份映射，再与网络层的输出相加合并。
> 
> —— [残差神经网络 - Wikipedia](https://zh.wikipedia.org/zh-cn/%E6%AE%8B%E5%B7%AE%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C)

也就是说，每个子层的输出为 $LayerNorm(x + Sublayer(x))$
- 其中Sublayer(x)是每个子层实现的函数

> Transformer使用了和ResNet类似的残差连接，即设模块本身的映射为$F(x)$，则模块输出为$Normalization(F(x)+x)$。和ResNet不同，Transformer使用的归一化方法是LayerNorm。另外要注意的是，残差连接有一个要求：输入$x$和输出$F(x)+x$的维度必须等长。在Transformer中，包括所有词嵌入在内的向量长度都是$d_{model}=512$。
> 
> —— [Attention Is All You Need (Transformer) 论文精读
](https://zhouyifan.net/2022/11/12/20220925-Transformer/)

为了实现残差连接，模型中的每个子层（包括嵌入层）都会产生维度 $d_{model}=512$ 的输出

**解码器**：同样由一组 $N=6$ 个相同层构成，其中每个层除了编码器的两个子层外，解码器还加入了第三个子层，用于对编码器的输出执行多头注意力（performs multi-head
attention over the output of the encoder stack）。

和编码器类似，我们在每个子层中均创建了**残差连接**，并进行了**层归一化**

> **存疑：什么是the output embeddings are offset by one position**

此外，我们修改了解码器中的自注意力子层，防止当前位置对后续位置的注意。通过这个Masking，结合**输出嵌入层（Output Embeddings）偏移了一个位置**（the output embeddings are offset by one position），保证了位置$i$的预测只能依赖于位置小于$i$的已知输出
- Mask 在解码器中用于限制注意力的范围，保证模型的自回归性质
- Mask 基于在注意力机制中引入一个矩阵参数，在矩阵中的**后续位置处**拥有一个近似负无穷的值，使softmax函数在计算注意力时对该处的权重近似为零

### Attention

注意力函数可以被描述为将一个查询和一组键值对映射到一个输出上（mapping a query and a set of key-value pairs to an output）
- 其中，查询、键和值均为向量

> **存疑：什么是兼容性函数**

函数的输出是值的加权和
- 每个值的权重通过查询和相应的键的兼容性函数计算得出（见下节）


![Alt text](image-2.png)

### Scaled Dot-Product Attention

我们将这个特殊的注意力机制称为**缩放点积注意力**（Figure 2），输入包含查询、维度为$d_k$的键和维度为$d_v$的值。我们**计算查询和所有键的点积（对应图中的MatMul），并除以$\sqrt{d_k}$（对应图中的Scale）**，将结果应用到一个 **softmax** 函数来得出值的权重

在实践中，我们同时计算一组查询的注意力函数——将查询封装在矩阵 $Q$ 中，同样地，键和值封装在矩阵 $K$ 和 $V$ 中，那么有输出矩阵的公式：

$$Attention(Q,K,V) = softmax(\frac{QK^T}{\sqrt{d_k}})V$$

两种常用的注意力函数是**加法注意力**和**点积（乘法）注意力**
- 点积注意力与我们的算法唯一的区别就是**缩放因子 $\frac{1}{\sqrt{d_k}}$** 
- 加法注意力通过一个具有隐藏层的前馈网络来计算兼容性函数
- 尽管两种算法的复杂度理论上的相近的，但是由于矩阵乘法有高度优化过的代码实现，因此点积注意力在实践中要更快、更节省时间

`//TODO(`

## Conclusion
1. 提出了新的深度学习模型 Transformer
2. 摒弃了递归和卷积，完全基于注意力机制实现
2. 将 encoder-decoder 架构中常用的循环层替换成为多头自注意力层

## 参考资料
- [Attention Is All You Need](https://arxiv.org/pdf/1706.03762)
- [循环神经网络 - Wikipedia](https://zh.wikipedia.org/zh-cn/%E5%BE%AA%E7%8E%AF%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C)
- [循环神经网络 - Dive into Deep Learning](https://zh.d2l.ai/chapter_recurrent-neural-networks/index.html)
- [编码器-解码器架构 - Dive into Deep Learning](https://zh.d2l.ai/chapter_recurrent-modern/encoder-decoder.html)
- [Attention Is All You Need (Transformer) 论文精读
](https://zhouyifan.net/2022/11/12/20220925-Transformer/)
- [递归神经网络(RNN)简介](https://blog.csdn.net/aws3217150/article/details/50768453)
- [【经典论文阅读15】Transformer—铸就大模型时代的基石
](https://blog.csdn.net/liu16659/article/details/108141534)
- [Attention is all yon need](https://blog.csdn.net/weixin_45112212/article/details/131569857)
