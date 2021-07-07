---
formatterOff: "@formatter:off"
title: WebMvcAutoConfiguration
subtitle: web-mvc-auto-configuration 
summary: web-mvc-auto-configuration 
tags: [] 
date: 2021-03-24 13:42:32 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# WebMvcAutoConfiguration

## What

`WebMvcAutoConfiguration`类是Spring Web Mvc自动配置的入口，实现了MVC核心对象的初始化。

## When

`WebMvcAutoConfiguration`类是何时被Spring Boot加载的呢？

首先，查看`spring-boot-autoconfigure`组件下的`META-INF/spring.factories`文件，发现有如下配置：

```properties
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
  org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration
```

至此，可以知道其是通过Spring Boot 的`@EnableAutoConfiguration`扩展机制加载并解析的。


