package com.ShopCart_FE_BE.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.config.UserDetailsImp;
import com.ShopCart_FE_BE.dto.CartDto;
import com.ShopCart_FE_BE.dto.CartProductDto;
import com.ShopCart_FE_BE.entity.CartEntity;
import com.ShopCart_FE_BE.request.AddToCartRequest;
import com.ShopCart_FE_BE.request.RemoveFromCartRequest;
import com.ShopCart_FE_BE.service.CartService;
import com.ShopCart_FE_BE.utils.ResponseHelper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/w-version/api/carts/")
public class CartController {

    private final CartService cartService;

    public CartController(
            CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Get cart detail from user
     */
    @GetMapping("")
    public ResponseEntity<Response<List<CartDto>>> getCartDetail(
            @AuthenticationPrincipal UserDetailsImp userDetailsImp) {
        List<CartEntity> cartEntities = this.cartService.getAllCartsByUserId(userDetailsImp.getId());

        Response<List<CartDto>> response = ResponseHelper.Success(cartEntities.stream().map(cartDto -> {
            return new CartDto(
                    cartDto.getId(),
                    cartDto.getQuantity(),
                    cartDto.getProductEntity().getPrice().multiply(BigDecimal.valueOf(cartDto.getQuantity())),

                    new CartProductDto(
                            cartDto.getProductEntity().getId(),
                            cartDto.getProductEntity().getMainImageUrl(),
                            cartDto.getProductEntity().getName(),
                            cartDto.getProductEntity().getPrice(),
                            cartDto.getProductEntity().getStatus().toString()));
        }).toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Add new product into cart
     * ? Body: JSON -> { productId: int, quantity: int }
     * 
     * * Require: Check stock of product before add to cart, Calculate total price
     * of cart
     * ! Note: Throw exception in error case (quantity, missing field)
     * 
     */
    @PostMapping("add")
    public ResponseEntity<Response<CartDto>> addToCart(
            @AuthenticationPrincipal UserDetailsImp userDetailsImp,
            @Valid @RequestBody AddToCartRequest request) {

        CartEntity cartEntity = this.cartService.addToCart(userDetailsImp.getId(), request);
        Response<CartDto> response = ResponseHelper.Success(new CartDto(
                cartEntity.getId(),
                cartEntity.getQuantity(),
                cartEntity.getProductEntity().getPrice().multiply(BigDecimal.valueOf(cartEntity.getQuantity())),
                new CartProductDto(
                        cartEntity.getProductEntity().getId(),
                        cartEntity.getProductEntity().getMainImageUrl(),
                        cartEntity.getProductEntity().getName(),
                        cartEntity.getProductEntity().getPrice(),
                        cartEntity.getProductEntity().getStatus().toString())));

        return ResponseEntity.ok(response);
    }

    /**
     * Remove quantity product from user's cart
     * ? Body: JSON -> { productId: int, quantity: int }
     * 
     * * Require: Check stock of product before remove from cart, Calculate total
     * price of cart
     * ! Note: Throw exception in error case (quantity, missing field)
     * 
     */
    @PostMapping("remove")
    public ResponseEntity<Response<CartDto>> removeFromCart(
            @AuthenticationPrincipal UserDetailsImp userDetailsImp,
            @Valid @RequestBody RemoveFromCartRequest request) {

        CartEntity cartEntity = this.cartService.removeFromCart(userDetailsImp.getId(), request);
        if (cartEntity == null) {
            return ResponseEntity.ok(ResponseHelper.Success(null));
        }
        Response<CartDto> response = ResponseHelper.Success(new CartDto(
                cartEntity.getId(),
                cartEntity.getQuantity(),
                cartEntity.getProductEntity().getPrice().multiply(BigDecimal.valueOf(cartEntity.getQuantity())),
                new CartProductDto(
                        cartEntity.getProductEntity().getId(),
                        cartEntity.getProductEntity().getMainImageUrl(),
                        cartEntity.getProductEntity().getName(),
                        cartEntity.getProductEntity().getPrice(),
                        cartEntity.getProductEntity().getStatus().toString())));

        return ResponseEntity.ok(response);
    }

}
