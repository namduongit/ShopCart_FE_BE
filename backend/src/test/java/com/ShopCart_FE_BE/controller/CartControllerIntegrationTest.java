package com.ShopCart_FE_BE.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.ShopCart_FE_BE.config.UserDetailsImp;
import com.ShopCart_FE_BE.entity.CartEntity;
import com.ShopCart_FE_BE.entity.InventoryEntity;
import com.ShopCart_FE_BE.entity.ProductEntity;
import com.ShopCart_FE_BE.entity.types.ProductStatus;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.request.AddToCartRequest;

import com.ShopCart_FE_BE.service.CartService;
import com.ShopCart_FE_BE.service.UserDetailsServiceImpl;
import com.ShopCart_FE_BE.utils.JwtUtils;
import tools.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;

@WebMvcTest(CartController.class)
@DisplayName("Cart Api Integration Tests")
public class CartControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockitoBean
        private CartService cartService;

        @MockitoBean
        private JwtUtils jwtUtils;

        @MockitoBean
        private UserDetailsServiceImpl userDetailsService;

        private ProductEntity mockProduct;
        private CartEntity mockCart;
        private String token;

        @BeforeEach
        void setUp() {
                token = "mock-jwt-token-12345";
                Claims mockClaims = mock(Claims.class);
                when(mockClaims.getSubject()).thenReturn("user@example.com");
                when(mockClaims.get("id", Long.class)).thenReturn(1L);
                when(jwtUtils.extractClaims(token)).thenReturn(mockClaims);

                // Mock UserDetailsServiceImpl
                UserDetailsImp mockUserDetails = new UserDetailsImp(1L, "John Doe", "user@example.com", "password");
                when(userDetailsService.loadUserByUsername("user@example.com")).thenReturn(mockUserDetails);

        }

        @Test
        @WithMockUser(username = "user@example.com")
        @DisplayName("TC1: POST /api/carts/add - Them San pham")
        void testAddtoCart() throws Exception {
                AddToCartRequest request = AddToCartRequest.builder().productId(1L).quantity(2).build();

                mockProduct = ProductEntity.builder().id(1L).name("Dell XPS 15 9530")
                                .price(BigDecimal.valueOf(45990000L))
                                .mainImageUrl("https://example.com/images/dell-xps-15-main.jpg")
                                .status(ProductStatus.ACTIVE).build();

                mockCart = CartEntity.builder().id(1L).quantity(2).productEntity(mockProduct).build();

                when(cartService.addToCart(anyLong(), any())).thenReturn(mockCart);

                mockMvc.perform(
                                post("/api/carts/add").cookie(new Cookie("access_token", token)).with(csrf())
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.message").value("Success"))
                                .andExpect(jsonPath("$.data.id").value(1L))
                                .andExpect(jsonPath("$.data.quantity").value(2))
                                .andExpect(jsonPath("$.data.product.name").value("Dell XPS 15 9530"))
                                .andExpect(jsonPath("$.data.product.price").value(45990000));
        }

        @Test
        @WithMockUser(username = "user@example.com")
        @DisplayName("TC2:  POST /api/carts/add - Thêm số lượng vượt quá giá trị tồn kho")
        void testIncreaseQuantityOverInventory() throws Exception {
                AddToCartRequest request = AddToCartRequest.builder().productId(1L).quantity(11).build();

                when(cartService.addToCart(anyLong(), any()))
                                .thenThrow(new InvalidException("Số lượng khả dụng còn lại không đủ (5) sản phẩm "));

                mockMvc.perform(post("/api/carts/add").cookie(new Cookie("access_token", this.token)).with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.status").value(400))
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message").value("Bad Request"))
                                .andExpect(jsonPath("$.errors")
                                                .value("Số lượng khả dụng còn lại không đủ (5) sản phẩm "));
        }

        @Test
        @WithMockUser(username = "user@example.com")
        @DisplayName("TC3: POST /api/carts/add - Số lượng không hợp lệ")
        void testAddToCartWithInvalidQuantity() throws Exception {
                AddToCartRequest request = AddToCartRequest.builder().productId(1L).quantity(0).build();

                mockMvc.perform(post("/api/carts/add").cookie(new Cookie("access_token", token)).with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.status").value(400))
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message").value("Bad Request"))
                                .andExpect(jsonPath("$.errors.quantity").value("Số lượng ít nhất là 1"));

                verify(cartService, never()).addToCart(anyLong(), any());
        }

        @Test
        @WithMockUser(username = "user@example.com")
        @DisplayName("TC4: POST /api/carts/add - Kiem tra response structure - HTTP 200")
        void testResponseStructedSuccess() throws Exception {
                AddToCartRequest request = AddToCartRequest.builder().productId(1L).quantity(2).build();

                mockProduct = ProductEntity.builder().id(1L).name("Dell XPS 15 9530")
                                .price(BigDecimal.valueOf(45990000L))
                                .mainImageUrl("https://example.com/images/dell-xps-15-main.jpg")
                                .status(ProductStatus.ACTIVE).build();

                mockCart = CartEntity.builder().id(1L).quantity(2).productEntity(mockProduct).build();
                when(cartService.addToCart(anyLong(), any())).thenReturn(mockCart);
                mockMvc.perform(post("/api/carts/add").cookie(new Cookie("access_token", this.token)).with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))).andExpect(status().isOk())
                                .andExpect(jsonPath("$.status").value(200)).andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.message").value("Success"))
                                .andExpect(jsonPath("errors").doesNotExist()).andExpect(jsonPath("$.data.id").value(1L))
                                .andExpect(jsonPath("$.data.quantity").value(2))
                                .andExpect(jsonPath("$.data.total").value(BigDecimal.valueOf(91980000L)))
                                .andExpect(jsonPath("$.data.product.id").value(1))
                                .andExpect(jsonPath("$.data.product.mainImageUrl")
                                                .value("https://example.com/images/dell-xps-15-main.jpg"))
                                .andExpect(jsonPath("$.data.product.name").value("Dell XPS 15 9530"))
                                .andExpect(jsonPath("$.data.product.price").value(BigDecimal.valueOf(45990000L)))
                                .andExpect(jsonPath("$.data.product.status").value("ACTIVE"));
        }

        @Test
        @WithMockUser(username = "user@example.com")
        @DisplayName("TC5: POST /api/carts/add - Kiem tra response structure - HTTP 400")
        void testResponseStructedBadRequest() throws Exception {
                AddToCartRequest request = AddToCartRequest.builder().productId(1L).quantity(11).build();

                when(cartService.addToCart(anyLong(), any()))
                                .thenThrow(new InvalidException("Số lượng khả dụng còn lại không đủ (5) sản phẩm "));

                mockMvc.perform(post("/api/carts/add").cookie(new Cookie("access_token", this.token)).with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.status").value(400))
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message").value("Bad Request"))
                                .andExpect(jsonPath("$.errors")
                                                .value("Số lượng khả dụng còn lại không đủ (5) sản phẩm "))
                                .andExpect(jsonPath("$.data").doesNotExist());
        }

        @Test
        @WithMockUser(username = "user@example.com")
        @DisplayName("TC6: POST /api/carts/add - Test CORS va header")
        void testCORSandHeader() throws Exception {
                AddToCartRequest request = AddToCartRequest.builder().productId(1L).quantity(11).build();

                mockProduct = ProductEntity.builder().id(1L).name("Dell XPS 15 9530")
                                .price(BigDecimal.valueOf(45990000L))
                                .mainImageUrl("https://example.com/images/dell-xps-15-main.jpg")
                                .status(ProductStatus.ACTIVE).build();

                mockCart = CartEntity.builder().id(1L).quantity(2).productEntity(mockProduct).build();
                when(cartService.addToCart(anyLong(), any())).thenReturn(mockCart);

                mockMvc.perform(post("/api/carts/add").cookie(new Cookie("access_token", this.token)).with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)).header("Origin","http://localhost:5173")).andExpect(status().isOk()).andExpect(header().exists("Access-Control-Allow-Origin")).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));

        }

        @Test
        @WithMockUser(username = "user@example.com")
        @DisplayName("TC7: POST /api/carts/add - Thieu ma san pham")
        void testAddToCartWithMissingProductId() throws Exception {
                AddToCartRequest request = AddToCartRequest.builder().quantity(2).build();

                mockMvc.perform(post("/api/carts/add").cookie(new Cookie("access_token", this.token)).with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.status").value(400))
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message").value("Bad Request"))
                                .andExpect(jsonPath("$.errors.productId").value("Yêu cầu gửi mã sản phẩm"))
                                .andExpect(jsonPath("$.data").doesNotExist());

        }

        @Test
        @WithMockUser(username = "user@example.com")
        @DisplayName("TC8: POST /api/carts/add - Thieu so luong")
        void testAddToCartWithMissingQuantity() throws Exception {2
                AddToCartRequest request = AddToCartRequest.builder().productId(1L).build();

                mockMvc.perform(post("/api/carts/add").cookie(new Cookie("access_token", this.token)).with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.status").value(400))
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message").value("Bad Request"))
                                .andExpect(jsonPath("$.errors.quantity").value("Yêu cầu gửi số lượng"))
                                .andExpect(jsonPath("$.data").doesNotExist());

        }

        @Test
        @WithMockUser(username = "user@example.com")
        @DisplayName("TC9: POST /api/carts/add - Sai dinh dang JSON")
        void testAddToCartWithMalformedJson() throws Exception {
                mockMvc.perform(post("/api/carts/add").cookie(new Cookie("access_token", this.token)).with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"productId\":1,\"quantity\":"))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.status").value(400))
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message").value("Bad Request"))
                                .andExpect(jsonPath("$.errors").value("Invalid request body format"))
                                .andExpect(jsonPath("$.data").doesNotExist());

        }

        @Test
        @WithMockUser(username = "user@example.com")
        @DisplayName("TC10: POST /api/carts/add - San pham khong ton tai")
        void testAddToCartWithProductNotFound() throws Exception {
                AddToCartRequest request = AddToCartRequest.builder().productId(999L).quantity(1).build();

                when(cartService.addToCart(anyLong(), any()))
                                .thenThrow(new NotFoundResource("Không tìm thấy sản phẩm"));

                mockMvc.perform(post("/api/carts/add").cookie(new Cookie("access_token", this.token)).with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.status").value(400))
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message").value("Bad Request"))
                                .andExpect(jsonPath("$.errors").value("Không tìm thấy sản phẩm"))
                                .andExpect(jsonPath("$.data").doesNotExist());
        }
}
