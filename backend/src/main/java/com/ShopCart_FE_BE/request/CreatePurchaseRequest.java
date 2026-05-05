package com.ShopCart_FE_BE.request;

import java.util.List;

import jakarta.validation.Valid;
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
public class CreatePurchaseRequest {
    @NotNull(message = "Yêu cầu gửi danh sách sản phẩm")
    @Size(min = 1, message = "Danh sách ít nhất 1 sản phẩm")
    @Valid
    private List<PurchaseItem> items;

    // Optional field
    private String fullName;

    @NotNull(message = "Yêu cầu gửi số điện thoại")
    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(min = 10, max = 10, message = "Số điện thoại phải có 10 số")
    private String phone;

    @NotNull(message = "Yêu cầu gửi địa chỉ")
    @NotBlank(message = "Địa chỉ nhận hàng không được để trống")
    private String address;

    @NotNull(message = "Yêu cầu gửi phương thức thanh toán")
    @Pattern(regexp = "COD|MOMO", message = "Phương thức thanh toán không hợp lệ")
    private String paymentMethod;

    // Optinal - Can be null
    private String couponCode;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurchaseItem {
        @NotNull(message = "Yêu cầu gửi mã sản phẩm")
        private Long productId;
        @NotNull(message = "Yêu cầu gửi số lượng")
        private Integer quantity;
    }
}
