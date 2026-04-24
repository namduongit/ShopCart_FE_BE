package com.ShopCart_FE_BE.handler;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.utils.ResponseHelper;

@ControllerAdvice
@Order(value = Ordered.LOWEST_PRECEDENCE)
public class RuntimeExceptionHandler {
    
    @ExceptionHandler({
        RuntimeException.class
    })
    public ResponseEntity<Response<Object>> runtimeExceptionHandler(RuntimeException exception) {
        String errorMessage = exception.getMessage();
        Response<Object> response = ResponseHelper.BadRequest(errorMessage);

        return ResponseEntity.badRequest().body(response);
    }
}
