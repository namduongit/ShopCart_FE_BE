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
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain filterChain) throws ServletException, IOException {

        String token = this.extractTokenFromCookie(req);
        System.out.println("Extracted token: " + token);
        // Token is not exist, continue to next filter
        if (token == null) {
            filterChain.doFilter(req, res);
            return;
        }

        // parse token
        Claims claims = this.jwtUtils.extractClaims(token);
        if (claims == null) {
            System.out.println("Invalid token - Token will be cleared");
            // this.jwtUtils.clearStateCookie(res);

            filterChain.doFilter(req, res);
            return;
        }

        String email = claims.getSubject();
        Long id = claims.get("id", Long.class);
        System.out.println("Authenticated user: " + email + " with id: " + id);

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                this.userDetailsService.loadUserByUsername(email),
                null,
                null);

        // Set data in context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // CartController.java for read
        authentication.setDetails(id);
        filterChain.doFilter(req, res);
    }

    private String extractTokenFromCookie(HttpServletRequest req) {
        if (req.getCookies() == null) {
            return null;
        }

        System.out.println("Run here");

        return Arrays.stream(req.getCookies())
                .filter(c -> "access_token".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

}
