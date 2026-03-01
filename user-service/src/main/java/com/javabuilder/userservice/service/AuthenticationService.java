package com.javabuilder.userservice.service;

import com.javabuilder.userservice.dto.request.LoginRequest;
import com.javabuilder.userservice.dto.response.LoginResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    LoginResponse login(LoginRequest request);
    LoginResponse refreshToken(String refreshToken);
    void logout(String refreshToken) throws ParseException, JOSEException;
}
