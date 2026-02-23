package com.javabuilder.userservice.service.impl;

import com.javabuilder.userservice.dto.request.LoginRequest;
import com.javabuilder.userservice.dto.response.LoginResponse;
import com.javabuilder.userservice.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "AUTHENTICATION-SERVICE")
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;

    @Override
    public LoginResponse login(LoginRequest request) {
        String email = request.email();
        String password = request.password();

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);


        return LoginResponse.builder()
                .accessToken("mock-access-token")
                .refreshToken("mock-refresh-token")
                .build();
    }
}
