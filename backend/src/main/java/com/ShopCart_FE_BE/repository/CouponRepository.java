package com.ShopCart_FE_BE.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ShopCart_FE_BE.entity.CouponEntity;

@Repository
public interface CouponRepository extends JpaRepository<CouponEntity, Long>{
    Optional<CouponEntity> findByName(String name);
}
