package com.javabuilder.orderservice.client;

import com.javabuilder.orderservice.client.dto.CheckProductStockRequest;
import com.javabuilder.orderservice.client.dto.ProductStockValidationResponse;
import com.javabuilder.orderservice.dto.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import java.util.List;

@HttpExchange
public interface ProductClient {

    @PostExchange("/internal/api/v1/products/validate-stocks")
    ApiResponse<List<ProductStockValidationResponse>> validateProductStock(@RequestBody @Valid CheckProductStockRequest request);
}
