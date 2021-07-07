---
formatterOff: "@formatter:off"
title: Spring MVC 处理器拦截器
subtitle: handler-interceptor 
summary: Spring MVC 处理器拦截器 
typed: [
    HandlerInterceptor.,
    AsyncHandlerInterceptor.
]
categories: [springmvc]
tags: [spring,web] 
banner: https://images.unsplash.com/photo-1501139083538-0139583c060f
date: 2021-03-24 22:06:21 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# HandlerInterceptor

## 简介（What）

`HandlerInterceptor`是Spring提供的用于拦截处理器`handler`（如`HandlerMethod`）的扩展接口，类似于Servlet的过滤器(`Filter`)，是Spring MVC的核心组件之一。

## 定义（Definition）

Spring提供了`HandlerInterceptor`及其支持异步的扩展`AsyncHandlerInterceptor`两个处理器拦截器接口，其定义分别如下：

* HandlerInterceptor

```java
package org.springframework.web.servlet;

public interface HandlerInterceptor {

    default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
        throws Exception {
        return true;
    }

    default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
        @Nullable ModelAndView modelAndView) throws Exception {
    }

    default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
        @Nullable Exception ex) throws Exception {
    }

}
```

* AsyncHandlerInterceptor

```java
package org.springframework.web.servlet;

public interface AsyncHandlerInterceptor extends HandlerInterceptor {

    default void afterConcurrentHandlingStarted(HttpServletRequest request, HttpServletResponse response,
        Object handler) throws Exception {
    }

}
```

## 用法（Usage）

如何实现一个自定义处理器拦截器呢？

### 自定义（Customizer）

首先，定义一个实现了`HandlerInterceptor`接口的类：

```java
package org.ifinalframework.web.interceptor;

public class TraceHandlerInterceptor implements AsyncHandlerInterceptor {

    private static final String TRACE = "trace";

    @Setter
    private TraceGenerator generator = new UuidTraceGenerator();

    @Override
    public boolean preHandle(final @NonNull HttpServletRequest request, final @NonNull HttpServletResponse response,
        final @NonNull Object handler) {
        // 向MDC注入trace变量
        MDC.put(TRACE, UUID.randomUUID().toString());
        return true;
    }

}

```

### 注册（Registration）

其次，将`HandlerInterceptor`注册到Spring MVC中，有多种注册方式：

* WebMvcConfigurationSupport

通过继承`WebMvcConfigurationSupport`并重写`addInterceptors(InterceptorRegistry)`方法来注入拦截器：

```java
package org.ifinalframework.web.config

public class MyWebMvcConfiguration extends WebMvcConfigurationSupport {

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new TraceHandlerInterceptor());
    }

}
```

> 继承`WebMvcConfigurationSupport`导致Spring Boot
> MVC自动配置失效的原因是`WebMvcAutoConfiguration`配置类的配置条件有`@ConditionalOnMissingBean({WebMvcConfigurationSupport.class})`。

* WebMvcConfigurer

实现`WebMvcConfigurer`，推荐使用。

```java
package org.ifinalframework.web.config;

@Slf4j
@Component
@SuppressWarnings("unused")
public class HandlerInterceptorWebMvcConfigurer implements WebMvcConfigurer {

    @Override
    public void addInterceptors(final @NonNull InterceptorRegistry registry) {
        registry.addInterceptor(new TraceHandlerInterceptor());

    }

}
```

> `WebMvcConfigurer`有一个过期的抽象实现类`WebMvcConfigurerAdapter`，该类在Spring 5.0 之前主要的使用方式（Java 7不支持默认方法），在此之后，已被标记`@Deprecated`。

## 进阶 (Advance)

刚刚介绍了Spring中自定义拦截器的几种注册方式，但这种方式存在一个极其不友好的缺点——**每个自定义的拦截器都必须显式的声明注册。**

那么有一种方式可以让Spring自动发现`HandlerInterceptor`并注册，且满足以下规则：

1. 自动发现Spring容器中所有的`HandlerInterceptor`实例
2. 排除未被`@Component`标记的实例（通过`xml`方式声明的实例不需要再次注册）
3. 使用注解配置要拦截规则
4. 支持排序

还好，Spring提供了丰富的功能可以实现上述要求：

首先，通过Spring提供的API获取到所有的`HandlerInterceptor`实例，可通过以下方式中的任何一种：

* BeanFactoryUtils

```java
BeanFactoryUtils.beansOfTypeIncludingAncestors(ListableBeanFactory,Class<T>)
```

* ObjectProvider

```java
ApplicationContext.getBeanProvider(Class<T>,boolean)
```

其次，找出被`@Component`标记的实例：

```java
AnnotatedElementUtils.isAnnotated(AopUtils.getTargetClass(handlerInterceptor),Component.class);
```

然后，通过`WebMvcConfigurer`的`addInterceptors(InterceptorRegistry)`进行注册：

```java
registry.addInterceptor(interceptor)
```

接着，如果有被`@Order`注解标记，则设置`setOrder(order)`:

```java
    final Order order=AnnotationUtils.getAnnotation(targetClass,Order.class);
    if(order!=null){
    interceptorRegistration.order(order.value());
    }
```

如果有被可描述拦截规则的自定义注解，则配置其拦截规则：

```java
    final Interceptor annotation = AnnotationUtils.getAnnotation(targetClass, Interceptor.class);
    InterceptorRegistration interceptorRegistration = registry.addInterceptor(interceptor);
    if (annotation != null) {
        if (annotation.includes().length > 0) {
            interceptorRegistration.addPathPatterns(annotation.includes());
        }
        if (annotation.excludes().length > 0) {
            interceptorRegistration.excludePathPatterns(annotation.excludes());
        }
    }
```

至此，一个可以自动发现并注册拦截器的Spring扩展就实现了。

上述源码请移步开源项目[final-framework](https://github.com/final-projects/final-framework)查看类`HandlerInterceptorWebMvcConfigurer`。

## 结语（End）

本文简述了Spring MVC 的核心组件之一——处理器拦截器`HandlerInterceptor`的基本功能，及自定义和注册方式，并对Spring自动发现与注册提出设想，进一步提升开发效率。





