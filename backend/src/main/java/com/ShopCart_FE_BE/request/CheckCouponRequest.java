package com.ShopCart_FE_BE.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckCouponRequest {
    @NotNull(message = "Vui lòng nhập mã giảm giá")
    private String code;

    @NotNull(message = "Vui lòng nhập tổng giá trị đơn hàng")
    @Min(value = 0, message = "Tổng giá trị đơn hàng phải lớn hơn 0")
    private BigDecimal totalAmount;
}
