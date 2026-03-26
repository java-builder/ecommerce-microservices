package com.javabuilder.userservice.service;

import com.javabuilder.userservice.dto.request.CreateUserRequest;
import com.javabuilder.userservice.dto.response.CreateUserResponse;
import com.javabuilder.userservice.dto.response.UserDetailResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    CreateUserResponse createUser(CreateUserRequest request);
    UserDetailResponse myInfo(String userId);
    List<UserDetailResponse> getAllUsers();
    String updateAvatar(String userId, MultipartFile file);
}
