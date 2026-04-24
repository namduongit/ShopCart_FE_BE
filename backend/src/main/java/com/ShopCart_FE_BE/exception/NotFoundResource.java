package com.ShopCart_FE_BE.exception;

/**
 * Exception for not found resource
 * 
 * * Example: Account not found, Product not found, etc...
 * 
 * ! Extend RuntimeException and will be handled by RuntimeExceptionHandler.java file
 */
public class NotFoundResource extends RuntimeException {
    public NotFoundResource(String message) {
        super(message);
    }
}
