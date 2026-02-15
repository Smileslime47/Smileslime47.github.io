---
title: Gradle学习笔记 & 一站式入土速成教程
date: 2025/11/03
categories:
  - DevOps
  - Gradle
---

## 引言

国内的JVM项目都太喜欢用Maven了，实际上哪怕不考虑其在Android项目的垄断，gradle在国外的许多库也已经成为了主流的构建工具之一，例如SpringFramework和Lsp4j的Github仓库都是用gradle构建的

相比Maven，gradle有很多优势：

- 配置文件简洁，相比xml，groovy这种脚本语言编写的配置文件有很高的信息密度
- 构建性能极高，Gradle支持增量构建和缓存，相比之下，Maven跑一个大型的Java项目可能要构建几个小时...
- 高度灵活的定制化构建，Gradle因为是直接在Task里面写Groovy脚本，你可以像写代码一样去灵活地写构建的逻辑
- 支持项目级别独立管理Gradle本体的版本号，以及项目的仓库源等，这些配置内化到项目里面无疑降低了项目冷启动的成本

当然...Groovy没能取代Maven本质上也是因为灵活这一点：

- 用kotlin/groovy写配置文件导致你不得不去学习这两种语言中的一种，以及groovy自己的接口定义，这些对于很多人都是不愿意付出的学习成本，Maven的构建插件也足够handle大部分项目的需求

总的来说，Maven/Gradle大家普遍认知是各有千秋

- 在一个老登比较多的团队里面，大家不太愿意付出学习成本，加上旧有项目能稳定运行的前提下没必要修改，其实继续用Maven就可以了
- 在新成员、年轻人比较多的团队里面，有技术热情的话多接触一些前沿的技术栈总是好的，除去学习成本外，Gradle相比Maven还是有很多优势

## 下载gradle

和Maven不同的是，gradle并不需要下载一个全局的运行时，而是可以仅在项目级别独立维护gradle的发行版，但是在IDEA使用gradle-wrapper创建gradle项目时，IDEA会自动从官方仓库下载（理所当然会被墙），因此需要修改gradle的下载源

在IDEA初始化gradle项目后，在`./gradle/wrapper/gradle-wrapper.properties`处修改`distributionUrl`字段，修改gradle的下载源

我司的链接为：https\://artifactory.cde.huawei.com/artifactory/gradle-distributions/gradle-8.12.1-bin.zip

- 将gradle的版本号修改为对应的版本即可，bin可以按需修改为all

## build.gradle.kts导致的同步失败问题

如果你是用IDEA新建的gradle项目，那么在同步gradle项目时大概率会报以下错误的同时构建成功：

```
> Task :prepareKotlinBuildScriptModel UP-TO-DATE
Download https://repo.maven.apache.org/maven2/org/sonatype/oss/oss-parent/7/oss-parent-7.pom, took 234 ms
Unexpected exception while resolving Gradle distribution sources: Could not resolve all files for configuration 'detachedConfiguration1'.
org.gradle.api.internal.artifacts.ivyservice.TypedResolveException: Could not resolve all files for configuration 'detachedConfiguration1'.
    at org.gradle.api.internal.artifacts.ResolveExceptionMapper.mapFailure(ResolveExceptionMapper.java:68)
    ...
...
BUILD SUCCESSFUL in 29s
```

可以看到，gradle实际上试图在下载一个Kotlin相关的插件，这个是因为gradle的配置文件（build.gradle）同时支持用`groovy/kotlin`两种语言编写

- 其中groovy除了支持基于Gradle官方库的基本语义分析功能外，还原生支持项目作用域的高阶语义分析，提供联想功能（如版本号、别名等）
- 而kotlin的语义分析要下载一个插件来支持

然而IDEA下载该插件需要gradle，这个gradle的下载链接，以及该插件的下载链接都是硬编码的（理所当然被墙了），所以导致插件安装失败，当然这个只是IDE层面的语义分析支持，实际上并不影响我们正常使用项目内的gradle

然而由于会失去kotlin层面的语义分析功能，所以我们只能老老实实用groovy来写了，想解决这个问题也很简单，把项目里所有的`build.gradle.kts`修改为`build.gradle`即可

详见：https://github.com/gradle/gradle/issues/14889

## gradle配置文件结构

gradle配置文件虽然叫配置文件，但并不像maven那样使用xml这种标记语言编写，而是像写代码一样使用groovy来声明（Groovy是一个风格类似Python的JVM语言）,形如这样：

```groovy
plugins {
    id "java"
    id "org.springframework.boot:3.4.6"
}

group = "com.huawei"
version = "1.0-SNAPSHOT"

dependencies {
    implementation "org.springframework.boot:spring-boot-starter-webflux:3.4.5"
}
```

显而易见，其中`plugins`和`depenencies`分别对应了项目的插件和依赖项，而group和version则是通过字段声明的，和Maven不同的是，plugin不止涉及到构建流程，也涉及到配置文件中的一些接口函数，这点在下文的**JVM插件**中你就能看到了

### Groovy语法

Groovy主要通过两种语法来实现对Gradle的配置：

- 函数接口的调用
- 闭包变量的赋值

#### 函数接口

由于groovy的语法糖，单个参数的函数调用可以不使用括号，实际上`id 'java'`等效于`id('java')`，同样地，下面两句也是等效的

```groovy
implementation "org.springframework.boot:spring-boot-starter-webflux:3.4.5"
implementation("org.springframework.boot:spring-boot-starter-webflux:3.4.5")
```

对于多个参数的函数，groovy也支持具名传参来省略括号，但是这种写法在实际的生产过程中比较少见，例如：

```groovy
implementation group:"org.springframework.boot", name:"spring-boot-starter-webflux", version:"3.4.5"
```

你会发现，plugins和dependencies本身也是函数，这两个函数实际上传了一个闭包（没有参数的lambda）进去，他们实际上等价于：

```groovy
plugins(parameters -> {
    id("java")
    id("org.springframework.boot:3.4.6")
})

dependencies(parameters -> {
    implementation("org.springframework.boot:spring-boot-starter-webflux:3.4.5")
})
```

诸如此类的语法糖大家可以自己探索

#### 闭包赋值

这里先提前剧透一下，当我们在Gradle配置仓库源的时候，大概会写出这样的代码：

```groovy
maven {
    name = "some_repo"
    url = uri("https://xxx/maven/")
    mavenContent {
        releasesOnly()
    }
}
```

初次接触的人可能会好奇，这里为什么能通过给变量赋值来实现配置（以及前文并没有声明过这些变量），本质上是通过**闭包**实现的，真正的作用域其实定义了url这个变量，我们只是覆写了它的值而已

在gradle真正构建的时候，可能是这样的：

```groovy
// 伪代码，并非真实的构建代码
def some_build_function(){
    url = ""
    ... // 加载了你的配置文件
    maven({
        ...
        url = uri("https://xxx/maven/") // 你的配置文件复制的url
        ...
    })
    ...
    download_from_url(url)
}
```

可以看到，在实际代码执行的作用域里，maven是能“看到”诸如name、url这些变量的，gradle的其他字段也是同理，都是通过预定义一些变量，再通过预定义一些闭包函数的接口，让我们来编写这些接口的逻辑来实现配置

### JVM插件

对于Java项目，需要在Plugin中声明JVM插件，即`BaseJavaPlugin`，该基类的实现类有3个id：

- `java`
- `java-library`
- `java-platform`

如上文所说，三种不同的插件分别对应不同的含义，也开放了不同的函数接口

#### java

java插件声明该项目是一个final的Java入口应用，即不会再作为库被其他JVM项目引入，该插件最重要的一点是在`dependencies`中开放且仅开放了`implementation`函数（而没有`api这个接口`）

#### java-library

java-library插件声明该项目是一个可被其他项目引入的库，因此在java的`implementation`的基础上还多了一个`api`的函数

#### java-platform

java-platform插件声明该项目作为其他项目的运行环境，说人话就是版本管理，你可以在该插件里声明一系列依赖库的版本，并作为bom导入到其他项目中（类似Spring的bom）

该插件还会暴露一个`allowDependencies`的函数，该声明会允许该项目继承其他的bom

### 依赖声明

一个项目的dependencies配置可能如下：

```groovy
dependencies {
    implementation "commons-codec:commons-codec"
    api "com.fasterxml.jackson.core:jackson-databind"
    api "org.apache.logging.log4j:log4j-api"
    api "org.apache.logging.log4j:log4j-core"
}
```

和Maven不同的是，Gradle的依赖是直接使用一个字符串声明的，使用诸如`group:name:version`的格式来声明

此外，如上文所说，`implementation`和`api`也有`<Group,Name,Version>`三个字符串参数版本的重载，例如：

```groovy
implementation group:"org.springframework.boot", name:"spring-boot-starter-webflux", version:"3.4.5"
```

这里展开讲讲api和implementation这两个接口的区别：

- implementation表示该依赖仅在项目内部使用，因此依赖的库不会被暴露给更上层的依赖方，拿这个项目举例子，该项目A引入了codec库，因此可以在项目A的代码里使用该库，但是如果项目A又被另一个项目B引入了，项目B是无法使用codec的
- api表示该依赖还需要暴露给上层的依赖方，拿这个项目举例子，项目A引入了jackson和log4j这两个库，那么如果项目B依赖了项目A的话，项目B也能使用jackso和log4j这两个库

你会发现相比Maven无脑透传依赖的逻辑，groovy对于依赖的作用域是更严格的

### 导入其他gradle脚本

Gradle的配置文件也是支持解耦然后导入的，你可以在根目录的`gradle`（一般习惯放在这里）写其他的gradle文件，比如这种版本管理的Map定义，然后再用`apply from`函数来导入进来

例如这样：

```groovy
apply from: "${rootDir}/gradle/versions.gradle" // rootDir是预定义的宏，不需要自己定义

dependencies {
        api "io.projectreactor:reactor-core:${dependencyVersions.reactor}"
        api "com.baomidou:mybatis-plus-spring-boot3-starter:${dependencyVersions.mybatisPlus}"
        ...
}
```

而`${rootDir}/gradle/versions.gradle`这个文件则是这样的:

```groovy
ext.dependencyVersions = [
        springBoot: "3.4.5",
        jackson    : "2.19.1",
        reactor    : "3.6.9",
        ...
]
```

## gradle父工程配置文件

把基本的配置文件看了个大概，你应该对gradle的配置文件有了一个大概的了解，我们现在可以来看一看父工程如何配置了

要注意的是，父工程（也就是根目录下）分为两个配置文件：`build.gradle`和`settings.gradle`，其中`build.gradle`和子项目一样，只是它负责的是整个父工程层面的构建配置

`settings.gradle`才是这一章的重心，它配置了整个项目的一些元数据，例如仓库、子项目管理等等

### 子项目管理

`settings.gradle`有一个`rootProject.name`声明父工程的工件名，同时通过`include`函数声明子工程

```groovy
rootProject.name = "xxx"

include "xxx-core"
include "xxx-fs"
include "xxx-webflux"
include "xxx-bom"
```

此外，include也有一个接受字符串数组的重载，所以你也可以这么写：

```groovy
rootProject.name = "xxx"

include(
    "xxx-core",
    "xxx-fs",
    "xxx-webflux",
    "xxx-bom"
)
```

一般来说还是第一种写法常用一些

和常规依赖不同的是，在引入子项目依赖的时候，要额外包上一层`project`函数，同时依赖声明前面要额外加一个冒号，例如`implementation project(":xxx-core")`

### 仓库换源

仓库源是在`dependencyResolutionManagement->repositories`这个闭包下声明的， 每个`maven`函数是一个依赖声明，其中url通过字段来声明，例如：

```groovy
dependencyResolutionManagement {
    repositories {
        maven {
            name = "some_repo"
            url = uri("https://xxx/maven/")
            mavenContent {
                releasesOnly()
            }
        }
        maven {
            name = "some_snapshot_repo"
            url = uri("https://xxx/snapshot")
            mavenContent {
                snapshotsOnly()
            }
        }
    }
}
```

可以看到，你也可以通过`mavenContent`来配置仓库源是用于`release`还是`snapshot`

### 插件换源

gradle的插件的仓库源和版本管理是独立管理的（是的...你不能在bom里对插件版本进行管理，plugin相关配置还必须声明在配置文件的最上面），像这样：

```groovy
pluginManagement {
    apply from: "${rootDir}/gradle/versions.gradle" //导入版本号

    repositories {
        // 插件仓库换源
        maven { url = uri("https://xxx/maven/") }
    }

    plugins {
        // 版本管理
        id "org.springframework.boot" version "${pluginVersions.springBoot}" apply false
    }
}
```

此外，你还会注意到，在对plugins进行版本管理的时候，后面多了一段`apply false`，这一段的含义是不要立刻加载该插件，而是懒加载（因为父工程只负责版本控制，不需要即刻加载插件）

## 版本管理

### bom

看到java-platform相信你已经猜到了，gradle版本管理的其中一个方式就是定义bom，一个java-platform的配置文件可能是这样的

```groovy
plugins {
    id 'java-platform'
}

javaPlatform {
    allowDependencies() // 允许引入别的 BOM
}

apply from: "${rootDir}/gradle/versions.gradle"

dependencies {
    // 继承 Spring Boot 官方BOM
    api platform("org.springframework.boot:spring-boot-dependencies:${dependencyVersions.springBoot}")
    // 继承 Jackson BOM
    api platform("com.fasterxml.jackson:jackson-bom:${dependencyVersions.jackson}")

    constraints {
        api "io.projectreactor:reactor-core:${dependencyVersions.reactor}"
        ...
    }
}
```

bom可以直接像其他依赖库那样在dependencies里引入，但是要包一层`platform`函数，比如正常引入某个依赖库是`api('xxx')`，引入bom则应该是`api(platform('xxx'))`

然后你就可以在其他的子项目导入该bom，要注意的是，和导入platform一样，导入子项目也需要额外包在`project`这个函数下面（父工程一章已经提过），因此如果你要导入子项目的bom，最终写出来的可能是这样

```groovy
plugins {
    id "java-library"
}

version = "1.0-SNAPSHOT"

dependencies {
    api platform(project(":xxx-bom")) // 导入子项目定义的bom
    api "org.springframework:spring-context" // bom已经定义了版本号，不需要再写了
}
```

### catalog

另外一种管理版本的方式是在`settings.gradle`里定义catalog

```groovy
dependencyResolutionManagement {
    versionCatalogs {
        create("libs"){
            plugin("springboot", "org.springframework.boot").version("3.4.5")
            library("refactor","io.projectreactor","reactor-core").version("3.6.9")
            library("mybatis.plus","com.baomidou","mybatis-plus-spring-boot3-starter").version("3.5.10.1") // 注意alias不能包含-符号
        }
    }
}
```

然后在`build.gradle`里使用`alias`函数引用脚本，库则可以直接引用

```groovy
plugins {
    alias(libs.plugins.springboot)
}

dependencies {
    implementation(libs.refactor)
    implementation(libs.mybatis.plus)
}
```