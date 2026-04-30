package com.ShopCart_FE_BE.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductInventoryDto {
    private Long id;
    private Integer stockQuantity;
    private Integer availableQuantity;
}
