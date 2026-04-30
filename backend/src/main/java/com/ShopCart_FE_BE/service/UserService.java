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

        userEntity.setFullName(request.getFullName());
        userEntity.setEmail(request.getEmail());
        userEntity.setPassword(this.passwordEncoder.encode(request.getPassword()));

        return this.userRepository.save(userEntity);
    }

    public UserEntity getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new NotFoundResource("Không tìm thấy người dùng"));
    }
}
