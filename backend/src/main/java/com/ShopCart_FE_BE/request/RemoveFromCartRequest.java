package com.ShopCart_FE_BE.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RemoveFromCartRequest {
    @NotNull(message = "Yêu cầu gửi mã sản phẩm")
    private Long productId;
    @NotNull(message = "Yêu cầu gửi số lượng")
    @Min(value = 1, message = "Số lượng ít nhất là 1")
    private Integer quantity;
}
