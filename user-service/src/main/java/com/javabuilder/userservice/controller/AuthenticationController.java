package com.javabuilder.userservice.controller;

import com.javabuilder.userservice.dto.request.LoginRequest;
import com.javabuilder.userservice.dto.response.ApiResponse;
import com.javabuilder.userservice.dto.response.LoginResponse;
import com.javabuilder.userservice.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping( "/login")
    ApiResponse<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        var data = authenticationService.login(request);
        return ApiResponse.<LoginResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Login successful")
                .data(data)
                .build();
    }
}
