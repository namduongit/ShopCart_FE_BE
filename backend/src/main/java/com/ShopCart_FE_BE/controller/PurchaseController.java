package com.ShopCart_FE_BE.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.config.UserDetailsImp;
import com.ShopCart_FE_BE.dto.OrderCouponDto;
import com.ShopCart_FE_BE.dto.OrderDto;
import com.ShopCart_FE_BE.dto.OrderItemDto;
import com.ShopCart_FE_BE.dto.OrderItemProductDto;
import com.ShopCart_FE_BE.dto.UserDto;
import com.ShopCart_FE_BE.entity.OrderEntity;
import com.ShopCart_FE_BE.request.CreatePurchaseRequest;
import com.ShopCart_FE_BE.service.OrderService;
import com.ShopCart_FE_BE.utils.ResponseHelper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/purchases/")
public class PurchaseController {

    private final OrderService orderService;

    public PurchaseController(
        OrderService orderService
    ) {
        this.orderService = orderService;
    }

    private OrderDto toOrderDto(OrderEntity orderEntity) {
        OrderCouponDto couponDto = null;
        if (orderEntity.getCouponEntity() != null) {
            couponDto = new OrderCouponDto(
                orderEntity.getCouponEntity().getId(),
                orderEntity.getCouponEntity().getName(),
                orderEntity.getCouponEntity().getValue()
            );
        }

        UserDto userDto = new UserDto(
            orderEntity.getUserEntity().getId(),
            orderEntity.getUserEntity().getFullName(),
            orderEntity.getUserEntity().getEmail()
        );

        List<OrderItemDto> items = orderEntity.getOrderItemEntities().stream().map(item ->
            new OrderItemDto(
                item.getId(),
                new OrderItemProductDto(
                    item.getProductEntity().getId(),
                    item.getProductEntity().getMainImageUrl(),
                    item.getProductEntity().getName(),
                    item.getProductEntity().getPrice(),
                    item.getProductEntity().getStatus().toString()
                ),
                item.getQuantity(),
                item.getTotal()
            )
        ).toList();

        return new OrderDto(
            orderEntity.getId(),
            orderEntity.getFullName(),
            orderEntity.getAddress(),
            orderEntity.getStatus().toString(),
            orderEntity.getTotalAmount(),
            orderEntity.getTotalQuantity(),
            userDto,
            items,
            couponDto
        );
    }

    @PostMapping("")
    public ResponseEntity<Response<OrderDto>> makePurchase(
        @AuthenticationPrincipal UserDetailsImp userDetailsImp,
        @Valid @RequestBody CreatePurchaseRequest request
    ) {
        OrderEntity orderEntity = this.orderService.makePurchase(userDetailsImp.getId(), request);
        Response<OrderDto> response = ResponseHelper.Created(toOrderDto(orderEntity));
        return ResponseEntity.ok(response);
    }

    @GetMapping("")
    public ResponseEntity<Response<List<OrderDto>>> getMyOrders(
        @AuthenticationPrincipal UserDetailsImp userDetailsImp
    ) {
        List<OrderEntity> orders = this.orderService.getOrdersByUserId(userDetailsImp.getId());

        List<OrderDto> orderDtos = orders.stream()
            .map(this::toOrderDto)
            .toList();

        return ResponseEntity.ok(ResponseHelper.Success(orderDtos));
    }

    @GetMapping("{orderId}")
    public ResponseEntity<Response<OrderDto>> getOrderById(
        @AuthenticationPrincipal UserDetailsImp userDetailsImp,
        @PathVariable Long orderId
    ) {
        OrderEntity orderEntity = this.orderService.getOrderById(userDetailsImp.getId(), orderId);
        return ResponseEntity.ok(ResponseHelper.Success(toOrderDto(orderEntity)));
    }
}
