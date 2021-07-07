---
formatterOff: "@formatter:off"
title: Spring Ioc 那些含有特定功能的配置类
subtitle: configuration-class 
summary: Spring Ioc 那些含有特定功能的配置类
typed:
  - '@Component.'
  - '@Configuration.'
  - '@ComponentScan.'
  - '@Import.'
  - '@ImportResource.'
banner: https://images.unsplash.com/photo-1484100356142-db6ab6244067
categories: [spring]
tags: [spring,ioc] 
date: 2021-01-22 16:49:09 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# ConfigurationClass

## 简介（What）

**配置类(`ConfigurationClass`)是一种含有特殊标记的`BeanDefiniton`。**这些配置类共同实现了诸如组件扫描、资源导入及自动装配等Spring的核心功能，极大地提高了Spring的**可扩展性**及开发人员的**工作效率**。如：

* 使用`@Component`标记组件类，配合`@ComponentScan`，减少`<beans>.xml`的声明；
* 使用`@ImportResource`标记声明需要导入的的资源；
* 使用`@Import`注解自定义需要导入的类；
* 使用`@Bean`注解标记Java方法声明的组件类，以替代`<bean>`标签；
* ……

## 定义（Definition）

在了解配置类之前，先看看其是如何定义的。ConfigrurationClass是Spring框架的一个*‘内部类’*（非`public`）。核心源码如下：

```java
package org.springframework.context.annotation;

final class ConfigurationClass {

    // 注解元数据
    private final AnnotationMetadata metadata;

    private final Resource resource;

    @Nullable
    private String beanName;

    private final Set<ConfigurationClass> importedBy = new LinkedHashSet<>(1);

    // 被 @Bean 标记的方法
    private final Set<BeanMethod> beanMethods = new LinkedHashSet<>();

    // @ImportResource 声明的资源
    private final Map<String, Class<? extends BeanDefinitionReader>> importedResources =
            new LinkedHashMap<>();

    // @Import 声明的注册器
    private final Map<ImportBeanDefinitionRegistrar, AnnotationMetadata> importBeanDefinitionRegistrars =
            new LinkedHashMap<>();

    final Set<String> skippedBeanMethods = new HashSet<>();

}
```

各属性的含义如下：

|               属性               |         类型         |            备注             |
| :------------------------------: | :------------------: | :-------------------------: |
|            `metadata`            | `AnnotationMetaData` |        配置类元数据         |
|            `resource`            |      `Resource`      |                             |
|            `beanName`            |       `String`       |            名称             |
|           `importdBy`            |        `Set`         |                             |
|          `beanMethods`           |        `Map`         |     被`@Bean`标记的方法     |
|       `importedResources`        |        `Map`         | `@ImportResource`声明的资源 |
| `importBeanDefinitionRegistrars` |        `Map`         |    `@Import`声明的注册器    |

这其中有几个比较重要的属性，如

* 用于描述配置类元数据的`metadata`；
* 描述被`@Bean`注解标记的方法的`beanMethods`；
* 描述`@ImportResource`注解标记的资源`importedResources`；
* 描述`@Import`注解声明的`ImportBeanDefinitionRegistrar`。

## 注解（Annotation）

### @ComponentScan

`@ComponentScan`是Spring中最核心的元注解之一了，该注解可以减少大量的`<beans>.xml`的配置文件，让Spring可以自动扫描指定路径下的组件类。

可以通过属`basePackages`或`value`或`basePackageClasses`属性来指定的扫描的路径，默认情况下为被该注解标记的类所在的包。

> *但是，在Spring Boot的开发中，又几乎不会使用到该注释，但是仍然能实现组件自动扫描的功能，这是为什么呢？*
>
> 当仔细查看`@SpringBootApplication`注解的时候，你会发现该注解是声明了`@ComponentScan`注解：
>
> ```java
> package org.springframework.boot.autoconfigure;
> 
> @ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
> 		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
> public @interface SpringBootApplication {
> 
> }
> ```
>
> 看到这，相信使用Spring Boot在开发多模块应用时遇到明明在类上声明了`@Component`或其扩展注解，但就是没有被Spring容器自动加载的小伙伴们，已经知道这是什么原因了。
>
> 这是因为定义的`XXXApplication`应用的包为`com.xxx.web`，而被标记的组件，如`Service`的包为`com.xxx.service`，从包的层级关系看，`web`并未包含`service`，因而没有被Spring能扫描到，这时候只需要把`XXXApplication`移动到`com.xxx`包下，问题即可解决。

### @Bean

`@Bean`注解是Spring提供的使用Java方法声明Bean定义的元注解，与`<bean>`标签功能相同，而且可以更高级的定制Bean的初始化流程。

如`spring-webmvc`模块中`WebMvcConfigurationSupport`，定义了Spring MVC中核心策略的默认实现：

```java
package org.springframework.web.servlet.config.annotation;

public class WebMvcConfigurationSupport implements ApplicationContextAware, ServletContextAware {

	@Bean
	@SuppressWarnings("deprecation")
	public RequestMappingHandlerMapping requestMappingHandlerMapping(
			@Qualifier("mvcContentNegotiationManager") ContentNegotiationManager contentNegotiationManager,
			@Qualifier("mvcConversionService") FormattingConversionService conversionService,
			@Qualifier("mvcResourceUrlProvider") ResourceUrlProvider resourceUrlProvider) {

		//...
		return mapping;
	}
    
	@Bean
	public RequestMappingHandlerAdapter requestMappingHandlerAdapter(
			@Qualifier("mvcContentNegotiationManager") ContentNegotiationManager contentNegotiationManager,
			@Qualifier("mvcConversionService") FormattingConversionService conversionService,
			@Qualifier("mvcValidator") Validator validator) {

        // ...
		return adapter;
	}

	@Bean
	public HandlerExceptionResolver handlerExceptionResolver(
			@Qualifier("mvcContentNegotiationManager") ContentNegotiationManager contentNegotiationManager) {
		// ...
		return composite;
	}
    
	@Bean
	public ViewResolver mvcViewResolver(
			@Qualifier("mvcContentNegotiationManager") ContentNegotiationManager contentNegotiationManager) {
		//...
		return composite;
	}

	@Bean
	@Lazy
	public HandlerMappingIntrospector mvcHandlerMappingIntrospector() {
		return new HandlerMappingIntrospector();
	}

	@Bean
	public LocaleResolver localeResolver() {
		return new AcceptHeaderLocaleResolver();
	}

	@Bean
	public ThemeResolver themeResolver() {
		return new FixedThemeResolver();
	}

	@Bean
	public FlashMapManager flashMapManager() {
		return new SessionFlashMapManager();
	}

	@Bean
	public RequestToViewNameTranslator viewNameTranslator() {
		return new DefaultRequestToViewNameTranslator();
	}


}
```



### @ImportResource

`@ImportResource`用于声明导入一个或多个`BeanDefinition`定义的资源，如`<beans>.xml`，支持通配符，如:

```java
package org.ifinalframework;

@Slf4j
@ComponentScan
@ImportResource({
    FinalFramework.CLASS_PATH_SPRING_CONFIG_XML,
    FinalFramework.CLASS_PATH_CONFIG_SPRING_CONFIG_XML,
    FinalFramework.CLASS_PATH_SPRING_SPRING_CONFIG_XML
})
public class FinalFramework implements BeanNameAware {

    static final String CLASS_PATH_SPRING_CONFIG_XML = "classpath:spring-config-*.xml";

    static final String CLASS_PATH_CONFIG_SPRING_CONFIG_XML = "classpath*:config/spring-config-*.xml";

    static final String CLASS_PATH_SPRING_SPRING_CONFIG_XML = "classpath*:spring/spring-config-*.xml";

    @Getter
    @Setter
    private String beanName;

}

```

上述声明，可以让Spring自动加载声明在类路径`config`或`spring`目录下名称为`spring-config-*.xml`的资源配置文件，包含`jar`包中的；以及声明在应用类根目录下的`spring-config-*.xml`配置文件，不包含`jar`包中的。

> **面试点：`classpath:`和`classpath*:`有什么区别？**

### @Import



`@Import`与`@ImportResource`注解类型，都是用于导入外部配置资源的，不同的是`@ImportResource`是通过如`beans.xml`可`beans.groovy`的资源文件间隔导入Bean定义，而`@Import`是直接导入要导入的Bean的类的，更多是用来扩展Spring功能，如大家熟知的`@EnableXXX`都是通过`@Import`的方式实现的。

### @Configuration



`@Configuration`注解主要是与其它注解搭配使用，如`@Bean`、`@ComponentScan`等。

被`@Configuration`标记的类可以被`Spring`通过`Cglib`库实现字节码增强，从而实现被`@Bean`标记的方法被调用多次时，返回的都是同一个对象（仅单例），可以通过`proxyBeanMethods`属性来指定是否增强被`@Bean`标记的方法，默认为`true`。

> **面试点：Spring是如何保证`@Bean`标记的方法返回的实例保证单例的？**





## How

了解了配置类的定义，那么如何判定一个`BeanDefiniton`是否是`ConfigurationClass`呢？

Spring提供了工具类`ConfigurationClassUtils`的`checkConfigurationClassCandidate()`方法来检测一个`BeanDefinition`是否是配置类。

### checkConfigurationClassCandidate()

该方法中有几个核心的代码片段：

* 不含有工厂方法

```java
if(className==null||beanDef.getFactoryMethodName()!=null){
    return false;
}
```

* 未实现特定接口

```java
if(BeanFactoryPostProcessor.class.isAssignableFrom(beanClass)||
    BeanPostProcessor.class.isAssignableFrom(beanClass)||
    AopInfrastructureBean.class.isAssignableFrom(beanClass)||
    EventListenerFactory.class.isAssignableFrom(beanClass)){
    return false;
}
```

* 被`@Configuration`标记或是`isConfigurationCandidate(metadata)`

```java
Map<String, Object> config=metadata.getAnnotationAttributes(Configuration.class.getName());
if(config!=null&&!Boolean.FALSE.equals(config.get("proxyBeanMethods"))){
    beanDef.setAttribute(CONFIGURATION_CLASS_ATTRIBUTE,CONFIGURATION_CLASS_FULL);
}else if(config!=null||isConfigurationCandidate(metadata)){
    beanDef.setAttribute(CONFIGURATION_CLASS_ATTRIBUTE,CONFIGURATION_CLASS_LITE);
}else{
    return false;
}
```

### isConfigurationCandidate()

* 非接口

```java
// Do not consider an interface or an annotation...
if (metadata.isInterface()) {
	return false;
}
```

* 含有特定标记

```java
// Any of the typical annotations found?
for (String indicator : candidateIndicators) {
	if (metadata.isAnnotated(indicator)) {
		return true;
	}
}

// candidateIndicators 定义与初始化
private static final Set<String> candidateIndicators = new HashSet<>(8);

static {
	candidateIndicators.add(Component.class.getName());
	candidateIndicators.add(ComponentScan.class.getName());
	candidateIndicators.add(Import.class.getName());
	candidateIndicators.add(ImportResource.class.getName());
}
```

* 含有`@Bean`标记的方法

```java
// Finally, let's look for @Bean methods...
try {
    return metadata.hasAnnotatedMethods(Bean.class.getName());
} catch (Throwable ex) {
    if (logger.isDebugEnabled()) {
        logger.debug("Failed to introspect @Bean methods on class [" + metadata.getClassName() + "]: " + ex);
    }
    return false;
}
```

至此，判定一个`BeanDefinition`是否是`ConfigurationClass`就结束了。

## 小结（End）

本文简述了什么是配置类，常用的配置类注解`@ComponentScan`、`@Bean`、`@ImportSource`等，以及判断配置类的方式。

在接下来的文章中，将和大家一起分析：

* Spring 是如何进行组件扫描；
* Spring 是如何实现从方法定义Bean；
* Spring 是如何保证Bean方法定义的Bean只被实例化一次；
* ……