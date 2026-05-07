package com.ShopCart_FE_BE.config;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class ForbiddenEntryPoint implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest req, HttpServletResponse res,
            AccessDeniedException accessDeniedException) throws IOException, ServletException {
        Response<?> response = new Response<>(
                403, false, "Forbidden", null, null);

        res.setContentType("application/json;charset=UTF-8");
        res.setStatus(response.getStatus());
        res.getWriter().write(new ObjectMapper().writeValueAsString(response));
    }

}