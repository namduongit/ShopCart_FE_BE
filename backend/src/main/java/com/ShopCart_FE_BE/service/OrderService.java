package com.ShopCart_FE_BE.service;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.CouponEntity;
import com.ShopCart_FE_BE.entity.InventoryEntity;
import com.ShopCart_FE_BE.entity.OrderEntity;
import com.ShopCart_FE_BE.entity.OrderItemEntity;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.entity.types.OrderStatus;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.repository.OrderRepository;
import com.ShopCart_FE_BE.request.CreatePurchaseRequest;
import com.ShopCart_FE_BE.request.CreatePurchaseRequest.PurchaseItem;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    // Service
    private final UserService userService;
    private final ProductService productService;
    private final CouponService couponService;
    private final InventoryService inventoryService;

    public OrderService(
            OrderRepository orderRepository,
            UserService userService,
            ProductService productService,
            CouponService couponService,
            InventoryService inventoryService
        ) {
        this.orderRepository = orderRepository;
        this.userService = userService;
        this.productService = productService;
        this.couponService = couponService;
        this.inventoryService = inventoryService;
    }

    /**
     * Make a purchase/payment
     * 
     * * FLOW: Check list of id -> Get User -> -> Update Stock -> Create Order
     * 
     * @param userId
     * @param request
     * @return
     */
    @Transactional
    public OrderEntity makePurchase(Long userId, CreatePurchaseRequest request) {
        List<Long> ids = request.getItems().stream()
                .map(PurchaseItem::getProductId)
                .toList();

        List<ProductEntity> productEntities = this.productService.getAllProductsById(ids);

        // Map<productId, ProductEntity>
        Map<Long, ProductEntity> mapProductIdEntity = new HashMap<>();
        List<Long> foundIds = productEntities.stream().map(product -> {
            mapProductIdEntity.put(product.getId(), product);
            return product.getId();
        }).toList();

        if (ids.size() != productEntities.size()) {
            List<Long> notFoundIds = ids.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new InvalidException("Danh sách sản phẩm không tồn tại: " + notFoundIds);
        }

        CouponEntity couponEntity = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            couponEntity = this.couponService.getCouponByName(request.getCouponCode());
            Date now = new Date(System.currentTimeMillis());

            if (couponEntity.getExpiryDate().before(now)) {
                throw new InvalidException("Mã giảm giá đã hết hạn");
            }
        }

        UserEntity userEntity = this.userService.getUserById(userId);

        BigDecimal totalAmount = BigDecimal.ZERO;
        int totalQuantity = 0;
        List<OrderItemEntity> orderItemEntities = new ArrayList<>();
        for (PurchaseItem item : request.getItems()) {
            ProductEntity productEntity = mapProductIdEntity.get(item.getProductId());
            totalAmount = totalAmount.add(
                    productEntity.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            totalQuantity += item.getQuantity();
            
            // Update inventory
            InventoryEntity inventoryEntity = productEntity.getInventoryEntity();
            inventoryEntity.setStockQuantity(inventoryEntity.getStockQuantity() - item.getQuantity());
            this.inventoryService.saveInventory(inventoryEntity);

            // Push new OrderItemEntity to list
            OrderItemEntity orderItemEntity = new OrderItemEntity();
            orderItemEntity.setQuantity(item.getQuantity());
            orderItemEntity.setTotal(productEntity.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            orderItemEntity.setProductEntity(productEntity);
            
            orderItemEntities.add(orderItemEntity);
        }

        OrderEntity orderEntity = new OrderEntity();

        String fullName = (request.getFullName() != null && !request.getFullName().isBlank())
                ? request.getFullName()
                : "Không có tên";
        orderEntity.setFullName(fullName);

        orderEntity.setAddress(request.getAddress());
        orderEntity.setStatus(OrderStatus.PENDING);
        orderEntity.setUserEntity(userEntity);
        orderEntity.setTotalQuantity(totalQuantity);
        orderEntity.setOrderItemEntities(orderItemEntities);

        if (couponEntity != null) {
            orderEntity.setCouponEntity(couponEntity);
            // Giảm trực tiếp: totalAmount - coupon.value (không âm)
            BigDecimal discounted = totalAmount.subtract(couponEntity.getValue());
            orderEntity.setTotalAmount(discounted.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : discounted);
        } else {
            orderEntity.setTotalAmount(totalAmount);
        }

        // Ref OrderItemEntity to OrderEntity
        orderItemEntities.forEach(item -> item.setOrderEntity(orderEntity));

        // Send email before return OrderEntity

        return this.orderRepository.save(orderEntity);
    }

    /**
     * Get all orders of userId
     *
     * @param userId
     * @return List<OrderEntity>
     */
    public List<OrderEntity> getOrdersByUserId(Long userId) {
        return this.orderRepository.findByUserEntityId(userId);
    }

    /**
     * Get order by userId and orderId
     *
     * @param userId
     * @param orderId
     * @return OrderEntity
     */
    public OrderEntity getOrderById(Long userId, Long orderId) {
        OrderEntity orderEntity = this.orderRepository.findById(orderId)
                .orElseThrow(() -> new com.ShopCart_FE_BE.exception.NotFoundResource("Không tìm thấy đơn hàng"));

        if (!orderEntity.getUserEntity().getId().equals(userId)) {
            throw new com.ShopCart_FE_BE.exception.InvalidException("Bạn không có quyền xem đơn hàng này");
        }

        return orderEntity;
    }
}
