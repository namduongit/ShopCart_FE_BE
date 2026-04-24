package com.ShopCart_FE_BE.handler;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ShopCart_FE_BE.config.Response;
import com.ShopCart_FE_BE.utils.ResponseHelper;

@RestControllerAdvice
public class MethodArgumentNotValidExceptionHandler {

    /**
     * Validation request body using @Validate annotation
     * ? DEPENDENCY: spring-boot-starter-validation
     * 
     * @param exception
     * @return
     * 
     * ? FOLLOW: https://www.baeldung.com/spring-boot-bean-validation
     */
    @ExceptionHandler({
        MethodArgumentNotValidException.class
    })
    public ResponseEntity<Response<Object>> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getAllErrors().forEach((error) -> {
                String fieldName = ((FieldError) error).getField();
                String errorMessage = error.getDefaultMessage();
                errors.put(fieldName, errorMessage);
            });

        Response<Object> response = ResponseHelper.BadRequest(errors);

        return ResponseEntity.badRequest().body(response);
    }
}
