package com.ShopCart_FE_BE.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ShopCart_FE_BE.entity.InventoryEntity;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryEntity, Long> {
    
}
