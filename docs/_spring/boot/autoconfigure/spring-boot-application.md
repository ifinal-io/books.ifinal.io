---
formatterOff: "@formatter:off"
title: '@SpringBootApplication'
subtitle: spring-boot-application 
summary: spring-boot-application 
tags: [] 
date: 2021-03-25 10:58:55 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# SpringBootApplication

## What

`@SpringBootApplication`注释用于标记一个类为配置类，其可以声明一个或多个**`@Bean`方法**， 
同时触发**自动装配`@EnableAutoConfiguration`**和**组件扫描`@ComponentScan`**。

这是一个方便使用的**注释（@Annotation）**，相当于同时声明了`@Configuration`、`@EnableAutoConfiguration`和`@ComponentScan`注释。

## Definition

```java
package org.springframework.boot.autoconfigure;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {

}
```