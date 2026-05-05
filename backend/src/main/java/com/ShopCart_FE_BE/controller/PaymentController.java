package com.ShopCart_FE_BE.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ShopCart_FE_BE.service.MomoService;

@RestController
@RequestMapping("/api/payments/")
public class PaymentController {

    private final MomoService momoService;

    public PaymentController(MomoService momoService) {
        this.momoService = momoService;
    }

    @PostMapping("{orderId}")
    public void d() {

    }

    @PostMapping("ipn")
    public void a() {

    }
}
