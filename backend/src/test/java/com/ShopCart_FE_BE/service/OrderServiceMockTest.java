package com.ShopCart_FE_BE.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
import com.ShopCart_FE_BE.entity.types.ProductStatus;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.repository.CouponRepository;
import com.ShopCart_FE_BE.repository.InventoryRepository;
import com.ShopCart_FE_BE.repository.OrderRepository;
import com.ShopCart_FE_BE.repository.ProductRepository;
import com.ShopCart_FE_BE.repository.UserRepository;
import com.ShopCart_FE_BE.request.CreatePurchaseRequest;
import com.ShopCart_FE_BE.request.CreatePurchaseRequest.PurchaseItem;

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
        Long userId = 1L;
        Long productId = 100L;
        ProductEntity product = createProduct(productId, "Keyboard", BigDecimal.valueOf(100), 10);
        UserEntity user = createUser(userId);
        CreatePurchaseRequest request = createRequest(productId, 3, null, "Nguyen Van A");

        when(productRepository.findAllById(List.of(productId))).thenReturn(List.of(product));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(inventoryRepository.save(any(InventoryEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderEntity result = orderService.makePurchase(userId, request);

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
        assertEquals(BigDecimal.valueOf(50300), savedOrder.getTotalAmount());
        assertEquals(3, savedOrder.getTotalQuantity());
        assertEquals("Nguyen Van A", savedOrder.getFullName());
        assertEquals("123 abc", savedOrder.getAddress());
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
    @DisplayName("Testing makePurchase with 2 items")
    void makePurchase_multipleItems_shouldCalculateTotalQuantityTotalAmountAndReduceEachInventory() {
        Long userId = 1L;
        ProductEntity keyboard = createProduct(100L, "Keyboard", BigDecimal.valueOf(100), 10);
        ProductEntity mouse = createProduct(90L, "Mouse", BigDecimal.valueOf(100), 15);
        UserEntity user = createUser(userId);
        CreatePurchaseRequest request = new CreatePurchaseRequest(
                List.of(
                        new PurchaseItem(100L, 3),
                        new PurchaseItem(90L, 5)
                ),
                "nguyen van a",
                "0909888333",
                "123 Test Street",
                "COD",
                null
                
        );

        when(productRepository.findAllById(List.of(100L, 90L))).thenReturn(List.of(keyboard, mouse));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(inventoryRepository.save(any(InventoryEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderEntity orderEntity = orderService.makePurchase(userId, request);

        ArgumentCaptor<OrderEntity> orderCaptor = ArgumentCaptor.forClass(OrderEntity.class);
        verify(productRepository).findAllById(List.of(100L, 90L));
        verify(couponRepository, never()).findByName(any());
        verify(userRepository).findById(userId);
        verify(inventoryRepository, times(2)).save(any(InventoryEntity.class));
        verify(orderRepository).save(orderCaptor.capture());

        OrderEntity savedOrder = orderCaptor.getValue();

        assertSame(orderEntity, savedOrder);
        assertEquals(7, keyboard.getInventoryEntity().getStockQuantity());
        assertEquals(10, mouse.getInventoryEntity().getStockQuantity());
        assertEquals(BigDecimal.valueOf(50800), savedOrder.getTotalAmount());
        assertEquals(8, savedOrder.getTotalQuantity());
        assertEquals(OrderStatus.PENDING, savedOrder.getStatus());
        assertEquals(2, savedOrder.getOrderItemEntities().size());
        assertSame(keyboard, savedOrder.getOrderItemEntities().get(0).getProductEntity());
        assertSame(mouse, savedOrder.getOrderItemEntities().get(1).getProductEntity());
        assertEquals(BigDecimal.valueOf(300), savedOrder.getOrderItemEntities().get(0).getTotal());
        assertEquals(BigDecimal.valueOf(500), savedOrder.getOrderItemEntities().get(1).getTotal());
        assertEquals(3, savedOrder.getOrderItemEntities().get(0).getQuantity());
        assertEquals(5, savedOrder.getOrderItemEntities().get(1).getQuantity());
    }

    @Test
    @DisplayName("Testing makePurchase method with coupon applying")
    void makePurchase_withCoupon_shouldApplyCouponAndCreateOrder() {
        Long userId = 1L;
        Long productId = 100L;
        ProductEntity product = createProduct(productId, "Keyboard", BigDecimal.valueOf(100), 10);
        UserEntity user = createUser(userId);
        CouponEntity coupon = createCoupon("magiamgia", BigDecimal.valueOf(10), CouponStatus.ACTIVE, BigDecimal.valueOf(0), "2030-09-02");
        CreatePurchaseRequest request = createRequest(productId, 3, "magiamgia", "nguyen van a");

        when(productRepository.findAllById(List.of(productId))).thenReturn(List.of(product));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(inventoryRepository.save(any(InventoryEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(couponRepository.findByName("magiamgia")).thenReturn(Optional.of(coupon));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderEntity orderEntity = orderService.makePurchase(userId, request);

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
        assertEquals(BigDecimal.valueOf(50290), savedOrder.getTotalAmount());
        assertEquals(3, savedOrder.getTotalQuantity());
        assertEquals("123 abc", savedOrder.getAddress());
        assertEquals("nguyen van a", savedOrder.getFullName());
        assertEquals(OrderStatus.PENDING, savedOrder.getStatus());
        assertSame(coupon, savedOrder.getCouponEntity());
        assertSame(user, savedOrder.getUserEntity());
        assertEquals(1, savedOrder.getOrderItemEntities().size());
        assertEquals(3, savedOrder.getOrderItemEntities().get(0).getQuantity());
        assertEquals(BigDecimal.valueOf(300), savedOrder.getOrderItemEntities().get(0).getTotal());
        assertSame(product, savedOrder.getOrderItemEntities().get(0).getProductEntity());
        assertSame(savedOrder, orderEntity);
    }

    @Test
    @DisplayName("Testing makePurchase with coupon's value is greater than order total price")
    void makePurchase_withCouponValueGreaterThanTotal_shouldApplyCouponAndCreateOrder() {
        Long userId = 1L;
        Long productId = 100L;
        ProductEntity product = createProduct(productId, "Keyboard", BigDecimal.valueOf(100), 10);
        UserEntity user = createUser(userId);
        CouponEntity coupon = createCoupon("magiamgia", BigDecimal.valueOf(3000), CouponStatus.ACTIVE, BigDecimal.valueOf(0), "2030-09-02");
        CreatePurchaseRequest request = createRequest(productId, 3, "magiamgia", "nguyen van a");

        when(productRepository.findAllById(List.of(productId))).thenReturn(List.of(product));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(couponRepository.findByName("magiamgia")).thenReturn(Optional.of(coupon));
        when(inventoryRepository.save(any(InventoryEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderEntity order = orderService.makePurchase(userId, request);

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
        assertEquals(BigDecimal.valueOf(50000), savedOrder.getTotalAmount());
        assertEquals(3, savedOrder.getTotalQuantity());
        assertSame(user, savedOrder.getUserEntity());
        assertEquals(7, savedInventory.getStockQuantity());
        assertSame(coupon, savedOrder.getCouponEntity());
        assertEquals(1, savedOrder.getOrderItemEntities().size());
        assertEquals(BigDecimal.valueOf(300), savedOrder.getOrderItemEntities().get(0).getTotal());
        assertEquals(3, savedOrder.getOrderItemEntities().get(0).getQuantity());
        assertSame(product, savedOrder.getOrderItemEntities().get(0).getProductEntity());
        assertSame(savedOrder, order);
    }

    @Test
    @DisplayName("Testing makePurchase with expired coupon")
    void makePurchase_withExpiredCoupon_shouldThrowInvalidException() {
        Long productId = 100L;
        ProductEntity product = createProduct(productId, "Keyboard", BigDecimal.valueOf(100), 10);
        CouponEntity coupon = createCoupon("magiamgia", BigDecimal.valueOf(10), CouponStatus.ACTIVE, BigDecimal.valueOf(0), "2020-09-02");
        CreatePurchaseRequest request = createRequest(productId, 3, "magiamgia", "nguyen van a");

        when(productRepository.findAllById(List.of(productId))).thenReturn(List.of(product));
        when(couponRepository.findByName("magiamgia")).thenReturn(Optional.of(coupon));

        InvalidException exp = assertThrows(
                InvalidException.class,
                () -> orderService.makePurchase(1L, request)
        );

        assertEquals("Mã giảm giá đã hết hạn", exp.getMessage());
        verify(productRepository).findAllById(List.of(productId));
        verify(couponRepository).findByName("magiamgia");
        verify(userRepository, never()).findById(any());
        verify(inventoryRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Testing makePurchase with coupon not found")
    void makePurchase_withCouponNotFound_shouldThrowNotFoundResourceException() {
        Long productId = 100L;
        ProductEntity product = createProduct(productId, "Keyboard", BigDecimal.valueOf(100), 10);
        CreatePurchaseRequest request = createRequest(productId, 3, "magiamgia", "nguyen van a");

        when(productRepository.findAllById(List.of(productId))).thenReturn(List.of(product));
        when(couponRepository.findByName("magiamgia")).thenReturn(Optional.empty());

        NotFoundResource exp = assertThrows(
                NotFoundResource.class,
                () -> orderService.makePurchase(1L, request)
        );

        assertEquals("Không tìm thấy mã giảm giá", exp.getMessage());
        verify(productRepository).findAllById(List.of(productId));
        verify(couponRepository).findByName("magiamgia");
        verify(userRepository, never()).findById(any());
        verify(inventoryRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Testing makePurchase with not found product ids")
    void makePurchase_withProductIdsNotFound_shouldThrowInvalidException() {
        Long foundProductId = 100L;
        Long missingProductId = 10L;
        ProductEntity product = createProduct(foundProductId, "Keyboard", BigDecimal.valueOf(100), 10);
        CreatePurchaseRequest request = new CreatePurchaseRequest(
                List.of(
                        new PurchaseItem(foundProductId, 3),
                        new PurchaseItem(missingProductId, 3)
                ),
                "nguyen van a",
                "0909888333",
                "123 abc",
                "COD",
                "magiamgia"
        );

        when(productRepository.findAllById(List.of(foundProductId, missingProductId))).thenReturn(List.of(product));

        InvalidException exp = assertThrows(
                InvalidException.class,
                () -> orderService.makePurchase(1L, request)
        );

        assertEquals("Danh sách sản phẩm không tồn tại: [10]", exp.getMessage());
        verify(productRepository).findAllById(List.of(foundProductId, missingProductId));
        verify(couponRepository, never()).findByName(any());
        verify(inventoryRepository, never()).save(any());
        verify(userRepository, never()).findById(any());
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Testing makePurchase with user not found")
    void makePurchase_withUserNotFound_shouldThrowNotFoundResourceException() {
        Long userId = 1L;
        Long productId = 100L;
        ProductEntity product = createProduct(productId, "Keyboard", BigDecimal.valueOf(100), 10);
        CreatePurchaseRequest request = createRequest(productId, 3, "", "nguyen van a");

        when(productRepository.findAllById(List.of(productId))).thenReturn(List.of(product));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        NotFoundResource exp = assertThrows(
                NotFoundResource.class,
                () -> orderService.makePurchase(userId, request)
        );

        assertEquals("Không tìm thấy người dùng", exp.getMessage());
        verify(productRepository).findAllById(List.of(productId));
        verify(couponRepository, never()).findByName(any());
        verify(userRepository).findById(userId);
        verify(inventoryRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Testing makePurchase with blank name field")
    void makePurchase_withBlankName_shouldReturnUserFullName() {
        Long userId = 1L;
        Long productId = 100L;
        ProductEntity product = createProduct(productId, "Keyboard", BigDecimal.valueOf(100), 10);
        UserEntity user = createUser(userId);
        CreatePurchaseRequest request = createRequest(productId, 3, "", "");

        when(productRepository.findAllById(List.of(productId))).thenReturn(List.of(product));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(inventoryRepository.save(any(InventoryEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderEntity order = orderService.makePurchase(userId, request);

        ArgumentCaptor<OrderEntity> orderCaptor = ArgumentCaptor.forClass(OrderEntity.class);
        verify(productRepository).findAllById(List.of(productId));
        verify(couponRepository, never()).findByName(any());
        verify(userRepository).findById(userId);
        verify(inventoryRepository).save(any(InventoryEntity.class));
        verify(orderRepository).save(orderCaptor.capture());

        OrderEntity savedOrder = orderCaptor.getValue();

        assertSame(user, order.getUserEntity());
        assertSame(order, savedOrder);
        assertEquals("nguyen van a", order.getFullName());
        assertEquals("nguyen van a", savedOrder.getFullName());
    }

    @Test
    @DisplayName("Testing makePurchase when order's total amount is less than coupon minimum purchase amount")
    void makePurchase_totalLessThanCouponMinimum_ShouldThrowInvalidException() {

        ProductEntity product = createProduct(1L, "Keyboard", BigDecimal.valueOf(100), 10);
        UserEntity user = createUser(1L);
        CouponEntity coupon = createCoupon("magiamgia", BigDecimal.valueOf(10), CouponStatus.ACTIVE, BigDecimal.valueOf(500), "2030-09-02");
        CreatePurchaseRequest request = createRequest(1L, 3, "magiamgia", "nguyen van a");

        when(productRepository.findAllById(List.of(1L))).thenReturn(List.of(product));
        when(couponRepository.findByName("magiamgia")).thenReturn(Optional.of(coupon));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(inventoryRepository.save(any(InventoryEntity.class))).thenAnswer(inv -> inv.getArgument(0));


        InvalidException exp = assertThrows(
            InvalidException.class, 
            () -> orderService.makePurchase(1L, request)
        );


        assertEquals("Tổng tiền phải lớn hơn 500", exp.getMessage());
        verify(productRepository).findAllById(List.of(1L));
        verify(couponRepository).findByName("magiamgia");
        verify(userRepository).findById(1L);
        verify(inventoryRepository).save(any());
        verify(productRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Testing makePurchase when product is inactive")
    void makePurchase_WhenProductInactive_ShouldThrowInvalidException() {

        // arrange
        ProductEntity product = createProduct(
            100L, 
            "Keyboard", 
            BigDecimal.valueOf(100), 
            ProductStatus.INACTIVE, 
            10
        );

        UserEntity user = createUser(1L);

        CreatePurchaseRequest req = createRequest(
            100L, 
            3, 
            null, 
            "nguyen van a"
        );

        when(productRepository.findAllById(List.of(100L))).thenReturn(List.of(product));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // act va assert
        InvalidException exp = assertThrows(
            InvalidException.class, 
            () -> orderService.makePurchase(1L, req)
        );

        assertEquals("Sản phẩm 'Keyboard' không khả dụng", exp.getMessage());

        verify(productRepository).findAllById(List.of(100L));
        verify(userRepository).findById(1L);
        verify(inventoryRepository, never()).save(any());
        verify(productRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Testing makePurchase with out of stock product")
    void makePurchase_WhenProductIsOutOfStock_ShouldSetProductStatusToInactive() {

        // assert
        ProductEntity product = createProduct(
            100L, 
            "Keyboard", 
            BigDecimal.valueOf(100), 
            ProductStatus.ACTIVE, 
            3
        );

        UserEntity user = createUser(1L);

        CreatePurchaseRequest req = createRequest(
            100L, 
            3, 
            null, 
            "nguyen van a"
        );

        when(productRepository.findAllById(List.of(100L))).thenReturn(List.of(product));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(inventoryRepository.save(any(InventoryEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(productRepository.save(any(ProductEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(inv -> inv.getArgument(0));


        orderService.makePurchase(1L, req);

        ArgumentCaptor<InventoryEntity> inventoryCaptor = ArgumentCaptor.forClass(InventoryEntity.class);
        ArgumentCaptor<ProductEntity> productCaptor = ArgumentCaptor.forClass(ProductEntity.class);

        verify(productRepository).findAllById(List.of(100L));
        verify(userRepository).findById(1L);
        verify(inventoryRepository).save(inventoryCaptor.capture());
        verify(productRepository).save(productCaptor.capture());
        verify(orderRepository).save(any(OrderEntity.class));

        InventoryEntity inventory = inventoryCaptor.getValue();
        ProductEntity savedProduct = productCaptor.getValue();
        assertEquals(ProductStatus.INACTIVE, savedProduct.getStatus());
        assertEquals(0, inventory.getStockQuantity());
    }

    @Test
    @DisplayName("Testing makePurchase when there is not enough stock")
    void makePurchase_WhenThereIsNotEnoughStock_ShouldThrowInvalidException() {

        // assert
        ProductEntity product = createProduct(
            100L, 
            "Keyboard", 
            BigDecimal.valueOf(100), 
            ProductStatus.ACTIVE, 
            3
        );

        UserEntity user = createUser(1L);

        CreatePurchaseRequest req = createRequest(
            100L, 
            5, 
            null, 
            "nguyen van a"
        );

        when(productRepository.findAllById(List.of(100L))).thenReturn(List.of(product));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        InvalidException exp = assertThrows(
            InvalidException.class, 
            () -> orderService.makePurchase(1L, req)
        );

        assertEquals("Sản phẩm 'Keyboard' không đủ số lượng tồn kho", exp.getMessage());

        verify(productRepository).findAllById(List.of(100L));
        verify(userRepository).findById(1L);
        verify(inventoryRepository, never()).save(any());
        verify(productRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Testing makePurchase with inactive coupon applied")
    void makePurchase_WhenAppliedCouponIsInactive_ShouldThrowInvalidException() {
        
        ProductEntity product = createProduct(
            100L, 
            "Keyboard", 
            BigDecimal.valueOf(100), 
            ProductStatus.ACTIVE, 
            10
        );

        UserEntity user = createUser(1L);
        
        CouponEntity coupon = createCoupon(
            "magiamgia", 
            BigDecimal.valueOf(100L), 
            CouponStatus.INACTIVE, 
            BigDecimal.valueOf(0), 
            "2030-09-02"
        );

        CreatePurchaseRequest req = createRequest(
            100L, 
            3, 
            "magiamgia", 
            "nguyen van a"
        );

        when(productRepository.findAllById(List.of(100L))).thenReturn(List.of(product));
        when(couponRepository.findByName("magiamgia")).thenReturn(Optional.of(coupon));

        InvalidException exp = assertThrows(
            InvalidException.class, 
            () -> orderService.makePurchase(1L, req)
        );

        assertEquals("Mã giảm giá không còn hiệu lực", exp.getMessage());

        verify(productRepository).findAllById(List.of(100L));
        verify(couponRepository).findByName("magiamgia");
        verify(inventoryRepository, never()).save(any());
        verify(productRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Testing getOrdersByUserId with items returned")
    void getOrdersByUserId_shouldReturnOrders() {
        Long userId = 1L;
        UserEntity user = createUser(userId);
        OrderEntity order1 = createOrder(10L, user);
        OrderEntity order2 = createOrder(21L, user);

        when(orderRepository.findByUserEntityId(userId)).thenReturn(List.of(order1, order2));

        List<OrderEntity> orderList = orderService.getOrdersByUserId(userId);

        assertEquals(2, orderList.size());
        assertSame(order1, orderList.get(0));
        assertSame(order2, orderList.get(1));
        assertSame(user, orderList.get(0).getUserEntity());
        assertSame(user, orderList.get(1).getUserEntity());
        verify(orderRepository).findByUserEntityId(userId);
    }

    @Test
    @DisplayName("Testing getOrderById")
    void getOrderById_whenOrderExistsAndBelongsToUser_shouldReturnOrder() {
        Long orderId = 100L;
        Long userId = 192L;
        UserEntity user = createUser(userId);
        OrderEntity order = createOrder(orderId, user);
        order.setFullName("nguyen van a");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        OrderEntity returnedOrder = orderService.getOrderById(userId, orderId);

        assertEquals(orderId, returnedOrder.getId());
        assertEquals("nguyen van a", returnedOrder.getFullName());
        assertSame(user, returnedOrder.getUserEntity());
        verify(orderRepository).findById(orderId);
    }

    @Test
    @DisplayName("Testing getOrderById with order not found")
    void getOrderById_whenOrderNotFound_shouldThrowNotFoundResourceException() {
        Long userId = 10L;
        Long orderId = 100L;
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        NotFoundResource exp = assertThrows(
                NotFoundResource.class,
                () -> orderService.getOrderById(userId, orderId)
        );

        assertEquals("Không tìm thấy đơn hàng", exp.getMessage());
        verify(orderRepository).findById(orderId);
    }

    @Test
    @DisplayName("Testing getOrderById with order which user isn't allowed to access")
    void getOrderById_whenOrderExistsAndUserDoesNotHaveAccess_shouldThrowInvalidException() {
        Long orderId = 100L;
        Long orderOwnerUserId = 10L;
        Long requesterUserId = 110L;
        UserEntity user = createUser(orderOwnerUserId);
        OrderEntity order = createOrder(orderId, user);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        InvalidException exp = assertThrows(
                InvalidException.class,
                () -> orderService.getOrderById(requesterUserId, orderId)
        );

        assertEquals("Bạn không có quyền xem đơn hàng này", exp.getMessage());
        verify(orderRepository).findById(orderId);
    }

    private ProductEntity createProduct(Long id, String name, BigDecimal price, int stockQuantity) {
        InventoryEntity inventory = new InventoryEntity();
        inventory.setStockQuantity(stockQuantity);

        ProductEntity product = new ProductEntity();
        product.setId(id);
        product.setName(name);
        product.setPrice(price);
        product.setStatus(ProductStatus.ACTIVE);
        product.setInventoryEntity(inventory);

        inventory.setProductEntity(product);
        return product;
    }

        private ProductEntity createProduct(Long id, String name, BigDecimal price, ProductStatus status, int stockQuantity) {
        InventoryEntity inventory = new InventoryEntity();
        inventory.setStockQuantity(stockQuantity);

        ProductEntity product = new ProductEntity();
        product.setId(id);
        product.setName(name);
        product.setPrice(price);
        product.setStatus(status);
        product.setInventoryEntity(inventory);

        inventory.setProductEntity(product);
        return product;
    }

    private UserEntity createUser(Long id) {
        UserEntity user = new UserEntity();
        user.setId(id);
        user.setFullName("nguyen van a");
        user.setEmail("nguyenvana@gmail.com");
        user.setPassword("password-mahoa");
        return user;
    }

    private CouponEntity createCoupon(String name, BigDecimal value, CouponStatus status, BigDecimal minimum, String expiryDate) {
        CouponEntity coupon = new CouponEntity();
        coupon.setName(name);
        coupon.setValue(value);
        coupon.setStatus(status);
        coupon.setMinimumPurchaseAmount(minimum);
        coupon.setExpiryDate(Date.valueOf(expiryDate));
        return coupon;
    }

    private OrderEntity createOrder(Long id, UserEntity user) {
        OrderEntity order = new OrderEntity();
        order.setId(id);
        order.setUserEntity(user);
        return order;
    }

    private CreatePurchaseRequest createRequest(Long productId, int quantity, String couponCode, String fullName) {
        return new CreatePurchaseRequest(
                List.of(new PurchaseItem(productId, quantity)),
                fullName,
                "0909888333",
                "123 abc",
                "COD",
                couponCode
        );
    }
}
