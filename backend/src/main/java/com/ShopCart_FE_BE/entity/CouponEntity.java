package com.ShopCart_FE_BE.entity;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import com.ShopCart_FE_BE.entity.types.CouponStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal value;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CouponStatus status;
    
    @Column(nullable = false)
    private Date expiryDate;

    @OneToMany(mappedBy = "couponEntity", cascade = CascadeType.ALL)
    private List<OrderEntity> orderEntities;
}
