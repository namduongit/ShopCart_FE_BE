package com.ShopCart_FE_BE.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;

    private String mainImageUrl;
    private List<String> imageUrls;

    private String name;
    private String description;
    private String slug;

    private Map<String, Object> attributes;

    private BigDecimal price;

    private String status;

    private ProductInventoryDto inventory;
}
