package com.ShopCart_FE_BE.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.utils.ResponseHelper;

@RestControllerAdvice
public class NoHandlerFoundExceptionHandler {
    @ExceptionHandler(
        NoHandlerFoundException.class
    )
    public ResponseEntity<Response<Object>> noHandlerFoundExceptionHandler(NoHandlerFoundException exception) {
        String errorMessage = "Server can't resolve this problem";
        Response<Object> response = ResponseHelper.BadRequest(errorMessage);

        return ResponseEntity.badRequest().body(response);
    }
}
