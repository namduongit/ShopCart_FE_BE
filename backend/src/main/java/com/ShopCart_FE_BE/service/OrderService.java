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
import com.ShopCart_FE_BE.entity.types.OrderPaymentStatus;
import com.ShopCart_FE_BE.entity.types.OrderPaymentType;
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

import jakarta.transaction.Transactional;

@Service
public class OrderService {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("10000000");
    private static final BigDecimal SHIPPING_FEE = new BigDecimal("50000");

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final InventoryRepository inventoryRepository;

    public OrderService(
            OrderRepository orderRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            CouponRepository couponRepository,
            InventoryRepository inventoryRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
        this.inventoryRepository = inventoryRepository;
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

        List<ProductEntity> productEntities = this.productRepository.findAllById(ids);

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
            couponEntity = this.couponRepository.findByName(request.getCouponCode())
                    .orElseThrow(() -> new NotFoundResource("Không tìm thấy mã giảm giá"));

            Date now = new Date(System.currentTimeMillis());
            if (couponEntity.getExpiryDate().before(now)) {
                throw new com.ShopCart_FE_BE.exception.InvalidException("Mã giảm giá đã hết hạn");
            }

            if (!couponEntity.getStatus().toString().equals("ACTIVE")) {
                throw new com.ShopCart_FE_BE.exception.InvalidException("Mã giảm giá không còn hiệu lực");
            }
        }

        UserEntity userEntity = this.userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundResource("Không tìm thấy người dùng"));

        BigDecimal totalAmount = BigDecimal.ZERO;
        int totalQuantity = 0;
        List<OrderItemEntity> orderItemEntities = new ArrayList<>();

        for (PurchaseItem item : request.getItems()) {
            ProductEntity productEntity = mapProductIdEntity.get(item.getProductId());
            InventoryEntity inventoryEntity = productEntity.getInventoryEntity();

            if (productEntity.getStatus().equals(ProductStatus.INACTIVE)) {
                throw new InvalidException("Sản phẩm '" + productEntity.getName() + "' không khả dụng");
            }

            if (inventoryEntity.getStockQuantity() < item.getQuantity()) {
                throw new InvalidException(
                        "Sản phẩm '" + productEntity.getName() + "' không đủ số lượng tồn kho");
            }

            totalAmount = totalAmount.add(productEntity.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            totalQuantity += item.getQuantity();

            inventoryEntity.setStockQuantity(inventoryEntity.getStockQuantity() - item.getQuantity());
            this.inventoryRepository.save(inventoryEntity);

            if (inventoryEntity.getStockQuantity() == 0) {
                productEntity.setStatus(ProductStatus.INACTIVE);
                this.productRepository.save(productEntity);
            }

            OrderItemEntity orderItemEntity = new OrderItemEntity();
            orderItemEntity.setQuantity(item.getQuantity());
            orderItemEntity.setTotal(productEntity.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            orderItemEntity.setProductEntity(productEntity);
            orderItemEntities.add(orderItemEntity);
        }

        if (totalAmount.compareTo(BigDecimal.valueOf(0)) <= 0) {
            throw new InvalidException("Tổng tiền đơn hàng phải lớn hơn 0");
        }

        OrderEntity orderEntity = new OrderEntity();
        // Order metadata
        String fullName = (request.getFullName() != null && !request.getFullName().isBlank())
                ? request.getFullName()
                : userEntity.getFullName();
        orderEntity.setFullName(fullName);
        orderEntity.setPhone(request.getPhone());
        orderEntity.setAddress(request.getAddress());
        // Order service data
        orderEntity.setStatus(OrderStatus.PENDING);
        orderEntity.setPaymentMethod(OrderPaymentType.valueOf(request.getPaymentMethod().toUpperCase()));
        orderEntity.setPaymentStatus(OrderPaymentStatus.PENDING);
        orderEntity.setTotalQuantity(totalQuantity);

        // Shipping Fee
        BigDecimal shippingFee = totalAmount.compareTo(FREE_SHIPPING_THRESHOLD) >= 0
                ? BigDecimal.ZERO
                : SHIPPING_FEE;
        orderEntity.setShippingFee(shippingFee);

        // Valid coupon
        if (couponEntity != null) {
            if (totalAmount.compareTo(couponEntity.getMinimumPurchaseAmount()) < 0) {
                throw new InvalidException("Tổng tiền phải lớn hơn " + couponEntity.getMinimumPurchaseAmount());
            }

            BigDecimal discounted = totalAmount.subtract(couponEntity.getValue());
            BigDecimal afterDiscount = discounted.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : discounted;
            orderEntity.setTotalAmount(afterDiscount.add(shippingFee));

            orderEntity.setCouponEntity(couponEntity);
        } else {
            orderEntity.setTotalAmount(totalAmount.add(shippingFee));
        }

        orderEntity.setUserEntity(userEntity);
        orderEntity.setOrderItemEntities(orderItemEntities);
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
