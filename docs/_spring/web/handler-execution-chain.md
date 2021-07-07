---
formatterOff: "@formatter:off"
title: Spring MVC 处理器执行链
subtitle: handler-execution-chain 
summary: Spring MVC 处理器执行链
typed:
  - HandlerExecutionChain.
banner: https://images.unsplash.com/photo-1505832018823-50331d70d237
categories: [springmvc,ssm]
tags: [springmvc,ssm] 
date: 2021-05-18 20:07:37 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# HandlerExecutionChain

## What

`HandlerExecutionChain`是Spring MVC中用来封装处理器（如`HandlerMethod`)对象和处理器拦截器(`HandlerInterceptor`)对象的，
每一个处理器对象(`Handler`)都可以有多个拦截器进行拦截，两者共同组成了一条请求执行链。