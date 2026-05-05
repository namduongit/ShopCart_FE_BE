package com.ShopCart_FE_BE.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.CartEntity;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.repository.CartRepository;
import com.ShopCart_FE_BE.repository.ProductRepository;
import com.ShopCart_FE_BE.repository.UserRepository;
import com.ShopCart_FE_BE.request.AddToCartRequest;
import com.ShopCart_FE_BE.request.RemoveFromCartRequest;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
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
     * * FLOW: Get ExistCart & User & Product -> Check stock -> Save cart
     * 
     * @param userId
     * @param request
     * @return CartEntity
     */
    public CartEntity addToCart(Long userId, AddToCartRequest request) {
        CartEntity existCartEntity = this.cartRepository
                .findByUserEntityIdAndProductEntityId(userId, request.getProductId())
                .orElse(null);

        ProductEntity productEntity = this.productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundResource("Không tìm thấy sản phẩm"));
        UserEntity userEntity = this.userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundResource("Không tìm thấy người dùng"));

        if (existCartEntity == null) {
            existCartEntity = new CartEntity();
            existCartEntity.setProductEntity(productEntity);
            existCartEntity.setUserEntity(userEntity);
            existCartEntity.setQuantity(0);
        }

        if (request.getQuantity() > productEntity.getStockAvailable()) {
            throw new InvalidException(
                    "Số lượng khả dụng còn lại không đủ (" + productEntity.getStockAvailable() + ") sản phẩm");
        }

        if (productEntity.getStatus().toString().equals("INACTIVE")) {
            throw new InvalidException("Sản phẩm đang bị khóa");
        }

        if (productEntity.getInventoryEntity()
                .getStockQuantity() < (existCartEntity.getQuantity() + request.getQuantity())) {
            throw new InvalidException("Kho không đủ số lượng để thêm vào giỏ");
        }

        existCartEntity.setQuantity(existCartEntity.getQuantity() + request.getQuantity());

        return this.cartRepository.save(existCartEntity);
    }

    /**
     * Remove quantity from user's cart
     * 
     * * FLOW: Get ExistCart -> Check quantity -> Remove if 0 -> Save cart
     * 
     * @param userId
     * @param request
     * @return null or CartEntity
     */
    public CartEntity removeFromCart(Long userId, RemoveFromCartRequest request) {
        CartEntity existCartEntity = this.cartRepository
                .findByUserEntityIdAndProductEntityId(userId, request.getProductId())
                .orElse(null);

        if (existCartEntity == null) {
            throw new NotFoundResource("Chưa có sản phẩm này trong giỏ hàng");
        }

        if (existCartEntity.getQuantity() < request.getQuantity()) {
            throw new InvalidException("Số lượng trong giỏ không đủ so với yêu cầu xóa");
        }

        existCartEntity.setQuantity(existCartEntity.getQuantity() - request.getQuantity());
        if (existCartEntity.getQuantity() == 0) {
            this.cartRepository.delete(existCartEntity);
            return null;
        }

        return this.cartRepository.save(existCartEntity);
    }

    public void clearCart(Long userId) {
        List<CartEntity> cartEntities = this.cartRepository.findByUserId(userId);
        this.cartRepository.deleteAll(cartEntities);
    }
}
