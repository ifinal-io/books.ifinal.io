---
formatterOff: "@formatter:off"
title: Jdbc3主键生成器 
subtitle: use-generated-keys 
summary: Jdbc3主键生成器
categories: [mybatis]
tags: []
date: 2021-08-13 17:16:45 +800 
version: 1.0 
formatterOn: "@formatter:on"
---

# Jdbc3主键生成器

在`mybatis`中，想要插入数据时获取到数据库的自增主键，需要开启`useGeneratedKeys`功能，并指定`keyProperty`和`keyColumn`。

## 用法

* xml

```xml
<insert id="insert" useGeneratedKeys="true" keyProperty="id" keyColumn="id">
    INSERT INTO {table} (column1,column2) values (value1,value2)
</insert>
```

* java

```java
@Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
int insert(Object data)
```

其中`useGeneratedKeys`用于标识是否启用获取主键功能，`keyProperty`用于指定java对象属性，`keyColumn`用于指定数据库列名。

**注意：**

当在`Mapper`使用了`@Param`指定了参数的名称时，`keyProperty`的值应为**`参数名+属性名`**，如：

```java
@Options(useGeneratedKeys = true, keyProperty = "data.id", keyColumn = "id")
int insert(@Param("data") Object data)
```

当使用了`List`进行批量插入用`@Param`指定参数名时，参数的名称必须为`list`，即：

```java
@Options(useGeneratedKeys = true, keyProperty = "list.id", keyColumn = "id")
int insert(@Param("list") List<Object> list);
```

不支持使用`Map<String,Object>`的方式进行主键获取，如：

```java
@Options(useGeneratedKeys = true, keyProperty = "list.id", keyColumn = "id")
int insert(Map<String, Object> params);
```

> 使用`Map`对参数进行包装，其中包含要插入的数据表`table`和数据集`list`参数。

## 原理

在`KeyGenerator`的实现类`Jdbc3KeyGenerator`方法`assignKeys`中：

```java
  private void assignKeys(Configuration configuration, ResultSet rs, ResultSetMetaData rsmd, String[] keyProperties,
      Object parameter) throws SQLException {
    if (parameter instanceof ParamMap || parameter instanceof StrictMap) {
      // Multi-param or single param with @Param
      // 参数被 @Param 标记  
      assignKeysToParamMap(configuration, rs, rsmd, keyProperties, (Map<String, ?>) parameter);
    } else if (parameter instanceof ArrayList && !((ArrayList<?>) parameter).isEmpty()
        && ((ArrayList<?>) parameter).get(0) instanceof ParamMap) {
      // Multi-param or single param with @Param in batch operation
      // 参数被 @Param 标记，批量操作  
      assignKeysToParamMapList(configuration, rs, rsmd, keyProperties, (ArrayList<ParamMap<?>>) parameter);
    } else {
      // Single param without @Param
      // 单个参数且没有 @Param 标记  
      assignKeysToParam(configuration, rs, rsmd, keyProperties, parameter);
    }
  }
```