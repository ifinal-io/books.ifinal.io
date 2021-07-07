---
formatterOff: "@formatter:off"
title: 'ApplicationContextFactory'
subtitle: application-context-factory 
summary: 创建应用上下文的策略工厂
tags: [spring,spring-boot] 
date: 2021-03-25 13:24:51 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# ApplicationContextFactory

## 简介（What）

`ApplicationContextFactory`是Spring Boot从2.4.0引入的供`SpringApplication`使用用于创建`ConfigurableApplicationContext`的策略工厂接口。

## 定义（Definition）

`ApplicationContextFactory`接口定义了一个根据Web应用类型（`WebApplicationType`）创建`ConfigurableApplicationContext`的方法，其定义如下：

```java
package org.springframework.boot;

@FunctionalInterface
public interface ApplicationContextFactory {

    ConfigurableApplicationContext create(WebApplicationType webApplicationType);

}
```

## 功能（Feature）

除了上述的接口方法，`ApplicationContextFactory`还提供了两个可以直接使用的静态方法和一个默认的实现：

* `ofContextClass()`：该方法通过`BeanUtils.instantiateClass()`方法创建给定类型`ConfigurableApplicationContext`的一个实例；

```java
    static ApplicationContextFactory ofContextClass(Class<? extends ConfigurableApplicationContext> contextClass) {
        return of(() -> BeanUtils.instantiateClass(contextClass));
    }
```

* `of(Supplier)`: 该方法是对Java 8流式编程的支持。

```java
    static ApplicationContextFactory of(Supplier<ConfigurableApplicationContext> supplier) {
        return (webApplicationType) -> supplier.get();
    }
```

* `DEFAULT`实现根据`WebApplicationType`的类型创建不同的`ConfigurableApplicationContext`实例，基对应关系如下：

| WebApplicationType |            ConfigurableApplicationContext             |
| :----------------: | :---------------------------------------------------: |
|     `SERVLET`      | `AnnotationConfigServletWebServerApplicationContext`  |
|     `REACTIVE`     | `AnnotationConfigReactiveWebServerApplicationContext` |
|     `default`      |         `AnnotationConfigApplicationContext`          |

```java
    ApplicationContextFactory DEFAULT = (webApplicationType) -> {
        try {
            switch (webApplicationType) {
                case SERVLET:
                    return new AnnotationConfigServletWebServerApplicationContext();
                case REACTIVE:
                    return new AnnotationConfigReactiveWebServerApplicationContext();
                default:
                    return new AnnotationConfigApplicationContext();
            }
        } catch (Exception ex) {
            throw new IllegalStateException("Unable create a default ApplicationContext instance, "
                + "you may need a custom ApplicationContextFactory", ex);
        }
    };
```

