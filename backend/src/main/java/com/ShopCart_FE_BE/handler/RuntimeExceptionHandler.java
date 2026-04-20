package com.ShopCart_FE_BE.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class RuntimeExceptionHandler {
    
    @ExceptionHandler({
        RuntimeException.class
    })
    public ResponseEntity<?> runtimeExceptionHandler(RuntimeException exception) {

        return null;
    }
}
