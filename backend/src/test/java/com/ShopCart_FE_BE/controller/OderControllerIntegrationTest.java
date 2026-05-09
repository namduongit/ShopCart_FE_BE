package com.ShopCart_FE_BE.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
// import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
// import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.security.autoconfigure.SecurityProperties.User;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
// import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.web.bind.MethodArgumentNotValidException;

import com.ShopCart_FE_BE.config.ForbiddenEntryPoint;
import com.ShopCart_FE_BE.config.SecurityConfig;
import com.ShopCart_FE_BE.config.UnauthorizedEntryPoint;
import com.ShopCart_FE_BE.config.UserDetailsImp;
// import com.ShopCart_FE_BE.entity.CouponEntity;
import com.ShopCart_FE_BE.entity.OrderEntity;
import com.ShopCart_FE_BE.entity.OrderItemEntity;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.entity.types.OrderPaymentStatus;
import com.ShopCart_FE_BE.entity.types.OrderPaymentType;
import com.ShopCart_FE_BE.entity.types.OrderStatus;
import com.ShopCart_FE_BE.entity.types.ProductStatus;
import com.ShopCart_FE_BE.exception.InvalidException;
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
@Import(SecurityConfig.class)
@DisplayName("Order api integration tests")
public class OderControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UnauthorizedEntryPoint unauthorizedEntryPoint;

    @MockitoBean
    private ForbiddenEntryPoint forbiddenEntryPoint;

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
//     private CouponEntity mockCoupon;
    private String token;

    @BeforeEach
    void setUp() {
        token = "mock-jwt-token-12345";
        Claims mockClaims = mock(Claims.class);
        when(mockClaims.getSubject()).thenReturn("user@example.com");
        when(mockClaims.get("id", Long.class)).thenReturn(1L);
        when(jwtUtils.extractClaims(token)).thenReturn(mockClaims);

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
                .shippingFee(BigDecimal.valueOf(0)).totalQuantity(2).couponEntity(null).userEntity(mockUser)
                .orderItemEntities(mockOderItem).build();
        when(orderService.makePurchase(anyLong(), any())).thenReturn(mockOrder);

        mockMvc.perform(post("/api/purchases/").with(csrf()).cookie(new Cookie("access_token", this.token))
                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.totalAmount").value(BigDecimal.valueOf(47580000.00)))
                .andExpect(jsonPath("$.status").value(201));
    }

    @Test
    @DisplayName("TC2: POST /api/purchase - Request thieu field")
    void testCreateOrderWithNotEnoughField() throws Exception {
        CreatePurchaseRequest request = CreatePurchaseRequest.builder()
                .items(List.of(PurchaseItem.builder().productId(1L).quantity(1).build(),
                        PurchaseItem.builder().productId(3L).quantity(1).build()))
                .build();

        mockMvc.perform(post("/api/purchases/").with(csrf()).cookie(new Cookie("access_token", this.token))
                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Bad Request"))
                .andExpect(jsonPath("$.data").doesNotExist()).andExpect(jsonPath("$.errors.address")
                        .value("Địa chỉ nhận hàng không được để trống"))
                .andExpect(jsonPath("$.errors.phone")
                        .value("Số điện thoại không được để trống"));

    }

    @Test
    @DisplayName("TC3: POST /api/purchase - San pham khong ton tai")
    void testCreateOrderWithNotFoundProduct() throws Exception {
        CreatePurchaseRequest request = CreatePurchaseRequest.builder().fullName("Tran Cuong").phone("0987654321")
                .address("273 An Duong Vuong").paymentMethod("COD")
                .items(List.of(PurchaseItem.builder().productId(100L).quantity(1).build(),
                        PurchaseItem.builder().productId(103L).quantity(1).build()))
                .build();

        when(orderService.makePurchase(anyLong(), any()))
                .thenThrow(new InvalidException("Danh sách sản phẩm không tồn tại: [100,103]"));

        mockMvc.perform(post("/api/purchases/").with(csrf()).cookie(new Cookie("access_token", this.token))
                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Bad Request"))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.errors").value("Danh sách sản phẩm không tồn tại: [100,103]"));
    }

    @Test
    @DisplayName("TC4: POST /api/purchase - Coupon khong ton tai")
    void testCreateOrderWithCouponNotFound() throws Exception {

        CreatePurchaseRequest request = CreatePurchaseRequest.builder()
                .fullName("Tran Cuong")
                .phone("0987654321")
                .address("273 An Duong Vuong")
                .paymentMethod("COD")
                .couponCode("SALE999")
                .items(List.of(
                        PurchaseItem.builder().productId(1L).quantity(1).build()))
                .build();

        when(orderService.makePurchase(anyLong(), any()))
                .thenThrow(new InvalidException("Không tìm thấy mã giảm giá"));

        mockMvc.perform(post("/api/purchases/")
                .with(csrf())
                .cookie(new Cookie("access_token", token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))

                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors")
                        .value("Không tìm thấy mã giảm giá"));
    }

    @Test
    @DisplayName("TC5: POST /api/purchase - San pham khong du ton kho")
    void testCreateOrderNotEnoughStock() throws Exception {

        CreatePurchaseRequest request = CreatePurchaseRequest.builder()
                .fullName("Tran Cuong")
                .phone("0987654321")
                .address("273 An Duong Vuong")
                .paymentMethod("COD")
                .items(List.of(
                        PurchaseItem.builder().productId(1L).quantity(100).build()))
                .build();

        when(orderService.makePurchase(anyLong(), any()))
                .thenThrow(new InvalidException(
                        "Sản phẩm 'Logitech MX Master 3S' không đủ số lượng tồn kho"));

        mockMvc.perform(post("/api/purchases/")
                .with(csrf())
                .cookie(new Cookie("access_token", token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))

                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors")
                        .value("Sản phẩm 'Logitech MX Master 3S' không đủ số lượng tồn kho"));
    }

    @Test
    @DisplayName("TC6: POST /api/purchase - Product inactive")
    void testCreateOrderWithInactiveProduct() throws Exception {

        CreatePurchaseRequest request = CreatePurchaseRequest.builder()
                .fullName("Tran Cuong")
                .phone("0987654321")
                .address("273 An Duong Vuong")
                .paymentMethod("COD")
                .items(List.of(
                        PurchaseItem.builder().productId(1L).quantity(1).build()))
                .build();

        when(orderService.makePurchase(anyLong(), any()))
                .thenThrow(new InvalidException(
                        "Sản phẩm 'Logitech MX Master 3S' không khả dụng"));

        mockMvc.perform(post("/api/purchases/")
                .with(csrf())
                .cookie(new Cookie("access_token", token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))

                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors")
                        .value("Sản phẩm 'Logitech MX Master 3S' không khả dụng"));
    }

    @Test
    @DisplayName("TC7: POST /api/purchase - Coupon het han")
    void testCreateOrderWithExpiredCoupon() throws Exception {

        CreatePurchaseRequest request = CreatePurchaseRequest.builder()
                .fullName("Tran Cuong")
                .phone("0987654321")
                .address("273 An Duong Vuong")
                .paymentMethod("COD")
                .couponCode("SALE50")
                .items(List.of(
                        PurchaseItem.builder().productId(1L).quantity(1).build()))
                .build();

        when(orderService.makePurchase(anyLong(), any()))
                .thenThrow(new InvalidException("Mã giảm giá đã hết hạn"));

        mockMvc.perform(post("/api/purchases/")
                .with(csrf())
                .cookie(new Cookie("access_token", token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))

                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors")
                        .value("Mã giảm giá đã hết hạn"));
    }

    @Test
    @DisplayName("TC8: GET /api/purchases/{orderId} - Lay don hang theo id thanh cong")
    void testGetOrderById() throws Exception {
        mockUser = UserEntity.builder()
                .id(1L).fullName("Tran Cuong").email("user@example.com").build();

        mockOderItem = List.of(
                OrderItemEntity.builder()
                        .id(1L)
                        .productEntity(ProductEntity.builder()
                                .id(1L)
                                .mainImageUrl("https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech.png")
                                .name("Logitech MX Master 3S")
                                .price(BigDecimal.valueOf(1590000.00))
                                .status(ProductStatus.ACTIVE).build())
                        .quantity(2)
                        .total(BigDecimal.valueOf(3180000.00)).build());

        mockOrder = OrderEntity.builder()
                .id(5L).fullName("Tran Cuong").address("273 An Duong Vuong")
                .status(OrderStatus.PENDING).paymentMethod(OrderPaymentType.COD)
                .paymentStatus(OrderPaymentStatus.PENDING)
                .totalAmount(BigDecimal.valueOf(3180000.00))
                .shippingFee(BigDecimal.valueOf(50000)).totalQuantity(2)
                .couponEntity(null).userEntity(mockUser)
                .orderItemEntities(mockOderItem).build();

        when(orderService.getOrderById(1L, 5L)).thenReturn(mockOrder);

        mockMvc.perform(get("/api/purchases/5")
                .cookie(new Cookie("access_token", token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.id").value(5L))
                .andExpect(jsonPath("$.data.totalAmount").value(3180000.00))
                .andExpect(jsonPath("$.data.items.length()").value(1))
                .andExpect(jsonPath("$.data.items[0].product.name").value("Logitech MX Master 3S"));
    }

    @Test
    @DisplayName("TC9: GET /api/purchases/{orderId} - Don hang khong ton tai")
    void testGetOrderByIdNotFound() throws Exception {
        when(orderService.getOrderById(1L, 999L))
                .thenThrow(new com.ShopCart_FE_BE.exception.NotFoundResource("Không tìm thấy đơn hàng"));

        mockMvc.perform(get("/api/purchases/999")
                .cookie(new Cookie("access_token", token)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors").value("Không tìm thấy đơn hàng"));
    }

    @Test
    @DisplayName("TC10: GET /api/purchases/{orderId} - Don hang cua nguoi khac")
    void testGetOrderByIdForbidden() throws Exception {
        when(orderService.getOrderById(1L, 7L))
                .thenThrow(new com.ShopCart_FE_BE.exception.InvalidException("Bạn không có quyền xem đơn hàng này"));

        mockMvc.perform(get("/api/purchases/7")
                .cookie(new Cookie("access_token", token)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors").value("Bạn không có quyền xem đơn hàng này"));
    }

    @Test
    @DisplayName("TC11: GET /api/purchases/ - Lay danh sach don hang thanh cong")
    void testGetMyOrders() throws Exception {
        mockUser = UserEntity.builder()
                .id(1L).fullName("Tran Cuong").email("user@example.com").build();

        mockOderItem = List.of(
                OrderItemEntity.builder()
                        .id(1L)
                        .productEntity(ProductEntity.builder()
                                .id(1L)
                                .mainImageUrl("https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech.png")
                                .name("Logitech MX Master 3S")
                                .price(BigDecimal.valueOf(1590000.00))
                                .status(ProductStatus.ACTIVE).build())
                        .quantity(1)
                        .total(BigDecimal.valueOf(1590000.00)).build());

        mockOrder = OrderEntity.builder()
                .id(1L).fullName("Tran Cuong").address("273 An Duong Vuong")
                .status(OrderStatus.PENDING).paymentMethod(OrderPaymentType.COD)
                .paymentStatus(OrderPaymentStatus.PENDING)
                .totalAmount(BigDecimal.valueOf(1590000.00))
                .shippingFee(BigDecimal.valueOf(50000)).totalQuantity(1)
                .couponEntity(null).userEntity(mockUser)
                .orderItemEntities(mockOderItem).build();

        when(orderService.getOrdersByUserId(1L)).thenReturn(List.of(mockOrder));

        mockMvc.perform(get("/api/purchases/")
                .cookie(new Cookie("access_token", token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].id").value(1L))
                .andExpect(jsonPath("$.data[0].totalAmount").value(1590000.00));
    }

    @Test
    @DisplayName("TC12: GET /api/purchases/ - Danh sach don hang rong")
    void testGetMyOrdersEmpty() throws Exception {
        when(orderService.getOrdersByUserId(1L)).thenReturn(List.of());

        mockMvc.perform(get("/api/purchases/")
                .cookie(new Cookie("access_token", token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(0));
    }
}
