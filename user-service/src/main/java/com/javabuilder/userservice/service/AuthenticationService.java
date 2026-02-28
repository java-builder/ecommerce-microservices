package com.javabuilder.userservice.service;

import com.javabuilder.userservice.dto.request.LoginRequest;
import com.javabuilder.userservice.dto.response.LoginResponse;

public interface AuthenticationService {
    LoginResponse login(LoginRequest request);
    LoginResponse refreshToken(String refreshToken);
}
