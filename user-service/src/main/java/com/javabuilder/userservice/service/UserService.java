package com.javabuilder.userservice.service;

import com.javabuilder.userservice.dto.request.CreateUserRequest;
import com.javabuilder.userservice.dto.response.CreateUserResponse;
import com.javabuilder.userservice.dto.response.UserDetailResponse;

import java.util.List;

public interface UserService {
    CreateUserResponse createUser(CreateUserRequest request);
    UserDetailResponse myInfo(String userId);
    List<UserDetailResponse> getAllUsers();
}
