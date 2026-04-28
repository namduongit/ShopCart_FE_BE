package com.ShopCart_FE_BE.controller;

import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.dto.JwtDto;
import com.ShopCart_FE_BE.dto.UserDto;
import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.request.LoginRequest;
import com.ShopCart_FE_BE.request.RegisterRequest;
import com.ShopCart_FE_BE.service.UserService;
import com.ShopCart_FE_BE.utils.JwtUtils;
import com.ShopCart_FE_BE.utils.ResponseHelper;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/w-version/auth/")
public class AuthController {
    private UserService userService;
    private AuthenticationManager authenticationManager;
    private JwtUtils jwtUtils;

    public AuthController(
        UserService userService,
        AuthenticationManager authenticationManager,
        JwtUtils jwtUtils
    ) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
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
    public ResponseEntity<Response<JwtDto>> login(
        @Valid @RequestBody LoginRequest request,
        HttpServletResponse httpServletResponse
    ) {
        Authentication authentication = this.authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        JwtDto token = this.jwtUtils.generateJwtToken(authentication);
        ResponseCookie responseCookie = this.jwtUtils.setStateCookie(token.getToken());
        httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

        Response<JwtDto> response = ResponseHelper.Success(token);
        return ResponseEntity.ok(response);
    }
}
