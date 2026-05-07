package com.ShopCart_FE_BE.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final AuthTokenFilter authTokenFilter;

    private final UnauthorizedEntryPoint unauthorizedEntryPoint;
    private final ForbiddenEntryPoint forbiddenEntryPoint;

    public SecurityConfig(
            AuthTokenFilter authTokenFilter,
            UnauthorizedEntryPoint unauthorizedEntryPoint,
            ForbiddenEntryPoint forbiddenEntryPoint) {
        this.authTokenFilter = authTokenFilter;
        this.unauthorizedEntryPoint = unauthorizedEntryPoint;
        this.forbiddenEntryPoint = forbiddenEntryPoint;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        // Disable CSRF protection for development purposes
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/carts/**").authenticated()
                .requestMatchers("/api/payments/**").authenticated()
                .requestMatchers("/api/purchases/**").authenticated()
                .anyRequest().permitAll());
        http.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.exceptionHandling(exp -> exp
                .authenticationEntryPoint(this.unauthorizedEntryPoint)
                .accessDeniedHandler(this.forbiddenEntryPoint));

        http.addFilterBefore(this.authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
