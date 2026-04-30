package com.ShopCart_FE_BE.exception;

public class UnauthenticationExeption extends RuntimeException{
    public UnauthenticationExeption(String message) {
        super(message);
    }
}
