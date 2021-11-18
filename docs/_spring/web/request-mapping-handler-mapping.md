---
formatterOff: "@formatter:off"
title: Spring是如何解析被@RequestMapping注解标记的方法的
subtitle: request-mapping-handler-mapping 
summary: Spring是如何解析被@RequestMapping注解标记的方法的
typed:
    - '@Controller'
    - '@RequestMapping'
    - 'RequestMappingInfo'
    - 'HandlerMethod'
categories: [] 
tags: [] 
date: 2021-10-27 10:50:02 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# Spring是如何解析被@RequestMapping注解标记的方法的

## 引言

在Spring MVC的开发过程中，我们都知道，只需要在Controller类中的方法上声明一个`@RequestMapping`注解，即可将该方法暴漏成一个HTTP接口:

```java
@Controller
public class HelloController{
    
    @ResponseBody
    @RequestMapping("/hello")
    public String hello(){
        return "Hello World!";
    }
}
```

就你上面的代码一样，然后通过浏览器访问`http://localhost:8080/hello`即可看到`Hello World!`。

那么，Spring是如何解析该方法的呢？

## 猜想

如果你是Spring的开发者，你会怎么解析`@RequestMapping`呢？

1. 找出Spring容器中所有的`Controller`（被`@Controller`标记的类）
2. 找出Controller中被`@RequestMapping`标记的方法

## RequestMappingHandlerMapping

`RequestMappingHandlerMapping`是Spring提供的解析`@RequestMapping`注解的类。

### 

![ReuestMappingHandlerMapping](https://upload-images.jianshu.io/upload_images/5415433-2d4320ec0045268a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如上图所示，通过IDEA的查看该类的继承关系，该类实现了`InitializingBean`接口，实现了该接口的类，在Spring 实例化完成后后解决`afterPropertiesSet()`方法，实现如下：

```java
    public void afterPropertiesSet() {

        this.config = new RequestMappingInfo.BuilderConfiguration();
        this.config.setTrailingSlashMatch(useTrailingSlashMatch());
        this.config.setContentNegotiationManager(getContentNegotiationManager());

        if (getPatternParser() != null) {
            this.config.setPatternParser(getPatternParser());
            Assert.isTrue(!this.useSuffixPatternMatch && !this.useRegisteredSuffixPatternMatch,
                    "Suffix pattern matching not supported with PathPatternParser.");
        }
        else {
            this.config.setSuffixPatternMatch(useSuffixPatternMatch());
            this.config.setRegisteredSuffixPatternMatch(useRegisteredSuffixPatternMatch());
            this.config.setPathMatcher(getPathMatcher());
        }

        super.afterPropertiesSet();
    }
```

在该方法中，通过`super.afterPropertiesSet()`调用了父类`AbstractHandlerMethodMapping`的实现。

## AbstractHandlerMethodMapping

在`AbstractHandlerMethodMapping`的`afterPropertiesSet()`中调用`initHandlerMethods()`

```java
    public void afterPropertiesSet() {
        initHandlerMethods();
    }
```
在`initHandlerMethods()`方法中，遍历所有的候选Bean，找出被`@RequestMapping`标记的方法，然后初始化`HandlerMethod`

```java
    protected void initHandlerMethods() {
        // 遍历所有的Bean
        for (String beanName : getCandidateBeanNames()) {
            if (!beanName.startsWith(SCOPED_TARGET_NAME_PREFIX)) {
                processCandidateBean(beanName);
            }
        }
        // 初始化 HandlerMethods
        handlerMethodsInitialized(getHandlerMethods());
    }
```
* processCandidateBean

```java
    protected void processCandidateBean(String beanName) {
        Class<?> beanType = null;
        try {
            beanType = obtainApplicationContext().getType(beanName);
        }
        catch (Throwable ex) {
            // An unresolvable bean type, probably from a lazy bean - let's ignore it.
            if (logger.isTraceEnabled()) {
                logger.trace("Could not resolve type for bean '" + beanName + "'", ex);
            }
        }
        // 查看类上是否有 @Controller 或 @RequestMapping 注解
        if (beanType != null && isHandler(beanType)) {
            detectHandlerMethods(beanName);
        }
    }
```

* RequestMappingHandlerMapping#createRequestMappingInfo

```java
    private RequestMappingInfo createRequestMappingInfo(AnnotatedElement element) {
        // 找到元素上声明的 @RequestMapping 注解
        RequestMapping requestMapping = AnnotatedElementUtils.findMergedAnnotation(element, RequestMapping.class);
        RequestCondition<?> condition = (element instanceof Class ?
                getCustomTypeCondition((Class<?>) element) : getCustomMethodCondition((Method) element));
        // 创建 RequestMappingInfo
        return (requestMapping != null ? createRequestMappingInfo(requestMapping, condition) : null);
    }
```

```java
    protected void registerHandlerMethod(Object handler, Method method, T mapping) {
        this.mappingRegistry.register(mapping, handler, method);
    }
```

## 小结

1. 在`RequestMappingHandlerMapping`初始化完成后,其`afterPropertiesSet()`方法被调用，进而调用父类的`initHandlerMethods()`方法；
2. 遍历容器中所有的候选Bean，找出类上有`@Controller`或者`@RequestMapping`注解的实例；
3. 找出实例中所有被`@RequestMapping`标记的方法，并映射成为一个`RequestMappingInfo`
4. 将Method和`RequestMappingInfo`初始化为`HandlerMethod`，并注册到`MappingRegistry`中。
