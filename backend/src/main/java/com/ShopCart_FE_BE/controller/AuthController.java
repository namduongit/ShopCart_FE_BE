package com.ShopCart_FE_BE.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.dto.UserDto;
import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.request.LoginRequest;
import com.ShopCart_FE_BE.request.RegisterRequest;
import com.ShopCart_FE_BE.service.UserService;
import com.ShopCart_FE_BE.utils.ResponseHelper;

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
    public ResponseEntity<Response<UserDto>> register(@Valid @RequestBody RegisterRequest request) {
        UserEntity user = this.userService.register(request);
        
        Response<UserDto> response = ResponseHelper.Success(
            new UserDto(user.getId(), user.getEmail())
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("login")
    public ResponseEntity<Response<UserDto>> login(@RequestBody LoginRequest request) {
        UserEntity user = this.userService.login(request.getEmail(), request.getPassword());

        Response<UserDto> response = ResponseHelper.Success(
            new UserDto(user.getId(), user.getEmail())
        );
        return ResponseEntity.ok(response);
    }
}
