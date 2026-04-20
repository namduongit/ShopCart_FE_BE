package com.ShopCart_FE_BE.service;

import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.exception.DuplicateException;
import com.ShopCart_FE_BE.exception.InvalidException;
import com.ShopCart_FE_BE.repository.UserRepository;
import com.ShopCart_FE_BE.request.RegisterRequest;

@Service
public class UserService {
    private UserRepository userRepository;

    public UserService(
        UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    public UserEntity register(RegisterRequest request) {
        if (request.getPassword() != request.getPasswordConfirm()) {
            throw new InvalidException("Mật khẩu khác mật khẩu xác nhận");
        }

        UserEntity existEntity = this.userRepository.findByEmail(request.getEmail()).orElse(null);

        if (existEntity != null) {
            throw new DuplicateException("Email đã tồn tại");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(request.getEmail());
        userEntity.setPassword(request.getPassword());

        return this.userRepository.save(userEntity);
    }
}
