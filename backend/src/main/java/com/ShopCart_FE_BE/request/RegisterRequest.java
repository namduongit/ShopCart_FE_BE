package com.ShopCart_FE_BE.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotNull(message = "Yêu cầu gửi tên")
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 0, max = 50, message = "Tên phải từ 0 đến 50 ký tự")
    private String fullName;

    @NotNull(message = "Yêu cầu gửi email")
    @NotBlank(message = "Email không được để trống")
    @Pattern(regexp = "^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Email không hợp lệ")
    @Size(max = 50, message = "Email không được vượt quá 50 ký tự")
    private String email;

    @NotNull(message = "Yêu cầu gửi mật khẩu")
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, max = 100, message = "Mật khẩu phải từ 6 đến 100 ký tự")
    private String password;

    @NotNull(message = "Yêu cầu gửi mật khẩu xác nhận")
    @NotBlank(message = "Mật khẩu xác nhận không được để trống")
    @Size(min = 6, max = 100, message = "Mật khẩu xác nhận phải từ 6 đến 100 ký tự")
    private String passwordConfirm;
}
