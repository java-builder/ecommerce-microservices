package com.javabuilder.productservice.controller;

import com.javabuilder.productservice.dto.request.CheckProductStockRequest;
import com.javabuilder.productservice.dto.response.ApiResponse;
import com.javabuilder.productservice.dto.response.ProductStockValidationResponse;
import com.javabuilder.productservice.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/internal/api/v1/products")
public class InternalProductController {

    private final ProductService productService;

    @PostMapping("/validate-stocks")
    ApiResponse<List<ProductStockValidationResponse>> validateStocks(@RequestBody @Valid CheckProductStockRequest request) {

        var data = productService.validateProductStock(request);
        return ApiResponse.<List<ProductStockValidationResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Products validated successfully")
                .data(data)
                .build();
    }
}
