package com.ShopCart_FE_BE.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegisterRequest {
    @NotNull(message = "Yêu cầu gửi email")
    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotNull(message = "Yêu cầu gửi mật khẩu")
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    @NotNull(message = "Yêu cầu gửi mật khẩu xác nhận")
    @NotBlank(message = "Mạt khẩu xác nhận không được để trống")
    private String passwordConfirm;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordConfirm() {
        return passwordConfirm;
    }

    public void setPasswordConfirm(String passwordConfirm) {
        this.passwordConfirm = passwordConfirm;
    }
}
