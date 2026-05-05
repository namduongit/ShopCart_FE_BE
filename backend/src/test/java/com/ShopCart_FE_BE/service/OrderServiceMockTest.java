package com.ShopCart_FE_BE.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ShopCart_FE_BE.entity.CouponEntity;
import com.ShopCart_FE_BE.entity.InventoryEntity;
import com.ShopCart_FE_BE.entity.OrderEntity;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.entity.types.CouponStatus;
import com.ShopCart_FE_BE.entity.types.OrderStatus;
import com.ShopCart_FE_BE.repository.CouponRepository;
import com.ShopCart_FE_BE.repository.InventoryRepository;
import com.ShopCart_FE_BE.repository.OrderRepository;
import com.ShopCart_FE_BE.repository.ProductRepository;
import com.ShopCart_FE_BE.repository.UserRepository;
import com.ShopCart_FE_BE.request.CreatePurchaseRequest;
import com.ShopCart_FE_BE.request.CreatePurchaseRequest.PurchaseItem;

import net.bytebuddy.asm.Advice.Argument;

@ExtendWith(MockitoExtension.class)
@DisplayName("Order Service Mock Testing")
public class OrderServiceMockTest {
    
    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    @DisplayName("Testing makePurchase method without coupon, should create new order and reduce stock in inventory")
    void makePurchase_withoutCoupon_shouldCreateOrderAndReduceInventory() {

        // arrange
        Long userId = 1L;
        Long productId = 100L;

        InventoryEntity inventory = new InventoryEntity();
        inventory.setId(10L);
        inventory.setStockQuantity(10);

        ProductEntity product = new ProductEntity();
        product.setId(productId);
        product.setName("Keyboard");
        product.setPrice(BigDecimal.valueOf(100));
        product.setInventoryEntity(inventory);
        inventory.setProductEntity(product);

        UserEntity user = new UserEntity();
        user.setId(userId);
        user.setFullName("Nguyen Van A");
        user.setEmail("a@example.com");
        user.setPassword("password-mahoa");

        CreatePurchaseRequest request = new CreatePurchaseRequest(
                List.of(new PurchaseItem(productId, 3)),
                "123 Test Street",
                null,
                "Nguyen Van A");

        when(productRepository.findAllById(List.of(productId))).thenReturn(List.of(product));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(inventoryRepository.save(any(InventoryEntity.class))).thenAnswer(obj -> obj.getArgument(0));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(obj -> obj.getArgument(0));



        // act
        OrderEntity result = orderService.makePurchase(userId, request);


        // assert
        ArgumentCaptor<InventoryEntity> inventoryCaptor = ArgumentCaptor.forClass(InventoryEntity.class);
        ArgumentCaptor<OrderEntity> orderCaptor = ArgumentCaptor.forClass(OrderEntity.class);

        verify(productRepository).findAllById(List.of(productId));
        verify(userRepository).findById(userId);
        verify(inventoryRepository).save(inventoryCaptor.capture());
        verify(orderRepository).save(orderCaptor.capture());
        verify(couponRepository, never()).findByName(any());

        InventoryEntity savedInventory = inventoryCaptor.getValue();
        OrderEntity savedOrder = orderCaptor.getValue();

        assertEquals(7, savedInventory.getStockQuantity());
        assertEquals(OrderStatus.PENDING, savedOrder.getStatus());
        assertEquals(BigDecimal.valueOf(300), savedOrder.getTotalAmount());
        assertEquals(3, savedOrder.getTotalQuantity());
        assertEquals("Nguyen Van A", savedOrder.getFullName());
        assertEquals("123 Test Street", savedOrder.getAddress());
        assertSame(user, savedOrder.getUserEntity());
        assertNull(savedOrder.getCouponEntity());
        assertEquals(1, savedOrder.getOrderItemEntities().size());
        assertEquals(3, savedOrder.getOrderItemEntities().get(0).getQuantity());
        assertEquals(BigDecimal.valueOf(300), savedOrder.getOrderItemEntities().get(0).getTotal());
        assertSame(product, savedOrder.getOrderItemEntities().get(0).getProductEntity());
        assertSame(savedOrder, savedOrder.getOrderItemEntities().get(0).getOrderEntity());
        assertSame(savedOrder, result);
    }

    @Test
    @DisplayName("Testing makePurchase method with coupon applying")
    void makePurchase_withCoupon_shouldApplyCouponAndCreateOrder() {

        // arrange
        Long userId = 1L;
        Long productId = 100L;

        InventoryEntity inventoryEntity = new InventoryEntity();
        inventoryEntity.setId(1L);
        inventoryEntity.setStockQuantity(10);

        ProductEntity productEntity = new ProductEntity();
        productEntity.setId(productId);
        productEntity.setName("Keyboard");
        productEntity.setPrice(BigDecimal.valueOf(100));
        productEntity.setInventoryEntity(inventoryEntity);
        inventoryEntity.setProductEntity(productEntity);

        CouponEntity couponEntity = new CouponEntity();
        couponEntity.setId(1L);
        couponEntity.setName("magiamgia");
        couponEntity.setValue(BigDecimal.valueOf(10));
        couponEntity.setStatus(CouponStatus.ACTIVE);
        couponEntity.setExpiryDate(Date.valueOf("2030-09-02"));

        UserEntity userEntity = new UserEntity();
        userEntity.setId(userId);
        userEntity.setFullName("nguyen van a");
        userEntity.setEmail("nguyenvana@gmail.com");
        userEntity.setPassword("password-mahoa");
        
        CreatePurchaseRequest request = new CreatePurchaseRequest(
            List.of(new PurchaseItem(productId, 3)),
            "100 abc",
            "magiamgia",
            "nguyen van a"
        );

        when(this.productRepository.findAllById(List.of(productId))).thenReturn(List.of(productEntity));
        when(this.userRepository.findById(userId)).thenReturn(Optional.of(userEntity));
        when(this.inventoryRepository.save(any(InventoryEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(this.couponRepository.findByName("magiamgia")).thenReturn(Optional.of(couponEntity));
        when(this.orderRepository.save(any(OrderEntity.class))).thenAnswer(inv -> inv.getArgument(0));


        // act
        OrderEntity orderEntity = orderService.makePurchase(userId, request);


        // assert
        ArgumentCaptor<InventoryEntity> inventoryCaptor = ArgumentCaptor.forClass(InventoryEntity.class);
        ArgumentCaptor<OrderEntity> orderCaptor = ArgumentCaptor.forClass(OrderEntity.class);

        verify(productRepository).findAllById(List.of(productId));
        verify(userRepository).findById(userId);
        verify(inventoryRepository).save(inventoryCaptor.capture());
        verify(orderRepository).save(orderCaptor.capture());
        verify(couponRepository).findByName("magiamgia");

        InventoryEntity savedInventory = inventoryCaptor.getValue();
        OrderEntity savedOrder = orderCaptor.getValue();

        assertEquals(7, savedInventory.getStockQuantity());
        assertEquals(BigDecimal.valueOf(290), savedOrder.getTotalAmount());
        assertEquals(3, savedOrder.getTotalQuantity());
        assertEquals("100 abc", savedOrder.getAddress());
        assertEquals("nguyen van a", savedOrder.getFullName());
        assertEquals(OrderStatus.PENDING, savedOrder.getStatus());
        assertSame(couponEntity, savedOrder.getCouponEntity());
        assertSame(userEntity, savedOrder.getUserEntity());
        assertEquals(1, savedOrder.getOrderItemEntities().size());
        assertEquals(3, savedOrder.getOrderItemEntities().get(0).getQuantity());
        assertEquals(BigDecimal.valueOf(300), savedOrder.getOrderItemEntities().get(0).getTotal());
        assertSame(productEntity, savedOrder.getOrderItemEntities().get(0).getProductEntity());
        assertSame(savedOrder, orderEntity);
    }

    @Test
    @DisplayName("test")
    void makePurchase_withCouponValueGreaterThanTotal_shouldApplyCouponAndCreateOrder() {
        
        // arrange
        Long productId = 100L;
        Long userId = 1L;

        InventoryEntity inventoryEntity = new InventoryEntity();
        inventoryEntity.setId(1L);
        inventoryEntity.setStockQuantity(10);

        ProductEntity productEntity = new ProductEntity();
        productEntity.setId(productId);
        productEntity.setName("Keyboard");
        productEntity.setPrice(BigDecimal.valueOf(100));
        productEntity.setInventoryEntity(inventoryEntity);
        inventoryEntity.setProductEntity(productEntity);

        UserEntity userEntity = new UserEntity();
        userEntity.setId(userId);
        userEntity.setFullName("nguyen van a");
        userEntity.setEmail("nguyenvana@gmail.com");
        userEntity.setPassword("password-mahoa");

        CouponEntity couponEntity = new CouponEntity();
        couponEntity.setId(1L);
        couponEntity.setName("magiamgia");
        couponEntity.setValue(BigDecimal.valueOf(3000));
        couponEntity.setExpiryDate(Date.valueOf("2030-09-02"));
        
        CreatePurchaseRequest request = new CreatePurchaseRequest(
            List.of(new PurchaseItem(productId, 3)),
            "123 abc",
            "magiamgia",
            "nguyen van a"
        );

        when(this.productRepository.findAllById(List.of(productId))).thenReturn(List.of(productEntity));
        when(this.userRepository.findById(userId)).thenReturn(Optional.of(userEntity));
        when(this.couponRepository.findByName("magiamgia")).thenReturn(Optional.of(couponEntity));
        when(this.inventoryRepository.save(any(InventoryEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(this.orderRepository.save(any(OrderEntity.class))).thenAnswer(inv -> inv.getArgument(0));


        // act
        OrderEntity order = orderService.makePurchase(userId, request);


        // assert
        ArgumentCaptor<InventoryEntity> inventoryCaptor = ArgumentCaptor.forClass(InventoryEntity.class);
        ArgumentCaptor<OrderEntity> orderCaptor = ArgumentCaptor.forClass(OrderEntity.class);

        verify(productRepository).findAllById(List.of(productId));
        verify(userRepository).findById(userId);
        verify(inventoryRepository).save(inventoryCaptor.capture());
        verify(orderRepository).save(orderCaptor.capture());
        verify(couponRepository).findByName("magiamgia");

        InventoryEntity savedInventory = inventoryCaptor.getValue();
        OrderEntity savedOrder = orderCaptor.getValue();

        assertEquals("nguyen van a", savedOrder.getFullName());
        assertEquals("123 abc", savedOrder.getAddress());
        assertEquals(OrderStatus.PENDING, savedOrder.getStatus());
        assertEquals(BigDecimal.valueOf(0), savedOrder.getTotalAmount());
        assertEquals(3, savedOrder.getTotalQuantity());
        assertSame(userEntity, savedOrder.getUserEntity());
        assertEquals(7, savedInventory.getStockQuantity());
        assertEquals(couponEntity, savedOrder.getCouponEntity());
        assertEquals(1, savedOrder.getOrderItemEntities().size());
        assertEquals(BigDecimal.valueOf(300), savedOrder.getOrderItemEntities().get(0).getTotal());
        assertEquals(3, savedOrder.getOrderItemEntities().get(0).getQuantity());
        assertSame(savedOrder, savedOrder.getOrderItemEntities().get(0).getOrderEntity());
        assertSame(productEntity, savedOrder.getOrderItemEntities().get(0).getProductEntity());
        assertSame(savedOrder, order);
    }
}
