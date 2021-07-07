---
formatterOff: "@formatter:off"
title: '配置类增强器'
subtitle: configuration-class-enhancer 
summary: configuration-class-enhancer 
tags: [] 
date: 2021-04-30 10:45:12 +800 
version: 1.0
formatterOn: "@formatter:on"
---

# 配置类增强器

## How

```java
	private Enhancer newEnhancer(Class<?> configSuperClass, @Nullable ClassLoader classLoader) {
		Enhancer enhancer = new Enhancer();
		enhancer.setSuperclass(configSuperClass);
		enhancer.setInterfaces(new Class<?>[] {EnhancedConfiguration.class});
		enhancer.setUseFactory(false);
		enhancer.setNamingPolicy(SpringNamingPolicy.INSTANCE);
		enhancer.setStrategy(new BeanFactoryAwareGeneratorStrategy(classLoader));
		enhancer.setCallbackFilter(CALLBACK_FILTER);
		enhancer.setCallbackTypes(CALLBACK_FILTER.getCallbackTypes());
		return enhancer;
	}
```