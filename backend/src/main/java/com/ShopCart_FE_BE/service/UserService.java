package com.ShopCart_FE_BE.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.exception.DuplicateException;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.repository.UserRepository;
import com.ShopCart_FE_BE.request.RegisterRequest;

@Service
public class UserService {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserEntity register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new InvalidException("Mật khẩu khác mật khẩu xác nhận");
        }

        UserEntity existsEntity = this.userRepository.findByEmail(request.getEmail()).orElse(null);

        if (existsEntity != null) {
            throw new DuplicateException("Email đã tồn tại");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(request.getEmail());
        String hashedPassword = this.passwordEncoder.encode(request.getPassword());
        userEntity.setPassword(hashedPassword);

        return this.userRepository.save(userEntity);
    }

    /**
     * ! Converted to Authentication Manager for managed token
     * ! Authentication Manager require PasswordEncoder for hashed password
     * @param id
     * @return UserEntity
     */
    // public UserEntity login(String email, String password) {
    //     UserEntity existsEntity = this.userRepository.findByEmail(email).orElse(null);

    //     if (existsEntity == null) {
    //         throw new InvalidException("Email không tồn tại");
    //     }

    //     if (!existsEntity.getPassword().equals(password)) {
    //         throw new InvalidException("Mật khẩu không đúng");
    //     }

    //     return existsEntity;
    // }

    public UserEntity getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new NotFoundResource("Không tìm thấy người dùng"));
    }
}
