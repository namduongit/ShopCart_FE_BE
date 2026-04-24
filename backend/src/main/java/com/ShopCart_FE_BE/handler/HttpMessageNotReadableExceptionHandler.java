package com.ShopCart_FE_BE.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.utils.ResponseHelper;

@RestControllerAdvice
public class HttpMessageNotReadableExceptionHandler {
    @ExceptionHandler({
        HttpMessageNotReadableException.class
    })
    public ResponseEntity<Response<Object>> httpMessageNotReadableExceptionHandler(HttpMessageNotReadableException exception) {
        String errorMessage = "Invalid request body format";
        Response<Object> response = ResponseHelper.BadRequest(errorMessage);

        return ResponseEntity.badRequest().body(response);
    }
}