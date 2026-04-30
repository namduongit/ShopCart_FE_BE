package com.ShopCart_FE_BE.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stock_quantity", nullable = false, columnDefinition = "integer check (stock_quantity >= 0)")
    private Integer stockQuantity;

    @Column(name = "reserved_quantity")
    private Integer reservedQuantity = 0;

    @OneToOne()
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private ProductEntity productEntity;

    public Integer getAvailableQuantity() {
        return this.stockQuantity - reservedQuantity;
    }
}
