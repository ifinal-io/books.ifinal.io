---
formatterOff: "@formatter:off"
title: Annotaiton 
subtitle: index 
summary: index 
tags: [spring,ioc] 
date: 2021-03-04 14:24:53 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# Annotation

Spring 提供了大量的**注解**`@Annotation`以供开发者使用：

* 用`@Component`及其扩展`@Service`、`@Controller`等替代`<bean>`，标记一个类为组件类;
* 用于替代`<context:component-scan>`配置完成组件扫描的`@ComponentScan`;
* ……

这些配置极大地简化了程序开发及配置，也为Spring Boot的自动配置提供了技术基础。

