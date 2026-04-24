package com.ShopCart_FE_BE.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        // Disable CSRF protection for development purposes
        http.csrf(csrf -> csrf.disable());
        // http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
