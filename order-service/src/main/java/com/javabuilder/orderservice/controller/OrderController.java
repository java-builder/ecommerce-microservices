package com.javabuilder.orderservice.controller;

import com.javabuilder.orderservice.dto.request.CreateOrderRequest;
import com.javabuilder.orderservice.dto.response.ApiResponse;
import com.javabuilder.orderservice.dto.response.CreateOrderResponse;
import com.javabuilder.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    ApiResponse<CreateOrderResponse> createOrder(@AuthenticationPrincipal Jwt jwt, @RequestBody @Valid CreateOrderRequest request) {
        var userId = jwt.getSubject();
        var data = orderService.createOrder(userId, request);
        return ApiResponse.<CreateOrderResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Order created successfully")
                .data(data)
                .build();
    }

}
