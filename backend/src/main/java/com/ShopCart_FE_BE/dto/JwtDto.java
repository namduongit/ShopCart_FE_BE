package com.ShopCart_FE_BE.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtDto {
    private Long id;
    private String name;
    private String email;
    private String token;
}
