package com.javabuilder.userservice.service.impl;

import com.javabuilder.userservice.common.RoleType;
import com.javabuilder.userservice.dto.request.CreateUserRequest;
import com.javabuilder.userservice.dto.response.CreateUserResponse;
import com.javabuilder.userservice.dto.response.UserDetailResponse;
import com.javabuilder.userservice.entity.Role;
import com.javabuilder.userservice.entity.User;
import com.javabuilder.userservice.exception.ErrorCode;
import com.javabuilder.userservice.exception.UserServiceException;
import com.javabuilder.userservice.mapper.UserMapper;
import com.javabuilder.userservice.repository.UserRepository;
import com.javabuilder.userservice.service.RoleService;
import com.javabuilder.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "USER-SERVICE")
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final RoleService roleService;

    @Override
    public CreateUserResponse createUser(CreateUserRequest request) {
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.password()));

        Role role = roleService.createRole(RoleType.CUSTOMER.name());
        user.addRole(role);
        try {
            userRepository.save(user);
        }catch (DataIntegrityViolationException exception) {
            log.error("User already exists");
            throw new UserServiceException(ErrorCode.USER_ALREADY_EXISTS);
        }
        return userMapper.toCreateUserResponse(user);
    }

    @Override
    public UserDetailResponse myInfo(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserServiceException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserDetailResponse(user);
    }

}
