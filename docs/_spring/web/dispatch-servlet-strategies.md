---
formatterOff: "@formatter:off"
title: Spring MVC DispatchServlet 九大策略
subtitle: strategies 
summary: Spring MVC DispatchServlet 九大策略
typed:
  - MultiPartResolver.
  - LocaleResolver.
  - ThemeResolver.
  - HandlerMapping.
  - HandlerAdapter.
  - HandlerExceptionResolver.
  - RequestToViewNameTranslator.
  - ViewResolver.
  - FlashMapManager.
banner: https://images.unsplash.com/photo-1508739773434-c26b3d09e071
categories: [springmvc,ssm]
tags: [springmvc,ssm] 
date: 2021-04-30 12:11:14 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# 九大策略

## What

想必了解过Spring MVC源码的同学一定听说过或者看到过说Spring MVC有**九大组件**，不知大家是否与我有过类似有疑问🤔️，为什么不是*十大*或者*八大*呢？

这是因为在`DispatcherServlet`的`onRefresh()`方法中，通过调用`initStrategies()`方法初始化了`Servlet`中使用到的"九大组件"：

```java
    @Override
protected void onRefresh(ApplicationContext context){
    initStrategies(context);
    }

/**
 * Initialize the strategy objects that this servlet uses.
 * <p>May be overridden in subclasses in order to initialize further strategy objects.
 */
protected void initStrategies(ApplicationContext context){
    initMultipartResolver(context);
    initLocaleResolver(context);
    initThemeResolver(context);
    initHandlerMappings(context);
    initHandlerAdapters(context);
    initHandlerExceptionResolvers(context);
    initRequestToViewNameTranslator(context);
    initViewResolvers(context);
    initFlashMapManager(context);
    }
```

这里，要特别声明一下，不知**组件**这个名字是从何时开始的，从源码及所谓"组件"的功能出发，本人更愿意称之为"策略"，而其本身也正是在不同的场景下使用不同的方式处理的。

## Strategies

### MultipartResolver

这个相信所有的小伙伴都再熟悉不过了吧，对，这个就是用来解析文件上传的，正是有了它，我们才可以在Spring中如此简单地实现文件上传功能。

### LocaleResolver

这个相信也有相当一部分小伙伴知道，这个就是来处理国际化（`i18n`）的，用于从请求(`HttpServletRequest`)中解析`Locale`。

下面是`LocaleResolver`的接口定义：

```java
package org.springframework.web.servlet;

public interface LocaleResolver {

    Locale resolveLocale(HttpServletRequest request);

    void setLocale(HttpServletRequest request, @Nullable HttpServletResponse response, @Nullable Locale locale);

}
```

常用的实现有：

* CookieLocaleResolver：从Cookie中解析Locale；
* AcceptHeaderLocaleResolver：从Header中解析Locale；
* SessionLocaleResolver：从Session中解析Locale。

### ThemeResolver

与`LocaleResolver`类似，`ThemeResolver`主要用于从请求中解析主题（`Theme`），但在大前端及前后端分离的技术趋势下，这里就不再过多的赘述了。

```java
package org.springframework.web.servlet;

public interface ThemeResolver {

    String resolveThemeName(HttpServletRequest request);

    void setThemeName(HttpServletRequest request, @Nullable HttpServletResponse response, @Nullable String themeName);

}
```

### HandlerMapping

`HandlerMapping`是根据请求找到对应的处理器(`HandlerMethod`)和拦截器(`HandlerIntercetor`)，如声明在`Controller`中被`@RequestMapping
`标记的方法，所有的处理器都会被包装在一个HandlerExecutionChain实例中。

以下是`HandlerMapping`接口的声明：

```java
package org.springframework.web.servlet;

public interface HandlerMapping {

    default boolean usesPathPatterns() {
        return false;
    }

    @Nullable
    HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception;

}
```

### HandlerAdapter

### HandlerExceptionResolver

`HandlerExceptionResolver`是Spring MVC中的异常处理策略，将`HandlerMethod`抛出的异常(`Exception`)
转换成一个视图`ModelAndView`，然后再交予`ViewResolver`处理，因此，`HandlerExceptionResolver`只能处理视图渲染前的异常，
在视图沉浸过程中的异常是无法处理的。

下面是`HandlerExceptionResolver`的源码接口定义：

```java
package org.springframework.web.servlet;

public interface HandlerExceptionResolver {

	ModelAndView resolveException(
			HttpServletRequest request, HttpServletResponse response, @Nullable Object handler, Exception ex);

}
```

### RequestToViewNameTranslator

### ViewResolver(视图解析器)

`ViewResolver`的作用是将`String`类型的逻辑视图根据`local`解析为`View`视图的。

下面是`ViewResolver`的源码接口定义：

```java
package org.springframework.web.servlet;

public interface ViewResolver {

    @Nullable
    View resolveViewName(String viewName, Locale locale) throws Exception;

}
```

### FlashMapManager