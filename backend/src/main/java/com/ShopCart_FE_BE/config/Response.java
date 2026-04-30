package com.ShopCart_FE_BE.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response<T> {
    private int status;
    private boolean success;
    private String message;
    private Object errors;
    private T data;
}
