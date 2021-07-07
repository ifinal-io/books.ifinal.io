---
formatterOff: "@formatter:off"
title: 'SpringApplication是如何创建应用上下文的'
subtitle: spring-application-context 
summary: Spring应用上下文创建流程
tags: [spring,spring-boot] 
date: 2021-03-26 09:55:06 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# SpringApplicationContext



## 简介（What）

在使用Spring Boot的时候，都知道通过`SpringApplication.run(MyApplicaton)`即可创建一个Spring应用，但是大家有没有注意这个方法的返回值呢？

```java
    public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
        return run(new Class<?>[] { primarySource }, args);
    }
```

`run()`方法返回了一个`ConfigurableApplicationContext`的实例，那么这个实例是如何被创建的呢，创建的又是哪个对象的实例呢？

## 目标（Target）

本文将通过源码的方式，来解决以下问题：

* SpringApplication是如何创建`ConfigurableApplicationContext`的对象实例的？
* SpringApplication创建的`ConfigurableApplicationContext`的对象实例是哪个对象的？

> **对象**指是的`Class`，**对象实例**指的是`Object`。

## 原理（How）

在SpringApplication的构造方法中，有这么一行代码：

```java
this.webApplicationType = WebApplicationType.deduceFromClasspath();
```

在SpringApplication的实例`run()`方法中，有如下的方法的调用:

```java
context = createApplicationContext();
```

在`createApplicationContext()`方法，又调用了`applicationContextFactory.create()`方法：

```java
protected ConfigurableApplicationContext createApplicationContext() {
    return this.applicationContextFactory.create(this.webApplicationType);
}
```

`applicationContextFactory`成员变量定义如下:

```java
private ApplicationContextFactory applicationContextFactory = ApplicationContextFactory.DEFAULT;
```

### WebApplicationType

`WebApplicationType`枚举定义了Spring Application的类型，有`NONE`、`SERVLET`和`REACTIVE`三种。

在`deduceFromClasspath（）`方法中，使用工具方法`ClassUtils.isPresent(className)`来判断特定的类是否存在，从而推断将要实例的应用类型：

```java
    static WebApplicationType deduceFromClasspath() {
        if (ClassUtils.isPresent(WEBFLUX_INDICATOR_CLASS, null) && !ClassUtils.isPresent(WEBMVC_INDICATOR_CLASS, null)
                && !ClassUtils.isPresent(JERSEY_INDICATOR_CLASS, null)) {
            return WebApplicationType.REACTIVE;
        }
        for (String className : SERVLET_INDICATOR_CLASSES) {
            if (!ClassUtils.isPresent(className, null)) {
                return WebApplicationType.NONE;
            }
        }
        return WebApplicationType.SERVLET;
    }
```

* 当且仅当`org.springframework.web.reactive.DispatcherHandler`类存在时，类型为`REACTIVE`；
* 当`javax.servlet.Servlet`或`org.springframework.web.context.ConfigurableWebApplicationContext`任一不存在时，类型为`NONE`；
* 类型为`SERVLET`。

### ApplicationContextFactory.DEFAULT

在`ApplicationContextFactory`的默认实现`DEFAULT`中，根据`WebApplicationType`的类型，创建对应的`ConfigurableApplicationContext`实例：

```java
switch (webApplicationType) {
case SERVLET:
    return new AnnotationConfigServletWebServerApplicationContext();
case REACTIVE:
    return new AnnotationConfigReactiveWebServerApplicationContext();
default:
    return new AnnotationConfigApplicationContext();
}
```

更多`ApplicationContextFactory`请查看[应用上下文工厂](application-context-factory.md)。

