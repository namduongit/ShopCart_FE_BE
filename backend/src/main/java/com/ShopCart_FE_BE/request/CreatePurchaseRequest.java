package com.ShopCart_FE_BE.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "Yêu cầu gửi địa chỉ")
    @NotBlank(message = "Địa chỉ nhận hàng không được để trống")
    private String address;

    // Optinal - Can be null
    // @NotBlank(message = "Mã giảm giá không được để trống")
    private String couponCode;

    // Optional field
    private String fullName;

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
