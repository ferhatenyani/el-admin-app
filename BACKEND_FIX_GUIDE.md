# Backend Configuration Guide - Fix Required Issues

## Critical Issues to Fix in Your Spring Boot Backend

### 1. CORS Configuration (403 Forbidden on OPTIONS)

**Problem**: DELETE and PUT requests are failing with `403 Forbidden` on OPTIONS preflight requests.

**Solution**: Add proper CORS configuration in your Spring Boot application.

Create or update your CORS configuration class:

```java
package com.yourpackage.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow credentials
        config.setAllowCredentials(true);

        // Allow frontend origin
        config.addAllowedOrigin("http://localhost:5173"); // Vite dev server
        config.addAllowedOrigin("http://localhost:3000"); // Alternative port

        // Allow all headers
        config.addAllowedHeader("*");

        // CRITICAL: Allow ALL HTTP methods including DELETE and PUT
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("PATCH");

        // Expose Authorization header
        config.addExposedHeader("Authorization");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

**Alternative**: If using Spring Security, configure CORS there:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API
            // ... rest of your security config
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

### 2. Authentication Redirect (302 on PUT/DELETE)

**Problem**: PUT and DELETE requests are getting `302 Found` redirects to `/`, indicating authentication issues.

**Cause**: Spring Security is redirecting unauthenticated requests to login page.

**Solution**: Ensure your Security Configuration allows authenticated requests and doesn't redirect API calls.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Important for API
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Protected endpoints - require authentication
                .requestMatchers("/api/**").authenticated()

                .anyRequest().permitAll()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .exceptionHandling(exception -> exception
                // Return 401 instead of redirecting
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"" + authException.getMessage() + "\"}");
                })
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

**JWT Filter Example** (if using JWT):

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                Long userId = tokenProvider.getUserIdFromToken(jwt);

                UserDetails userDetails = userDetailsService.loadUserById(userId);
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

---

### 3. Image URL Configuration

**Problem**: Cover images might not be displaying because of relative URL paths.

**Options**:

#### Option A: Return Full URLs from Backend

Update your Book entity/DTO to return full URLs:

```java
@Service
public class BookService {

    @Value("${app.base-url}")
    private String baseUrl; // e.g., "http://localhost:8080"

    public BookDTO mapToDTO(Book book) {
        BookDTO dto = new BookDTO();
        // ... other mappings

        // Convert relative path to full URL
        if (book.getCoverImagePath() != null) {
            dto.setCoverImageUrl(baseUrl + book.getCoverImagePath());
        }

        return dto;
    }
}
```

Add to `application.properties`:
```properties
app.base-url=http://localhost:8080
```

#### Option B: Serve Static Files Properly

Ensure your static file configuration is correct:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/")
                .setCachePeriod(3600);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true);
    }
}
```

---

### 4. File Upload Configuration

Ensure multipart file uploads are properly configured:

```properties
# application.properties

# Enable multipart uploads
spring.servlet.multipart.enabled=true

# Max file size
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Upload directory
app.upload.dir=uploads/books
```

Controller example:

```java
@RestController
@RequestMapping("/api/books")
public class BookController {

    @PostMapping
    public ResponseEntity<BookDTO> createBook(
            @RequestPart("book") String bookJson,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage) {

        ObjectMapper mapper = new ObjectMapper();
        BookDTO bookDTO = mapper.readValue(bookJson, BookDTO.class);

        BookDTO created = bookService.createBook(bookDTO, coverImage);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> updateBook(
            @PathVariable Long id,
            @RequestPart("book") String bookJson,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage) {

        ObjectMapper mapper = new ObjectMapper();
        BookDTO bookDTO = mapper.readValue(bookJson, BookDTO.class);

        BookDTO updated = bookService.updateBook(id, bookDTO, coverImage);
        return ResponseEntity.ok(updated);
    }
}
```

---

## Testing Your Fixes

After implementing the above fixes, test with:

```bash
# Test CORS preflight
curl -X OPTIONS http://localhost:8080/api/books/1 \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: DELETE" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v

# Should return 200 OK with CORS headers

# Test DELETE with auth
curl -X DELETE http://localhost:8080/api/books/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Origin: http://localhost:5173" \
  -v

# Should return 200 OK, not 403 or 302

# Test PUT with auth
curl -X PUT http://localhost:8080/api/books/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"title":"Updated Title"}' \
  -v

# Should return 200 OK, not 302
```

---

## Summary of Required Backend Changes

1. ✅ **Add CORS configuration** allowing DELETE, PUT, OPTIONS methods
2. ✅ **Fix Security Configuration** to return 401 instead of 302 redirects
3. ✅ **Configure JWT/Auth filter** to properly handle Bearer tokens
4. ✅ **Return full image URLs** or ensure static file serving works
5. ✅ **Configure multipart file uploads** for book cover images

Once these are implemented, your frontend (which has been fixed) will work correctly!
