---
tittle:我的SpringBlog部署历程
---
# 我的SpringBlog部署历程
## 工程创建
采用了maven构建，在项目下创建多个子模块的方式，实现了代码的解耦合
```
SpringBlog47
├─ blog-framework   //公共依赖模块
│  ├─ src
│  │  └─ ...
│  └─ pom.xml       
├─ blog-web         //后台系统
│  ├─ src
│  │  └─ ...
│  └─ pom.xml       
├─ blog-admin       //前台系统
│  ├─ src
│  │  └─ ...
│  └─ pom.xml       
└─ pom.json         //maven配置文件
```
在SpringBlog父项下的pom.xml通过`<dependencyManagement>`进行版本管理
```XML
<dependencyManagement>
    <dependencies>
        <!--SpringBoot依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>3.0.4</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>   
        ...
    </dependencies>
</dependencyManagement>
```

## 数据库