package com.ShopCart_FE_BE.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckStockRequest {
    
    @NotNull(message = "Yêu cầu gửi danh sách sản phẩm để kiểm tra số lượng")
    @Size(min = 1, message = "Danh sách sản phẩm không được rỗng")
    @Valid
    private List<CheckStockItem> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckStockItem {

        @NotNull(message = "Yêu cầu gửi mã sản phẩm")
        private Long productId;

        @NotNull(message = "Yêu cầu gửi số lượng sản phẩm")
        private Integer quantity;

    }
}
