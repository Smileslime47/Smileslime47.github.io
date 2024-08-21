---
title: 深度学习《Attention Is All You Need》精读报告
author: Liu Yibang
date: 2024/08/21
categories: 
    - Artificial Intelligence
    - Article
---

本论文是 Transformer 模型的首次提出

## Abstract

主流的序列转导模型：RNN（循环神经网络 - Recurrent Neural Network）、CNN(卷积神经网络 - Convolutional Neural Networks)
- 序列转录模型（sequence transduction model）：给定一个序列，生成另外一个序列
- 基于 encoder-decoder 架构，通过注意力机制（attention）连接

提出 **Transformer** 架构：仅仅基于注意力机制，不使用循环和卷积，在多个翻译任务上取得较高的BLEU成绩
- **BLEU**：双语替换评测（bilingual evaluation understudy），用于评估模型生成的语句品质，通常将模型生成语句和人工翻译语句进行比较，通过计算两个语句的N-grams模型并统计匹配个数来得到结果。BLEU 的分数在 0.0-1.0 之间

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

> **什么是hidden representations？暂且理解为输入输出序列中位置所带来的的隐含关系**

减少序列化的计算也是 Extended Neural GPU、ByteNet 和 ConvS2S 等模型的目标，这些模型采用了卷积神经网络（CNN）作为基础块，对所有输入输出序列的位置并计算其隐藏表示（computing hidden representations in parallel for all input and output positions）
- 对于**将任意两个位置的输入/输出信号建立联系需要的操作次数**和**这两个信号在序列中的位置距离**的关系（the number of operations required to relate signals from two arbitrary input or output positions grows in the distance between positions）：ConvS2S 是线性增长的；而 ByteNet 是对数增长的
- 基于上一点，导致这些模型在学习远距离的依赖关系时较为困难

> **什么是有效分辨率？**

在 Transformer 模型中，操作次数被简化到了常数级 —— 代价是由于**平均注意力加权位置**导致的有效分辨率降低（albeit at the cost of reduced effective resolution due
to averaging attention-weighted positions）
- 在3.2章节中提到了通过多头注意力的解决方案

> 什么是**递归注意力机制**?

**Self-Attention（a.k.a Intra-Attention）**：一种将单序列中不同位置联系起来，以计算序列表示的注意力机制
- 端到端记忆神经网络基于**递归注意力机制**而非**序列对齐递归**（即上文Introduction一章中提到的）
- 端到端指神经网络可以直接利用输入的数据，而不需要经过其他预处理（如标记等）
- Transfomer 模型是第一个完全依赖于 Self-Attention 机制而不使用 RNN 和 CNN（这两个使用的是序列对齐递归）的模型

这一章对上一章中提到的**计算远距离依赖关系**这一点进行了展开。由于传统的神经网络模型都需要考虑到序列中的位置关系，不得不对序列遍历处理，因此复杂度均不低于线性（$O(N)$）。Transformer 模型引入了 Self-Attention 机制，在不考虑序列中的位置的情况下，可以通过并行计算将复杂度缩减至常数级（$O(1)$）

## Conclusion

为了更好的理解 Transformer 模型的创新点，便于后面对技术细节的阅读，这里选择了先读结论

1. 提出了新的深度学习模型 Transformer
2. 摒弃了递归和卷积，完全基于注意力机制实现
2. 将 encoder-decoder 架构中常用的循环层替换成为多头自注意力层

## Model Architecture

大多数竞争性（competitive，这里指的应该是**有竞争力**的意思）的神经序列转导模型都采用了 encoder-decoder 模型

`//TODO(`

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
