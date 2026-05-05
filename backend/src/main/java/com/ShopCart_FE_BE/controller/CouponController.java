package com.ShopCart_FE_BE.controller;

import java.sql.Date;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.dto.CouponDto;
import com.ShopCart_FE_BE.entity.CouponEntity;
import com.ShopCart_FE_BE.service.CouponService;
import com.ShopCart_FE_BE.utils.ResponseHelper;

@RestController
@RequestMapping("/api/coupons/")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    private CouponDto toCouponDto(CouponEntity entity) {
        Date now = new Date(System.currentTimeMillis());
        boolean isActive = entity.getStatus().toString().equals("ACTIVE");
        boolean notExpired = !entity.getExpiryDate().before(now);
        boolean isValid = isActive && notExpired;

        return new CouponDto(
                entity.getId(),
                entity.getName(),
                entity.getValue(),
                entity.getStatus().toString(),
                entity.getExpiryDate(),
                entity.getMinimumPurchaseAmount(),
                isValid);
    }

    @GetMapping("")
    public ResponseEntity<Response<List<CouponDto>>> getAllCoupons() {
        List<CouponEntity> coupons = this.couponService.getAllCoupons();

        List<CouponDto> couponDtos = coupons.stream()
                .map(this::toCouponDto)
                .toList();

        return ResponseEntity.ok(ResponseHelper.Success(couponDtos));
    }

    @GetMapping("{code}")
    public ResponseEntity<Response<CouponDto>> getCouponByCode(
            @PathVariable String code) {
        CouponEntity couponEntity = this.couponService.getCouponByName(code);
        return ResponseEntity.ok(ResponseHelper.Success(toCouponDto(couponEntity)));
    }

    @GetMapping("{code}/check")
    public ResponseEntity<Response<CouponDto>> checkCoupon(
            @PathVariable String code) {
        CouponEntity couponEntity = this.couponService.checkCouponValid(code);
        return ResponseEntity.ok(ResponseHelper.Success(toCouponDto(couponEntity)));
    }
}
