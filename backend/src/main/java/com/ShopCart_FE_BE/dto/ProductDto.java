package com.ShopCart_FE_BE.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class ProductDto {
    private Long id;
    private String mainImageUrl;
    private List<String> imageUrls;
    private String name;
    private String slug;
    private Integer stockQuantity;
    private Map<String, Object> attributes;
    private BigDecimal price;
    private String status;
    
    public ProductDto(Long id, String mainImageUrl, List<String> imageUrls, String name, String slug,
            Integer stockQuantity, Map<String, Object> attributes, BigDecimal price, String status) {
        this.id = id;
        this.mainImageUrl = mainImageUrl;
        this.imageUrls = imageUrls;
        this.name = name;
        this.slug = slug;
        this.stockQuantity = stockQuantity;
        this.attributes = attributes;
        this.price = price;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
