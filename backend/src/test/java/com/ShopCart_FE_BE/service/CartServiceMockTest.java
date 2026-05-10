package com.ShopCart_FE_BE.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ShopCart_FE_BE.entity.CartEntity;
import com.ShopCart_FE_BE.entity.InventoryEntity;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.entity.types.ProductStatus;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.repository.CartRepository;
import com.ShopCart_FE_BE.repository.ProductRepository;
import com.ShopCart_FE_BE.repository.UserRepository;
import com.ShopCart_FE_BE.request.AddToCartRequest;
import com.ShopCart_FE_BE.request.RemoveFromCartRequest;

@ExtendWith(MockitoExtension.class)
@DisplayName("Cart Service Mock Testing")
public class CartServiceMockTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    @DisplayName("a) Test addToCart() - Thêm sản phẩm thành công")
    void addToCart_Success_ShouldSaveNewCart() {
        Long userId = 1L;
        Long productId = 100L;
        AddToCartRequest request = new AddToCartRequest(productId, 2);
        
        ProductEntity product = createProduct(productId, "Product A", 10);
        UserEntity user = createUser(userId);

        when(cartRepository.findByUserEntityIdAndProductEntityId(userId, productId)).thenReturn(Optional.empty());
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(cartRepository.save(any(CartEntity.class))).thenAnswer(i -> i.getArguments()[0]);

        CartEntity result = cartService.addToCart(userId, request);

        assertNotNull(result);
        assertEquals(2, result.getQuantity());
        assertEquals(product, result.getProductEntity());
        assertEquals(user, result.getUserEntity());
        verify(cartRepository).save(any(CartEntity.class));
    }

    @Test
    @DisplayName("a) Test addToCart() - Thêm sản phẩm đã có trong giỏ (cộng dồn số lượng)")
    void addToCart_AlreadyInCart_ShouldIncrementQuantity() {
        Long userId = 1L;
        Long productId = 100L;
        AddToCartRequest request = new AddToCartRequest(productId, 3);
        
        ProductEntity product = createProduct(productId, "Product A", 10);
        UserEntity user = createUser(userId);
        CartEntity existingCart = new CartEntity(1L, 2, user, product);
        
        // Cập nhật ProductEntity để getStockAvailable() phản ánh đúng thực tế (nếu cần)
        product.setCartEntities(new ArrayList<>());
        product.getCartEntities().add(existingCart);

        when(cartRepository.findByUserEntityIdAndProductEntityId(userId, productId)).thenReturn(Optional.of(existingCart));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(cartRepository.save(any(CartEntity.class))).thenAnswer(i -> i.getArguments()[0]);

        CartEntity result = cartService.addToCart(userId, request);

        assertEquals(5, result.getQuantity()); // 2 + 3
        verify(cartRepository).save(existingCart);
    }

    @Test
    @DisplayName("a) Test addToCart() - Thêm khi tồn kho không đủ")
    void addToCart_InsufficientStock_ShouldThrowInvalidException() {
        Long userId = 1L;
        Long productId = 100L;
        AddToCartRequest request = new AddToCartRequest(productId, 11); // Yêu cầu 11 trong khi chỉ có 10
        
        ProductEntity product = createProduct(productId, "Product A", 10);
        UserEntity user = createUser(userId);

        when(cartRepository.findByUserEntityIdAndProductEntityId(userId, productId)).thenReturn(Optional.empty());
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        InvalidException ex = assertThrows(InvalidException.class, () -> cartService.addToCart(userId, request));
        assertEquals("Số lượng khả dụng còn lại không đủ (10) sản phẩm", ex.getMessage());
        verify(cartRepository, never()).save(any());
    }

    @Test
    @DisplayName("a) Test addToCart() - Thêm sản phẩm không tồn tại")
    void addToCart_ProductNotFound_ShouldThrowNotFoundResource() {
        Long userId = 1L;
        Long productId = 999L;
        AddToCartRequest request = new AddToCartRequest(productId, 1);

        when(cartRepository.findByUserEntityIdAndProductEntityId(userId, productId)).thenReturn(Optional.empty());
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        NotFoundResource ex = assertThrows(NotFoundResource.class, () -> cartService.addToCart(userId, request));
        assertEquals("Không tìm thấy sản phẩm", ex.getMessage());
    }

    @Test
    @DisplayName("b) Test removeFromCart() - Xóa một phần số lượng")
    void removeFromCart_PartialRemoval_ShouldDecrementQuantity() {
        Long userId = 1L;
        Long productId = 100L;
        RemoveFromCartRequest request = new RemoveFromCartRequest(productId, 2);
        
        CartEntity existingCart = new CartEntity(1L, 5, null, null);

        when(cartRepository.findByUserEntityIdAndProductEntityId(userId, productId)).thenReturn(Optional.of(existingCart));
        when(cartRepository.save(any(CartEntity.class))).thenAnswer(i -> i.getArguments()[0]);

        CartEntity result = cartService.removeFromCart(userId, request);

        assertNotNull(result);
        assertEquals(3, result.getQuantity()); // 5 - 2
        verify(cartRepository).save(existingCart);
    }

    @Test
    @DisplayName("b) Test removeFromCart() - Xóa toàn bộ sản phẩm")
    void removeFromCart_FullRemoval_ShouldDeleteCartEntry() {
        Long userId = 1L;
        Long productId = 100L;
        RemoveFromCartRequest request = new RemoveFromCartRequest(productId, 5);
        
        CartEntity existingCart = new CartEntity(1L, 5, null, null);

        when(cartRepository.findByUserEntityIdAndProductEntityId(userId, productId)).thenReturn(Optional.of(existingCart));

        CartEntity result = cartService.removeFromCart(userId, request);

        assertNull(result);
        verify(cartRepository).delete(existingCart);
        verify(cartRepository, never()).save(any());
    }

    // Helper methods
    private ProductEntity createProduct(Long id, String name, int stockQuantity) {
        InventoryEntity inventory = new InventoryEntity();
        inventory.setStockQuantity(stockQuantity);

        ProductEntity product = new ProductEntity();
        product.setId(id);
        product.setName(name);
        product.setPrice(BigDecimal.valueOf(100));
        product.setStatus(ProductStatus.ACTIVE);
        product.setInventoryEntity(inventory);
        inventory.setProductEntity(product);
        product.setCartEntities(new ArrayList<>());
        return product;
    }

    private UserEntity createUser(Long id) {
        UserEntity user = new UserEntity();
        user.setId(id);
        user.setFullName("Nguyen Van A");
        return user;
    }
}
