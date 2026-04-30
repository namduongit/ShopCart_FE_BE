package com.ShopCart_FE_BE.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    // The password will be hashed, so needn't set size
    @Column(nullable = false)
    private String password;
    
    /* Relationship */
    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL)
    private List<CartEntity> cartEntities;

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL)
    private List<OrderEntity> orderEntities;
}
