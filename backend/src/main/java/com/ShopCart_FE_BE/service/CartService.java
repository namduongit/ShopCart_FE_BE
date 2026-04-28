package com.ShopCart_FE_BE.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.CartEntity;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.repository.CartRepository;
import com.ShopCart_FE_BE.request.AddCartRequest;

@Service
public class CartService {
    private final CartRepository cartRepository;

    private final ProductService productService;
    private final UserService userService;

    public CartService(
            CartRepository cartRepository,
            ProductService productService,
            UserService userService) {
        this.cartRepository = cartRepository;
        this.productService = productService;
        this.userService = userService;
    }

    /**
     * Get carts by user Id
     * 
     * @param userId
     * @return List<CartEntity>
     */
    public List<CartEntity> getAllCartsByUserId(Long userId) {
        return this.cartRepository.findByUserId(userId);
    }

    /**
     * Add new cart
     * 
     * * FLOW: Get User & Product -> Check stock -> Save cart
     * 
     * @param userId
     * @param request
     * @return CartEntity
     */
    public CartEntity addToCart(Long userId, AddCartRequest request) {
        UserEntity userEntity = this.userService.getUserById(userId);
        ProductEntity productEntity = this.productService.getProductById(request.getProductId());
        CartEntity existingCart = this.cartRepository
                .findByUserEntityIdAndProductEntityId(userId, request.getProductId())
                .orElse(new CartEntity());

        if (productEntity.getStockQuantity() <= 0) {
            throw new InvalidException("Sản phẩm đã hết hàng");
        }

        if (productEntity.getStockQuantity() < request.getQuantity()) {
            throw new InvalidException("Không đủ số lượng đặt hàng");
        }

        if (productEntity.getReservedStockQuantity() + request.getQuantity() > productEntity.getStockQuantity()) {
            throw new InvalidException("Không đủ số lượng đặt hàng");
        }

        if (!productEntity.getStatus().toString().equals("ACTIVE")) {
            throw new InvalidException("Sản phẩm không khả dụng");
        }
        // ? Update productEntity
        // * If reverved stock + new quantity >= stock quantity -> set status INACTIVE
        productEntity.setReservedStockQuantity(
                productEntity.getReservedStockQuantity() + request.getQuantity());

        // if (productEntity.getReservedStockQuantity() + request.getQuantity() == productEntity.getStockQuantity()) {
        //     productEntity.setStatus("INACTIVE");
        // }
        this.productService.saveProduct(productEntity);

        // Initialize CartEntity before save
        if (existingCart.getUserEntity() == null) {
            existingCart.setUserEntity(userEntity);
        }
        if (existingCart.getProductEntity() == null) {
            existingCart.setProductEntity(productEntity);
        }
        existingCart.setQuantity(existingCart.getQuantity() + request.getQuantity());

        return this.cartRepository.save(existingCart);
    }
}
