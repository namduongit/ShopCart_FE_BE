package com.ShopCart_FE_BE.config;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class UnauthorizedEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
        HttpServletRequest req, HttpServletResponse res,
            AuthenticationException authException
        ) throws IOException, ServletException {
        
        Response<?> response = new Response<>(
            401, false, "Unauthorized", null, null
        );

        res.setContentType("application/json;charset=UTF-8");
        res.setStatus(response.getStatus());
        res.getWriter().write(new ObjectMapper().writeValueAsString(response));
    }

    
}