package com.ShopCart_FE_BE.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ShopCart_FE_BE.entity.InventoryEntity;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryEntity, Long> {
    
    Optional<InventoryEntity> findByProductEntityId(Long productId);

}
