---
formatterOff: "@formatter:off"
title:  如何自定义Spring Boot Starter
subtitle: how-to-custom-spring-boot-starter 
summary: 如何自定义Spring Boot Starter
typed:
    - '@EnableAutoConfiguration'
    - 'ApplicationContextInitializer'
categories: [springboot] 
tags: [springboot] 
date: 2021-11-23 13:51:48 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# 如何自定义Spring Boot Starter

## 方式一：通过@EnableAutoConfiguration

* Step1: 定义一个需要加入SpringBoot的中组件

```java

@Configuration(proxyBeanMethods = false)
public class WebMvcAutoConfiguration {
//......
}
```

* Step2:在META-INF/spring.factories文件中声明

```properties
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration
```

通过@EnableAutoConfiguration方式，可以将某一个或多个组件类显示注入到Spring容器中，SpringBoot就是使用的该种方式，在spring-boot-autoconfigure.jar中的META-INF/spring.factories文件中声明了大量的内置配置类。

## 方式二：通过ApplicationContextInitializer

* Step1: 实现ApplicationContextInitializer接口

```java

@Slf4j
public final class FinalFrameworkApplicationContextInitializer extends
        AbsFrameworkApplicationContextInitializer<ConfigurableApplicationContext> {

    public FinalFrameworkApplicationContextInitializer() {
        super(FinalFramework.class);
        logger.info("registered framework: {}", FinalFramework.class.getSimpleName());
    }

}
```

```java

@Slf4j
@ComponentScan
@ImportResource({
        "classpath:spring-config-*.xml",
        "classpath*:config/spring-config-*.xml",
        "classpath*:spring/spring-config-*.xml"
})
public class FinalFramework {
}
```

* Step2: 在META-INF/spring.factories文件中声明

```properties
# ApplicationContextInitializer
org.springframework.context.ApplicationContextInitializer=\
org.ifinalframework.context.initializer.FinalFrameworkApplicationContextInitializer,\
```

