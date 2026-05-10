package com.ShopCart_FE_BE.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ShopCart_FE_BE.entity.InventoryEntity;
import com.ShopCart_FE_BE.entity.OrderEntity;
import com.ShopCart_FE_BE.entity.OrderItemEntity;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.entity.types.OrderStatus;
import com.ShopCart_FE_BE.entity.types.ProductStatus;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.repository.CouponRepository;
import com.ShopCart_FE_BE.repository.InventoryRepository;
import com.ShopCart_FE_BE.repository.OrderRepository;
import com.ShopCart_FE_BE.repository.ProductRepository;
import com.ShopCart_FE_BE.repository.UserRepository;
import com.ShopCart_FE_BE.request.CreatePurchaseRequest;
import com.ShopCart_FE_BE.request.CreatePurchaseRequest.PurchaseItem;

@ExtendWith(MockitoExtension.class)
@DisplayName("Order Service Unit Testing")
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    @DisplayName("Test createOrder() – tạo đơn hàng, trừ tồn kho")
    void createOrder_ShouldCreateOrderAndReduceStock() {
        Long userId = 1L;
        Long productId = 100L;
        UserEntity user = new UserEntity();
        user.setId(userId);
        user.setFullName("Test User");

        InventoryEntity inventory = new InventoryEntity();
        inventory.setStockQuantity(10);

        ProductEntity product = new ProductEntity();
        product.setId(productId);
        product.setName("Product A");
        product.setPrice(new BigDecimal("1000"));
        product.setStatus(ProductStatus.ACTIVE);
        product.setInventoryEntity(inventory);
        inventory.setProductEntity(product);

        CreatePurchaseRequest request = new CreatePurchaseRequest(
                List.of(new PurchaseItem(productId, 3)),
                "Test User", "0123456789", "Address", "COD", null
        );

        when(productRepository.findAllById(any())).thenReturn(List.of(product));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(orderRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        OrderEntity result = orderService.createOrder(userId, request);

        assertEquals(7, inventory.getStockQuantity());
        verify(orderRepository).save(any(OrderEntity.class));
        verify(inventoryRepository).save(inventory);
    }

    @Test
    @DisplayName("Test getOrderById() – lấy thông tin đơn hàng")
    void getOrderById_ShouldReturnOrderInfo() {
        Long userId = 1L;
        Long orderId = 100L;
        UserEntity user = new UserEntity();
        user.setId(userId);
        OrderEntity order = new OrderEntity();
        order.setId(orderId);
        order.setUserEntity(user);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        OrderEntity result = orderService.getOrderById(userId, orderId);

        assertEquals(orderId, result.getId());
        assertSame(user, result.getUserEntity());
    }

    @Test
    @DisplayName("Test cancelOrder() – hủy đơn, hoàn tồn kho")
    void cancelOrder_ShouldCancelOrderAndReturnStock() {
        Long userId = 1L;
        Long orderId = 100L;
        UserEntity user = new UserEntity();
        user.setId(userId);

        InventoryEntity inventory = new InventoryEntity();
        inventory.setStockQuantity(7);

        ProductEntity product = new ProductEntity();
        product.setStatus(ProductStatus.ACTIVE);
        product.setInventoryEntity(inventory);
        inventory.setProductEntity(product);

        OrderItemEntity item = new OrderItemEntity();
        item.setProductEntity(product);
        item.setQuantity(3);
        item.setTotal(new BigDecimal("3000"));

        OrderEntity order = new OrderEntity();
        order.setId(orderId);
        order.setUserEntity(user);
        order.setStatus(OrderStatus.PENDING);
        order.setOrderItemEntities(List.of(item));

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        orderService.cancelOrder(userId, orderId);

        assertEquals(10, inventory.getStockQuantity());
        assertEquals(OrderStatus.CANCELLED, order.getStatus());
        verify(orderRepository).save(order);
        verify(inventoryRepository).save(inventory);
    }

    @Test
    @DisplayName("Test calculateOrderTotal() – tính tổng giá chính xác")
    void calculateOrderTotal_ShouldCalculateAccurately() {
        OrderItemEntity item1 = new OrderItemEntity();
        item1.setTotal(new BigDecimal("100000"));
        
        OrderItemEntity item2 = new OrderItemEntity();
        item2.setTotal(new BigDecimal("200000"));
        
        // Shipping fee 50000 (SHIPPING_FEE constant in OrderService)
        BigDecimal result = orderService.calculateOrderTotal(List.of(item1, item2), null);
        
        assertEquals(new BigDecimal("350000"), result);
    }

    @Test
    @DisplayName("Test checkStockBeforeOrder() – kiểm tra tồn kho")
    void checkStockBeforeOrder_ShouldThrowExceptionWhenNotEnough() {
        Long productId = 100L;
        InventoryEntity inventory = new InventoryEntity();
        inventory.setStockQuantity(2);

        ProductEntity product = new ProductEntity();
        product.setName("Product A");
        product.setInventoryEntity(inventory);

        PurchaseItem item = new PurchaseItem(productId, 3);

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        InvalidException ex = assertThrows(InvalidException.class, () -> 
            orderService.checkStockBeforeOrder(List.of(item))
        );

        assertEquals("Sản phẩm 'Product A' không đủ tồn kho", ex.getMessage());
    }
}
