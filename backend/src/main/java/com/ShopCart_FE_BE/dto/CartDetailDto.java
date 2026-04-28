package com.ShopCart_FE_BE.dto;

import java.math.BigDecimal;
import java.util.List;

public class CartDetailDto {
    List<CartDto> carts;
    private Integer totalQuantity;
    private BigDecimal totalPrice; 

    public CartDetailDto() { }

    public CartDetailDto(List<CartDto> carts, Integer totalQuantity, BigDecimal totalPrice) {
        this.carts = carts;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    public List<CartDto> getCarts() {
        return carts;
    }
    
    public void setCarts(List<CartDto> carts) {
        this.carts = carts;
    }
    
    public Integer getTotalQuantity() {
        return totalQuantity;
    }
    
    public void setTotalQuantity(Integer totalQuantity) {
        this.totalQuantity = totalQuantity;
    }
    
    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}
