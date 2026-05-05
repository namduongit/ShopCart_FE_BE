package com.ShopCart_FE_BE.service;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.CouponEntity;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.repository.CouponRepository;

@Service
public class CouponService {
    
    private final CouponRepository couponRepository;

    public CouponService(
        CouponRepository couponRepository
    ) {
        this.couponRepository = couponRepository;
    }

    /**
     * Lấy tất cả danh sách coupon
     *
     * @return List<CouponEntity>
     */
    public List<CouponEntity> getAllCoupons() {
        return this.couponRepository.findAll();
    }

    /**
     * Tìm coupon theo mã (name)
     *
     * @param name
     * @return CouponEntity
     */
    public CouponEntity getCouponByName(String name) {
        return this.couponRepository.findByName(name)
                .orElseThrow(() -> new NotFoundResource("Không tìm thấy mã giảm giá"));
    }

    /**
     * Kiểm tra coupon còn hiệu lực không:
     *  - Phải tồn tại theo mã
     *  - Status phải là ACTIVE
     *  - Ngày hiện tại không vượt quá expiryDate
     *
     * @param name mã coupon cần kiểm tra
     * @return CouponEntity nếu hợp lệ
     * @throws NotFoundResource  nếu không tìm thấy
     * @throws com.ShopCart_FE_BE.exception.InvalidException nếu hết hạn hoặc bị vô hiệu
     */
    public CouponEntity checkCouponValid(String name) {
        CouponEntity couponEntity = this.getCouponByName(name);

        Date now = new Date(System.currentTimeMillis());

        if (couponEntity.getExpiryDate().before(now)) {
            throw new com.ShopCart_FE_BE.exception.InvalidException("Mã giảm giá đã hết hạn");
        }

        if (!couponEntity.getStatus().toString().equals("ACTIVE")) {
            throw new com.ShopCart_FE_BE.exception.InvalidException("Mã giảm giá không còn hiệu lực");
        }

        return couponEntity;
    }
}
