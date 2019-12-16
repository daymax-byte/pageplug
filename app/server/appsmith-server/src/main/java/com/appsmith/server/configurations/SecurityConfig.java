package com.appsmith.server.configurations;


import com.appsmith.server.services.OrganizationService;
import com.appsmith.server.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.RedirectServerAuthenticationEntryPoint;
import org.springframework.security.web.server.authentication.ServerAuthenticationFailureHandler;
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.util.Arrays;

@EnableWebFluxSecurity
public class SecurityConfig {

    @Autowired
    private UserService userService;

    @Autowired
    private CommonConfig commonConfig;

    @Autowired
    private ServerAuthenticationSuccessHandler authenticationSuccessHandler;

    @Autowired
    private ServerAuthenticationFailureHandler authenticationFailureHandler;

    /**
     * This routerFunction is required to map /public/** endpoints to the src/main/resources/public folder
     * This is to allow static resources to be served by the server. Couldn't find an easier way to do this,
     * hence using RouterFunctions to implement this feature.
     * <p>
     * Future folks: Please check out links:
     * - https://www.baeldung.com/spring-webflux-static-content
     * - https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html#webflux-config-static-resources
     * - Class ResourceHandlerRegistry
     * for details. If you figure out a cleaner approach, please modify this function
     *
     * @return
     */
    @Bean
    public RouterFunction<ServerResponse> publicRouter() {
        return RouterFunctions
                .resources("/public/**", new ClassPathResource("public/"));
    }

    /**
     * This configuration enables CORS requests for the most common HTTP Methods
     *
     * @return
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                // This picks up the configurationSource from the bean corsConfigurationSource()
                .cors().and()
                .csrf().disable()
                .authorizeExchange()
                .matchers(ServerWebExchangeMatchers.pathMatchers(HttpMethod.GET, "/login"))
                .permitAll()
                .pathMatchers("/public/**").permitAll()
                .anyExchange()
                .authenticated()
                .and().httpBasic()
                .and().oauth2Login()
                .authenticationSuccessHandler(authenticationSuccessHandler)
                .authenticationFailureHandler(authenticationFailureHandler)
                .authorizedClientRepository(new ClientUserRepository(userService, commonConfig))
                .and().formLogin()
                .authenticationEntryPoint(new RedirectServerAuthenticationEntryPoint("/login"))
                .requiresAuthenticationMatcher(ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/login"))
                .authenticationSuccessHandler(authenticationSuccessHandler)
                .authenticationFailureHandler(authenticationFailureHandler)
                .and().build();
    }

}
