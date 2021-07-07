---
formatterOff: "@formatter:off"
title: '@ExceptionHandler' 
subtitle: exception-handler 
summary: Spring MVC 异常处理体系之异常处理器 
tags: [springmvc] 
date: 2021-04-30 11:16:20 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# @ExceptionHandler

## What

`@ExceptionHandler`注解可以和注解`@RestControllerAdvice`(或`@ControllerAdvice`)组合使用，构建Spring MVC架构中全局异常处理机制。

```java
package org.springframework.web.bind.annotation;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ExceptionHandler {

	Class<? extends Throwable>[] value() default {};

}
```