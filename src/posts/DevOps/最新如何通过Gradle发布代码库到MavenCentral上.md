---
title: 最新如何通过Gradle发布代码库到MavenCentral上
date: 2026/04/12
tags:
  - Gradle
---

## 注册SonaType账号

首先要拥有一个MavenCentreRepo的账号，在[SonaType](https://central.sonatype.com/)登录账号后

## 新建NameSpace

CentreRepo要求GroupID必须是发布者拥有的域名，所以至少要拥有一个自己的域名，如果没有的话，也可以使用Github登录，这样的话至少能认证`io.github.xxx`这个GroupID，但是还是建议自己申请一个域名

点击右上角的头像，选择**View Namespaces**->**Register New Namespace**

![SonaType 菜单页](/images/posts/gradle-maven-central-sonatype-menu.png)

填写你自己的域名，这里它会让你在DNS里加一条TXT记录，来验证你域名的合法性

![验证命名空间的 DNS 记录提示](/images/posts/gradle-maven-central-verify-namespace.png)

我这里直接通过CloudFlare添加了对应的TXT记录

![添加 TXT 记录示例](/images/posts/gradle-maven-central-add-txt-record.png)

添加完毕后，回到SonaType，点击浮窗的**Confirm**

![命名空间验证状态页](/images/posts/gradle-maven-central-sonatype-namespaces.png)

正常来说，不用等太久刷新一下，就能看到这里是Verified了

## 新建UserToken

也是右上角的头像，选择**View User Tokens**->**Generate User Token**，随便选择一个名字和过期时间（我这里选No expire了）

随后会弹出一个浮窗，记住这里的Username和Password

![生成 User Token 的弹窗](/images/posts/gradle-maven-central-sonatype-usertoken.png)

## 创建GPG签名

### 安装工具并生成签名

在`https://gpg4win.org/`下载Windows的GPG工具，如果是Linux或者Mac可以直接使用包管理器安装`gnupg`或者`gpg`，下面仅提供Widnows的GPG4WIN的教程

安装好后，在终端输入`gpg --full-generate-key`生成签名，输入密钥配置，我这里填写的是

```
key:(1)RSA and RSA
keysize:4096
expire:0->y
real name:Smile slime 47
email:Smile_slime_47@outlook.com
comment:For Smile slime 47 library
```

随后会弹出一个浮窗，让你填写签名的Passphrase，这里记一下填写的内容

在终端输入`gpg --list-keys`，就能看到刚才创建的签名公钥了，这里要记住pub（主密钥）和sub（子密钥）的后八位

```
pub   rsa4096 2026-04-12 [SC]
      XXXXXXXX
uid           [ultimate] Smile slime 47 (For Smile slime 47 library) <Smile_slime_47@outlook.com>
sub   rsa4096 2026-04-12 [E]
      XXXXXXXX
```

### 分发公钥

随后需要将主密钥分发到公网上以便验证，这里我用了gemini给我的三个服务器，可能会遇到一些网络问题，自行解决一下

```bash
# 1. Ubuntu 的服务器（最常用，同步快）
gpg --keyserver keyserver.ubuntu.com --send-keys 你的8位ID

# 2. OpenPGP 的官方服务器
gpg --keyserver keys.openpgp.org --send-keys 你的8位ID

# 3. PGP 全球目录
gpg --keyserver pgp.mit.edu --send-keys 你的8位ID
```

### 导出私钥文件

在终端输入`gpg --export-secret-keys -o <输出路径>`，将私钥导出到本地的某个目录下，回车后输入上面的passphrase确认，输出路径参考`D:\gpg\secring.gpg`

同时记住这个路径

### 配置Gradle签名信息

编辑`~/.gradle/gradle.properties`，添加如下字段


```properties
# GPG 签名信息
signing.keyId=<主密钥ID后8位>
signing.password=<前文的Passphrase>
signing.secretKeyRingFile=<私钥文件路径，如D:/gpg/secring.gpg>
```

## 配置Gradle SonaType信息

在配置`~/.gradle/gradle.properties`好gpg后，同时在下面添加如下信息

```properties
# Sonatype 身份认证
ossrhUsername=上文UserToken的username
ossrhPassword=上文UserToken的password
```

## 配置项目的build.gradle.kts

首先，在build.gradle.kts引入相关插件

```kotlin
plugins {
    `maven-publish`
    signing
}
```

然后在下面配置发布相关的配置

```kotlin
java {
    withSourcesJar()
    withJavadocJar()
}

// 1. 配置要发布的内容
publishing {
    publications {
        create<MavenPublication>("release") {
            // 项目类型，java or kotlin
            from(components["kotlin"])
            // 发布到Maven Central必须有source和javadoc
            artifact(tasks.named("sourcesJar"))
            artifact(tasks.named("javadocJar"))

            // 元数据
            artifactId = "Knot"
            groupId = project.group.toString()
            version = project.version.toString()

            // 完善 POM 文件信息
            pom {
                name.set("Knot")
                description.set("A Rope Data Structure Library Impl emented in Kotlin")
                url.set("https://github.com/Smileslime47/Knot")
                licenses {
                    license {
                        name.set("The MIT License")
                        url.set("https://opensource.org/licenses/MIT")
                    }
                }
                developers {
                    developer {
                        id.set("Smile_slime_47")
                        name.set("Smile slime 47")
                        email.set("Smile_slime_47@outlook.com")
                    }
                }
                issueManagement {
                    system.set("GitHub Issues")
                    url.set("https://github.com/Smileslime47/Knot/issues")
                }
                scm {
                    connection.set("scm:git:git@github.com:Smileslime47/Knot.git")
                    developerConnection.set("scm:git:ssh://github.com/Smileslime47/Knot.git")
                    url.set("https://github.com/Smileslime47/Knot")
                }
            }
        }
    }

    // 2. 配置发布的目标仓库
    repositories {
        // 由于OSSRH的发布模式已经废弃，这里先发布到本地目录，详情见下文
        maven {
            name = "LocalRepo"
            url = uri("${rootProject.buildDir}/repo")
        }
    }
}

// 3. 配置 GPG 签名（发布到 Maven Central 必备）
signing {
    sign(publishing.publications["release"])
}
```

## 构建发布包

2024年Central Portal更新了接口，导致基于OSSRH的maven/gradle的publish不再适用，OSSRH在2025/06/30已经停止维护，现在没有官方的构建工具插件可以在本地一键式发布，只能通过浏览器在Maven Central里手动上传

首先在项目里跑`./gradlew publishReleasePublicationToLocalTestRepository`，或者在IDEA的Gradle插件右侧执行`Tasks->publishing->publishReleasePublicationToLocalTestRepository`

随后在项目根目录的`build\repo\<包名>\<版本号>`（如`build\repo\moe\smileslime47\Knot\1.0.0`）下面检查是否至少包含这八个文件，其中XXXX为你的artifactId，1.0.0为你的version

- XXXX-1.0.0.jar & .jar.asc
- XXXX-1.0.0-sources.jar & .sources.jar.asc
- XXXX-1.0.0-javadoc.jar & .javadoc.jar.asc
- XXXX-1.0.0.pom & .pom.asc

如果没问题，回到repo处，从包名的位置开始构建一个**zip**压缩包，压缩包进去的一级目录必须和你的包名一致，如`build\repo\moe.zip\moe\smileslime47\Knot\1.0.0`

## 发布到Maven Central上

回到[SonaType的发布页](https://central.sonatype.com/publishing)，在Deployments处点击右上角的**Publish Component**，Deploy Name和Description随便填即可，重点是Upload Your File处，上传上一步构建的压缩包

如果没问题，确认后即可看到**VALIDATED**的标签，表示已通过审核，如果仍有其他问题，可以根据报错信息进一步调试（网上搜索或者问AI都可以）

![上传发布包后的 VALIDATED 状态](/images/posts/gradle-maven-central-sonatype-deployment.png)

确认没有问题后，点击**Publish**按钮，此时**VALIDATED**标签会变为**PUBLISHING**

等待约10分钟后，再次刷新可以看到标签变为**PUBLISHED**，此时已经发布成功，并能看到相应的Repo连接

![发布完成后的 PUBLISHED 状态](/images/posts/gradle-maven-central-sonatype-published.png)

等待半天到一天后，基本上就能在[mvnrepository](https://mvnrepository.com/)看到自己的仓库了，这个并不是Maven Central官方，所以更新会慢一些
