---
formatterOff: "@formatter:off"
title: '@SpringBootApplication'
subtitle: '@SpringBootApplication'
summary: '一个用于标记SpringApplication启动类的注解'
typed: 
    - '@Configuration.'
    - '@EnableAutoConfiguration.'
    - '@ComponentScan.'
category: [springboot]
tags: [springboot] 
date: 2021-03-25 10:58:55 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# SpringBootApplication

## 概述（Overview）

**`@SpringBootApplication`，一个用于标记`SpringApplication`启动类的注解。**

## 简介（What）

使用一个被`@SpringBootApplication`标记的启动类，可以快速构建一个`SpringApplication`应用。

```java
package org.ifinalframework.example

@SpringBootApplication
public class FinalApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinalApplication.class,args);
    }
}
```

就这样，一个基于Spring Boot的应用程序就构建好了，而且，在这个应用中，还可以

* 在启动类中使用`@Bean`；
* 自动注入被标记的组件
* 自动发现（自动装配）引入的各种组件(`spring-boot-starter-*`)；
* ……

## 原理（Why）

在解释上述疑问之前，先查看一下`@SpringBootApplication`的定义：

### @SpringBootApplication

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

从源码中，可以发现，`@SpringBootApplicaiton`被以下注解标记：

* `@SpringBootConfiguration`
* `@EnableAutoConfiguration`
* `@ComponentScan`

### @SpringBootConfiguration

再查看`@SpringBootConfiguration`的定义：

```java
package org.springframework.boot;

@Configuration
@Indexed
public @interface SpringBootConfiguration {

	@AliasFor(annotation = Configuration.class)
	boolean proxyBeanMethods() default true;

}
```

在源码中，可以发现，其又被`@Configuration`注解标记。

### @Configuration

`@Configuration`注解结合`@Bean`注解，可以通过Java方法的方式来声明Spring Bean，而被`@SpringBootApplication`标记的启动类，根据Spring注解的传递性，可以看做启动类也被`@Configuration`标记了，因此可以直接在启动类中使用`@Bean`来流入Spring Bean。

### @EnableAutoConfiguration

`@EnableAutoConfiguration`是Spring Boot自动装配的入口，用于加载声明在`META-INF/spring.factories`文件中`key`为以下值的扩展组件。

```properties
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration
```

Spring Boot的各种组件（`spring-boot-starter-*`）或自定义组件都可以通过该方式进行扩展。

> 在Spring Boot `1.2`之前，需要显示声明`@EnableAutoConfiguration`才可以启用启动装配功能。

### @ComponentScan

`@ComponentScan`是Spring的组件扫描配置，可以扫描并加载指定包路径下的Spring组件，如果未指定，则扫描被标记类所在的包。

一个Spring Boot应用的包层级结构示例：

```text
.
├── entity
│   ├── FinalEntity.java
├── dao 
│   ├── FinalDao.java
├── service 
│   ├── FinalService.java
├── FinalApplication.java
```

> Spring Boot 的启动类所在的包应能够覆盖所有业务模块，否则可能会出现组件找不到或组件未加载的问题。

## 小结

`@SpringBootApplication`是一个用于标记Spring Boot应用启动类的注解，被标记的类其可以声明一个或多个**`@Bean`方法**， 同时触发**自动装配`@EnableAutoConfiguration`**和**组件扫描`@ComponentScan`**。

我说清楚了没！