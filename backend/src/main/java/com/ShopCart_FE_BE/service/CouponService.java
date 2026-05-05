package com.ShopCart_FE_BE.service;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.CouponEntity;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.repository.CouponRepository;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(
            CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public List<CouponEntity> getAllCoupons() {
        return this.couponRepository.findAll();
    }

    public CouponEntity getCouponByName(String name) {
        return this.couponRepository.findByName(name)
                .orElseThrow(() -> new NotFoundResource("Không tìm thấy mã giảm giá"));
    }

    public CouponEntity checkCouponValid(String code) {
        CouponEntity coupon = this.getCouponByName(code);

        Date now = new Date(System.currentTimeMillis());
        if (coupon.getExpiryDate().before(now)) {
            throw new InvalidException("Mã giảm giá đã hết hạn");
        }

        if (!coupon.getStatus().toString().equals("ACTIVE")) {
            throw new InvalidException("Mã giảm giá không còn hiệu lực");
        }

        return coupon;
    }
}
