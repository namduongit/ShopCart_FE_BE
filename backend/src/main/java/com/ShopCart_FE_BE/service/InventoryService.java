package com.ShopCart_FE_BE.service;

import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.InventoryEntity;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.exception.NotFoundResource;
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

    public boolean isAvailable(Long productId, int quantity) {
        InventoryEntity inventory = this.inventoryRepository
                    .findByProductEntityId(productId)
                    .orElseThrow(() -> new NotFoundResource("Inventory with id " + productId + " not found"));

        if (quantity <= 0) throw new InvalidException("Quantity must be greater than 0");
        
        return inventory.getStockQuantity() >= quantity;
    }

    public void decreaseStock(Long productId, int quantity) {
        InventoryEntity inv = this.inventoryRepository
                .findByProductEntityId(productId)
                .orElseThrow(() -> new NotFoundResource("Inventory with id " + productId + " not found"));
    
        if (quantity <= 0) throw new InvalidException("Quantity must be greater than 0");

        if (inv.getStockQuantity() < quantity) throw new InvalidException("Not enough stock");

        inv.setStockQuantity(inv.getStockQuantity() - quantity);

        this.inventoryRepository.save(inv);
    }

    public void increaseStock(Long productId, int quantity) {
        InventoryEntity inv = this.inventoryRepository
            .findByProductEntityId(productId)
            .orElseThrow(() -> new NotFoundResource("Inventory with id " + productId + " not found"));

        inv.setStockQuantity(inv.getStockQuantity() + quantity);

        this.inventoryRepository.save(inv);
    }
}
