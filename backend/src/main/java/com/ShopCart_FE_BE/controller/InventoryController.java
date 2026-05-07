package com.ShopCart_FE_BE.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.request.CheckStockRequest;
import com.ShopCart_FE_BE.service.InventoryService;
import com.ShopCart_FE_BE.utils.ResponseHelper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventories")
public class InventoryController {

    private final InventoryService inventoryService;


    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/checkStock")
    public ResponseEntity<Response<Boolean>> checkStock(
        @Valid @RequestBody CheckStockRequest request
    ) {
        return ResponseEntity.ok(
            ResponseHelper.Success(inventoryService.isAvailable(request))
        );
    }

    @PutMapping("/{productId}/decrease")
    public ResponseEntity<Response<Void>> decreaseStock(
            @PathVariable Long productId,
            @RequestParam int quantity) {
        this.inventoryService.decreaseStock(productId, quantity);

        return ResponseEntity
                .ok(ResponseHelper.Success(null));
    }

    @PutMapping("/{productId}/increase")
    public ResponseEntity<Response<Void>> increaseStock(
            @PathVariable Long productId,
            @RequestParam int quantity) {
        this.inventoryService.increaseStock(productId, quantity);

        return ResponseEntity
                .ok(ResponseHelper.Success(null));
    }
}
