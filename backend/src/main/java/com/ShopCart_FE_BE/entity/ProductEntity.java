package com.ShopCart_FE_BE.entity;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.ShopCart_FE_BE.entity.types.ProductStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mainImageUrl;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(nullable = false, columnDefinition = "text[]")
    private List<String> imageUrls;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(unique = true, nullable = false)
    private String slug;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> attributes;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    /* Relationship */
    @OneToOne(mappedBy = "productEntity", cascade = CascadeType.ALL)
    private InventoryEntity inventoryEntity;

    @OneToMany(mappedBy = "productEntity", cascade = CascadeType.ALL)
    private List<CartEntity> cartEntities;

    @OneToMany(mappedBy = "productEntity", cascade = CascadeType.ALL)
    private List<OrderItemEntity> order_ItemEntities;

    @SuppressWarnings("null")
    public Integer getStockAvailable() {
        InventoryEntity inventoryEntity = this.inventoryEntity;
        List<CartEntity> cartEntities = this.cartEntities;

        return inventoryEntity == null ? 0 : 
        (cartEntities == null || cartEntities.size() == 0) ? 
        inventoryEntity.getStockQuantity() : 
        inventoryEntity.getStockQuantity() - cartEntities.stream().reduce(0, (sum, item) -> sum + item.getQuantity(), Integer::sum);
    }
}
