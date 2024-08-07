---
title: JPEG编码过程-Wikipedia
date: 2023/04/30
categories:
  - Translation
mathjax: true
---
# JPEG压缩标准
<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br />本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">知识共享署名-非商业性使用 4.0 国际许可协议</a>进行许可。
节选并译自：https://en.wikipedia.org/wiki/JPEG

要注意的是，Wikipedia给出的JPEG标准描述仍然有疏漏和错误之处，详细准确的JPEG压缩标准请参考JPEG官方规范标准。

# 语法和文件格式
JPEG图像由一系列段（Segment）组成，每个段都以单字节0xFF起始，其下一个字节指示段的标记类型（marker）。一些标记仅包含这两个字节，还有的标记会紧跟两个字节（高位和低位）指示后面有效载荷数据的长度（这里的长度是独立用两个字节表示的，和前面表示标记的两个字节不同）。一些标记位后存储的是[熵编码数据](https://en.wikipedia.org/wiki/Entropy_coding)，这种情况下长度并不包含后面的熵编码数据。...

在熵编码数据中出现的任何0xFF字节，编码器会在其之后再插入一个0x00字节，从而防止以外的标记位出现。这种被叫做[字节填充技术](https://en.wikipedia.org/wiki/Consistent_Overhead_Byte_Stuffing)（参见参见JPEG 规范第 F.1.2.3 节）。这个规则仅适用于熵编码数据，而非标记位的有效载荷数据。不过熵编码数据仍然有一些自己的标记位，尤其是重置标志位（0xD0至0xD7），重置标志位常用于隔离熵编码数据中的各个独立区块从而实现并行解码，此外一部分编码器也会在中途插入这些重置标记位。

常见JPEG标记位：
|简写|Bytes|载荷数据|名称|描述|
|--|--|--|--|--|
|SOI|0xFF,0xD8|无|Start Of Image|指|
|SOF0|0xFF,0xC0|可变长度|Start Of Frame（基线式DCT）|指示这是基于基线式DCT的JPEG图像，并指定宽度、高度、颜色通道数和色度抽样（如4:2:0）|
|SOF2|0xFF,0xC2|可变长度|Start Of Frame（渐进式DCT）|指示这是基于渐进式DCT的JPEG图像，并指定宽度、高度、颜色通道数和色度抽样（如4:2:0）|
|DHT|0xFF,0xC4|可变长度|Define Huffman Table(s)|定义一个或多个霍夫曼表|
|DQT|0xFF,0xDB|可变长度|Define Quantization Table(s)|定义一个或多个量化表|
|DRI|0xFF,0xDD|4 bytes|Define Restart Interval|由最小编码单元（MCU）指定RSTn标记位的间隔。|
|SOS|0xFF,0xDA|可变长度|Start Of Scan|开始图像自上而下的扫描解码。在基线式DCT的JPEG图像中，通常只需要进行一次线性扫描，而渐进式DCT的JPEG图像则包含多次扫描。这个标记位指示了它包含的数据片段，在其之后存储着熵编码数据|
|RSTn|0xFF,0xDn (n=0..7)|无|Restart|每r个宏区块（MCU）插入一个RST标记位，其中r为DRI标记位设置的间隔。如果没有DRI标记位则不使用此标记位。标记码第三位由0-7不断循环|
|APPn|0xFF,0xEn|可变长度|Application-specific |APP扩展位。例如：一个EXIF JPEG图像会使用APP1标记位来存储元数据，并基于TIFF格式布局|
|COM|0xFF,0xFE|可变长度|Comment|图像注释|
|EOI|0xFF,0xD9|无|End Of Image||

此外还有一种引入其他JPEG编码类型的Start Of Frame标记位。

由于多个供应商可能使用相同的APPn标记，因此对于特定应用程序的标记位通常以供应商名称（如“Exif”或“Adobe”）或其他一些用于标识的字符串开头。

# JPEG压缩过程

JPEG文件可以以多种不同方式编码，但是最常见的是JFIF格式标准。编码过程通常分为以下几步：

1. 将图像的颜色表示方式由[$RGB$](https://en.wikipedia.org/wiki/RGB_color_model)转换为[$Y′C_BC_R$](https://en.wikipedia.org/wiki/YCbCr)，该色彩空间由一个亮度分量（Y'）和两个色度分量（Cb和Cr）组成。在少数情况下这一步会被跳过。
2. 降低色度数据的分辨率，通常会将分辨率降低2倍至3倍。这一步基于人眼对颜色细节变化的敏感度要低于对亮度细节变化的敏感度。
3. 图像被切分成8x8像素的区块，对于区块上的Y、Cb、Cr经过[离散余弦变换（DCT）](https://en.wikipedia.org/wiki/Discrete_cosine_transform)处理。离散余弦变换是一种类似于[傅里叶变换](https://en.wikipedia.org/wiki/Fourier_transform)的变换，生成一种基于余弦波的空间频谱。
4. 在经过离散余弦变换后，对于不同频率分量的振幅会被[量化](https://en.wikipedia.org/wiki/Quantization_(image_processing))。人类视觉对于较大面积上亮度/色度的细小变化要更加敏感，因此对于频谱中的高频分量可以以更低的精度来存储。编码器往往提供一个压缩质量的参数，这会影响每个频率分量被压缩的程度，当采用过低的压缩质量时，高频分量往往会被完全舍弃。
5. 处理完的8x8区块会通过无损算法进一步压缩，如[哈夫曼编码](https://en.wikipedia.org/wiki/Huffman_coding)。

考虑到量化是一种不可逆的操作，解码过程会将除量化外的步骤反向进行。在本节的剩余部分会详细解释编码和解码的具体过程。

## 编码
JPEG标准中的许多选项其实并不常用。如上文所述，大部分图像处理软件在创建JPEG文件时往往采用较为简单的JFIF格式。下文简要描述了比较常见的编码方式，该编码方式适用于每个像素用24位（即色彩深度24bpp）存储（红色、绿色、蓝色各8位）的图像输入。该编码方式属于一种[有损压缩编码](https://en.wikipedia.org/wiki/Lossy_compression)。

### 色彩空间转换
首先，图像从[$RGB$](https://en.wikipedia.org/wiki/RGB_color_model)格式（通常为sRGB，但也有可能是其他色彩空间）转换为另一种叫做[$Y′C_BC_R$](https://en.wikipedia.org/wiki/YCbCr)（或者YCbCr）的色彩空间。它包含三个分量：$Y'$、$C_B$、$C_R$：$Y'$分量表示一个像素的亮度，而$C_B$和$C_R$分量则表示一个像素的蓝色和红色分量。这与[数字电视](https://en.wikipedia.org/wiki/Digital_television)及数字影像如[DVD](https://en.wikipedia.org/wiki/DVD-Video)等使用的色彩空间相同。$Y′C_BC_R$色彩空间可以让我们采用一些不会明显影响图像质量（或者在相同压缩比下更好的图像质量）的压缩算法。对于图像感知影响最明显的亮度分量被限制在了单独的通道中，这样更加符合人类视觉系统对于色彩变化的感知规律。

在JFIF标准中指定了应当采用$Y′C_BC_R$的色彩空间转换，使生成的JPEG文件拥有更好的兼容性。但是在某些“最高质量”下的JPEG编码器会跳过此步骤，将颜色信息继续采用[RGB模型](https://en.wikipedia.org/wiki/RGB_color_model)存储，该模型将像素点分为红色、绿色、蓝色三个色度分量来存储。由于这会导致压缩效率大大降低，在考虑到文件大小的情况下一般不会采用。

注：$RGB$格式和$Y′C_BC_R$格式的互相转换有一套现成的转换公式：
- RGB到YCbCr
    - $Y = 0.299 \times R + 0.587 \times G + 0.114 \times B$
    - $C_B = (-0.16874 \times R - 0.33126 \times G + 0.5 \times B) + 128$
    - $C_R = (0.5 \times R - 0.41869 \times G - 0.08131 \times B) + 128$
- YCbCr到RGB
    - $R=Y + 1.402 \times (C_R - 128)$
    - $G=Y - 0.34414 \times (C_B - 128) - 0.71414 \times (C_R - 128)$
    - $B=Y + 1.772 \times (C_B - 128)$

### 降采样
由于人眼对于色度和亮度敏感度的不同，相比色彩饱和度和色调上的变化（即$C_B$、$C_R$分量），人眼往往更能注意到图像中亮度上的变化（即$Y'$分量）。基于这点，编码器可以设计出更加有效的压缩算法。

在转换到$Y′C_BC_R$后可以进行下一个步骤：降低$C_B$、$C_R$分量的分辨率，这一步通常被叫做[降采样](https://en.wikipedia.org/wiki/Downsampling_(signal_processing))或者[色度抽样](https://en.wikipedia.org/wiki/Chroma_subsampling)。对于JPEG图像降采样的压缩比通常有：4:4:4（不进行降采样）、4:2:2（仅在水平方向上压缩至一半）、4:2:0（在水平和垂直方向上均压缩至一半）。对于后面的压缩步骤，$Y'$、$C_B$、$C_R$分量均以相似的方式进行处理。

### 分块
在[抽样](https://en.wikipedia.org/wiki/Chroma_subsampling)后，每个通道都被分为有限个8x8的区块。基于降采样的方式，图像会被分成多个**最小编码单元**（Minimum Coded Unit,MCU）：8x8（无降采样）、16x8（4:2:2降采样：$Y_1、Y_2、C_B、C_R$，即每两个8x8区块为单位编码在一组）、16x16（4:2:0降采样：$Y_1、Y_2、Y_3、Y_4、C_B、C_R$，即每四个8x8区块为单位编码在一组）。在[视频压缩](https://en.wikipedia.org/wiki/Data_compression#Video)中，MCU一般被叫做[宏区块](https://en.wikipedia.org/wiki/Macroblock)。

注：这里的意思实际上是指每次读取数据时需要读取16x16的区块，这样就能获得4个8x8的Y矩阵和2个8x8的C矩阵进行编码；如果每次只读取一个8x8的区块，那么得到的Cb和Cr矩阵就是4x4的，后面的处理过程就不能统一化处理。

如果某一通道的数据不能用整数个区块表示，则编码器需要以某种形式的数据将其填充为区块的整数倍。用固定的颜色（如黑色）填充图像边缘可能会导致图像边界产生可见的[振铃效应](https://en.wikipedia.org/wiki/Ringing_artifacts)；为了减轻（不一定能完全消除）这种现象，通常用边缘处的像素重复填充剩余部分，此外也可以应用更加复杂的边缘填充技术。

### 离散余弦变换
下一步，每个分量（Y、Cb、Cr）的8x8的矩阵需要通过一个归一化的二维[离散余弦变换](https://en.wikipedia.org/wiki/Discrete_cosine_transform)（DCT）-II型被转换为频域矩阵。DCT有时也被叫做DCT-II型，与之相对的逆变换（IDCT）则被叫做DCT-III型。

举例来说，一个8x8的区块可能是：

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/eed8c00e62db6618fd452d3905a03f842c30ce34)

在对此8x8的区块进行DCT前，它的数据需要从一个正数范围平移至一个以0为中心的范围。对于一个8位的图像，原始区块中的每个数据都在[0,255]的范围内，对每个数据减去范围的中值（在这种情况下即128）将其范围限制在以0为中心，于是平移后的范围为[-128,127]。这一步骤降低了随后DCT处理阶段的动态范围。

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/f69a5e277c8e5d58ea12abdf1b102668b9bb5bf1)

下一步是代入二维DCT公式，这里已经给出：
$$G_{u,v}=\frac{1}{4}α(u)α(v)\sum^7_{x=0}\sum^7_{y=0}g_{x,y}cos[\frac{(2x+1)u\pi}{16}]cos[\frac{(2y+1)v\pi}{16}]$$
- u为水平空间频率，范围为$0\leq u<8$
- v为垂直空间频率，范围为$0\leq u<8$
- $α(u)=\begin{cases}\frac{1}{\sqrt{2}}, & \text{if}\ u=0 \\1, & \text{otherwise}\end{cases}$是一个使变换[正交](https://en.wikipedia.org/wiki/Orthonormality)的正规化系数
- $g_{x,y}$为坐标$(x,y)$处的数据值
- $G_{u,v}$为坐标$(u,v)$处的DCT系数（注：这里的u,v坐标和相同数值的x,y坐标没有任何相关性）

在我们对上面的矩阵进行变换后就能得到如下结果：

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/46ee57df2a309dd59e0a10c9ab83e8b86d712e3e)

注意最左上角的系数，其数值要远大于其他数值。这个值我们称为[DC系数](https://en.wikipedia.org/wiki/DC_bias)（或者常数分量），它定义了整个区块的基本色调。其余63个系数为AC系数（也叫交变分量）。DCT处理的优势在于它将大部分信号集中在矩阵的左上角，而接下来的量化步骤会进一步加强这个现象，并缩减DCT矩阵的大小，产生一个在熵编码阶段易于压缩的信号。

DCT会短暂地增加图像的位深，因为对于8位的图像而言其DCT系数可能需要11位或更多位来存储（取决于DCT的保真度）。这可能会导致编码器需要暂时使用16位的数据格式来存储这些系数。在经过量化步骤后这些数据会变回8位。不过对于大多数JPEG的实现方案来说，考虑到在图像编解码过程中的任一时间通常只有图片的一小部分区块以完整的DCT系数形式存储，在这个阶段临时增加数据结构的大小并不会导致什么性能问题。

### 量化
人眼通常更擅长在较大的区域中发现细微的[亮度](https://en.wikipedia.org/wiki/Brightness   )变化，而不擅长区分高频区域中的亮度变化。这允许我们在压缩过程中大幅度减少高频分量中的数据。简单地将频域中的每个分量除以该分量对应的一个常数，并对结果进行四舍五入取整即可完成量化步骤。如果采用足够高精度的DCT变换，那么这个四舍五入的过程是整个压缩过程中除色度抽样外唯一的有损压缩步骤。在通常情况下，许多高频分量被四舍五入为零，而其余的分量则以非常小的正数或负数表示，从而让我们可以用更小的位数来表示这些数据。

[量化矩阵](https://en.wikipedia.org/wiki/Quantization_(image_processing)#Quantization_matrices)中的元素控制着压缩比，其值越大则图像压缩比率越大。对于标准的亮度量化矩阵（JPEG标准中指定的压缩质量50%）如下图所示：

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/22b028c684dba73c77c66d11739144919a55806a)

量化后的DCT系数可以通过计算得出：

$$B_{j,k}=round(\frac{G_{j,k}}{Q_{j,k}}) for j=0,1,2,\dots,7;k=0,1,2,\dots,7$$

其中$G$为未经过量化的DCT系数，$Q是上述的量化矩阵$，$B$是经过量化后的DCT系数

在上述经过DCT变换处理的矩阵用这个量化矩阵处理后会得到：

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/dfedb02fc67c95d021b46c13f4fb21c55a361671)

举例来说，对于DC系数-415来说，其量化后的数据为：

$$round(\frac{-415.37}{16})=round(-25.96)=-26$$

可以注意到，区块中的大部分高频元素（即x或者y方向上空间频率大于4的元素）几乎都被量化为零。

### 熵编码
熵编码是一种特殊形式是[无损数据压缩](https://en.wikipedia.org/wiki/Lossless_data_compression)技术，它涉及到了一种基于“[之字形](https://en.wikipedia.org/wiki/Zigzag)”扫描的[游程编码](https://en.wikipedia.org/wiki/Run-length_encoding)（RLE）技术，这种编码可以将相似的频率分量排在一起，在末尾插入零的长度编码，然后对剩下的内容进行[霍夫曼编码](https://en.wikipedia.org/wiki/Huffman_coding)。

JPEG标准还允许（但不强制要求）使用[算术编码](https://en.wikipedia.org/wiki/Arithmetic_coding)，算术编码在数学上要优于霍夫曼编码，但由于算术编码在过去被需要支付使用许可费的[专利](https://en.wikipedia.org/wiki/Patent)覆盖，以及其编解码速度要慢于霍夫曼编码，这种编码技术实际上很少被使用。算术编码通常会使JPEG文件进一步缩小5%-7%。

前面的量化DC系数会被用于当前的量化DC系数，编码时记录当前DC系数与前一个DC系数的差值而非当前DC系数的实际数值。而剩余的63个AC系数则不会采用这种差分编码。

上述的量化系数的之字形序列如下所示（该格式仅为便于理解，并非实际存储格式）。

```
−26 							
−3 	0
−3 	−2 	−6
2 	−4 	1 	−3
1 	1 	5 	1 	2
−1 	1 	−1 	2 	0 	0
0 	0 	0 	−1 	−1 	0 	0
0 	0 	0 	0 	0 	0 	0 	0
0 	0 	0 	0 	0 	0 	0
0 	0 	0 	0 	0 	0
0 	0 	0 	0 	0
0 	0 	0 	0
0 	0 	0
0 	0
0   
```

如果第i个区块由$B_i$表示，区块内的像素点由$(p,q),p=0,1,\dots,7;q=0,1,\dots,7$表示，则DCT矩阵中的任何一个系数都可以由$B_i(p,q)$表示。因此在上述编码方案中，在第i个区块中的像素点被编码到序列中的位置分别为：
$$Bi(0,0),B_i(0,1),B_i(1,0),B_i(2,0),B_i(1,1),B_i(0,2),B_i(0,3),B_i(1,2)\dots$$

注：这里我已经算出了完整的序列，即zigzag(i)对于matrix(y,x)的映射关系有：

`{0, 0},{0, 1},{1, 0},{2, 0},{1, 1},{0, 2},{0, 3},{1, 2},{2, 1},{3, 0},{4, 0},{3, 1},{2, 2},{1, 3},{0, 4},{0, 5},{1, 4},{2, 3},{3, 2},{4, 1},{5, 0},{6, 0},{5, 1},{4, 2},{3, 3},{2, 4},{1, 5},{0, 6},{0, 7},{1, 6},{2, 5},{3, 4},{4, 3},{5, 2},{6, 1},{7, 0},{7, 1},{6, 2},{5, 3},{4, 4},{3, 5},{2, 6},{1, 7},{2, 7},{3, 6},{4, 5},{5, 4},{6, 3},{7, 2},{7, 3},{6, 4},{5, 5},{4, 6},{3, 7},{4, 7},{5, 6},{6, 5},{7, 4},{7, 5},{6, 6},{5, 7},{6, 7},{7, 6},{7, 7}`

这种编码方式又叫做基线*顺序*编码（baseline sequential encoding），此外JPEG还支持*渐进式*编码（progressive encoding）。顺序编码对于一个区块的64个系数以之字形进行扫描，而渐进式编码则对于所有区块的相同位置的系数进行批量扫描，然后对所有区块的下一个位置的系数扫描。举例来说，如果图像被分割成N个8x8的区块$B_0,B_1,B_2,\dots,B_{n-1}$，然后进行三次扫描：第一次扫描所有区块中位于$B_i(0,0)$的DC系数，

...

在本文的剩余部分，假设系数模式是以顺序编码进行处理的。

JPEG采用霍夫曼编码对上面的系数模式进行编码。JPEG标准提供了一套通用霍夫曼表，但是编码器也可以选择针对当前图像的频率分布优化过的霍夫曼表。

对之字形排列的量化数据的编码将从游程编码开始，其中：
- $x$是一个非零的量化AC系数
- RUNLENGTH表示该非零AC系数前的零的个数
- SIZE是表示$x$所需的位数
- AMPLITUDE是是$x$的二进制表示（注：这里的二进制表示是将$x$进行*可变长整数编码*，详见项目页）

游程编码检查每个非零的AC系数以及在这个系数前有多少个零，并据此创建两个标记：
|标记1|标记2|
|--|--|
|(RUNLENGTH,SIZE)|(AMPLITUDE)|

RUNLENGTH和SIZE存储在同一个字节中，因此每个数据包含4位的信息。高4位表示前导零的数量，低4位表示编码x需要读取的位数

这意味着标记1中最多只能记录该AC系数前有15个前导零。不过JPEG定义了两个特殊的霍夫曼码。
- 其中一个指示剩余AC系数均为0并提前结束序列（记为"End-Of-Block"或者“EOB”）（注：对应标记1记作(0,0)，无标记2）
- 另一个指示读下一个AC系数前有超过15个前导零的情况。当一个非零AC系数前有16个前导零的情况下，*标记1*会被编码为：(15,0)(0)（注：这里wikipedia有误，当满足16个前导0时仅由一个标记1(15,0)作为标记位表示，同EOB，不会有标记2）

整个过程会一直遍历到“EOB”——记作(0,0)

之前的AC系数会被编码为：

(0, 2)(-3);(1, 2)(-3);(0, 1)(-2);(0, 2)(-6);(0, 1)(2);(0, 1)(-4);(0, 1)(1);(0, 2)(-3);(0, 1)(1);(0, 1)(1);
(0, 2)(5);(0, 1)(1);(0, 1)(2);(0, 1)(-1);(0, 1)(1);(0, 1)(-1);(0, 1)(2);(5, 1)(-1);(0, 1)(-1);(0, 0);

矩阵中的第一个值-26为DC系数，它采用了不同的编码方式，因此不会和AC系数编码在一起。

注：后文没有提及到熵编码后输出流的格式，在熵编码这里的介绍也较为粗略。熵编码包含了游程编码、可变长整数编码和霍夫曼编码三部分。