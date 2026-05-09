package com.ShopCart_FE_BE.service;

import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.InventoryEntity;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.repository.InventoryRepository;
import com.ShopCart_FE_BE.repository.ProductRepository;
import com.ShopCart_FE_BE.request.CheckStockRequest;
import com.ShopCart_FE_BE.request.CheckStockRequest.CheckStockItem;

@Service
public class InventoryService {
    
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    public InventoryService(
        InventoryRepository inventoryRepository,
        ProductRepository productRepository
    ) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
    } 

    public InventoryEntity saveInventory(InventoryEntity inventoryEntity) {
        return this.inventoryRepository.save(inventoryEntity);
    }

    public boolean isAvailable(CheckStockRequest request) {
        for (CheckStockItem item : request.getItems()) {
            if (item.getQuantity() <= 0) throw new InvalidException("Số lượng sản phẩm phải lớn hơn 0");

            ProductEntity prod = productRepository.findById(
                item.getProductId()
            ).orElseThrow(() -> new InvalidException("Không tìm thấy sản phẩm với id " + item.getProductId()));

            if (prod.getStockAvailable() < item.getQuantity()) return false;
        }
        
        return true;
    }

    public void decreaseStock(Long productId, int quantity) {
        InventoryEntity inv = this.inventoryRepository
                .findByProductEntityId(productId)
                .orElseThrow(() -> new NotFoundResource("Không tìm thấy inventory với id " + productId));
    
        if (quantity <= 0) throw new InvalidException("Số lượng phải lớn hơn 0");

        if (inv.getStockQuantity() < quantity) throw new InvalidException("Không đủ hàng tồn kho");

        inv.setStockQuantity(inv.getStockQuantity() - quantity);

        this.inventoryRepository.save(inv);
    }

    public void increaseStock(Long productId, int quantity) {
        InventoryEntity inv = this.inventoryRepository
            .findByProductEntityId(productId)
            .orElseThrow(() -> new NotFoundResource("Không tìm thấy inventory với id " + productId));

        if (quantity <= 0 ) throw new InvalidException("Số lượng phải lớn hơn 0");

        inv.setStockQuantity(inv.getStockQuantity() + quantity);

        this.inventoryRepository.save(inv);
    }

}
