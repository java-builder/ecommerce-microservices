package com.javabuilder.orderservice.service;

import com.javabuilder.orderservice.dto.request.CreateOrderRequest;
import com.javabuilder.orderservice.dto.response.CreateOrderResponse;

public interface OrderService {

    CreateOrderResponse createOrder(String userId, CreateOrderRequest request);
}
