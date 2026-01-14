2026-01-14T21:02:22.272+01:00 DEBUG 2036 --- [  XNIO-1 task-2] c.o.espritlivre.web.rest.OrderResource   : Enter: createOrder() with argument[s] = [OrderDTO{id=null, uniqueId='null', status='null', totalAmount=555, shippingCost=100, shippingProvider='ZR', shippingMethod='HOME_DELIVERY', fullName='ferhaten yani', phone='0541633537', email='ferhatenyani19ferhatenyani19@gmail.com', streetAddress='Ighram, Algeria', wilaya='Adrar', city='Ighram', postalCode='06057', createdAt='null', createdBy='null', updatedAt='null', user=null, orderItems=[OrderItemDTO{id=null, quantity=14, unitPrice=32.5, totalPrice=null, itemType='BOOK', order=null, book=null, bookId=1, bookTitle='null', bookAuthor='null', bookPack=null, bookPackId=null, bookPackTitle='null'}]}]
2026-01-14T21:02:22.274+01:00 DEBUG 2036 --- [  XNIO-1 task-2] c.o.espritlivre.web.rest.OrderResource   : REST request to create Order : OrderDTO{id=null, uniqueId='null', status='null', totalAmount=555, shippingCost=100, shippingProvider='ZR', shippingMethod='HOME_DELIVERY', fullName='ferhaten yani', phone='0541633537', email='ferhatenyani19ferhatenyani19@gmail.com', streetAddress='Ighram, Algeria', wilaya='Adrar', city='Ighram', postalCode='06057', createdAt='null', createdBy='null', updatedAt='null', user=null, orderItems=[OrderItemDTO{id=null, quantity=14, unitPrice=32.5, totalPrice=null, itemType='BOOK', order=null, book=null, bookId=1, bookTitle='null', bookAuthor='null', bookPack=null, bookPackId=null, bookPackTitle='null'}]}
2026-01-14T21:02:22.292+01:00 DEBUG 2036 --- [  XNIO-1 task-2] c.o.espritlivre.service.OrderService     : Enter: create() with argument[s] = [OrderDTO{id=null, uniqueId='null', status='null', totalAmount=555, shippingCost=100, shippingProvider='ZR', shippingMethod='HOME_DELIVERY', fullName='ferhaten yani', phone='0541633537', email='ferhatenyani19ferhatenyani19@gmail.com', streetAddress='Ighram, Algeria', wilaya='Adrar', city='Ighram', postalCode='06057', createdAt='null', createdBy='null', updatedAt='null', user=null, orderItems=[OrderItemDTO{id=null, quantity=14, unitPrice=32.5, totalPrice=null, itemType='BOOK', order=null, book=null, bookId=1, bookTitle='null', bookAuthor='null', bookPack=null, bookPackId=null, bookPackTitle='null'}]}]
2026-01-14T21:02:22.292+01:00 DEBUG 2036 --- [  XNIO-1 task-2] c.o.espritlivre.service.OrderService     : Request to create Order : OrderDTO{id=null, uniqueId='null', status='null', totalAmount=555, shippingCost=100, shippingProvider='ZR', shippingMethod='HOME_DELIVERY', fullName='ferhaten yani', phone='0541633537', email='ferhatenyani19ferhatenyani19@gmail.com', streetAddress='Ighram, Algeria', wilaya='Adrar', city='Ighram', postalCode='06057', createdAt='null', createdBy='null', updatedAt='null', user=null, orderItems=[OrderItemDTO{id=null, quantity=14, unitPrice=32.5, totalPrice=null, itemType='BOOK', order=null, book=null, bookId=1, bookTitle='null', bookAuthor='null', bookPack=null, bookPackId=null, bookPackTitle='null'}]}
2026-01-14T21:02:22.292+01:00 DEBUG 2036 --- [  XNIO-1 task-2] c.o.e.service.UniqueIdGeneratorService   : Enter: generateOrderUniqueId() with argument[s] = []
2026-01-14T21:02:22.485+01:00 DEBUG 2036 --- [  XNIO-1 task-2] org.hibernate.SQL                        : select o1_0.unique_id from jhi_order o1_0 where o1_0.active=true and o1_0.unique_id like ? escape '' order by o1_0.unique_id desc
2026-01-14T21:02:22.552+01:00 DEBUG 2036 --- [  XNIO-1 task-2] c.o.e.service.UniqueIdGeneratorService   : Generated order unique ID: ORD-20260114-0001
2026-01-14T21:02:22.552+01:00 DEBUG 2036 --- [  XNIO-1 task-2] c.o.e.service.UniqueIdGeneratorService   : Exit: generateOrderUniqueId() with result = ORD-20260114-0001
2026-01-14T21:02:22.605+01:00 DEBUG 2036 --- [  XNIO-1 task-2] org.hibernate.SQL                        : select u1_0.id,u1_0.activated,u1_0.city,u1_0.created_by,u1_0.created_date,u1_0.default_shipping_method,u1_0.default_shipping_provider,u1_0.email,u1_0.email_verification_token,u1_0.email_verification_token_expiry,u1_0.first_name,u1_0.image_url,u1_0.lang_key,u1_0.last_modified_by,u1_0.last_modified_date,u1_0.last_name,u1_0.login,u1_0.orders_linked,u1_0.pending_email,u1_0.phone,u1_0.postal_code,u1_0.street_address,u1_0.wilaya from jhi_user u1_0 where u1_0.login=?
2026-01-14T21:02:22.994+01:00 DEBUG 2036 --- [  XNIO-1 task-2] org.hibernate.SQL                        : select b1_0.id,b1_0.active,b1_0.author_id,b1_0.cover_image_url,b1_0.created_at,b1_0.deleted_at,b1_0.deleted_by,b1_0.description,b1_0.language,b1_0.price,b1_0.stock_quantity,b1_0.title,b1_0.updated_at from book b1_0 where b1_0.active=? and b1_0.id=? fetch first ? rows only
2026-01-14T21:02:23.074+01:00 DEBUG 2036 --- [  XNIO-1 task-2] org.hibernate.SQL                        : select nextval('order_seq')
2026-01-14T21:02:23.118+01:00 DEBUG 2036 --- [  XNIO-1 task-2] org.hibernate.SQL                        : select nextval('order_item_seq')
2026-01-14T21:02:23.136+01:00 DEBUG 2036 --- [  XNIO-1 task-2] org.hibernate.SQL                        : select a1_0.id,a1_0.active,a1_0.created_by,a1_0.created_date,a1_0.deleted_at,a1_0.deleted_by,a1_0.last_modified_by,a1_0.last_modified_date,a1_0.name,a1_0.profile_picture_url from author a1_0 where a1_0.id=?
2026-01-14T21:02:23.157+01:00 DEBUG 2036 --- [  XNIO-1 task-2] c.o.espritlivre.service.OrderService     : Admin notification email queued for order: ORD-20260114-0001
2026-01-14T21:02:23.157+01:00 DEBUG 2036 --- [  XNIO-1 task-2] c.o.espritlivre.service.OrderService     : Exit: create() with result = OrderDTO{id=37, uniqueId='ORD-20260114-0001', status='PENDING', totalAmount=555, shippingCost=100, shippingProvider='ZR', shippingMethod='HOME_DELIVERY', fullName='ferhaten yani', phone='+213541633537', email='ferhatenyani19ferhatenyani19@gmail.com', streetAddress='Ighram, Algeria', wilaya='Adrar', city='Ighram', postalCode='06057', createdAt='2026-01-14T21:02:22.552577100+01:00[Europe/Paris]', createdBy='admin', updatedAt='null', user=UserDTO{id='4c973896-5761-41fc-8217-07c5d13a004b', login='admin'}, orderItems=[OrderItemDTO{id=45, quantity=14, unitPrice=32.5, totalPrice=null, itemType='BOOK', order=null, book=null, bookId=1, bookTitle='Les Hirondelles de Kaboul', bookAuthor='Yasmina Khadra', bookPack=null, bookPackId=null, bookPackTitle='null'}]}
2026-01-14T21:02:23.157+01:00 DEBUG 2036 --- [it-livre-task-2] c.o.espritlivre.service.MailService      : Enter: sendNewOrderNotificationToAdmin() with argument[s] = [OrderDTO{id=37, uniqueId='ORD-20260114-0001', status='PENDING', totalAmount=555, shippingCost=100, shippingProvider='ZR', shippingMethod='HOME_DELIVERY', fullName='ferhaten yani', phone='+213541633537', email='ferhatenyani19ferhatenyani19@gmail.com', streetAddress='Ighram, Algeria', wilaya='Adrar', city='Ighram', postalCode='06057', createdAt='2026-01-14T21:02:22.552577100+01:00[Europe/Paris]', createdBy='admin', updatedAt='null', user=UserDTO{id='4c973896-5761-41fc-8217-07c5d13a004b', login='admin'}, orderItems=[OrderItemDTO{id=45, quantity=14, unitPrice=32.5, totalPrice=null, itemType='BOOK', order=null, book=null, bookId=1, bookTitle='Les Hirondelles de Kaboul', bookAuthor='Yasmina Khadra', bookPack=null, bookPackId=null, bookPackTitle='null'}]}, http://localhost:8080/admin/orders/37]
2026-01-14T21:02:23.162+01:00 DEBUG 2036 --- [it-livre-task-2] c.o.espritlivre.service.MailService      : Sending new order notification to admin for order: ORD-20260114-0001
2026-01-14T21:02:23.230+01:00 DEBUG 2036 --- [  XNIO-1 task-2] org.hibernate.SQL                        : insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
2026-01-14T21:02:23.274+01:00  WARN 2036 --- [  XNIO-1 task-2] o.h.engine.jdbc.spi.SqlExceptionHelper   : SQL Error: 0, SQLState: 23505
2026-01-14T21:02:23.275+01:00 ERROR 2036 --- [  XNIO-1 task-2] o.h.engine.jdbc.spi.SqlExceptionHelper   : Batch entry 0 insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (('TRUE'::boolean),('Ighram'),('2026-01-14 20:02:22.552577+00'),('admin'),(NULL),(NULL),('ferhatenyani19ferhatenyani19@gmail.com'),('ferhaten yani'),(NULL),('+213541633537'),('06057'),('100'::numeric),('HOME_DELIVERY'),('ZR'),('PENDING'),('Ighram, Algeria'),('555'::numeric),('ORD-20260114-0001'),(NULL),('4c973896-5761-41fc-8217-07c5d13a004b'),('Adrar'),('37'::int8)) was aborted: ERROR: duplicate key value violates unique constraint "idx_order_unique_id"
  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.  Call getNextException to see other errors in the batch.
2026-01-14T21:02:23.275+01:00 ERROR 2036 --- [  XNIO-1 task-2] o.h.engine.jdbc.spi.SqlExceptionHelper   : ERROR: duplicate key value violates unique constraint "idx_order_unique_id"
  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.
2026-01-14T21:02:23.309+01:00 DEBUG 2036 --- [it-livre-task-2] org.hibernate.SQL                        : select u1_0.id,u1_0.activated,u1_0.city,u1_0.created_by,u1_0.created_date,u1_0.default_shipping_method,u1_0.default_shipping_provider,u1_0.email,u1_0.email_verification_token,u1_0.email_verification_token_expiry,u1_0.first_name,u1_0.image_url,u1_0.lang_key,u1_0.last_modified_by,u1_0.last_modified_date,u1_0.last_name,u1_0.login,u1_0.orders_linked,u1_0.pending_email,u1_0.phone,u1_0.postal_code,u1_0.street_address,u1_0.wilaya from jhi_user u1_0 where upper(u1_0.email)=upper(?)
2026-01-14T21:02:23.311+01:00 ERROR 2036 --- [  XNIO-1 task-2] c.o.espritlivre.web.rest.OrderResource   : Exception in createOrder() with cause = 'org.hibernate.exception.ConstraintViolationException: could not execute batch [Batch entry 0 insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (('TRUE'::boolean),('Ighram'),('2026-01-14 20:02:22.552577+00'),('admin'),(NULL),(NULL),('ferhatenyani19ferhatenyani19@gmail.com'),('ferhaten yani'),(NULL),('+213541633537'),('06057'),('100'::numeric),('HOME_DELIVERY'),('ZR'),('PENDING'),('Ighram, Algeria'),('555'::numeric),('ORD-20260114-0001'),(NULL),('4c973896-5761-41fc-8217-07c5d13a004b'),('Adrar'),('37'::int8)) was aborted: ERROR: duplicate key value violates unique constraint "idx_order_unique_id"_  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.  Call getNextException to see other errors in the batch.] [insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]' and exception = 'could not execute batch [Batch entry 0 insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (('TRUE'::boolean),('Ighram'),('2026-01-14 20:02:22.552577+00'),('admin'),(NULL),(NULL),('ferhatenyani19ferhatenyani19@gmail.com'),('ferhaten yani'),(NULL),('+213541633537'),('06057'),('100'::numeric),('HOME_DELIVERY'),('ZR'),('PENDING'),('Ighram, Algeria'),('555'::numeric),('ORD-20260114-0001'),(NULL),('4c973896-5761-41fc-8217-07c5d13a004b'),('Adrar'),('37'::int8)) was aborted: ERROR: duplicate key value violates unique constraint "idx_order_unique_id"_  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.  Call getNextException to see other errors in the batch.] [insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]; SQL [insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]; constraint [idx_order_unique_id]'

org.springframework.dao.DataIntegrityViolationException: could not execute batch [Batch entry 0 insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (('TRUE'::boolean),('Ighram'),('2026-01-14 20:02:22.552577+00'),('admin'),(NULL),(NULL),('ferhatenyani19ferhatenyani19@gmail.com'),('ferhaten yani'),(NULL),('+213541633537'),('06057'),('100'::numeric),('HOME_DELIVERY'),('ZR'),('PENDING'),('Ighram, Algeria'),('555'::numeric),('ORD-20260114-0001'),(NULL),('4c973896-5761-41fc-8217-07c5d13a004b'),('Adrar'),('37'::int8)) was aborted: ERROR: duplicate key value violates unique constraint "idx_order_unique_id"
  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.  Call getNextException to see other errors in the batch.] [insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]; SQL [insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]; constraint [idx_order_unique_id]
        at org.springframework.orm.jpa.vendor.HibernateJpaDialect.convertHibernateAccessException(HibernateJpaDialect.java:294)
        at org.springframework.orm.jpa.vendor.HibernateJpaDialect.convertHibernateAccessException(HibernateJpaDialect.java:256)
        at org.springframework.orm.jpa.vendor.HibernateJpaDialect.translateExceptionIfPossible(HibernateJpaDialect.java:241)
        at org.springframework.orm.jpa.JpaTransactionManager.doCommit(JpaTransactionManager.java:566)
        at org.springframework.transaction.support.AbstractPlatformTransactionManager.processCommit(AbstractPlatformTransactionManager.java:795)
        at org.springframework.transaction.support.AbstractPlatformTransactionManager.commit(AbstractPlatformTransactionManager.java:758)
        at org.springframework.transaction.interceptor.TransactionAspectSupport.commitTransactionAfterReturning(TransactionAspectSupport.java:698)
        at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:416)
        at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:119)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
        at org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:97)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
        at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:728)
        at com.oussamabenberkane.espritlivre.service.OrderService$$SpringCGLIB$$0.create(<generated>)
        at com.oussamabenberkane.espritlivre.web.rest.OrderResource.createOrder(OrderResource.java:112)
        at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:104)
        at java.base/java.lang.reflect.Method.invoke(Method.java:565)
        at org.springframework.aop.support.AopUtils.invokeJoinpointUsingReflection(AopUtils.java:359)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.invokeJoinpoint(ReflectiveMethodInvocation.java:196)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)
        at org.springframework.aop.aspectj.AspectJAfterThrowingAdvice.invoke(AspectJAfterThrowingAdvice.java:64)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
        at org.springframework.aop.aspectj.MethodInvocationProceedingJoinPoint.proceed(MethodInvocationProceedingJoinPoint.java:89)
        at com.oussamabenberkane.espritlivre.aop.logging.LoggingAspect.logAround(LoggingAspect.java:103)
        at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:104)
        at java.base/java.lang.reflect.Method.invoke(Method.java:565)
        at org.springframework.aop.aspectj.AbstractAspectJAdvice.invokeAdviceMethodWithGivenArgs(AbstractAspectJAdvice.java:642)
        at org.springframework.aop.aspectj.AbstractAspectJAdvice.invokeAdviceMethod(AbstractAspectJAdvice.java:632)
        at org.springframework.aop.aspectj.AspectJAroundAdvice.invoke(AspectJAroundAdvice.java:71)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
        at org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:97)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
        at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:728)
        at com.oussamabenberkane.espritlivre.web.rest.OrderResource$$SpringCGLIB$$0.createOrder(<generated>)
        at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:104)
        at java.base/java.lang.reflect.Method.invoke(Method.java:565)
        at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:258)
        at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:191)
        at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:118)
        at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:986)
        at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:891)
        at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
        at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1089)
        at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:979)
        at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
        at org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:914)
        at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:547)
        at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)
        at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:614)
        at io.undertow.servlet.handlers.ServletHandler.handleRequest(ServletHandler.java:74)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:129)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at com.oussamabenberkane.espritlivre.web.filter.OAuth2RefreshTokensWebFilter.doFilterInternal(OAuth2RefreshTokensWebFilter.java:66)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
        at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231)
        at org.springframework.security.web.ObservationFilterChainDecorator$FilterObservation$SimpleFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:479)
        at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:340)
        at org.springframework.security.web.ObservationFilterChainDecorator.lambda$wrapSecured$0(ObservationFilterChainDecorator.java:82)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:128)
        at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:126)
        at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:120)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.oauth2.client.web.OAuth2AuthorizationCodeGrantFilter.doFilterInternal(OAuth2AuthorizationCodeGrantFilter.java:183)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter.doFilterInternal(BearerTokenAuthenticationFilter.java:145)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter.doFilter(AbstractAuthenticationProcessingFilter.java:227)
        at org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter.doFilter(AbstractAuthenticationProcessingFilter.java:221)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter.doFilterInternal(OAuth2AuthorizationRequestRedirectFilter.java:198)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter.doFilterInternal(OAuth2AuthorizationRequestRedirectFilter.java:198)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107)
        at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.csrf.CsrfFilter.doFilterInternal(CsrfFilter.java:117)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)
        at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82)
        at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$0(ObservationFilterChainDecorator.java:323)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:224)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233)
        at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191)
        at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
        at org.springframework.web.servlet.handler.HandlerMappingIntrospector.lambda$createCacheFilter$3(HandlerMappingIntrospector.java:243)
        at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
        at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
        at org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebMvcSecurityConfiguration.java:238)
        at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:362)
        at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:278)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at io.undertow.servlet.handlers.FilterHandler.handleRequest(FilterHandler.java:84)
        at io.undertow.servlet.handlers.security.ServletSecurityRoleHandler.handleRequest(ServletSecurityRoleHandler.java:62)
        at io.undertow.servlet.handlers.ServletChain$1.handleRequest(ServletChain.java:68)
        at io.undertow.servlet.handlers.ServletDispatchingHandler.handleRequest(ServletDispatchingHandler.java:36)
        at io.undertow.servlet.handlers.RedirectDirHandler.handleRequest(RedirectDirHandler.java:68)
        at io.undertow.servlet.handlers.security.SSLInformationAssociationHandler.handleRequest(SSLInformationAssociationHandler.java:117)
        at io.undertow.servlet.handlers.security.ServletAuthenticationCallHandler.handleRequest(ServletAuthenticationCallHandler.java:57)
        at io.undertow.server.handlers.PredicateHandler.handleRequest(PredicateHandler.java:43)
        at io.undertow.security.handlers.AbstractConfidentialityHandler.handleRequest(AbstractConfidentialityHandler.java:46)
        at io.undertow.servlet.handlers.security.ServletConfidentialityConstraintHandler.handleRequest(ServletConfidentialityConstraintHandler.java:64)
        at io.undertow.security.handlers.AuthenticationMechanismsHandler.handleRequest(AuthenticationMechanismsHandler.java:60)
        at io.undertow.servlet.handlers.security.CachedAuthenticatedSessionHandler.handleRequest(CachedAuthenticatedSessionHandler.java:77)
        at io.undertow.security.handlers.AbstractSecurityContextAssociationHandler.handleRequest(AbstractSecurityContextAssociationHandler.java:43)
        at io.undertow.server.handlers.PredicateHandler.handleRequest(PredicateHandler.java:43)
        at io.undertow.servlet.handlers.SendErrorPageHandler.handleRequest(SendErrorPageHandler.java:52)
        at io.undertow.server.handlers.PredicateHandler.handleRequest(PredicateHandler.java:43)
        at io.undertow.servlet.handlers.ServletInitialHandler.handleFirstRequest(ServletInitialHandler.java:276)
        at io.undertow.servlet.handlers.ServletInitialHandler$2.call(ServletInitialHandler.java:135)
        at io.undertow.servlet.handlers.ServletInitialHandler$2.call(ServletInitialHandler.java:132)
        at io.undertow.servlet.core.ServletRequestContextThreadSetupAction$1.call(ServletRequestContextThreadSetupAction.java:48)
        at io.undertow.servlet.core.ContextClassLoaderSetupAction$1.call(ContextClassLoaderSetupAction.java:43)
        at io.undertow.servlet.handlers.ServletInitialHandler.dispatchRequest(ServletInitialHandler.java:256)
        at io.undertow.servlet.handlers.ServletInitialHandler$1.handleRequest(ServletInitialHandler.java:101)
        at io.undertow.server.Connectors.executeRootHandler(Connectors.java:395)
        at io.undertow.server.HttpServerExchange$1.run(HttpServerExchange.java:861)
        at org.jboss.threads.ContextHandler$1.runWith(ContextHandler.java:18)
        at org.jboss.threads.EnhancedQueueExecutor$Task.run(EnhancedQueueExecutor.java:2513)
        at org.jboss.threads.EnhancedQueueExecutor$ThreadBody.run(EnhancedQueueExecutor.java:1512)
        at org.xnio.XnioWorker$WorkerThreadFactory$1$1.run(XnioWorker.java:1282)
        at java.base/java.lang.Thread.run(Thread.java:1447)
Caused by: org.hibernate.exception.ConstraintViolationException: could not execute batch [Batch entry 0 insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (('TRUE'::boolean),('Ighram'),('2026-01-14 20:02:22.552577+00'),('admin'),(NULL),(NULL),('ferhatenyani19ferhatenyani19@gmail.com'),('ferhaten yani'),(NULL),('+213541633537'),('06057'),('100'::numeric),('HOME_DELIVERY'),('ZR'),('PENDING'),('Ighram, Algeria'),('555'::numeric),('ORD-20260114-0001'),(NULL),('4c973896-5761-41fc-8217-07c5d13a004b'),('Adrar'),('37'::int8)) was aborted: ERROR: duplicate key value violates unique constraint "idx_order_unique_id"
  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.  Call getNextException to see other errors in the batch.] [insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]
        at org.hibernate.exception.internal.SQLStateConversionDelegate.convert(SQLStateConversionDelegate.java:97)
        at org.hibernate.exception.internal.StandardSQLExceptionConverter.convert(StandardSQLExceptionConverter.java:58)
        at org.hibernate.engine.jdbc.spi.SqlExceptionHelper.convert(SqlExceptionHelper.java:108)
        at org.hibernate.engine.jdbc.batch.internal.BatchImpl.lambda$performExecution$2(BatchImpl.java:293)
        at org.hibernate.engine.jdbc.mutation.internal.PreparedStatementGroupSingleTable.forEachStatement(PreparedStatementGroupSingleTable.java:67)
        at org.hibernate.engine.jdbc.batch.internal.BatchImpl.performExecution(BatchImpl.java:264)
        at org.hibernate.engine.jdbc.batch.internal.BatchImpl.execute(BatchImpl.java:242)
        at org.hibernate.engine.jdbc.internal.JdbcCoordinatorImpl.getBatch(JdbcCoordinatorImpl.java:173)
        at org.hibernate.engine.jdbc.mutation.internal.MutationExecutorSingleBatched.resolveBatch(MutationExecutorSingleBatched.java:47)
        at org.hibernate.engine.jdbc.mutation.internal.MutationExecutorSingleBatched.performBatchedOperations(MutationExecutorSingleBatched.java:60)
        at org.hibernate.engine.jdbc.mutation.internal.AbstractMutationExecutor.execute(AbstractMutationExecutor.java:63)
        at org.hibernate.persister.entity.mutation.InsertCoordinatorStandard.doStaticInserts(InsertCoordinatorStandard.java:194)
        at org.hibernate.persister.entity.mutation.InsertCoordinatorStandard.coordinateInsert(InsertCoordinatorStandard.java:132)
        at org.hibernate.persister.entity.mutation.InsertCoordinatorStandard.insert(InsertCoordinatorStandard.java:104)
        at org.hibernate.action.internal.EntityInsertAction.execute(EntityInsertAction.java:110)
        at org.hibernate.engine.spi.ActionQueue.executeActions(ActionQueue.java:644)
        at org.hibernate.engine.spi.ActionQueue.executeActions(ActionQueue.java:511)
        at org.hibernate.event.internal.AbstractFlushingEventListener.performExecutions(AbstractFlushingEventListener.java:414)
        at org.hibernate.event.internal.DefaultFlushEventListener.onFlush(DefaultFlushEventListener.java:41)
        at org.hibernate.event.service.internal.EventListenerGroupImpl.fireEventOnEachListener(EventListenerGroupImpl.java:127)
        at org.hibernate.internal.SessionImpl.doFlush(SessionImpl.java:1429)
        at org.hibernate.internal.SessionImpl.managedFlush(SessionImpl.java:491)
        at org.hibernate.internal.SessionImpl.flushBeforeTransactionCompletion(SessionImpl.java:2354)
        at org.hibernate.internal.SessionImpl.beforeTransactionCompletion(SessionImpl.java:1978)
        at org.hibernate.engine.jdbc.internal.JdbcCoordinatorImpl.beforeTransactionCompletion(JdbcCoordinatorImpl.java:439)
        at org.hibernate.resource.transaction.backend.jdbc.internal.JdbcResourceLocalTransactionCoordinatorImpl.beforeCompletionCallback(JdbcResourceLocalTransactionCoordinatorImpl.java:169)
        at org.hibernate.resource.transaction.backend.jdbc.internal.JdbcResourceLocalTransactionCoordinatorImpl$TransactionDriverControlImpl.commit(JdbcResourceLocalTransactionCoordinatorImpl.java:267)
        at org.hibernate.engine.transaction.internal.TransactionImpl.commit(TransactionImpl.java:101)
        at org.springframework.orm.jpa.JpaTransactionManager.doCommit(JpaTransactionManager.java:562)
        ... 200 common frames omitted
Caused by: java.sql.BatchUpdateException: Batch entry 0 insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (('TRUE'::boolean),('Ighram'),('2026-01-14 20:02:22.552577+00'),('admin'),(NULL),(NULL),('ferhatenyani19ferhatenyani19@gmail.com'),('ferhaten yani'),(NULL),('+213541633537'),('06057'),('100'::numeric),('HOME_DELIVERY'),('ZR'),('PENDING'),('Ighram, Algeria'),('555'::numeric),('ORD-20260114-0001'),(NULL),('4c973896-5761-41fc-8217-07c5d13a004b'),('Adrar'),('37'::int8)) was aborted: ERROR: duplicate key value violates unique constraint "idx_order_unique_id"
  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.  Call getNextException to see other errors in the batch.
        at org.postgresql.jdbc.BatchResultHandler.handleError(BatchResultHandler.java:165)
        at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2421)
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:580)
        at org.postgresql.jdbc.PgStatement.internalExecuteBatch(PgStatement.java:889)
        at org.postgresql.jdbc.PgStatement.executeBatch(PgStatement.java:913)
        at org.postgresql.jdbc.PgPreparedStatement.executeBatch(PgPreparedStatement.java:1739)
        at com.zaxxer.hikari.pool.ProxyStatement.executeBatch(ProxyStatement.java:127)
        at com.zaxxer.hikari.pool.HikariProxyPreparedStatement.executeBatch(HikariProxyPreparedStatement.java)
        at org.hibernate.engine.jdbc.batch.internal.BatchImpl.lambda$performExecution$2(BatchImpl.java:279)
        ... 225 common frames omitted
Caused by: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "idx_order_unique_id"
  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.
        at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2733)
        at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2420)
        ... 232 common frames omitted

2026-01-14T21:02:23.344+01:00 DEBUG 2036 --- [  XNIO-1 task-2] c.o.e.w.rest.errors.ExceptionTranslator  : Converting Exception to Problem Details:

org.springframework.dao.DataIntegrityViolationException: could not execute batch [Batch entry 0 insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (('TRUE'::boolean),('Ighram'),('2026-01-14 20:02:22.552577+00'),('admin'),(NULL),(NULL),('ferhatenyani19ferhatenyani19@gmail.com'),('ferhaten yani'),(NULL),('+213541633537'),('06057'),('100'::numeric),('HOME_DELIVERY'),('ZR'),('PENDING'),('Ighram, Algeria'),('555'::numeric),('ORD-20260114-0001'),(NULL),('4c973896-5761-41fc-8217-07c5d13a004b'),('Adrar'),('37'::int8)) was aborted: ERROR: duplicate key value violates unique constraint "idx_order_unique_id"
  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.  Call getNextException to see other errors in the batch.] [insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]; SQL [insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]; constraint [idx_order_unique_id]
        at org.springframework.orm.jpa.vendor.HibernateJpaDialect.convertHibernateAccessException(HibernateJpaDialect.java:294)
        at org.springframework.orm.jpa.vendor.HibernateJpaDialect.convertHibernateAccessException(HibernateJpaDialect.java:256)
        at org.springframework.orm.jpa.vendor.HibernateJpaDialect.translateExceptionIfPossible(HibernateJpaDialect.java:241)
        at org.springframework.orm.jpa.JpaTransactionManager.doCommit(JpaTransactionManager.java:566)
        at org.springframework.transaction.support.AbstractPlatformTransactionManager.processCommit(AbstractPlatformTransactionManager.java:795)
        at org.springframework.transaction.support.AbstractPlatformTransactionManager.commit(AbstractPlatformTransactionManager.java:758)
        at org.springframework.transaction.interceptor.TransactionAspectSupport.commitTransactionAfterReturning(TransactionAspectSupport.java:698)
        at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:416)
        at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:119)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
        at org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:97)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
        at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:728)
        at com.oussamabenberkane.espritlivre.service.OrderService$$SpringCGLIB$$0.create(<generated>)
        at com.oussamabenberkane.espritlivre.web.rest.OrderResource.createOrder(OrderResource.java:112)
        at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:104)
        at java.base/java.lang.reflect.Method.invoke(Method.java:565)
        at org.springframework.aop.support.AopUtils.invokeJoinpointUsingReflection(AopUtils.java:359)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.invokeJoinpoint(ReflectiveMethodInvocation.java:196)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)
        at org.springframework.aop.aspectj.AspectJAfterThrowingAdvice.invoke(AspectJAfterThrowingAdvice.java:64)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
        at org.springframework.aop.aspectj.MethodInvocationProceedingJoinPoint.proceed(MethodInvocationProceedingJoinPoint.java:89)
        at com.oussamabenberkane.espritlivre.aop.logging.LoggingAspect.logAround(LoggingAspect.java:103)
        at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:104)
        at java.base/java.lang.reflect.Method.invoke(Method.java:565)
        at org.springframework.aop.aspectj.AbstractAspectJAdvice.invokeAdviceMethodWithGivenArgs(AbstractAspectJAdvice.java:642)
        at org.springframework.aop.aspectj.AbstractAspectJAdvice.invokeAdviceMethod(AbstractAspectJAdvice.java:632)
        at org.springframework.aop.aspectj.AspectJAroundAdvice.invoke(AspectJAroundAdvice.java:71)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
        at org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:97)
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
        at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:728)
        at com.oussamabenberkane.espritlivre.web.rest.OrderResource$$SpringCGLIB$$0.createOrder(<generated>)
        at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:104)
        at java.base/java.lang.reflect.Method.invoke(Method.java:565)
        at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:258)
        at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:191)
        at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:118)
        at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:986)
        at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:891)
        at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
        at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1089)
        at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:979)
        at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
        at org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:914)
        at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:547)
        at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)
        at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:614)
        at io.undertow.servlet.handlers.ServletHandler.handleRequest(ServletHandler.java:74)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:129)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at com.oussamabenberkane.espritlivre.web.filter.OAuth2RefreshTokensWebFilter.doFilterInternal(OAuth2RefreshTokensWebFilter.java:66)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
        at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231)
        at org.springframework.security.web.ObservationFilterChainDecorator$FilterObservation$SimpleFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:479)
        at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:340)
        at org.springframework.security.web.ObservationFilterChainDecorator.lambda$wrapSecured$0(ObservationFilterChainDecorator.java:82)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:128)
        at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:126)
        at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:120)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.oauth2.client.web.OAuth2AuthorizationCodeGrantFilter.doFilterInternal(OAuth2AuthorizationCodeGrantFilter.java:183)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter.doFilterInternal(BearerTokenAuthenticationFilter.java:145)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter.doFilter(AbstractAuthenticationProcessingFilter.java:227)
        at org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter.doFilter(AbstractAuthenticationProcessingFilter.java:221)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter.doFilterInternal(OAuth2AuthorizationRequestRedirectFilter.java:198)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter.doFilterInternal(OAuth2AuthorizationRequestRedirectFilter.java:198)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107)
        at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.csrf.CsrfFilter.doFilterInternal(CsrfFilter.java:117)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)
        at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82)
        at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
        at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$0(ObservationFilterChainDecorator.java:323)
        at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:224)
        at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
        at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233)
        at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191)
        at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
        at org.springframework.web.servlet.handler.HandlerMappingIntrospector.lambda$createCacheFilter$3(HandlerMappingIntrospector.java:243)
        at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
        at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
        at org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebMvcSecurityConfiguration.java:238)
        at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:362)
        at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:278)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
        at io.undertow.servlet.core.ManagedFilter.doFilter(ManagedFilter.java:67)
        at io.undertow.servlet.handlers.FilterHandler$FilterChainImpl.doFilter(FilterHandler.java:131)
        at io.undertow.servlet.handlers.FilterHandler.handleRequest(FilterHandler.java:84)
        at io.undertow.servlet.handlers.security.ServletSecurityRoleHandler.handleRequest(ServletSecurityRoleHandler.java:62)
        at io.undertow.servlet.handlers.ServletChain$1.handleRequest(ServletChain.java:68)
        at io.undertow.servlet.handlers.ServletDispatchingHandler.handleRequest(ServletDispatchingHandler.java:36)
        at io.undertow.servlet.handlers.RedirectDirHandler.handleRequest(RedirectDirHandler.java:68)
        at io.undertow.servlet.handlers.security.SSLInformationAssociationHandler.handleRequest(SSLInformationAssociationHandler.java:117)
        at io.undertow.servlet.handlers.security.ServletAuthenticationCallHandler.handleRequest(ServletAuthenticationCallHandler.java:57)
        at io.undertow.server.handlers.PredicateHandler.handleRequest(PredicateHandler.java:43)
        at io.undertow.security.handlers.AbstractConfidentialityHandler.handleRequest(AbstractConfidentialityHandler.java:46)
        at io.undertow.servlet.handlers.security.ServletConfidentialityConstraintHandler.handleRequest(ServletConfidentialityConstraintHandler.java:64)
        at io.undertow.security.handlers.AuthenticationMechanismsHandler.handleRequest(AuthenticationMechanismsHandler.java:60)
        at io.undertow.servlet.handlers.security.CachedAuthenticatedSessionHandler.handleRequest(CachedAuthenticatedSessionHandler.java:77)
        at io.undertow.security.handlers.AbstractSecurityContextAssociationHandler.handleRequest(AbstractSecurityContextAssociationHandler.java:43)
        at io.undertow.server.handlers.PredicateHandler.handleRequest(PredicateHandler.java:43)
        at io.undertow.servlet.handlers.SendErrorPageHandler.handleRequest(SendErrorPageHandler.java:52)
        at io.undertow.server.handlers.PredicateHandler.handleRequest(PredicateHandler.java:43)
        at io.undertow.servlet.handlers.ServletInitialHandler.handleFirstRequest(ServletInitialHandler.java:276)
        at io.undertow.servlet.handlers.ServletInitialHandler$2.call(ServletInitialHandler.java:135)
        at io.undertow.servlet.handlers.ServletInitialHandler$2.call(ServletInitialHandler.java:132)
        at io.undertow.servlet.core.ServletRequestContextThreadSetupAction$1.call(ServletRequestContextThreadSetupAction.java:48)
        at io.undertow.servlet.core.ContextClassLoaderSetupAction$1.call(ContextClassLoaderSetupAction.java:43)
        at io.undertow.servlet.handlers.ServletInitialHandler.dispatchRequest(ServletInitialHandler.java:256)
        at io.undertow.servlet.handlers.ServletInitialHandler$1.handleRequest(ServletInitialHandler.java:101)
        at io.undertow.server.Connectors.executeRootHandler(Connectors.java:395)
        at io.undertow.server.HttpServerExchange$1.run(HttpServerExchange.java:861)
        at org.jboss.threads.ContextHandler$1.runWith(ContextHandler.java:18)
        at org.jboss.threads.EnhancedQueueExecutor$Task.run(EnhancedQueueExecutor.java:2513)
        at org.jboss.threads.EnhancedQueueExecutor$ThreadBody.run(EnhancedQueueExecutor.java:1512)
        at org.xnio.XnioWorker$WorkerThreadFactory$1$1.run(XnioWorker.java:1282)
        at java.base/java.lang.Thread.run(Thread.java:1447)
Caused by: org.hibernate.exception.ConstraintViolationException: could not execute batch [Batch entry 0 insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (('TRUE'::boolean),('Ighram'),('2026-01-14 20:02:22.552577+00'),('admin'),(NULL),(NULL),('ferhatenyani19ferhatenyani19@gmail.com'),('ferhaten yani'),(NULL),('+213541633537'),('06057'),('100'::numeric),('HOME_DELIVERY'),('ZR'),('PENDING'),('Ighram, Algeria'),('555'::numeric),('ORD-20260114-0001'),(NULL),('4c973896-5761-41fc-8217-07c5d13a004b'),('Adrar'),('37'::int8)) was aborted: ERROR: duplicate key value violates unique constraint "idx_order_unique_id"
  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.  Call getNextException to see other errors in the batch.] [insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]
        at org.hibernate.exception.internal.SQLStateConversionDelegate.convert(SQLStateConversionDelegate.java:97)
        at org.hibernate.exception.internal.StandardSQLExceptionConverter.convert(StandardSQLExceptionConverter.java:58)
        at org.hibernate.engine.jdbc.spi.SqlExceptionHelper.convert(SqlExceptionHelper.java:108)
        at org.hibernate.engine.jdbc.batch.internal.BatchImpl.lambda$performExecution$2(BatchImpl.java:293)
        at org.hibernate.engine.jdbc.mutation.internal.PreparedStatementGroupSingleTable.forEachStatement(PreparedStatementGroupSingleTable.java:67)
        at org.hibernate.engine.jdbc.batch.internal.BatchImpl.performExecution(BatchImpl.java:264)
        at org.hibernate.engine.jdbc.batch.internal.BatchImpl.execute(BatchImpl.java:242)
        at org.hibernate.engine.jdbc.internal.JdbcCoordinatorImpl.getBatch(JdbcCoordinatorImpl.java:173)
        at org.hibernate.engine.jdbc.mutation.internal.MutationExecutorSingleBatched.resolveBatch(MutationExecutorSingleBatched.java:47)
        at org.hibernate.engine.jdbc.mutation.internal.MutationExecutorSingleBatched.performBatchedOperations(MutationExecutorSingleBatched.java:60)
        at org.hibernate.engine.jdbc.mutation.internal.AbstractMutationExecutor.execute(AbstractMutationExecutor.java:63)
        at org.hibernate.persister.entity.mutation.InsertCoordinatorStandard.doStaticInserts(InsertCoordinatorStandard.java:194)
        at org.hibernate.persister.entity.mutation.InsertCoordinatorStandard.coordinateInsert(InsertCoordinatorStandard.java:132)
        at org.hibernate.persister.entity.mutation.InsertCoordinatorStandard.insert(InsertCoordinatorStandard.java:104)
        at org.hibernate.action.internal.EntityInsertAction.execute(EntityInsertAction.java:110)
        at org.hibernate.engine.spi.ActionQueue.executeActions(ActionQueue.java:644)
        at org.hibernate.engine.spi.ActionQueue.executeActions(ActionQueue.java:511)
        at org.hibernate.event.internal.AbstractFlushingEventListener.performExecutions(AbstractFlushingEventListener.java:414)
        at org.hibernate.event.internal.DefaultFlushEventListener.onFlush(DefaultFlushEventListener.java:41)
        at org.hibernate.event.service.internal.EventListenerGroupImpl.fireEventOnEachListener(EventListenerGroupImpl.java:127)
        at org.hibernate.internal.SessionImpl.doFlush(SessionImpl.java:1429)
        at org.hibernate.internal.SessionImpl.managedFlush(SessionImpl.java:491)
        at org.hibernate.internal.SessionImpl.flushBeforeTransactionCompletion(SessionImpl.java:2354)
        at org.hibernate.internal.SessionImpl.beforeTransactionCompletion(SessionImpl.java:1978)
        at org.hibernate.engine.jdbc.internal.JdbcCoordinatorImpl.beforeTransactionCompletion(JdbcCoordinatorImpl.java:439)
        at org.hibernate.resource.transaction.backend.jdbc.internal.JdbcResourceLocalTransactionCoordinatorImpl.beforeCompletionCallback(JdbcResourceLocalTransactionCoordinatorImpl.java:169)
        at org.hibernate.resource.transaction.backend.jdbc.internal.JdbcResourceLocalTransactionCoordinatorImpl$TransactionDriverControlImpl.commit(JdbcResourceLocalTransactionCoordinatorImpl.java:267)
        at org.hibernate.engine.transaction.internal.TransactionImpl.commit(TransactionImpl.java:101)
        at org.springframework.orm.jpa.JpaTransactionManager.doCommit(JpaTransactionManager.java:562)
        ... 200 common frames omitted
Caused by: java.sql.BatchUpdateException: Batch entry 0 insert into jhi_order (active,city,created_at,created_by,deleted_at,deleted_by,email,full_name,linked_at,phone,postal_code,shipping_cost,shipping_method,shipping_provider,status,street_address,total_amount,unique_id,updated_at,user_id,wilaya,id) values (('TRUE'::boolean),('Ighram'),('2026-01-14 20:02:22.552577+00'),('admin'),(NULL),(NULL),('ferhatenyani19ferhatenyani19@gmail.com'),('ferhaten yani'),(NULL),('+213541633537'),('06057'),('100'::numeric),('HOME_DELIVERY'),('ZR'),('PENDING'),('Ighram, Algeria'),('555'::numeric),('ORD-20260114-0001'),(NULL),('4c973896-5761-41fc-8217-07c5d13a004b'),('Adrar'),('37'::int8)) was aborted: ERROR: duplicate key value violates unique constraint "idx_order_unique_id"
  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.  Call getNextException to see other errors in the batch.
        at org.postgresql.jdbc.BatchResultHandler.handleError(BatchResultHandler.java:165)
        at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2421)
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:580)
        at org.postgresql.jdbc.PgStatement.internalExecuteBatch(PgStatement.java:889)
        at org.postgresql.jdbc.PgStatement.executeBatch(PgStatement.java:913)
        at org.postgresql.jdbc.PgPreparedStatement.executeBatch(PgPreparedStatement.java:1739)
        at com.zaxxer.hikari.pool.ProxyStatement.executeBatch(ProxyStatement.java:127)
        at com.zaxxer.hikari.pool.HikariProxyPreparedStatement.executeBatch(HikariProxyPreparedStatement.java)
        at org.hibernate.engine.jdbc.batch.internal.BatchImpl.lambda$performExecution$2(BatchImpl.java:279)
        ... 225 common frames omitted
Caused by: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "idx_order_unique_id"
  Detail: Key (unique_id)=(ORD-20260114-0001) already exists.
        at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2733)
        at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2420)
        ... 232 common frames omitted

2026-01-14T21:02:23.357+01:00  INFO 2036 --- [it-livre-task-2] c.o.espritlivre.service.MailService      : Admin user not found or no language preference set, using default locale: fr
2026-01-14T21:02:24.238+01:00 DEBUG 2036 --- [it-livre-task-2] c.o.espritlivre.service.MailService      : Send priority email[multipart 'false' and html 'true'] to 'oussamabenberkane.pro@gmail.com' with subject 'Nouvelle notification de commande - Esprit Livre #ORD-20260114-0001' and priority=1
DEBUG: Jakarta Mail version 2.1.3
DEBUG: URL jar:file:/C:/Users/MyHomehP/.m2/repository/org/eclipse/angus/jakarta.mail/2.0.3/jakarta.mail-2.0.3.jar!/META-INF/javamail.providers
DEBUG: successfully loaded resource: jar:file:/C:/Users/MyHomehP/.m2/repository/org/eclipse/angus/jakarta.mail/2.0.3/jakarta.mail-2.0.3.jar!/META-INF/javamail.providers
DEBUG: successfully loaded resource: /META-INF/javamail.default.providers
DEBUG: Tables of loaded providers
DEBUG: Providers Listed By Class Name: {org.eclipse.angus.mail.imap.IMAPStore=jakarta.mail.Provider[STORE,imap,org.eclipse.angus.mail.imap.IMAPStore,Oracle], org.eclipse.angus.mail.smtp.SMTPTransport=jakarta.mail.Provider[TRANSPORT,smtp,org.eclipse.angus.mail.smtp.SMTPTransport,Oracle], org.eclipse.angus.mail.pop3.POP3Store=jakarta.mail.Provider[STORE,pop3,org.eclipse.angus.mail.pop3.POP3Store,Oracle], org.eclipse.angus.mail.pop3.POP3SSLStore=jakarta.mail.Provider[STORE,pop3s,org.eclipse.angus.mail.pop3.POP3SSLStore,Oracle], org.eclipse.angus.mail.smtp.SMTPSSLTransport=jakarta.mail.Provider[TRANSPORT,smtps,org.eclipse.angus.mail.smtp.SMTPSSLTransport,Oracle], org.eclipse.angus.mail.imap.IMAPSSLStore=jakarta.mail.Provider[STORE,imaps,org.eclipse.angus.mail.imap.IMAPSSLStore,Oracle]}
DEBUG: Providers Listed By Protocol: {imap=jakarta.mail.Provider[STORE,imap,org.eclipse.angus.mail.imap.IMAPStore,Oracle], smtp=jakarta.mail.Provider[TRANSPORT,smtp,org.eclipse.angus.mail.smtp.SMTPTransport,Oracle], pop3=jakarta.mail.Provider[STORE,pop3,org.eclipse.angus.mail.pop3.POP3Store,Oracle], imaps=jakarta.mail.Provider[STORE,imaps,org.eclipse.angus.mail.imap.IMAPSSLStore,Oracle], smtps=jakarta.mail.Provider[TRANSPORT,smtps,org.eclipse.angus.mail.smtp.SMTPSSLTransport,Oracle], pop3s=jakarta.mail.Provider[STORE,pop3s,org.eclipse.angus.mail.pop3.POP3SSLStore,Oracle]}
DEBUG: successfully loaded resource: /META-INF/javamail.default.address.map
DEBUG: URL jar:file:/C:/Users/MyHomehP/.m2/repository/org/eclipse/angus/jakarta.mail/2.0.3/jakarta.mail-2.0.3.jar!/META-INF/javamail.address.map
DEBUG: successfully loaded resource: jar:file:/C:/Users/MyHomehP/.m2/repository/org/eclipse/angus/jakarta.mail/2.0.3/jakarta.mail-2.0.3.jar!/META-INF/javamail.address.map
DEBUG: getProvider() returning jakarta.mail.Provider[TRANSPORT,smtp,org.eclipse.angus.mail.smtp.SMTPTransport,Oracle]
DEBUG SMTP: useEhlo true, useAuth true
2026-01-14T21:02:24.374+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : useEhlo true, useAuth true
DEBUG SMTP: trying to connect to host "in-v3.mailjet.com", port 587, isSSL false
2026-01-14T21:02:24.380+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : trying to connect to host "in-v3.mailjet.com", port 587, isSSL false
220 in.mailjet.com ESMTP Mailjet
DEBUG SMTP: connected to host "in-v3.mailjet.com", port: 587
2026-01-14T21:02:24.592+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : connected to host "in-v3.mailjet.com", port: 587
EHLO 10.80.202.144
250-smtpintls.mailjet.com
250-PIPELINING
250-SIZE 15728640
250-VRFY
250-ETRN
250-STARTTLS
250-AUTH PLAIN LOGIN DIGEST-MD5 CRAM-MD5
250-AUTH=PLAIN LOGIN DIGEST-MD5 CRAM-MD5
250-ENHANCEDSTATUSCODES
250-8BITMIME
250-SMTPUTF8
250 CHUNKING
DEBUG SMTP: Found extension "PIPELINING", arg ""
2026-01-14T21:02:24.680+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "PIPELINING", arg ""
DEBUG SMTP: Found extension "SIZE", arg "15728640"
2026-01-14T21:02:24.680+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "SIZE", arg "15728640"
DEBUG SMTP: Found extension "VRFY", arg ""
2026-01-14T21:02:24.685+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "VRFY", arg ""
DEBUG SMTP: Found extension "ETRN", arg ""
2026-01-14T21:02:24.685+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "ETRN", arg ""
DEBUG SMTP: Found extension "STARTTLS", arg ""
2026-01-14T21:02:24.685+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "STARTTLS", arg ""
DEBUG SMTP: Found extension "AUTH", arg "PLAIN LOGIN DIGEST-MD5 CRAM-MD5"
2026-01-14T21:02:24.685+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "AUTH", arg "PLAIN LOGIN DIGEST-MD5 CRAM-MD5"
DEBUG SMTP: Found extension "AUTH=PLAIN", arg "LOGIN DIGEST-MD5 CRAM-MD5"
2026-01-14T21:02:24.690+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "AUTH=PLAIN", arg "LOGIN DIGEST-MD5 CRAM-MD5"
DEBUG SMTP: Found extension "ENHANCEDSTATUSCODES", arg ""
2026-01-14T21:02:24.691+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "ENHANCEDSTATUSCODES", arg ""
DEBUG SMTP: Found extension "8BITMIME", arg ""
2026-01-14T21:02:24.693+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "8BITMIME", arg ""
DEBUG SMTP: Found extension "SMTPUTF8", arg ""
2026-01-14T21:02:24.693+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "SMTPUTF8", arg ""
DEBUG SMTP: Found extension "CHUNKING", arg ""
2026-01-14T21:02:24.693+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "CHUNKING", arg ""
STARTTLS
220 2.0.0 Ready to start TLS
EHLO 10.80.202.144
250-smtpintls.mailjet.com
250-PIPELINING
250-SIZE 15728640
250-VRFY
250-ETRN
250-AUTH PLAIN LOGIN DIGEST-MD5 CRAM-MD5
250-AUTH=PLAIN LOGIN DIGEST-MD5 CRAM-MD5
250-ENHANCEDSTATUSCODES
250-8BITMIME
250-SMTPUTF8
250 CHUNKING
DEBUG SMTP: Found extension "PIPELINING", arg ""
2026-01-14T21:02:25.102+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "PIPELINING", arg ""
DEBUG SMTP: Found extension "SIZE", arg "15728640"
2026-01-14T21:02:25.108+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "SIZE", arg "15728640"
DEBUG SMTP: Found extension "VRFY", arg ""
2026-01-14T21:02:25.113+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "VRFY", arg ""
DEBUG SMTP: Found extension "ETRN", arg ""
2026-01-14T21:02:25.117+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "ETRN", arg ""
DEBUG SMTP: Found extension "AUTH", arg "PLAIN LOGIN DIGEST-MD5 CRAM-MD5"
2026-01-14T21:02:25.117+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "AUTH", arg "PLAIN LOGIN DIGEST-MD5 CRAM-MD5"
DEBUG SMTP: Found extension "AUTH=PLAIN", arg "LOGIN DIGEST-MD5 CRAM-MD5"
2026-01-14T21:02:25.117+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "AUTH=PLAIN", arg "LOGIN DIGEST-MD5 CRAM-MD5"
DEBUG SMTP: Found extension "ENHANCEDSTATUSCODES", arg ""
2026-01-14T21:02:25.125+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "ENHANCEDSTATUSCODES", arg ""
DEBUG SMTP: Found extension "8BITMIME", arg ""
2026-01-14T21:02:25.127+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "8BITMIME", arg ""
DEBUG SMTP: Found extension "SMTPUTF8", arg ""
2026-01-14T21:02:25.127+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "SMTPUTF8", arg ""
DEBUG SMTP: Found extension "CHUNKING", arg ""
2026-01-14T21:02:25.127+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Found extension "CHUNKING", arg ""
DEBUG SMTP: protocolConnect login, host=in-v3.mailjet.com, user=882157472f08d8fdffb37ab6e23d137c, password=<non-null>
2026-01-14T21:02:25.127+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : protocolConnect login, host=in-v3.mailjet.com, user=882157472f08d8fdffb37ab6e23d137c, password=<non-null>
DEBUG SMTP: Attempt to authenticate using mechanisms: LOGIN PLAIN DIGEST-MD5 NTLM XOAUTH2
2026-01-14T21:02:25.133+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Attempt to authenticate using mechanisms: LOGIN PLAIN DIGEST-MD5 NTLM XOAUTH2
DEBUG SMTP: Using mechanism LOGIN
2026-01-14T21:02:25.134+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Using mechanism LOGIN
DEBUG SMTP: AUTH LOGIN command trace suppressed
2026-01-14T21:02:25.134+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : AUTH LOGIN command trace suppressed
DEBUG SMTP: AUTH LOGIN succeeded
2026-01-14T21:02:25.344+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : AUTH LOGIN succeeded
DEBUG SMTP: use8bit false
2026-01-14T21:02:25.386+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : use8bit false
MAIL FROM:<oussamabenberkane.pro@gmail.com>
250 2.1.0 Ok
RCPT TO:<oussamabenberkane.pro@gmail.com>
250 2.1.5 Ok
DEBUG SMTP: Verified Addresses
2026-01-14T21:02:25.513+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : Verified Addresses
DEBUG SMTP:   oussamabenberkane.pro@gmail.com
2026-01-14T21:02:25.513+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              :   oussamabenberkane.pro@gmail.com
DATA
354 End data with <CR><LF>.<CR><LF>
Date: Wed, 14 Jan 2026 21:02:25 +0100 (CET)
From: Esprit Livre <oussamabenberkane.pro@gmail.com>
To: oussamabenberkane.pro@gmail.com
Message-ID: <1142470772.0.1768420945378@[10.80.202.144]>
Subject: Nouvelle notification de commande - Esprit Livre #ORD-20260114-0001
MIME-Version: 1.0
Content-Type: text/html;charset=UTF-8
Content-Transfer-Encoding: quoted-printable
X-Mailer: Esprit Livre Mailer
X-Priority: 1

<!DOCTYPE html>
<html lang=3D"fr">
<head>
    <meta charset=3D"UTF-8">
    <meta name=3D"viewport" content=3D"width=3Ddevice-width, initial-scale=
=3D1.0">
    <title>New Order Notification</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
        }
        .email-header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 600;
        }
        .email-header .subtitle {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .email-body {
            padding: 40px 30px;
            color: #333333;
            line-height: 1.6;
        }
        .alert-banner {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px 20px;
            margin-bottom: 25px;
            border-radius: 4px;
        }
        .alert-banner strong {
            color: #92400e;
            font-size: 16px;
        }
        .order-id {
            font-size: 24px;
            color: #2563eb;
            font-weight: 700;
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background-color: #eff6ff;
            border-radius: 6px;
        }
        .info-section {
            margin: 25px 0;
            padding: 20px;
            background-color: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        .info-section h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #1e40af;
            font-weight: 600;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 8px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #64748b;
            min-width: 140px;
        }
        .info-value {
            color: #333333;
            text-align: right;
            flex: 1;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .items-table th {
            background-color: #eff6ff;
            color: #1e40af;
            font-weight: 600;
            padding: 12px 10px;
            text-align: left;
            font-size: 14px;
            border-bottom: 2px solid #2563eb;
        }
        .items-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
        }
        .items-table tr:last-child td {
            border-bottom: none;
        }
        .items-table .text-right {
            text-align: right;
        }
        .total-section {
            margin-top: 20px;
            padding: 15px 20px;
            background-color: #eff6ff;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .total-label {
            font-size: 18px;
            font-weight: 700;
            color: #1e40af;
        }
        .total-amount {
            font-size: 24px;
            font-weight: 700;
            color: #2563eb;
        }
        .action-button {
            display: inline-block;
            padding: 14px 40px;
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 10px 0;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .badge-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .badge-confirmed {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .badge-shipped {
            background-color: #e0e7ff;
            color: #4338ca;
        }
        .badge-delivered {
            background-color: #d1fae5;
            color: #065f46;
        }
        .badge-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
        }
    </style>
</head>
<body>
    <div class=3D"email-container">
        <div class=3D"email-header">
            <h1>=F0=9F=9B=92 Esprit Livre</h1>
            <p class=3D"subtitle">Notification Administrateur</p>
        </div>

        <div class=3D"email-body">
            <div class=3D"alert-banner">
                <strong>=F0=9F=93=A2 Nouvelle commande re=C3=A7ue !</strong=
>
            </div>

            <div class=3D"order-id">ORD-20260114-0001</div>

            <!-- Customer Information -->
            <div class=3D"info-section">
                <h3>=F0=9F=91=A4 Informations client</h3>
                <div class=3D"info-row">
                    <span class=3D"info-label">Nom :</span>
                    <span class=3D"info-value">ferhaten yani</span>
                </div>
                <div class=3D"info-row">
                    <span class=3D"info-label">T=C3=A9l=C3=A9phone :</span>
                    <span class=3D"info-value">+213541633537</span>
                </div>
                <div class=3D"info-row">
                    <span class=3D"info-label">Email :</span>
                    <span class=3D"info-value">ferhatenyani19ferhatenyani19=
@gmail.com</span>
                </div>
            </div>

            <!-- Shipping Address -->
            <div class=3D"info-section">
                <h3>=F0=9F=93=8D Adresse de livraison</h3>
                <div class=3D"info-row">
                    <span class=3D"info-label">Wilaya :</span>
                    <span class=3D"info-value">Adrar</span>
                </div>
                <div class=3D"info-row">
                    <span class=3D"info-label">Commune :</span>
                    <span class=3D"info-value">Ighram</span>
                </div>
                <div class=3D"info-row">
                    <span class=3D"info-label">Adresse :</span>
                    <span class=3D"info-value">Ighram, Algeria</span>
                </div>
                <div class=3D"info-row">
                    <span class=3D"info-label">Code postal :</span>
                    <span class=3D"info-value">06057</span>
                </div>
            </div>

            <!-- Order Details -->
            <div class=3D"info-section">
                <h3>=F0=9F=93=8B D=C3=A9tails de la commande</h3>
                <div class=3D"info-row">
                    <span class=3D"info-label">Date de commande :</span>
                    <span class=3D"info-value">14/01/2026</span>
                </div>
                <div class=3D"info-row">
                    <span class=3D"info-label">Heure de commande :</span>
                    <span class=3D"info-value">21:02</span>
                </div>
                <div class=3D"info-row">
                    <span class=3D"info-label">Statut :</span>
                    <span class=3D"info-value">
                        <span class=3D"badge badge-pending">PENDING</span>
                    </span>
                </div>
            </div>

            <!-- Order Items -->
            <div class=3D"info-section">
                <h3>=F0=9F=93=9A Articles command=C3=A9s</h3>
                <table class=3D"items-table">
                    <thead>
                        <tr>
                            <th>Livre</th>
                            <th class=3D"text-right">Qt=C3=A9</th>
                            <th class=3D"text-right">Prix unitaire</th>
                            <th class=3D"text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Les Hirondelles de Kaboul</td>
                            <td class=3D"text-right">14</td>
                            <td class=3D"text-right">32.5 DZD</td>
                            <td class=3D"text-right">null DZD</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Total Amount -->
            <div class=3D"total-section">
                <span class=3D"total-label">Montant total : =C2=A0 =C2=A0</=
span>
                <span class=3D"total-amount">555 DZD</span>
            </div>

            <!-- Action Button -->
            <div class=3D"button-container">
                <a href=3D"http://localhost:8080/admin/orders/37" class=3D"=
action-button" style=3D"color: #ffffff">Voir la commande dans le panneau d&=
#39;administration</a>
            </div>
        </div>

        <div class=3D"footer">
            <p>
                <strong>Esprit Livre - Panneau d&#39;Administration</strong=
>
            </p>
            <p style=3D"margin-top: 20px; font-size: 12px; color: #94a3b8;"=
>Ceci est une notification automatique envoy=C3=A9e aux administrateurs lor=
s de la cr=C3=A9ation d&#39;une nouvelle commande.</p>
            <p style=3D"font-size: 12px; color: #94a3b8;">=C2=A9 2025 Espri=
t Livre. Tous droits r=C3=A9serv=C3=A9s.</p>
        </div>
    </div>
</body>
</html>
.
250 OK queued as 81a494b6-69ac-406c-8f70-89691cab6c35
DEBUG SMTP: message successfully delivered to mail server
2026-01-14T21:02:25.814+01:00 DEBUG 2036 --- [it-livre-task-2] org.eclipse.angus.mail.smtp              : message successfully delivered to mail server
QUIT
221 2.0.0 Bye
2026-01-14T21:02:25.877+01:00  INFO 2036 --- [it-livre-task-2] c.o.espritlivre.service.MailService      : Priority email successfully sent to 'oussamabenberkane.pro@gmail.com' with subject 'Nouvelle notification de commande - Esprit Livre #ORD-20260114-0001'
2026-01-14T21:02:25.878+01:00 DEBUG 2036 --- [it-livre-task-2] c.o.espritlivre.service.MailService      : Exit: sendNewOrderNotificationToAdmin() with result = null