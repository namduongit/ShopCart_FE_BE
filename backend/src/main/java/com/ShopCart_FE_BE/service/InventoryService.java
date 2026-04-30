package com.ShopCart_FE_BE.service;

import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.InventoryEntity;
import com.ShopCart_FE_BE.repository.InventoryRepository;

@Service
public class InventoryService {
    
    private final InventoryRepository inventoryRepository;

    public InventoryService(
        InventoryRepository inventoryRepository
    ) {
        this.inventoryRepository = inventoryRepository;
    } 

    public InventoryEntity saveInventory(InventoryEntity inventoryEntity) {
        return this.inventoryRepository.save(inventoryEntity);
    }
}
