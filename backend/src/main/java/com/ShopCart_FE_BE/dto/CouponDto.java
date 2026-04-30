package com.ShopCart_FE_BE.dto;

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
    private String status;
    private Date expirateDate;
}
