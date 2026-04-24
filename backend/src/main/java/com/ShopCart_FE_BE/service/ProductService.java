package com.ShopCart_FE_BE.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.repository.ProductRepository;

@Service
public class ProductService {
    
    private final ProductRepository productRepository;

    public ProductService(
        ProductRepository productRepository
    ) {
        this.productRepository = productRepository;
    }

    public List<ProductEntity> getAllProducts() {
        return this.productRepository.findAll();
    }

    public ProductEntity getProductById(Long productId) {
        return productRepository.findById(productId).orElseThrow(() -> new NotFoundResource("Không tìm thấy sản phẩm"));
    }

    public ProductEntity saveProduct(ProductEntity productEntity) {
        return productRepository.save(productEntity);
    }
}
