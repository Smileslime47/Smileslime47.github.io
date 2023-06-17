# SpringMVC简介
## SpringMVC
SpringMVC（SpringWeb）是一个Spring体系下的基于MVC模型的**Web开发框架**。MVC模型即：**Model、Viewer、Controller**，SpringMVC支持以MVC和RESTful的设计风格设计web层应用，并与前端进行数据交互。

## 配置
由于SpringMVC是基于Tomcat容器进行部署的，在pom.xml上除了引入必要的依赖外，还需要对Tomcat进行一些配置
```XML
 <dependencies>
        <!-- servlet依赖 -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.1.0</version>
            <scope>provided</scope>
        </dependency>
        <!--jsp依赖 -->
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>jsp-api</artifactId>
            <version>2.1</version>
            <scope>provided</scope>
        </dependency>
        <!--SpringMVC的依赖-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.1.9.RELEASE</version>
        </dependency>

        <!-- jackson，帮助进行json转换-->
        <!--在SpringBoot中默认也是基于jackson进行json解析的-->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.9.0</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.tomcat.maven</groupId>
                <artifactId>tomcat7-maven-plugin</artifactId>
                <version>2.2</version>
                <configuration>
                    <!--端口-->
                    <port>81</port>
                    <!--项目路径-->
                    <path>/</path>
                    <!--解决get请求中文乱码-->
                    <uriEncoding>utf-8</uriEncoding>
                </configuration>
            </plugin>
        </plugins>
    </build>
```
此外，还需要在pom的项目信息下添加标签`<packaging>war</packaging>`指定打包格式为war

## 添加web模块
在**项目结构 -> 模块 -> + -> Web**添加一个Webapp模块，同时需要修改路径将模块放在src\main路径下