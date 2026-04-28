package com.ShopCart_FE_BE.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.dto.CartDetailDto;
import com.ShopCart_FE_BE.dto.CartDto;
import com.ShopCart_FE_BE.entity.CartEntity;
import com.ShopCart_FE_BE.request.AddCartRequest;
import com.ShopCart_FE_BE.service.CartService;
import com.ShopCart_FE_BE.utils.ResponseHelper;

@RestController
@RequestMapping("/w-version/api/carts/")
public class CartController {

    private final CartService cartService;

    public CartController(
            CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Get cart detail from userId
     * ? Require: userId -> In part variable
     * 
     * @param userId
     * 
     */
    @GetMapping("{userId}")
    public ResponseEntity<Response<CartDetailDto>> getCartDetail(
            @PathVariable(name = "userId", required = true) Long userId) {
        List<CartEntity> cartEntities = this.cartService.getAllCartsByUserId(userId);

        CartDetailDto cartDetailDto = new CartDetailDto();
        Integer totalQuantity = 0;
        BigDecimal totalPrice = new BigDecimal(0);
        List<CartDto> cartDtos = new ArrayList<CartDto>();
        for (CartEntity cartEntity : cartEntities) {
            totalQuantity += cartEntity.getQuantity();
            totalPrice = totalPrice.add(
                    cartEntity.getProductEntity().getPrice().multiply(
                            BigDecimal.valueOf(cartEntity.getQuantity())));
            cartDtos.add(new CartDto(
                    cartEntity.getProductEntity().getId(),
                    cartEntity.getProductEntity().getName(),
                    cartEntity.getQuantity(),
                    cartEntity.getProductEntity().getPrice()
                                .multiply(BigDecimal.valueOf(cartEntity.getQuantity()))));
        }

        cartDetailDto.setCarts(cartDtos);
        cartDetailDto.setTotalQuantity(totalQuantity);
        cartDetailDto.setTotalPrice(totalPrice);

        Response<CartDetailDto> response = ResponseHelper.Success(cartDetailDto);

        return ResponseEntity.ok(response);
    }

    /**
     * Add new product into cart
     * ? Require: userId -> In path variable
     * ? Body: JSON -> { productId: int, quantity: int }
     * 
     * * Require: Check stock of product before add to cart, Calculate total price
     * of cart
     * ! Note: Throw exception in error case (quantity, missing field)
     * 
     */
    @PostMapping("{userId}")
    public ResponseEntity<Response<CartDto>> addToCart(
            @PathVariable(name = "userId", required = true) Long userId,
            @Validated @RequestBody AddCartRequest request) {
        CartEntity cartEntity = this.cartService.addToCart(userId, request);

        Response<CartDto> response = ResponseHelper.Success(
                new CartDto(cartEntity.getProductEntity().getId(),
                        cartEntity.getProductEntity().getName(),
                        cartEntity.getQuantity(),
                        cartEntity.getProductEntity().getPrice()
                                .multiply(BigDecimal.valueOf(cartEntity.getQuantity()))));

        return ResponseEntity.ok(response);
    }
}
