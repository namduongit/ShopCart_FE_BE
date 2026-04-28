package com.ShopCart_FE_BE.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.dto.ProductDto;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.service.ProductService;
import com.ShopCart_FE_BE.utils.ResponseHelper;

@RestController
@RequestMapping("/w-version/api/products/")
public class ProductController {
    private final ProductService productService;

    public ProductController(
        ProductService productService
    ) {
        this.productService = productService;
    }

    @GetMapping("")
    public ResponseEntity<Response<List<ProductDto>>> getAllProduct() {
        List<ProductEntity> productEntities = this.productService.getAllProducts();

        Response<List<ProductDto>> response = ResponseHelper.Success(
            productEntities.stream()
            .map(entity -> new ProductDto(
                entity.getId(),
                entity.getMainImageUrl(),
                entity.getImageUrls(),
                entity.getName(),
                entity.getSlug(),
                entity.getStockQuantity(),
                entity.getAttributes(),
                entity.getPrice(),
                entity.getStatus().toString()
            ))
            .collect(Collectors.toList())
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("{id}")
    public ResponseEntity<Response<ProductDto>> getProductById(@PathVariable(name = "id", required = true) Long id) {
        ProductEntity productEntity = this.productService.getProductById(id);

        ProductDto productDto = new ProductDto(
            productEntity.getId(),
            productEntity.getMainImageUrl(),
            productEntity.getImageUrls(),
            productEntity.getName(),
            productEntity.getSlug(),
            productEntity.getStockQuantity(),
            productEntity.getAttributes(),
            productEntity.getPrice(),
            productEntity.getStatus().toString()
        );

        Response<ProductDto> response = ResponseHelper.Success(productDto);
        return ResponseEntity.ok(response);
    }
}
