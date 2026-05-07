package com.ShopCart_FE_BE.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityProperties.User;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.ShopCart_FE_BE.config.UserDetailsImp;
import com.ShopCart_FE_BE.entity.CouponEntity;
import com.ShopCart_FE_BE.entity.OrderEntity;
import com.ShopCart_FE_BE.entity.OrderItemEntity;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.entity.types.OrderPaymentStatus;
import com.ShopCart_FE_BE.entity.types.OrderPaymentType;
import com.ShopCart_FE_BE.entity.types.OrderStatus;
import com.ShopCart_FE_BE.entity.types.ProductStatus;
import com.ShopCart_FE_BE.request.CreatePurchaseRequest;
import com.ShopCart_FE_BE.request.CreatePurchaseRequest.PurchaseItem;
import com.ShopCart_FE_BE.service.InventoryService;
import com.ShopCart_FE_BE.service.OrderService;
import com.ShopCart_FE_BE.service.UserDetailsServiceImpl;
import com.ShopCart_FE_BE.utils.JwtUtils;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(PurchaseController.class)
@DisplayName("Order api integration tests")
public class OderControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private OrderService orderService;

    @MockitoBean
    private InventoryService inventoryService;

    @MockitoBean
    private JwtUtils jwtUtils;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    private OrderEntity mockOrder;
    private UserEntity mockUser;
    private List<OrderItemEntity> mockOderItem;
    private CouponEntity mockCoupon;
    private String token;

    @BeforeEach
    void setUp() {
        token = "mock-jwt-token-12345";
        Claims mockClaims = mock(Claims.class);
        when(mockClaims.getSubject()).thenReturn("user@example.com");
        when(mockClaims.get("id", Long.class)).thenReturn(1L);

        UserDetailsImp mockUserdetails = new UserDetailsImp(1L, "Tran Cuong", "user@example.com", "password");

        when(userDetailsService.loadUserByUsername("user@example.com")).thenReturn(mockUserdetails);

    }

    @Test
    @DisplayName("TC1: POST /api/purchase - Tao don hang ")
    void testCreateOrder() throws Exception {
        CreatePurchaseRequest request = CreatePurchaseRequest.builder().fullName("Tran Cuong").phone("0987654321")
                .address("273 An Duong Vuong").paymentMethod("COD")
                .items(List.of(PurchaseItem.builder().productId(1L).quantity(1).build(),
                        PurchaseItem.builder().productId(3L).quantity(1).build()))
                .build();

        mockUser = UserEntity.builder().id(1L).fullName("Tran Cuong").email("user@example.com").build();

        mockOderItem = List.of(
                OrderItemEntity.builder().id(1L).productEntity(ProductEntity.builder().id(1L).mainImageUrl(
                        "https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-main.png")
                        .name("Logitech MX Master 3S").price(BigDecimal.valueOf(1590000.00))
                        .status(ProductStatus.ACTIVE).build()).quantity(1).total(BigDecimal.valueOf(1590000.00))
                        .build(),
                OrderItemEntity.builder().id(2L).productEntity(ProductEntity.builder().id(3L).mainImageUrl(
                        "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_9__1_43.png")
                        .name(" Dell XPS 15 9530").price(BigDecimal.valueOf(45990000.00))
                        .status(ProductStatus.ACTIVE).build()).quantity(1).total(BigDecimal.valueOf(45990000.00))
                        .build());
        mockOrder = OrderEntity.builder().id(1L).fullName("Tran Cuong").address("273 An Duong Vuong")
                .status(OrderStatus.PENDING).paymentMethod(OrderPaymentType.COD)
                .paymentStatus(OrderPaymentStatus.PENDING).totalAmount(BigDecimal.valueOf(47580000.00))
                .shippingFee(BigDecimal.valueOf(0)).totalQuantity(2).couponEntity(null).build();
        when(orderService.makePurchase(anyLong(), any())).thenReturn(mockOrder);

        mockMvc.perform(post("/api/purchase").cookie(new Cookie("access_token", this.token))
                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.totalAmount").value(BigDecimal.valueOf(47580000.00))).andExpect(jsonPath("$.data.status").value(201));
    }
}
