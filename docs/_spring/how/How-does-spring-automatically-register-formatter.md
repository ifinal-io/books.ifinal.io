# Spring是如何自动发现Formatter并注册的？

在使用Spring Boot来开发Web项目时，如果需要自定义转换器(`Converter`)，

## ApplicationConversionService

Spring内置了一个ApplicationConversionService来注册内置的`Converter`。

```java
	public static void addBeans(FormatterRegistry registry, ListableBeanFactory beanFactory) {
		Set<Object> beans = new LinkedHashSet<>();
		beans.addAll(beanFactory.getBeansOfType(GenericConverter.class).values());
		beans.addAll(beanFactory.getBeansOfType(Converter.class).values());
		beans.addAll(beanFactory.getBeansOfType(Printer.class).values());
		beans.addAll(beanFactory.getBeansOfType(Parser.class).values());
		for (Object bean : beans) {
			if (bean instanceof GenericConverter) {
				registry.addConverter((GenericConverter) bean);
			}
			else if (bean instanceof Converter) {
				registry.addConverter((Converter<?, ?>) bean);
			}
			else if (bean instanceof Formatter) {
				registry.addFormatter((Formatter<?>) bean);
			}
			else if (bean instanceof Printer) {
				registry.addPrinter((Printer<?>) bean);
			}
			else if (bean instanceof Parser) {
				registry.addParser((Parser<?>) bean);
			}
		}
	}
```

## AutoConfiguration

### WebMvc

```java
public class WebMvcAutoConfiguration {

    public static class WebMvcAutoConfigurationAdapter implements WebMvcConfigurer, ServletContextAware {
    
    		@Override
		    public void addFormatters(FormatterRegistry registry) {
			    ApplicationConversionService.addBeans(registry, this.beanFactory);
		    }
    }
}    
```

### WebFlux

```java
public class WebFluxAutoConfiguration {

  	public static class WebFluxConfig implements WebFluxConfigurer {
	    	@Override
		    public void addFormatters(FormatterRegistry registry) {
			    ApplicationConversionService.addBeans(registry, this.beanFactory);
		    }
    }
}
```


