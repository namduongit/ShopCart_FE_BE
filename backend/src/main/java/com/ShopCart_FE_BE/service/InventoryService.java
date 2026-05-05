package com.ShopCart_FE_BE.service;

import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.CartEntity;
import com.ShopCart_FE_BE.entity.InventoryEntity;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.repository.CartRepository;
import com.ShopCart_FE_BE.repository.InventoryRepository;
import java.util.List;

@Service
public class InventoryService {
    
    private final InventoryRepository inventoryRepository;
    private final CartRepository cartRepository;

    public InventoryService(
        InventoryRepository inventoryRepository,
        CartRepository cartRepository
    ) {
        this.inventoryRepository = inventoryRepository;
        this.cartRepository = cartRepository;
    } 

    public InventoryEntity saveInventory(InventoryEntity inventoryEntity) {
        return this.inventoryRepository.save(inventoryEntity);
    }

    // update this method with new checking logic later
    public boolean isAvailable(Long productId, int quantity) {
        if (quantity <= 0) throw new InvalidException("Số lượng phải lớn hơn 0");
        
        return this.getAvailableQuantity(productId) >= quantity;
    }

    public void decreaseStock(Long productId, int quantity) {
        InventoryEntity inv = this.inventoryRepository
                .findByProductEntityId(productId)
                .orElseThrow(() -> new NotFoundResource("Inventory with id " + productId + " not found"));
    
        if (quantity <= 0) throw new InvalidException("Số lượng phải lớn hơn 0");

        if (inv.getStockQuantity() < quantity) throw new InvalidException("Không đủ hàng tồn kho");

        inv.setStockQuantity(inv.getStockQuantity() - quantity);

        this.inventoryRepository.save(inv);
    }

    public void increaseStock(Long productId, int quantity) {
        InventoryEntity inv = this.inventoryRepository
            .findByProductEntityId(productId)
            .orElseThrow(() -> new NotFoundResource("Inventory with id " + productId + " not found"));

        if (quantity <= 0 ) throw new InvalidException("Quantity must be greater than 0");

        inv.setStockQuantity(inv.getStockQuantity() + quantity);

        this.inventoryRepository.save(inv);
    }

    // shoule be removed later when product has availability checking logic
    public int getAvailableQuantity(Long productId) {
        int reservedQuantity = 0;

        InventoryEntity inv = this.inventoryRepository
            .findByProductEntityId(productId)
            .orElseThrow(() -> new NotFoundResource("Inventory with id " + productId + " not found"));

        List<CartEntity> cartList = this.cartRepository
            .findByProductEntityId(productId);

        for (CartEntity prod : cartList) {
            reservedQuantity += prod.getQuantity();
        }

        return inv.getStockQuantity() - reservedQuantity;
    }
}
