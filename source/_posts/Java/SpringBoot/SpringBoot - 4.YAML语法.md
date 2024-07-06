---
title: SpringBoot - 4.YAML语法
date: 1919/08/10
categories:
  - Java
  - SpringBoot
---
## 约定
- k: v 表示键值对关系，**冒号后面必须有一个空格**
- 使用空格的缩进（且只支持空格，不支持Tab缩进）表示层级关系，空格数目不重要，**只要是左对齐的一列数据，都是同一个层级的**
- 大小写敏感
- java中对于驼峰命名法，可用原名或使用-代替驼峰，如java中的lastName属性,在yml中使用lastName或 last-name都可正确映射。
- yml中注释前面要加#

## 键值对
YAML采用**Key: Value**的键值关系存储数据，并支持一系列数据格式

### 字符串
字符串可以用双引号或单引号(也可以什么都不加)进行声明
- 使用双引号时，转义字符会产生效果
- 使用单引号时，会自动对转义字符进行转义，使其打印为常规字符

```
userName: talloran
userName: 'talloran'
userName: "talloran"
```

### 日期
```
date: 2019/01/01
```

### 对象
通过缩进表示键值对的所属关系
```
student:
  name: zhangsan
  age: 20
```

此外也可以通过{}进行单行声明
```
student: {name: zhangsan,age: 20}
```

### 集合
对于集合（List、Set等）可以用-进行标识
```
pets:
  - dog
  - pig
  - cat
```

和对象相同，也可以通过{}进行单行生命
```
pets: [dog,pig,cat]
```

此外集合也可以用于存储对象
```
students:
 - name: zhangsan
   age: 22
 - name: lisi
   age: 20
 - {name: wangwu,age: 18}
```

## 占位符赋值
```
server:
  port: ${myPort:88}

myPort: 80   
```