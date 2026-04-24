package com.ShopCart_FE_BE.utils;

import com.ShopCart_FE_BE.config.Response;

public class ResponseHelper {
    // Methods response with data
    /**
     * 
     * @param <T>
     * @param data
     * @return
     */
    public static <T> Response<T> Created(T data) {
        Response<T> response = new Response<>(201, "Created", null, data);
        return response;
    }

    /**
     * 
     * @param <T>
     * @param data
     * @return
     */
    public static <T> Response<T> Success(T data) {
        Response<T> response = new Response<>(200, "Success", null, data);
        return response;
    }

    // Other methods response without data
    /**
     * 
     * @param <T>
     * @param errors
     * @return
     */
    public static <T> Response<T> BadRequest(Object errors) {
        Response<T> response = new Response<>(400, "Bad Request", errors, null);
        return response;
    }

    /**
     * 
     * @param <T>
     * @param errors
     * @return
     */
    public static <T> Response<T> NotFound(Object errors) {
        Response<T> response = new Response<>(404, "Not Found", errors, null);
        return response;
    }

    /**
     * 
     * @param <T>
     * @param errors
     * @return
     */
    public static <T> Response<T> InternalServerError(Object errors) {
        Response<T> response = new Response<>(500, "Internal Server Error", errors, null);
        return response;
    }

    /**
     * 
     * @param <T>
     * @param errors
     * @return
     */
    public static <T> Response<T> Unauthorized(Object errors) {
        Response<T> response = new Response<>(401, "Unauthorized", errors, null);
        return response;
    }
}
