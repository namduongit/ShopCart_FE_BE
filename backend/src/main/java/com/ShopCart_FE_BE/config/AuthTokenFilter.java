package com.ShopCart_FE_BE.config;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ShopCart_FE_BE.service.UserDetailsServiceImpl;
import com.ShopCart_FE_BE.utils.JwtUtils;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthTokenFilter(
            JwtUtils jwtUtils,
            UserDetailsServiceImpl userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        System.out.println("AuthTokenFilter: " + request.getRequestURI());
        String token = this.extractTokenFromCookie(request);
        System.out.println("Extracted token: " + token);
        // Token is not exist, continue to next filter
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        Claims claims = this.jwtUtils.extractClaims(token);
        System.out.println("asdada");
        if (claims == null) {
            System.out.println("Invalid token");
            this.jwtUtils.clearStateCookie(response);
            filterChain.doFilter(request, response);
            return;
        }

        String email = claims.getSubject();
        Long id = claims.get("id", Long.class);
        System.out.println("Authenticated user: " + email + " with id: " + id);

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                this.userDetailsService.loadUserByUsername(email),
                null,
                null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        authentication.setDetails(id);
        filterChain.doFilter(request, response);
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null)
            return null;

        return Arrays.stream(request.getCookies())
                .filter(c -> "access_token".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

}
