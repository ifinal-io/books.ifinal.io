---
formatterOff: "@formatter:off"
title: EnvironmentPostProcessor
subtitle: environment-post-processor 
summary: Spring环境后置处理器
typed: [EnvironmentPostProcessor.]
categories: [springboot] 
tags: [springboot]
banner: https://images.unsplash.com/photo-1550029402-8ea9bfe19f04
date: 2021-06-25 10:48:10 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# EnvironmentPostProcessor

## 简介（What）

`EnvironmentPostProcessor`是Spring Boot提供的一个后置处理器，用于处理Spring应用的`ConfigurableEnvironment`对象，如添加默认值。

## 定义（Definition）

`EnvironmentPostProcessor`是一个函数接口，定义如下：

```java
package org.springframework.boot.env;

@FunctionalInterface
public interface EnvironmentPostProcessor {

    /**
     * Post-process the given {@code environment}.
     * @param environment the environment to post-process
     * @param application the application to which the environment belongs
     */
    void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application);

}
```

## 用法（Usage）

本文以修改Spring Boot应用的默认服务端口为例，示例如何使用`EnvironmentPostProcessor`对Spring Boot的环境变量进行修改。

在默认情况下，Spring Boot应用的默认服务端口为`8080`， 也可以通过`server.port`进行修改，但是这种修改仅对当前项目起作用， 如何对某个公司或组织下的所有项目进行默认的服务商品进行修改呢？

首先，自定义一个实现了`EnvironmentPostProcessor`类，如修改默认端口，通常情况下，

```java
public class ServerEnvironmentPostProcessor implements EnvironmentPostProcessor {

    public static final String SERVER_PORT_PROPERTY_NAME = "server.port";

    @Override
    public void postProcessEnvironment(final ConfigurableEnvironment environment, final SpringApplication application) {
        environment.getPropertySources()
            .addLast(new MapPropertySource("defaultServerProperties",
                Collections.singletonMap(SERVER_PORT_PROPERTY_NAME, 80)));
    }

}
```
> 上述代码相当于在`application`配置文件中声明了如下配置：
> ```properties
> server.port=80
> ```

然后，在`classpath:/META-INF/spring.factories`文件中添加如下配置：

```properties
# EnvironmentPostProcessor
org.springframework.boot.env.EnvironmentPostProcessor=\
org.ifinalframework.boot.env.ServerEnvironmentPostProcessor
```

启动Spring应用，服务将运行在80端口。

> 上述实现，仅在未显示指定`server.port`的情况下有效，这是因为此处使用的是`addLast()`进行的配置，如果想忽略显示指定的配置，可使用`addFirst()`方式注入。

## 原理（How）

从Spring Boot `2.4.0`开始，引入了`EnvironmentPostProcessorApplicationListener`应用监听器。

该接口实现了`SmartApplicationListener`，并重写了`supportsEventType(Class)`方法，支持以下类型的`ApplicationEvent`:
* ApplicationEnvironmentPreparedEvent
* ApplicationPreparedEvent
* ApplicationFailedEvent

```java
@Override
public boolean supportsEventType(Class<? extends ApplicationEvent> eventType) {
    return ApplicationEnvironmentPreparedEvent.class.isAssignableFrom(eventType)
            || ApplicationPreparedEvent.class.isAssignableFrom(eventType)
            || ApplicationFailedEvent.class.isAssignableFrom(eventType);
}
```

因此，当`SpringApplication`准备好`Envirmonent`并发布`ApplicationEnvironmentPreparedEvent
`事件，会回调其`onApplicationEvent(ApplicationEvent)`方法，从而触发`onApplicationEnvironmentPreparedEvent()`方法：

```java
@Override
public void onApplicationEvent(ApplicationEvent event) {
    if (event instanceof ApplicationEnvironmentPreparedEvent) {
        onApplicationEnvironmentPreparedEvent((ApplicationEnvironmentPreparedEvent) event);
    }
    if (event instanceof ApplicationPreparedEvent) {
        onApplicationPreparedEvent();
    }
    if (event instanceof ApplicationFailedEvent) {
        onApplicationFailedEvent();
    }
}
```

在`onApplicationEnvironmentPreparedEvent()`方法中，通过调用`SpringFactoriesLoader.loadFactoryNames(EnvironmentPostProcessor.
class, classLoader)`加载声明在`/META-INF/spring.factories`文件中的`EnvironmentPostProcessor`实例。

![EnvironmentPostProcessor](http://assets.processon.com/chart_image/60d55686e401fd50b993ebd6.png)

## 小结（End）

本文以服务端口`server.port`为例，简述了Spring环境后置处理器的基本使用及其实现原理，开发者可以使用该扩展对Spring默认环境进行处理或自定义， 更大限度地提高程序开发效率。