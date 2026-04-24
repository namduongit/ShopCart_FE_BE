package com.ShopCart_FE_BE.config;

public class Response<T> {
    private int status;
    private String message;
    private Object errors;
    private T data;

    public Response(int status, String message, Object errors, T data) {
        this.status = status;
        this.message = message;
        this.errors = errors;
        this.data = data;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getErrors() {
        return errors;
    }

    public void setErrors(Object errors) {
        this.errors = errors;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
