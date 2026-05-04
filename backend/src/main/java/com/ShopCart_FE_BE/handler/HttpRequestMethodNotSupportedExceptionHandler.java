package com.ShopCart_FE_BE.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.utils.ResponseHelper;

@RestControllerAdvice
public class HttpRequestMethodNotSupportedExceptionHandler {
     @ExceptionHandler({
        HttpRequestMethodNotSupportedException.class
    })
    public ResponseEntity<Response<Object>> httpMessageNotReadableExceptionHandler(HttpRequestMethodNotSupportedException exception) {
        String errorMessage = "Method not support";
        Response<Object> response = ResponseHelper.BadRequest(errorMessage);

        return ResponseEntity.badRequest().body(response);
    }
}
