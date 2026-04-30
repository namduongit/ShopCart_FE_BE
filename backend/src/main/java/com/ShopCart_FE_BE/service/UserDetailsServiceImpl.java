package com.ShopCart_FE_BE.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ShopCart_FE_BE.config.UserDetailsImp;
import com.ShopCart_FE_BE.entity.UserEntity;
import com.ShopCart_FE_BE.exception.NotFoundResource;
import com.ShopCart_FE_BE.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private UserRepository userRepository;

    public UserDetailsServiceImpl(
         UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    /**
     * FLOW SPRING SECURITY MANAGE USER
     * 
     * Request login from controller
     * * Call authentication manager to verify user -> Run in UserDetailsService
     * @return UserDetailsImp implement UserDetails [Require Password Encoder]
     * * Controller recieve infomation about user details
     */

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity = this.userRepository
        .findByEmail(username)
        .orElseThrow(() -> new NotFoundResource("Không tìm thấy tài khoản"));

        UserDetailsImp userDetailsImp = new UserDetailsImp(
            userEntity.getId(),
            userEntity.getFullName(),
            userEntity.getEmail(),
            userEntity.getPassword()
        );

        return userDetailsImp;
    }
}
