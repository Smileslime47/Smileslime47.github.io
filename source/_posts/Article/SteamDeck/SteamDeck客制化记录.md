---
title: SteamDeck客制化记录
date: 2024/06/19
categories:
  - Article
  - SteamDeck
---

后面也许还会考虑更换硬件（风扇、SSD、摇杆等），会另开文章再说

## 密码库问题

刚进入桌面模式时，可能会弹出一个“KDE试图创建名为kdewallet的密码库”的窗口，如果你不搞定这个的话，大概率之后每次进入桌面模式都会弹出这个窗口

要使用GPG密钥创建密码库，首先你要在开始菜单搜搜并打开Konsole

然后输入该命令

```bash
gpg --full-generate-key
```

随后会有几次提示引导你创建密钥（选自[生成新 GPG 密钥 - Github Docs](https://docs.github.com/zh/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)）：

- 在提示时，指定要生成的密钥类型，或按 Enter 键接受默认值。
- 在提示时，指定要生成的密钥大小，或按 Enter 键接受默认值。
- 输入密钥的有效时长。 按 Enter 键将指定默认选择，表示该密钥不会过期。 除非你需要过期日期，否则我们建议接受此默认值。
- 验证您的选择是否正确。
- 输入您的用户 ID 信息。
- 输入安全密码。

创建完毕后，回到窗口，选择使用GPG密钥创建密码库，此时你应当能看见刚才创建的密钥了，继续下一步即可解决该问题

## 游戏兼容性

为了让游戏能在Linux上流畅运行，Valve基于Wine兼容层开发了一个更适用于游戏运行的兼容层——Proton，即便不是SteamDeck，你也可以在你的Linux系统上使用Proton来运行Steam上的游戏，Proton会随着Steam一同安装。

你可以在[ProtonDB](https://www.protondb.com/)上看到各个游戏对Proton/SteamDeck/Linux的兼容性，这些评测基本来自于玩家社区，并且对于兼容性一般的游戏也会有玩家给出解决方案。

## BIOS模式

关机模式下按音量+键和电源键进入BIOS

## 桌面模式 – Desktop Mode

桌面模式下L2是右键，R2是左键，X呼出虚拟键盘，B收回虚拟键盘，Y打出一个空格，左触摸板是鼠标滚轮，右触摸板是鼠标位移，触摸屏单击等效鼠标双击

如果要在桌面模式游玩游戏的话，长按菜单键可以在这个指令集和常规手柄映射的指令集之间切换

具体可以再在设置里查看桌面模式的控制器布局

初次进入桌面模式建议在Konsole通过passwd指令设置root用户密码

取消文件系统的只读模式：

```bash
sudo steamos-readonly disable
```

Discover换源：

```bash
sudo flatpak remote-modify flathub --url=https://mirror.sjtu.edu.cn/flathub
flatpak remotes --show-details
```

官方的虚拟键盘很难用，桌面模式下会有英文键盘打出中文的Bug（QWERTY和美式都有这个问题），有条件还是建议外接扩展坞键盘使用桌面模式

## 远程传输文件 – KDE Connect

传输文件可以使用KDE Connect，桌面模式下在开始菜单搜索即可找到，需要两方加入同一个局域网且都拥有KDE Connect这个应用

不建议传输大文件（比如模拟器ROM），两方任意一方网络不稳定都会导致传输失败

我就试过手机硬用KDE Connect給Deck传12G的宝可梦，传了将近两个小时而且两方任意一方熄屏过久都会导致传输失败

## 插件管理器 — Decky

Decky Loader官网：https://decky.xyz

SteamOs更新会导致Decky失效，重新执行一遍安装脚本即可恢复。另外我遇到过CSS Loader失效的情况，对我而言也是重新安装一遍Decky解决的。

要注意的是测试版和预览版系统可能会导致插件出各种各样的问题，建议使用稳定版更新渠道（总之最好不要使用预览版）

## 我安装的Decky插件

### EmuDecky

Emu Deck的官方插件

可以在Game Mode下设置模拟器的Cheat Sheet以及一些其他设置，个人用的不是很多

### To Moon

和其他插件不同的是，这个插件并不被Decky官方的插件商店收录，可以在 https://github.com/YukiCoco/ToMoon 下载并安装插件

游戏模式下启动代理服务

在从桌面模式切换回游戏模式时会自动注销当前会话，导致在桌面模式安装cfw是没办法在游戏模式使用的，To Moon解决了这个问题

### KDE Connect

在GameMode下仍然可以通过KDE Connect接收文件

需要在桌面模式下和要发送文件的设备进行过至少一次配对才能在游戏模式下正常使用

### Brightness Bar

SteamDeck有一个功能是按住STEAM键/QAM键的同时上推/下拉摇杆可以调节屏幕亮度（好几次因为这个莫名其妙屏幕变得巨亮/巨暗。。。）

但是这个亮度调节是不会像音量调节一样显示一个调节的进度条的，这个插件让你在用这种方式调节亮度时像调节音量一样显示一个进度条。

### PlayTime

记录你在SteamDeck上误国的时间

### Animation Changer

一键更换启动动画和挂机动画

这个插件可以直接浏览并下载 https://steamdeckrepo.com 这里由社区制作的动画

虽然在桌面模式也可以更换，但是明显这个更好用一些，下面许多插件也是同理

### CSS Loader

一键应用预设的CSS主题，自带主题商店，下面会列出几个我安装了的主题

你也可以在 https://deckthemes.com/themes 这里查看主题商店拥有的主题

### ProtonDB Badges

在游戏页面显示该游戏在ProtonDB上对Proton兼容层的兼容性

这里我设置的是小型+左上角，配合Clean Gameview有不错的浏览效果

### MagicPods

在SteamDeck上对Airpods实现完全控制和电量查看

因为我在外面玩的时候习惯戴Airpods使用，这个可以在Deck上查看耳机剩余电量以及切换降噪模式对我而言很有用

而且可以在这里一键连接已配对的Airpods，个人觉得比在系统设置->蓝牙里连接要更直观

### Battery Tracker

追踪电量使用情况

### Mango Peel

可以修改游玩时屏幕上方的性能HUD内容

显示时间的功能在SteamDeck Oled的单列模式下有错位BUG，暂时还没有解决。Repo上03/24就有人提过这个问题的Issue了，看来解决希望可能不大。

## 我安装的CSS Loader主题

### Full Suspend

将挂机动画修改为全屏大小，如果要用Animation Loader插件修改挂机（suspend）动画的话这个几乎是必装的

### Better Blur

修改系统的模糊设置，体现在打开Steam菜单和QAM菜单的时候中间画面的模糊效果

默认的模糊明显偏暗，这里可以调成亮一点的模糊观感会更好

我这里默认的是4的Blur Strength和0.5的Opacity

这个在下面的CapyMenu的图片中也能看出效果

### Top Bar Transparency

给状态栏一个不错的透明模糊效果，否则的话是纯黑的（常见于聚焦和打开菜单的时候）

同样地，这个在下面的CapyMenu的图片中也能看出效果

### CapyMenu

有Steam Menu、QAM、Context Menu三个主题，分别对应更换Steam菜单、系统菜单以及内容菜单（常见的是电源选项）的样式

![Steam菜单](/images/posts/capymenu-steam-1024x640.jpg)

![QAM菜单](/images/posts/capymenu-qam-new-1024x640.jpg)

![Context菜单](/images/posts/capymenu-context-1024x640.jpg)

### Centered Home

将主页游戏库图标居中放大显示，并将其他内容放在下一页，这样更有主机端的感觉

![](/images/posts/centered-home-1024x640.jpg)

### Clean Gameview

将游戏页面的样式修改为大篇幅封面Hero + 页脚启动栏透明的风格，其余内容放在下一页

![](/images/posts/clean-gameview-1024x640.jpg)

### Clean Game Launch

使游戏启动画面显示游戏Logo而非Gamepad映射说明，毕竟大部分人也不太想看这个

![](/images/posts/clean-game-launch-1024x640.jpg)

## 模拟器管理器 — Emu Deck

下载网址：https://www.emudeck.com

### 文档

官方文档：https://emudeck.github.io

EmuDeck采用了对各个模拟器统一管理文件结构的方式，例如，所有模拟器的ROM目录都位于/home/Emulation/roms目录下。

各个模拟器的使用方式在文档中都有提到（序列号、固件、ROM等）

安装好对应游戏的ROM后可以在EmuDeck的Steam ROM Manager将模拟器和游戏加入到Steam库中从而在游戏模式下启动（等同于在库中添加非Steam游戏）

### 卸载

由于EmuDeck只是一个模拟器的管理器，并非集成软件，当你通过EmuDeck安装模拟器时，本质上还是把模拟器安装到了SteamOS本地，EmuDeck只是负责解决了模拟器的配置以及和SteamOS之间的兼容性问题而已。因此，卸载本地的模拟器并不会卸载EmuDeck，再次运行EmuDeck的安装脚本时仍会检测到本地已有EmuDeck而退出。要完全卸载EmuDeck和通过其安装的模拟器，需要执行下面这个脚本

卸载脚本：https://github.com/dragoonDorise/EmuDeck/blob/main/uninstall.sh

### Switch模拟器

我本人主要还是在Deck上跑Wii模拟器和NS模拟器。考虑到Yuzu凉了，我这里用的是Ryujinx模拟器

NS模拟器需要主机的硬件序列号（即Prod Key）和固件（Firmware），且版本必须对应，举例来说，你在网上找的V18.0.0的prod.key必须安装V18.0.0的firmware才能正常工作

这两个都可以在https://prodkeys.net/d/中找到对应的文件并下载

参照EmuDeck的文档，可以得知：序列号文件（prod.key）位于Emulation/bios/ryujinx/keys/目录下

固件需要在SteamOS的开始菜单中手动启动Ryujinx的客户端，然后在Tools->Install Firmware->Install a firmware from XCI or ZIP选择你下载到的固件

要注意的是不论是桌面模式还是游戏模式，在游戏请求Switch键盘输入时，SteamDeck的键盘输入都有很严重的Bug（包括外接键盘也是一样的效果），具体表现是输入框中只能输入一个字符，再次输入新的字符会将原来的字符替代掉（类似光标卡在最前面然后开Insert模式输入）。经过我自己的测试，一个勉强可行的解决方案是输入第一个字符后Accept（A），然后再次打开输入框，此时可以在输入框输入第二个字符，输入完毕后再次Accept，反复操作直到输入完整内容为止。
