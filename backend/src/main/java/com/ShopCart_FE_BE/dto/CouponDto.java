package com.ShopCart_FE_BE.dto;

import java.math.BigDecimal;
import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor  
@AllArgsConstructor
public class CouponDto {
    private Long id;
    private String name;
    private BigDecimal value;
    private String status;
    private Date expiryDate;
    /** true nếu coupon còn hiệu lực (chưa hết hạn và status = ACTIVE) */
    private Boolean isValid;
}
