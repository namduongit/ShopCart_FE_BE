package com.ShopCart_FE_BE.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCouponDto {
    private Long id;
    private String name;
    private BigDecimal value;
}
