package com.ShopCart_FE_BE.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.ShopCart_FE_BE.config.ForbiddenEntryPoint;
import com.ShopCart_FE_BE.config.SecurityConfig;
import com.ShopCart_FE_BE.config.UnauthorizedEntryPoint;
import com.ShopCart_FE_BE.config.UserDetailsImp;
import com.ShopCart_FE_BE.entity.CartEntity;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.entity.types.ProductStatus;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.request.AddToCartRequest;
import com.ShopCart_FE_BE.service.CartService;
import com.ShopCart_FE_BE.service.UserDetailsServiceImpl;
import com.ShopCart_FE_BE.utils.JwtUtils;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(CartController.class)
@Import(SecurityConfig.class)
@DisplayName("CartController Mock Test")
public class CartControllerMockTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CartService cartService;

    @MockitoBean
    private UnauthorizedEntryPoint unauthorizedEntryPoint;

    @MockitoBean
    private ForbiddenEntryPoint forbiddenEntryPoint;

    @MockitoBean
    private JwtUtils jwtUtils;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    private String token;

    @BeforeEach
    void setUp() {
        token = "mock-jwt-token-12345";
        Claims mockClaims = mock(Claims.class);
        when(mockClaims.getSubject()).thenReturn("user@example.com");
        when(mockClaims.get("id", Long.class)).thenReturn(1L);
        when(jwtUtils.extractClaims(token)).thenReturn(mockClaims);

        // Mock UserDetailsServiceImpl
        UserDetailsImp mockUserDetails = new UserDetailsImp(1L, "Tran Cường", "user@example.com", "password");
        when(userDetailsService.loadUserByUsername("user@example.com")).thenReturn(mockUserDetails);

    }

    @Test
    @DisplayName("TC1: Thêm sản phẩm vào giỏ hàng thành công với service được mock")
    void testAddToCartWithMockedService() throws Exception {
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(1L)
                .quantity(2)
                .build();

        ProductEntity product = ProductEntity.builder()
                .id(1L)
                .name("Dell XPS 15 9530")
                .price(BigDecimal.valueOf(45990000L))
                .mainImageUrl("https://example.com/images/dell-xps-15-main.jpg")
                .status(ProductStatus.ACTIVE)
                .build();

        CartEntity cart = CartEntity.builder()
                .id(1L)
                .quantity(2)
                .productEntity(product)
                .build();

        when(cartService.addToCart(anyLong(), any(AddToCartRequest.class))).thenReturn(cart);

        mockMvc.perform(post("/api/carts/add")
                .cookie(new Cookie("access_token", token))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Success"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.quantity").value(2))
                .andExpect(jsonPath("$.data.total").value(91980000))
                .andExpect(jsonPath("$.data.product.id").value(1))
                .andExpect(jsonPath("$.data.product.mainImageUrl")
                        .value("https://example.com/images/dell-xps-15-main.jpg"))
                .andExpect(jsonPath("$.data.product.name").value("Dell XPS 15 9530"))
                .andExpect(jsonPath("$.data.product.price").value(45990000))
                .andExpect(jsonPath("$.data.product.status").value("ACTIVE"));

        verify(cartService).addToCart(anyLong(), any(AddToCartRequest.class));
    }

    @Test
    @DisplayName("TC2: Trả về Bad Request khi service mock báo số lượng vượt tồn kho")
    void testAddToCartMockedServiceThrowsBadRequest() throws Exception {
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(1L)
                .quantity(11)
                .build();

        when(cartService.addToCart(anyLong(), any(AddToCartRequest.class)))
                .thenThrow(new InvalidException("Số lượng khả dụng còn lại không đủ (5) sản phẩm "));

        mockMvc.perform(post("/api/carts/add")
                .cookie(new Cookie("access_token", token))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Bad Request"))
                .andExpect(jsonPath("$.errors").value("Số lượng khả dụng còn lại không đủ (5) sản phẩm "))
                .andExpect(jsonPath("$.data").doesNotExist());

        verify(cartService).addToCart(eq(1L), any(AddToCartRequest.class));
    }

    @Test
    @DisplayName("TC3: Không gọi service khi số lượng nhỏ hơn 1")
    void testAddToCartInvalidRequestNeverCallsService() throws Exception {
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(1L)
                .quantity(0)
                .build();

        mockMvc.perform(post("/api/carts/add")
                .cookie(new Cookie("access_token", token))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Bad Request"))
                .andExpect(jsonPath("$.errors.quantity").value("Số lượng ít nhất là 1"))
                .andExpect(jsonPath("$.data").doesNotExist());

        verify(cartService, never()).addToCart(anyLong(), any(AddToCartRequest.class));
    }

    @Test
    @DisplayName("TC4: Không gọi service khi thiếu mã sản phẩm")
    void testAddToCartMissingProductIdNeverCallsService() throws Exception {
        AddToCartRequest request = AddToCartRequest.builder()
                .quantity(2)
                .build();

        mockMvc.perform(post("/api/carts/add")
                .cookie(new Cookie("access_token", token))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Bad Request"))
                .andExpect(jsonPath("$.errors.productId").value("Yêu cầu gửi mã sản phẩm"))
                .andExpect(jsonPath("$.data").doesNotExist());

        verify(cartService, never()).addToCart(anyLong(), any(AddToCartRequest.class));
    }

    @Test
    @DisplayName("TC5: Không gọi service khi thiếu số lượng")
    void testAddToCartMissingQuantityNeverCallsService() throws Exception {
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(1L)
                .build();

        mockMvc.perform(post("/api/carts/add")
                .cookie(new Cookie("access_token", token))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Bad Request"))
                .andExpect(jsonPath("$.errors.quantity").value("Yêu cầu gửi số lượng"))
                .andExpect(jsonPath("$.data").doesNotExist());

        verify(cartService, never()).addToCart(anyLong(), any(AddToCartRequest.class));
    }

    @Test
    @DisplayName("TC6: Không gọi service khi JSON sai định dạng")
    void testAddToCartMalformedJsonNeverCallsService() throws Exception {
        mockMvc.perform(post("/api/carts/add")
                .cookie(new Cookie("access_token", token))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"productId\":1,\"quantity\":"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Bad Request"))
                .andExpect(jsonPath("$.errors").value("Invalid request body format"))
                .andExpect(jsonPath("$.data").doesNotExist());

        verify(cartService, never()).addToCart(anyLong(), any(AddToCartRequest.class));
    }

    @Test
    @DisplayName("TC8: Trả về Bad Request khi service mock báo sản phẩm không tồn tại")
    void testAddToCartProductNotFoundFromMockedService() throws Exception {
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(999L)
                .quantity(1)
                .build();

        when(cartService.addToCart(anyLong(), any(AddToCartRequest.class)))
                .thenThrow(new NotFoundResource("Không tìm thấy sản phẩm"));

        mockMvc.perform(post("/api/carts/add")
                .cookie(new Cookie("access_token", token))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Bad Request"))
                .andExpect(jsonPath("$.errors").value("Không tìm thấy sản phẩm"))
                .andExpect(jsonPath("$.data").doesNotExist());

        verify(cartService).addToCart(eq(1L), any(AddToCartRequest.class));
    }

    @Test
    @DisplayName("TC8: Trả về Bad Request khi service mock báo sản phẩm đang bị khóa")
    void testAddToCartLockedProductFromMockedService() throws Exception {
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(4L)
                .quantity(1)
                .build();

        when(cartService.addToCart(anyLong(), any(AddToCartRequest.class)))
                .thenThrow(new InvalidException("Sản phẩm đang bị khóa"));

        mockMvc.perform(post("/api/carts/add")
                .cookie(new Cookie("access_token", token))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Bad Request"))
                .andExpect(jsonPath("$.errors").value("Sản phẩm đang bị khóa"))
                .andExpect(jsonPath("$.data").doesNotExist());

        verify(cartService).addToCart(eq(1L), any(AddToCartRequest.class));
    }

    @Test
    @DisplayName("TC9: Kiểm tra response trả về đúng tổng tiền khi service mock trả cart số lượng lớn")
    void testAddToCartReturnsCorrectTotalFromMockedCart() throws Exception {
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(3L)
                .quantity(5)
                .build();

        ProductEntity product = ProductEntity.builder()
                .id(3L)
                .name("Dell XPS 15 9530")
                .price(BigDecimal.valueOf(45990000L))
                .mainImageUrl("https://example.com/images/dell-xps-15-main.jpg")
                .status(ProductStatus.ACTIVE)
                .build();

        CartEntity cart = CartEntity.builder()
                .id(7L)
                .quantity(5)
                .productEntity(product)
                .build();

        when(cartService.addToCart(anyLong(), any(AddToCartRequest.class))).thenReturn(cart);

        mockMvc.perform(post("/api/carts/add")
                .cookie(new Cookie("access_token", token))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(7))
                .andExpect(jsonPath("$.data.quantity").value(5))
                .andExpect(jsonPath("$.data.total").value(229950000))
                .andExpect(jsonPath("$.data.product.id").value(3))
                .andExpect(jsonPath("$.data.product.status").value("ACTIVE"));

        verify(cartService).addToCart(eq(1L), any(AddToCartRequest.class));
    }

}
