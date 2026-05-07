package com.ShopCart_FE_BE.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.utils.ResponseHelper;

@RestControllerAdvice
public class NoResourceFoundExceptionHandler {
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Response<Object>> noResourceFoundExceptionHandler(NoResourceFoundException exception) {
        String errorMessage = "Not found resource";
        Response<Object> response = ResponseHelper.NotFound(errorMessage);

        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
