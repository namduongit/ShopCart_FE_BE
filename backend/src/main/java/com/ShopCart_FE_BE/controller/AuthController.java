package com.ShopCart_FE_BE.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.request.RegisterRequest;
import com.ShopCart_FE_BE.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/w-version/auth/")
public class AuthController {
    private UserService userService;

    public AuthController(
        UserService userService
    ) {
        this.userService = userService;
    }

    @PostMapping("register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        UserEntity user = this.userService.register(request);
        
        return null;
    }
}
