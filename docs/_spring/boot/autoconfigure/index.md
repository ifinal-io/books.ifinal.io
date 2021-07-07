---
formatterOff: "@formatter:off"
title: 自动装配 
subtitle: index 
summary: 约定大于配置 
tags: [spring,spring-boot,autoconfigure] 
date: 2021-03-04 20:33:45 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# AutoConfigure

Spring Boot 提供了大量开箱即用的组件（`spring-boot-starter-*`），这些组件使用起来相当简单：

1. 引入对应的依赖
2. 进行简单的配置（甚至不需要配置）

然后就可以使用组件提供的功能了。

那么，这些组件是如何被Spring容器加载的呢？有人可能会说：“Spring Boot 本来就是Spring的项目，当然可以被Spring加载了”。这句话听上去好像没有什么不对的，但是，实际上并不是这样的。

Spring Boot 开箱即用的特性要归功于Spring强大的可扩展性。

