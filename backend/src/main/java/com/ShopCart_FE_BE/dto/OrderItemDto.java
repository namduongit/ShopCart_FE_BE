package com.ShopCart_FE_BE.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private Long id;
    private OrderItemProductDto product;
    private Integer quantity;
    private BigDecimal total;
}
