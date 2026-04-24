package com.ShopCart_FE_BE.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ShopCart_FE_BE.entity.CartEntity;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    @Query("SELECT c FROM CartEntity c WHERE c.userEntity.id = :userId AND c.productEntity.id = :productId")
    Optional<CartEntity> findByUserEntityIdAndProductEntityId(Long userId, Long productId);
}
