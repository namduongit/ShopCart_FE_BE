package com.ShopCart_FE_BE.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ShopCart_FE_BE.entity.CartEntity;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    
}
