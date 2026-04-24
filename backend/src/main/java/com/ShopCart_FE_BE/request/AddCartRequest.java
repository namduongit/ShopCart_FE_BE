package com.ShopCart_FE_BE.request;

import jakarta.validation.constraints.NotNull;

public class AddCartRequest {
    @NotNull(message = "Yêu cầu gửi mã sản phẩm")
    private Long productId;
    @NotNull(message = "Yêu cầu gửi số lượng")
    private Integer quantity;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
