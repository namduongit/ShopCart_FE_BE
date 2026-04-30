package com.ShopCart_FE_BE.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;

    private String fullName;
    private String address;
    private String status;

    private BigDecimal totalAmount;
    private Integer totalQuantity;

    private UserDto user;
    private List<OrderItemDto> items;
    private OrderCouponDto coupon;
}
